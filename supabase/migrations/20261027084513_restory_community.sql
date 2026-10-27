-- Community tables are isolated from existing operational records.
create schema if not exists community_private;
revoke all on schema community_private from public;
grant usage on schema community_private to anon, authenticated;

create table public.community_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null unique check (
    nickname ~ '^[가-힣a-zA-Z0-9_]{2,20}$'
    and nickname !~* '(관리자|운영자|리스토리|admin|restory)'
  ),
  created_at timestamptz not null default now()
);
create unique index community_profiles_nickname_lower on public.community_profiles(lower(nickname));

create table public.community_moderators (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references public.community_profiles(id) on delete cascade,
  category text not null check (category in ('question','story','knowledge','chat')),
  title text not null check (char_length(btrim(title)) between 5 and 100),
  body text not null check (char_length(btrim(body)) between 20 and 6000),
  image_paths text[] not null default '{}' check (cardinality(image_paths) <= 4),
  status text not null default 'published' check (status in ('published','hidden','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index community_posts_feed on public.community_posts(status, created_at desc, id);
create index community_posts_category on public.community_posts(category, status, created_at desc);
create index community_posts_author on public.community_posts(author_id, created_at desc);
create index community_posts_images on public.community_posts using gin(image_paths);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null default auth.uid() references public.community_profiles(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 2 and 2000),
  status text not null default 'published' check (status in ('published','hidden','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index community_comments_post on public.community_comments(post_id, status, created_at);
create index community_comments_author on public.community_comments(author_id, created_at desc);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason text not null check (reason in ('privacy','spam','abuse','other')),
  note text not null default '' check (char_length(note) <= 500),
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  unique(post_id, reporter_id)
);
create index community_reports_queue on public.community_reports(resolved, created_at);
create index community_reports_reporter on public.community_reports(reporter_id);

alter table public.community_profiles enable row level security;
alter table public.community_moderators enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_reports enable row level security;

-- No client can assign moderation privileges. Operators are enrolled separately.
revoke all on public.community_profiles, public.community_moderators, public.community_posts,
  public.community_comments, public.community_reports from anon, authenticated;
grant select on public.community_profiles, public.community_posts, public.community_comments to anon, authenticated;
grant select on public.community_moderators, public.community_reports to authenticated;
grant insert(id,nickname), update(nickname) on public.community_profiles to authenticated;
grant insert(category,title,body,image_paths), update(category,title,body,image_paths,status) on public.community_posts to authenticated;
grant insert(post_id,body), update(body,status) on public.community_comments to authenticated;
grant insert(post_id,reason,note), update(resolved) on public.community_reports to authenticated;

create policy community_profile_read on public.community_profiles for select to anon, authenticated using (true);
create policy community_profile_insert on public.community_profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy community_profile_update on public.community_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy community_moderator_self on public.community_moderators for select to authenticated using ((select auth.uid()) = user_id);

create function community_private.is_moderator() returns boolean
language sql stable security invoker set search_path = '' as $$
  select auth.uid() is not null and exists (select 1 from public.community_moderators where user_id = (select auth.uid()));
$$;
revoke all on function community_private.is_moderator() from public;
grant execute on function community_private.is_moderator() to authenticated;

create policy community_posts_public on public.community_posts for select to anon, authenticated using (status = 'published');
create policy community_posts_own on public.community_posts for select to authenticated using (author_id = (select auth.uid()) or (select community_private.is_moderator()));
create policy community_posts_insert on public.community_posts for insert to authenticated with check (author_id = (select auth.uid()) and status = 'published');
create policy community_posts_update on public.community_posts for update to authenticated
  using ((author_id = (select auth.uid()) and status = 'published') or (select community_private.is_moderator()))
  with check (author_id = (select auth.uid()) or (select community_private.is_moderator()));

create policy community_comments_public on public.community_comments for select to anon, authenticated
  using (status = 'published' and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published'));
create policy community_comments_own on public.community_comments for select to authenticated
  using (author_id = (select auth.uid()) or (select community_private.is_moderator()));
create policy community_comments_insert on public.community_comments for insert to authenticated
  with check (author_id = (select auth.uid()) and status = 'published' and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published'));
create policy community_comments_update on public.community_comments for update to authenticated
  using ((author_id = (select auth.uid()) and status = 'published') or (select community_private.is_moderator()))
  with check (author_id = (select auth.uid()) or (select community_private.is_moderator()));

create policy community_reports_read on public.community_reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select community_private.is_moderator()));
create policy community_reports_insert on public.community_reports for insert to authenticated
  with check (reporter_id = (select auth.uid()) and not resolved and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published'));
create policy community_reports_resolve on public.community_reports for update to authenticated
  using ((select community_private.is_moderator())) with check ((select community_private.is_moderator()));

create function community_private.validate_content() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare recent_count integer; image_path text;
begin
  if auth.uid() is null then raise exception 'community_auth_required'; end if;
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text || tg_table_name, 0));
  if tg_op = 'INSERT' then
    new.author_id := auth.uid(); new.created_at := now(); new.updated_at := now(); new.status := 'published';
    if tg_table_name = 'community_posts' then
      select count(*) into recent_count from public.community_posts where author_id = auth.uid() and created_at > now() - interval '10 minutes';
      if recent_count >= 5 then raise exception 'community_rate_limit'; end if;
    else
      select count(*) into recent_count from public.community_comments where author_id = auth.uid() and created_at > now() - interval '10 minutes';
      if recent_count >= 20 then raise exception 'community_rate_limit'; end if;
    end if;
  else
    new.id := old.id; new.author_id := old.author_id; new.created_at := old.created_at; new.updated_at := now();
    if not community_private.is_moderator() and new.status not in ('published','deleted') then raise exception 'community_forbidden'; end if;
    if new.author_id <> auth.uid() then
      -- Moderators can hide/restore, never rewrite another member's words.
      if tg_table_name = 'community_posts' then
        new.title := old.title; new.body := old.body; new.category := old.category; new.image_paths := old.image_paths;
      else new.body := old.body; end if;
    end if;
  end if;
  if tg_table_name = 'community_posts' then
    foreach image_path in array new.image_paths loop
      if image_path !~ ('^' || new.author_id::text || '/[0-9a-f-]{36}\.jpg$') then raise exception 'community_invalid_photo'; end if;
    end loop;
  end if;
  return new;
end;
$$;
revoke all on function community_private.validate_content() from public, anon, authenticated;
create trigger community_posts_validate before insert or update on public.community_posts for each row execute function community_private.validate_content();
create trigger community_comments_validate before insert or update on public.community_comments for each row execute function community_private.validate_content();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('community-photos','community-photos',false,5242880,array['image/jpeg']);
create policy community_photos_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'community-photos' and (storage.foldername(name))[1] = (select auth.uid())::text and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.jpg$');
create policy community_photos_public_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'community-photos' and exists (select 1 from public.community_posts p where p.status = 'published' and p.image_paths @> array[name]));
create policy community_photos_owner_read on storage.objects for select to authenticated
  using (bucket_id = 'community-photos' and ((storage.foldername(name))[1] = (select auth.uid())::text or (select community_private.is_moderator())));
create policy community_photos_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'community-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
