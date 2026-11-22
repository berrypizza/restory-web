-- Run on an isolated test database after the intake migration.
begin;
insert into auth.users(id) select ('14000000-0000-4000-8000-00000000000' || n)::uuid from generate_series(1,4) n;
insert into public.intake_staff (user_id, staff_name, role) values
  ('14000000-0000-4000-8000-000000000001', '고관호', 'admin'),
  ('14000000-0000-4000-8000-000000000002', '고현호', 'admin'),
  ('14000000-0000-4000-8000-000000000003', '이주형', 'tech');
do $$ begin
  begin
    insert into public.intake_staff values ('14000000-0000-4000-8000-000000000004', '테스트', 'admin');
    raise exception 'unexpected third approver';
  exception when check_violation then null; end;
end $$;

set local role anon;
do $$ declare k uuid := '14000000-0000-4000-8000-000000000010'; begin
  perform public.submit_customer_intake(k,'검증 고객','010-0000-0000','테스트로 1','소파 수리','테스트 메모',true);
  perform public.submit_customer_intake(k,'검증 고객','010-0000-0000','테스트로 1','소파 수리','테스트 메모',true);
  begin
    perform public.submit_customer_intake(gen_random_uuid(),'검증 고객','잘못된 번호','테스트로 1','기타','',true);
    raise exception 'invalid phone accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.submit_customer_intake(gen_random_uuid(),'검증 고객','01000000000','테스트로 1','기타','',false);
    raise exception 'missing consent accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform 1 from public.customer_intakes;
    raise exception 'anonymous inbox access';
  exception when insufficient_privilege then null; end;
  begin
    perform public.schedule_customer_intake(k, current_date, null, '', false);
    raise exception 'anonymous approval';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  if exists(select 1 from public.jobs where name = '검증 고객')
    or (select count(*) from public.customer_intakes where customer_name = '검증 고객') <> 1
    then raise exception 'submission must create exactly one pending request and no job'; end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000003', true);
do $$ begin
  if exists(select 1 from public.customer_intakes) then raise exception 'technician read pending intake'; end if;
  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000010',current_date,null,'',false);
    raise exception 'technician approval';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000001', true);
do $$ begin
  if (select phone from public.customer_intakes where id='14000000-0000-4000-8000-000000000010') is distinct from '01000000000'
    then raise exception 'manager cannot review intake'; end if;
  perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000010','2027-01-12','14:30','이주형',true);
end $$;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000002', true);
do $$ declare saved uuid; retried uuid; begin
  select job_id into saved from public.customer_intakes where id = '14000000-0000-4000-8000-000000000010';
  select job_id into retried from public.schedule_customer_intake('14000000-0000-4000-8000-000000000010','2027-02-01',null,'',false);
  if saved is null or retried is distinct from saved then raise exception 'repeat approval created another job'; end if;
  if not exists(select 1 from public.jobs where id=saved and is_measurement and visit_date='2027-01-12'
    and visit_time='14:30' and symptom='소파 수리' and name='검증 고객' and phone='01000000000'
    and region='테스트로 1' and memo='테스트 메모' and tech='이주형' and status='배정')
    then raise exception 'scheduled job incomplete'; end if;
  if not exists(select 1 from public.customer_intakes where job_id=saved and customer_name is null and phone is null
    and address is null and item is null and notes is null and scheduled_by='14000000-0000-4000-8000-000000000001')
    then raise exception 'receipt did not record the original reviewer or retained contact details'; end if;
  insert into public.jobs(name, region, symptom, visit_date, is_aftercare, aftercare_source_id, price)
    values ('검증 재방문','테스트로 1','소파 수리',current_date,true,saved,0);
  insert into public.materials(job_id,name) values(saved,'검증 자재');
end $$;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000003', true);
do $$ begin
  if (select count(*) from public.jobs where name='검증 고객') <> 1 then raise exception 'assigned tech cannot see job'; end if;
end $$;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000004', true);
do $$ begin
  if exists(select 1 from public.customer_intakes) or exists(select 1 from public.jobs where from_customer_intake)
    then raise exception 'nonstaff read intake'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
do $$ begin
  if exists(select 1 from public.jobs where name in ('검증 고객','검증 재방문')) or
    exists(select 1 from public.materials where name='검증 자재') then raise exception 'private job or material visible'; end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000002', true);
do $$ begin
  delete from public.jobs where name='검증 고객';
  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000010',current_date,null,'',false);
    raise exception 'deleted job recreated';
  exception when no_data_found then null; end;
  if not exists(select 1 from public.jobs where name='검증 재방문' and from_customer_intake) then raise exception 'orphan lost privacy'; end if;
end $$;
rollback;
