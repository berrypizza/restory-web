create schema intake_private;
revoke all on schema intake_private from public;
grant usage on schema intake_private to anon, authenticated;

-- Staff membership is provisioned by the owner, independently of public sign-up.
create table public.intake_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  staff_name text not null unique check (length(btrim(staff_name)) between 1 and 40),
  role text not null check (role in ('admin', 'tech')),
  constraint intake_approvers check (role <> 'admin' or staff_name in ('고관호', '고현호'))
);
alter table public.intake_staff enable row level security;
revoke all on public.intake_staff from public, anon, authenticated;
grant select on public.intake_staff to authenticated;
grant select, insert on public.intake_staff to service_role;
create policy intake_staff_self on public.intake_staff for select to authenticated
using (user_id = (select auth.uid()));

create table public.customer_intakes (
  id uuid primary key,
  received_at timestamptz not null default now(),
  customer_name text,
  phone text,
  address text,
  item text,
  notes text,
  scheduled_at timestamptz,
  scheduled_by uuid references public.intake_staff(user_id) on delete set null,
  job_id uuid unique references public.jobs(id) on delete set null,
  constraint intake_lifecycle check (
    (scheduled_at is null and job_id is null and customer_name is not null and phone is not null
     and address is not null and item is not null) or
    (scheduled_at is not null and customer_name is null and phone is null and address is null
     and item is null and notes is null)
  )
);
create index customer_intake_queue on public.customer_intakes(received_at, id) where scheduled_at is null;
alter table public.customer_intakes enable row level security;
revoke all on public.customer_intakes from public, anon, authenticated;
grant select on public.customer_intakes to authenticated;
create policy intake_managers_read on public.customer_intakes for select to authenticated
using (exists (select 1 from public.intake_staff where user_id = (select auth.uid()) and role = 'admin'));

alter table public.jobs
  add column from_customer_intake boolean not null default false,
  add column intake_assistants text[] not null default '{}';

create function intake_private.can_access_job(primary_tech text, assistants text[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.intake_staff s where s.user_id = (select auth.uid())
      and (s.role = 'admin' or s.staff_name = primary_tech or s.staff_name = any(assistants))
  );
$$;
revoke all on function intake_private.can_access_job(text, text[]) from public, anon, authenticated;
grant execute on function intake_private.can_access_job(text, text[]) to anon, authenticated;

-- Apply alongside the policies used by legacy manual entries.
alter table public.jobs enable row level security;
create policy customer_job_staff_only on public.jobs as restrictive for all
using (not from_customer_intake or intake_private.can_access_job(tech, intake_assistants))
with check (not from_customer_intake or intake_private.can_access_job(tech, intake_assistants));
create policy customer_job_manager_removal on public.jobs as restrictive for delete
using (not from_customer_intake or intake_private.can_access_job(null, '{}'::text[]));
create policy customer_job_manager_creation on public.jobs as restrictive for insert
with check (not from_customer_intake or intake_private.can_access_job(null, '{}'::text[]));

alter table public.materials enable row level security;
create policy customer_material_parent_access on public.materials as restrictive for all
using (job_id is null or exists (select 1 from public.jobs j where j.id = job_id));

create function intake_private.keep_job_origin() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and old.from_customer_intake then
    new.from_customer_intake := true;
  end if;
  if new.aftercare_source_id is not null and exists (
    select 1 from public.jobs j where j.id = new.aftercare_source_id and j.from_customer_intake
  ) then
    new.from_customer_intake := true;
  end if;
  return new;
end;
$$;
revoke all on function intake_private.keep_job_origin() from public, anon, authenticated;
create trigger customer_job_origin before insert or update of from_customer_intake, aftercare_source_id
on public.jobs for each row execute function intake_private.keep_job_origin();

create function intake_private.submit_request(p_id uuid, p_name text, p_phone text, p_address text,
  p_item text, p_notes text, p_consent boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare
  digits text := regexp_replace(coalesce(p_phone,''), '[[:space:]()-]', '', 'g');
begin
  digits := regexp_replace(digits, '^\+820?', '0');
  p_name := regexp_replace(p_name, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  p_address := regexp_replace(p_address, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  p_item := regexp_replace(p_item, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  if p_id is null or p_consent is distinct from true or
     coalesce(length(p_name),0) not between 1 and 60 or
     digits !~ '^(0[1-9][0-9]{7,9}|050[0-9]{9})$' or
     coalesce(length(p_address),0) not between 2 and 250 or
     coalesce(length(p_item),0) not between 1 and 100 or
     length(coalesce(p_notes,'')) > 800 then
    raise exception 'invalid_intake' using errcode = '22023';
  end if;
  insert into public.customer_intakes (id, customer_name, phone, address, item, notes)
  values (p_id, p_name, digits, p_address, p_item,
    nullif(btrim(replace(p_notes, '<!--RESTORY_', 'RESTORY_')), ''))
  on conflict (id) do nothing;
end;
$$;
revoke all on function intake_private.submit_request(uuid,text,text,text,text,text,boolean) from public, anon, authenticated;
grant execute on function intake_private.submit_request(uuid,text,text,text,text,text,boolean) to anon, authenticated;
create function public.submit_customer_intake(p_id uuid, p_name text, p_phone text, p_address text,
  p_item text, p_notes text, p_consent boolean)
returns void language sql security invoker set search_path = '' as $$
  select intake_private.submit_request(p_id,p_name,p_phone,p_address,p_item,p_notes,p_consent);
$$;
revoke all on function public.submit_customer_intake(uuid,text,text,text,text,text,boolean) from public, anon, authenticated;
grant execute on function public.submit_customer_intake(uuid,text,text,text,text,text,boolean) to anon, authenticated;

create function intake_private.schedule_request(p_id uuid, p_date date, p_time time, p_tech text, p_measurement boolean)
returns table(job_id uuid, visit_date date) language plpgsql security definer set search_path = '' as $$
declare
  request public.customer_intakes%rowtype;
  new_job_id uuid;
  technician text := btrim(coalesce(p_tech,''));
begin
  if not exists (select 1 from public.intake_staff where user_id = (select auth.uid()) and role = 'admin') then
    raise exception 'staff_access_required' using errcode = '42501';
  end if;
  select * into strict request from public.customer_intakes where id = p_id for update;
  if request.scheduled_at is not null then
    if request.job_id is null then raise exception 'scheduled_job_removed' using errcode = 'P0002'; end if;
    return query select j.id, j.visit_date from public.jobs j where j.id = request.job_id;
    return;
  end if;
  if p_date is null or not isfinite(p_date) or length(technician) > 40 or p_measurement is null then
    raise exception 'invalid_schedule' using errcode = '22023';
  end if;
  insert into public.jobs (visit_date, visit_time, name, phone, region, symptom, memo, tech,
    status, price, is_measurement, as_until, from_customer_intake)
  values (p_date, p_time, request.customer_name, request.phone, request.address, request.item,
    coalesce(request.notes,''), technician, case when technician = '' then '대기' else '배정' end,
    0, p_measurement, (p_date + interval '1 year')::date, true)
  returning id into new_job_id;
  -- Keep the retry receipt even after the job is deleted, and keep only one copy of customer details.
  update public.customer_intakes set scheduled_at = now(), scheduled_by = (select auth.uid()), job_id = new_job_id,
    customer_name = null, phone = null, address = null, item = null, notes = null where id = p_id;
  return query select new_job_id, p_date;
end;
$$;
revoke all on function intake_private.schedule_request(uuid,date,time,text,boolean) from public, anon, authenticated;
grant execute on function intake_private.schedule_request(uuid,date,time,text,boolean) to authenticated;
create function public.schedule_customer_intake(p_id uuid, p_date date, p_time time, p_tech text, p_measurement boolean)
returns table(job_id uuid, visit_date date) language sql security invoker set search_path = '' as $$
  select * from intake_private.schedule_request(p_id,p_date,p_time,p_tech,p_measurement);
$$;
revoke all on function public.schedule_customer_intake(uuid,date,time,text,boolean) from public, anon, authenticated;
grant execute on function public.schedule_customer_intake(uuid,date,time,text,boolean) to authenticated;
