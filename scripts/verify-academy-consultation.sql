-- Run after the experience migration as a database owner. All fixtures roll back.
begin;
set local role anon;

do $test$
declare
  payload jsonb := '{"consultation_type":"offline","situation":"employee","name":"검증용 신청","phone":"01000000000","email":"test@example.com","region":"서울 강남구","age_range":"34","repair_experience":"explored","marketing_experience":"personal","available_time":"평일 오후","message":"트랜잭션 롤백 검증","consent":true,"consent_version":"2026-11-11.v2"}';
  invalid jsonb;
begin
  perform public.submit_academy_consultation('00000000-0000-4000-8000-000000000101',payload);
  perform public.submit_academy_consultation('00000000-0000-4000-8000-000000000101',payload);
  perform public.submit_academy_consultation('00000000-0000-4000-8000-000000000102',payload || '{"consultation_type":"online","email":"","repair_experience":"beginner","marketing_experience":"beginner"}');
  for invalid in select value from jsonb_array_elements(jsonb_build_array(
    payload - 'region', payload || '{"region":"   "}', payload - 'age_range', payload || '{"age_range":"30대"}',
    payload || '{"age_range":"0"}', payload || '{"age_range":"121"}', payload || '{"age_range":"34.5"}',
    payload - 'repair_experience', payload || '{"repair_experience":"unknown"}', payload || '{"repair_experience":null}',
    payload - 'marketing_experience', payload || '{"marketing_experience":42}',
    payload || '{"consent":false}',payload || '{"consent_version":"2026-10-31.v1"}', payload || '{"email":"invalid"}'
  )) loop
    begin
      perform public.submit_academy_consultation(gen_random_uuid(),invalid);
      raise exception 'test_failed_invalid_accepted';
    exception when sqlstate '22023' then null; end;
  end loop;
  begin
    perform 1 from public.academy_consultations;
    raise exception 'test_failed_anon_can_read';
  exception when insufficient_privilege then null; end;
end;
$test$;
reset role;
do $test$
begin
  if (select count(*) from public.academy_consultations where id in ('00000000-0000-4000-8000-000000000101','00000000-0000-4000-8000-000000000102')) <> 2 then raise exception 'test_failed_count'; end if;
  if not exists(select 1 from public.academy_consultations where id='00000000-0000-4000-8000-000000000101' and repair_experience='explored' and marketing_experience='personal' and region='서울 강남구' and age_range='34' and fee_krw=50000 and consent_version='2026-11-11.v2') then raise exception 'test_failed_saved_values'; end if;
end;
$test$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000999","role":"authenticated"}',true);
set local role authenticated;
do $test$ begin
  if exists(select 1 from public.academy_consultations) then raise exception 'test_failed_nonadmin_can_read'; end if;
end; $test$;
reset role;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select user_id from public.academy_admins limit 1),'role','authenticated')::text,true);
set local role authenticated;
do $test$ begin
  if not exists(select 1 from public.academy_consultations where id='00000000-0000-4000-8000-000000000101' and repair_experience='explored' and marketing_experience='personal') then raise exception 'test_failed_admin_cannot_read'; end if;
end; $test$;
reset role;
select 'PASS: two valid submissions, retry deduplication, 15 invalid inputs rejected, anonymous/nonadmin blocked, admin answers readable; all rolled back' as verification;
rollback;
