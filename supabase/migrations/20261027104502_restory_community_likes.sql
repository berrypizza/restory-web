create table public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index community_likes_user on public.community_likes(user_id, post_id);
alter table public.community_likes enable row level security;
revoke all on public.community_likes from public, anon, authenticated;
grant select, delete on public.community_likes to authenticated;
grant insert(post_id) on public.community_likes to authenticated;

create policy community_likes_own_read on public.community_likes for select to authenticated
  using (user_id = (select auth.uid()));
create policy community_likes_insert on public.community_likes for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (
    select 1 from public.community_posts p where p.id = post_id and p.status = 'published'
  ));
create policy community_likes_own_delete on public.community_likes for delete to authenticated
  using (user_id = (select auth.uid()));

-- Only aggregate totals are public. Individual members' likes remain private.
-- The definer helper is not exposed through the Data API and never returns user IDs.
create function community_private.like_summary(post_ids uuid[])
returns table(post_id uuid, like_count bigint, liked boolean)
language plpgsql stable security definer set search_path = '' as $$
declare viewer_id uuid := auth.uid();
begin
  if coalesce(cardinality(post_ids), 0) > 50 then
    raise exception 'community_like_batch_limit' using errcode = '22023';
  end if;
  return query
    select p.id, count(l.post_id),
      case when viewer_id is null then false
        else coalesce(bool_or(l.user_id = viewer_id), false) end
    from public.community_posts p
    left join public.community_likes l on l.post_id = p.id
    where p.id = any(post_ids) and p.status = 'published'
    group by p.id;
end;
$$;
revoke all on function community_private.like_summary(uuid[]) from public, anon, authenticated;
grant execute on function community_private.like_summary(uuid[]) to anon, authenticated;

create function public.community_get_likes(post_ids uuid[])
returns table(post_id uuid, like_count bigint, liked boolean)
language sql stable security invoker set search_path = '' as $$
  select * from community_private.like_summary(post_ids);
$$;
revoke all on function public.community_get_likes(uuid[]) from public, anon, authenticated;
grant execute on function public.community_get_likes(uuid[]) to anon, authenticated;
