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
do $$ declare
  k uuid := '14000000-0000-4000-8000-000000000010';
  pic jsonb := jsonb_build_object('image',encode(decode('ffd8ff0011ffd9','hex'),'base64'),
    'thumbnail',encode(decode('ffd8ff22ffd9','hex'),'base64'));
begin
  perform public.submit_customer_intake(k,'검증 고객','010-0000-0000','테스트로 1','소파 수리','테스트 메모',true,jsonb_build_array(pic,pic));
  perform public.submit_customer_intake(k,'검증 고객','010-0000-0000','테스트로 1','소파 수리','테스트 메모',true);
  perform public.submit_customer_intake(k,'검증 고객','010-0000-0000','다른길 2','소파 수리','',true,'[]','901호','detail');
  begin
    perform public.confirm_customer_intake_address(k,'테스트로 1','테스트로 1','','none');
    raise exception 'anonymous address confirmation';
  exception when insufficient_privilege then null; end;
  begin
    perform public.submit_customer_intake('14000000-0000-4000-8000-000000000011','검증 사진','01000000000','테스트로 1','기타','',true,
      jsonb_build_array(pic,jsonb_build_object('image','aGVsbG8=','thumbnail','aGVsbG8=')));
    raise exception 'accepted invalid second photo';
  exception when invalid_parameter_value then null; end;
  begin
    perform 1 from public.read_customer_photos(k,null,true);
    raise exception 'anonymous photo access';
  exception when insufficient_privilege then null; end;
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
  if exists(select 1 from public.customer_intakes where id='14000000-0000-4000-8000-000000000011')
    or (select count(*) from public.customer_intake_photos where request_id='14000000-0000-4000-8000-000000000010') <> 2
    then raise exception 'intake or media saved partially or twice'; end if;
  if exists(select 1 from public.jobs where name = '검증 고객')
    or (select count(*) from public.customer_intakes where customer_name = '검증 고객') <> 1
    then raise exception 'submission must create exactly one pending request and no job'; end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000003', true);
do $$ begin
  if exists(select 1 from public.customer_intakes) then raise exception 'technician read pending intake'; end if;
  begin
    perform public.confirm_customer_intake_address('14000000-0000-4000-8000-000000000010','테스트로 1','테스트로 1','','none');
    raise exception 'technician confirmed address';
  exception when insufficient_privilege then null; end;
  if exists(select 1 from public.read_customer_photos('14000000-0000-4000-8000-000000000010',null,true))
    then raise exception 'technician read pending photos'; end if;
  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000010',current_date,null,'',false);
    raise exception 'technician approval';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000001', true);
do $$ begin
  if (select phone from public.customer_intakes where id='14000000-0000-4000-8000-000000000010') is distinct from '01000000000'
    then raise exception 'manager cannot review intake'; end if;
  if (select photo_count from public.customer_intakes where id='14000000-0000-4000-8000-000000000010') is distinct from 2
    or (select count(*) from public.read_customer_photos('14000000-0000-4000-8000-000000000010',null,true) where decode(jpeg,'base64')=decode('ffd8ff22ffd9','hex')) <> 2
    then raise exception 'manager cannot preview both images'; end if;
  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000010','2027-01-12','14:30','이주형',true);
    raise exception 'legacy address scheduled before review';
  exception when invalid_parameter_value then
    if sqlerrm <> 'address_confirmation_required' then raise; end if;
  end;
  perform public.confirm_customer_intake_address('14000000-0000-4000-8000-000000000010','테스트로 1','테스트로 1','','none');
  perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000010','2027-01-12','14:30','이주형',true);
end $$;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000002', true);
do $$ declare saved uuid; retried uuid; begin
  select job_id into saved from public.customer_intakes where id = '14000000-0000-4000-8000-000000000010';
  select job_id into retried from public.schedule_customer_intake('14000000-0000-4000-8000-000000000010','2027-02-01',null,'',false);
  if saved is null or retried is distinct from saved then raise exception 'repeat approval created another job'; end if;
  if not exists(select 1 from public.jobs where id=saved and is_measurement and visit_date='2027-01-12'
    and visit_time='14:30' and symptom='소파 수리' and name='검증 고객' and phone='01000000000'
    and region='테스트로 1' and memo='테스트 메모' and tech='이주형' and status='배정' and customer_photo_count=2)
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
  if (select count(*) from public.read_customer_photos(null,(select id from public.jobs where name='검증 고객'),false)
      where decode(jpeg,'base64')=decode('ffd8ff0011ffd9','hex')) <> 2 then raise exception 'assigned tech cannot see both original photos'; end if;
end $$;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000004', true);
do $$ begin
  if exists(select 1 from public.customer_intakes) or exists(select 1 from public.jobs where from_customer_intake)
    then raise exception 'nonstaff read intake'; end if;
  if exists(select 1 from public.customer_intake_photos) then raise exception 'nonstaff read photos'; end if;
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
reset role;
do $$ begin
  if exists(select 1 from public.customer_intake_photos where request_id='14000000-0000-4000-8000-000000000010')
    then raise exception 'photos retained after full job deletion'; end if;
end $$;

set local role anon;
select public.submit_customer_intake('14000000-0000-4000-8000-000000000020','메모 검증','01000000000','검증로 7','기타','고객 원문',true,'[]','202호','detail');
select public.submit_customer_intake('14000000-0000-4000-8000-000000000021','실측 미정','01000000000','검증리 산7-2','기타','',true,'[]','','later');
select public.submit_customer_intake('14000000-0000-4000-8000-000000000022','실측 견적','01000000000','검증로 7','기타','',true,'[]','','none');
do $$ begin
  begin
    perform public.submit_customer_intake(gen_random_uuid(),'누락 검증','01000000000','서울','기타','',true,'[]','','later');
    raise exception 'neighborhood-only base accepted';
  exception when invalid_parameter_value then if sqlerrm <> 'invalid_address_base' then raise; end if; end;
  begin
    perform public.submit_customer_intake(gen_random_uuid(),'누락 검증','01000000000','검증로 7','기타','',true,'[]','  ','detail');
    raise exception 'empty required detail accepted';
  exception when invalid_parameter_value then if sqlerrm <> 'invalid_address_detail' then raise; end if; end;
  begin
    perform public.submit_customer_intake(gen_random_uuid(),'누락 검증','01000000000','검증로 7','기타','',true,'[]','미정','detail');
    raise exception 'placeholder marked address ready';
  exception when invalid_parameter_value then if sqlerrm <> 'invalid_address_detail' then raise; end if; end;
end $$;
do $$ begin
  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000020',current_date,'09:30','',false,'직원 메모',150000);
    raise exception 'anonymous approval with staff memo';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000003',true);
do $$ begin
  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000020',current_date,'09:30','',false,'직원 메모',150000);
    raise exception 'technician approval with staff memo';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','14000000-0000-4000-8000-000000000001',true);
do $$ declare
  request_id uuid := '14000000-0000-4000-8000-000000000020';
  saved uuid;
  retried uuid;
  invalid_time time;
  invalid_price integer;
begin
  foreach invalid_time in array array[time '09:15', time '09:30:01', time '24:00'] loop
    begin
      perform public.schedule_customer_intake(request_id,current_date,invalid_time,'',false,'',150000);
      raise exception 'off-grid time accepted';
    exception when invalid_parameter_value then null; end;
  end loop;
  begin
    perform public.schedule_customer_intake(request_id,current_date,null,'',false,repeat('가',1201),150000);
    raise exception 'overlength staff memo accepted';
  exception when invalid_parameter_value then null; end;
  foreach invalid_price in array array[null,0,-1]::integer[] loop
    begin
      perform public.schedule_customer_intake(request_id,current_date,null,'',false,'',invalid_price);
      raise exception 'unquoted regular visit accepted';
    exception when invalid_parameter_value then
      if sqlerrm <> 'quote_required' then raise; end if;
    end;
  end loop;
  begin
    perform public.schedule_customer_intake(request_id,current_date,null,'',false);
    raise exception 'five-argument approval accepted unquoted visit';
  exception when invalid_parameter_value then
    if sqlerrm <> 'quote_required' then raise; end if;
  end;
  begin
    perform public.schedule_customer_intake(request_id,current_date,null,'',false,'');
    raise exception 'six-argument approval accepted unquoted visit';
  exception when invalid_parameter_value then
    if sqlerrm <> 'quote_required' then raise; end if;
  end;
  if not exists(select 1 from public.customer_intakes where id=request_id and scheduled_at is null and notes='고객 원문')
    or exists(select 1 from public.jobs where name='메모 검증')
    then raise exception 'failed approval consumed the intake'; end if;
  select job_id into saved from public.schedule_customer_intake(request_id,current_date,'09:30','이주형',false,'  직원 메모  ',150000);
  select job_id into retried from public.schedule_customer_intake(request_id,current_date,'12:00','',false,'재시도 메모',300000);
  if saved is null or retried is distinct from saved or not exists (
    select 1 from public.jobs where id=saved and customer_notes='고객 원문' and memo='직원 메모' and visit_time='09:30' and price=150000 and region='검증로 7 202호'
  ) then raise exception 'approval or retry changed the original price, notes or time'; end if;
  update public.jobs set memo='직원 수정' where id=saved;
  if not exists(select 1 from public.jobs where id=saved and customer_notes='고객 원문' and memo='직원 수정')
    then raise exception 'staff edit changed the customer note'; end if;

  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000021',current_date,null,'',true,'',-1);
    raise exception 'negative measurement quote accepted';
  exception when invalid_parameter_value then
    if sqlerrm <> 'invalid_quote' then raise; end if;
  end;
  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000021',current_date,null,'',false,'',150000);
    raise exception 'regular visit with pending address accepted';
  exception when invalid_parameter_value then if sqlerrm <> 'address_confirmation_required' then raise; end if; end;
  begin
    perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000021',current_date,null,'',true,'');
    raise exception 'unconfirmed measurement accepted through older RPC';
  exception when invalid_parameter_value then if sqlerrm <> 'address_confirmation_required' then raise; end if; end;
  if not exists(select from public.customer_intakes where id='14000000-0000-4000-8000-000000000021' and scheduled_at is null and address_confirmed is false)
    or exists(select from public.jobs where name='실측 미정') then raise exception 'blocked scheduling changed state'; end if;
  perform public.confirm_customer_intake_address('14000000-0000-4000-8000-000000000021','검증리 산7-2','검증로 15','2층 매장','detail');
  perform public.confirm_customer_intake_address('14000000-0000-4000-8000-000000000021','검증리 산7-2','검증로 15','2층 매장','detail');
  begin
    perform public.confirm_customer_intake_address('14000000-0000-4000-8000-000000000021','검증리 산7-2','다른길 77','','none');
    raise exception 'stale address confirmation overwrote saved address';
  exception when serialization_failure then null; end;
  perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000021',current_date,null,'',true,'',null);
  perform public.schedule_customer_intake('14000000-0000-4000-8000-000000000022',current_date,null,'',true,'',70000);
  if not exists(select 1 from public.jobs where name='실측 미정' and is_measurement and price=0 and region='검증로 15 2층 매장')
    or not exists(select 1 from public.jobs where name='실측 견적' and is_measurement and price=70000)
    then raise exception 'measurement quote was not saved as entered'; end if;
end $$;
reset role;
rollback;
