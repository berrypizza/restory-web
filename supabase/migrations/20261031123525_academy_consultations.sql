-- Public intake is a validated write-only RPC. Reading contacts requires a verified owner account.
create table public.academy_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.academy_admins enable row level security;
revoke all on public.academy_admins from public, anon, authenticated;
grant select on public.academy_admins to authenticated;
grant all on public.academy_admins to service_role;
create policy academy_admin_self on public.academy_admins for select to authenticated using (user_id = (select auth.uid()));

insert into public.academy_admins(user_id)
select id from auth.users where lower(email) = 'kkh0510ks@gmail.com' and email_confirmed_at is not null;

create table public.academy_consultations (
  id uuid primary key,
  consultation_type text not null check (consultation_type in ('online','offline')),
  fee_krw integer generated always as (case when consultation_type='offline' then 50000 else 0 end) stored,
  situation text not null check (situation in ('employee','freelancer','student','technician','other')),
  name text not null check (char_length(name) between 1 and 50),
  phone text not null check (phone ~ '^0[0-9]{8,10}$'),
  email text not null default '' check (char_length(email)<=254),
  region text not null default '' check (char_length(region)<=80),
  age_range text not null default '' check (char_length(age_range)<=30),
  available_time text not null check (char_length(available_time) between 1 and 150),
  message text not null default '' check (char_length(message)<=2000),
  status text not null default 'new' check (status in ('new','contacted','scheduled','completed')),
  consent_version text not null,
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index academy_consultations_created_idx on public.academy_consultations(created_at desc);
create index academy_consultations_phone_created_idx on public.academy_consultations(phone,created_at desc);
alter table public.academy_consultations enable row level security;
revoke all on public.academy_consultations from public, anon, authenticated;
grant select, delete on public.academy_consultations to authenticated;
grant update(status) on public.academy_consultations to authenticated;
grant all on public.academy_consultations to service_role;
create policy academy_consultation_admin_read on public.academy_consultations for select to authenticated
using (created_at > now() - interval '90 days' and exists (select 1 from public.academy_admins where user_id=(select auth.uid())));
create policy academy_consultation_admin_update on public.academy_consultations for update to authenticated
using (exists (select 1 from public.academy_admins where user_id=(select auth.uid())))
with check (exists (select 1 from public.academy_admins where user_id=(select auth.uid())));
create policy academy_consultation_admin_delete on public.academy_consultations for delete to authenticated
using (exists (select 1 from public.academy_admins where user_id=(select auth.uid())));

create function public.is_academy_admin() returns boolean language sql stable security invoker set search_path = '' as $$
  select exists(select 1 from public.academy_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.is_academy_admin() from public, anon, authenticated;
grant execute on function public.is_academy_admin() to authenticated;

-- SECURITY DEFINER is intentional: anonymous visitors may submit, but never select or directly insert.
-- Every accepted field is validated here; price, status, consent time and retention time are server-owned.
create function public.submit_academy_consultation(p_id uuid, p_data jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_phone text;
  v_key text;
begin
  if p_id is null or jsonb_typeof(p_data) is distinct from 'object' or octet_length(p_data::text)>12000
    or p_data->'consent' is distinct from 'true'::jsonb
    or p_data->>'consent_version' is distinct from '2026-10-31.v1'
    or coalesce(p_data->>'website','')<>'' then
    raise exception 'invalid_input' using errcode='22023';
  end if;
  foreach v_key in array array['consultation_type','situation','name','phone','email','region','age_range','available_time','message'] loop
    if p_data ? v_key and jsonb_typeof(p_data->v_key) is distinct from 'string' then
      raise exception 'invalid_input' using errcode='22023';
    end if;
  end loop;
  v_phone := regexp_replace(coalesce(p_data->>'phone',''),'[^0-9]','','g');
  if coalesce(p_data->>'consultation_type','') not in ('online','offline')
    or coalesce(p_data->>'situation','') not in ('employee','freelancer','student','technician','other')
    or char_length(btrim(coalesce(p_data->>'name',''))) not between 1 and 50
    or coalesce(p_data->>'phone','') !~ '^[0-9+ ()-]+$' or v_phone !~ '^0[0-9]{8,10}$'
    or char_length(coalesce(p_data->>'email',''))>254
    or (btrim(coalesce(p_data->>'email',''))<>'' and btrim(p_data->>'email') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
    or char_length(coalesce(p_data->>'region',''))>80
    or char_length(coalesce(p_data->>'age_range',''))>30
    or char_length(btrim(coalesce(p_data->>'available_time',''))) not between 1 and 150
    or char_length(coalesce(p_data->>'message',''))>2000 then
    raise exception 'invalid_input' using errcode='22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('academy_consultation_intake',0));
  if exists(select 1 from public.academy_consultations where id=p_id) then return; end if;
  if (select count(*) from public.academy_consultations where phone=v_phone and created_at>now()-interval '24 hours')>=3
    or (select count(*) from public.academy_consultations where created_at>now()-interval '1 hour')>=100 then
    raise exception 'rate_limit' using errcode='P0001';
  end if;
  insert into public.academy_consultations(id,consultation_type,situation,name,phone,email,region,age_range,available_time,message,consent_version)
  values(p_id,p_data->>'consultation_type',p_data->>'situation',btrim(p_data->>'name'),v_phone,
    btrim(coalesce(p_data->>'email','')),btrim(coalesce(p_data->>'region','')),btrim(coalesce(p_data->>'age_range','')),
    btrim(p_data->>'available_time'),btrim(coalesce(p_data->>'message','')),'2026-10-31.v1');
end;
$$;
revoke all on function public.submit_academy_consultation(uuid,jsonb) from public, anon, authenticated;
grant execute on function public.submit_academy_consultation(uuid,jsonb) to anon, authenticated;

-- Apply the retention period disclosed in the consent text to this feature only.
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('academy-consultation-retention','17 * * * *',
  $$delete from public.academy_consultations where created_at <= now() - interval '90 days'$$);
