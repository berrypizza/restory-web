create table public.intake_quote_profile (
  id smallint primary key check (id = 1),
  name text not null default '리스토리 스튜디오' check (char_length(btrim(name)) between 1 and 45),
  registration_number text not null default ''
    check (registration_number = '' or registration_number ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'),
  logo text default '/images/logo-cc.png' check (
    logo is null or logo = '/images/logo-cc.png' or
    (octet_length(logo) <= 205000 and logo ~ '^data:image/png;base64,iVBORw0KGgo[A-Za-z0-9+/]+=*\Z')
  ),
  revision integer not null default 1 check (revision > 0)
);

insert into public.intake_quote_profile (id) values (1);
alter table public.intake_quote_profile enable row level security;
revoke all on public.intake_quote_profile from public, anon, authenticated;
grant select on public.intake_quote_profile to authenticated;
grant update (name, registration_number, logo, revision) on public.intake_quote_profile to authenticated;

create policy quote_profile_read on public.intake_quote_profile for select to authenticated
  using (exists (select 1 from public.intake_staff where user_id = (select auth.uid()) and role = 'admin'));
create policy quote_profile_edit on public.intake_quote_profile for update to authenticated
  using (exists (select 1 from public.intake_staff where user_id = (select auth.uid()) and role = 'admin'))
  with check (exists (select 1 from public.intake_staff where user_id = (select auth.uid()) and role = 'admin'));
