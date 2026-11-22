alter table public.jobs add column customer_notes text;

create function intake_private.schedule_request(
  p_id uuid, p_date date, p_time time, p_tech text, p_measurement boolean, p_staff_memo text
) returns table(job_id uuid, visit_date date)
language plpgsql security definer set search_path = '' as $$
declare
  request public.customer_intakes%rowtype;
  technician text := btrim(coalesce(p_tech, ''));
  new_job_id uuid;
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
  if p_staff_memo is not null and (length(p_staff_memo) > 1200 or
     (p_time is not null and (extract(hour from p_time) > 23 or
      extract(minute from p_time) not in (0, 30) or extract(second from p_time) <> 0))) then
    raise exception 'invalid_schedule_details' using errcode = '22023';
  end if;

  -- Older clients have one memo field. New approvals keep the original customer text apart from editable staff notes.
  insert into public.jobs (visit_date, visit_time, name, phone, region, symptom, customer_notes, memo,
    tech, status, price, is_measurement, as_until, from_customer_intake, customer_photo_count)
  values (p_date, p_time, request.customer_name, request.phone, request.address, request.item,
    case when p_staff_memo is not null then coalesce(request.notes, '') end,
    case when p_staff_memo is null then coalesce(request.notes, '')
      else btrim(replace(p_staff_memo, '<!--RESTORY_', 'RESTORY_')) end,
    technician, case when technician = '' then '대기' else '배정' end, 0, p_measurement,
    (p_date + interval '1 year')::date, true, request.photo_count)
  returning id into new_job_id;
  update public.customer_intake_photos set job_id = new_job_id where request_id = p_id;
  update public.customer_intakes set scheduled_at = now(), scheduled_by = (select auth.uid()), job_id = new_job_id,
    customer_name = null, phone = null, address = null, item = null, notes = null where id = p_id;
  return query select new_job_id, p_date;
end;
$$;
revoke all on function intake_private.schedule_request(uuid,date,time,text,boolean,text) from public, anon, authenticated;
grant execute on function intake_private.schedule_request(uuid,date,time,text,boolean,text) to authenticated;

create or replace function intake_private.schedule_request(p_id uuid, p_date date, p_time time, p_tech text, p_measurement boolean)
returns table(job_id uuid, visit_date date) language sql security invoker set search_path = '' as $$
  select * from intake_private.schedule_request(p_id, p_date, p_time, p_tech, p_measurement, null);
$$;
create function public.schedule_customer_intake(p_id uuid, p_date date, p_time time, p_tech text, p_measurement boolean, p_staff_memo text)
returns table(job_id uuid, visit_date date) language sql security invoker set search_path = '' as $$
  select * from intake_private.schedule_request(p_id, p_date, p_time, p_tech, p_measurement, coalesce(p_staff_memo, ''));
$$;
revoke all on function public.schedule_customer_intake(uuid,date,time,text,boolean,text) from public, anon, authenticated;
grant execute on function public.schedule_customer_intake(uuid,date,time,text,boolean,text) to authenticated;
notify pgrst, 'reload schema';
