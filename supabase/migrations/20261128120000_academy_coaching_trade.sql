-- 1:1 coaching (2 hours, 500,000 KRW) replaces the free/offline consultation choice,
-- and applicants now tell us their trade instead of their life situation.
-- Historical rows (v1/v2) keep their original answers, fee and consent version.

-- 1) new consultation type
-- (the original check was declared inline, so drop it by definition rather than by a guessed name)
do $$
declare c text;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.academy_consultations'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) like '%consultation_type%'
      and pg_get_constraintdef(oid) not like '%consent_version%'
  loop
    execute format('alter table public.academy_consultations drop constraint %I', c);
  end loop;
end $$;
alter table public.academy_consultations
  add constraint academy_consultations_consultation_type_check
  check (consultation_type in ('online','offline','coaching'));

-- 2) fee follows the type (generated column must be re-created to change its expression)
alter table public.academy_consultations drop column fee_krw;
alter table public.academy_consultations
  add column fee_krw integer generated always as (
    case consultation_type when 'coaching' then 500000 when 'offline' then 50000 else 0 end
  ) stored;

-- 3) trade replaces situation for new requests
alter table public.academy_consultations alter column situation drop not null;
alter table public.academy_consultations
  add column trade text check (trade in (
    'house_repair','aircon_cleaning','sofa_clinic','furniture_repair','interior',
    'move_cleaning','plumbing','electrical','other'
  ));
alter table public.academy_consultations
  add constraint academy_consultations_v3_required check (
    consent_version <> '2026-11-28.v3' or (
      consultation_type = 'coaching'
      and trade is not null
      and btrim(region) <> ''
      and age_range ~ '^([1-9][0-9]?|1[01][0-9]|120)$'
      and repair_experience is not null
      and marketing_experience is not null
    )
  );

-- 4) intake RPC: accepts the current v3 form, and still the previous v2 form for open tabs
create or replace function public.submit_academy_consultation(p_id uuid, p_data jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_phone text;
  v_key text;
  v_version text := p_data->>'consent_version';
begin
  if p_id is null or jsonb_typeof(p_data) is distinct from 'object' or octet_length(p_data::text)>12000
    or p_data->'consent' is distinct from 'true'::jsonb
    or v_version is null or v_version not in ('2026-11-11.v2','2026-11-28.v3')
    or coalesce(p_data->>'website','')<>'' then
    raise exception 'invalid_input' using errcode='22023';
  end if;
  foreach v_key in array array['consultation_type','situation','trade','name','phone','email','region','age_range','repair_experience','marketing_experience','available_time','message'] loop
    if p_data ? v_key and jsonb_typeof(p_data->v_key) is distinct from 'string' then
      raise exception 'invalid_input' using errcode='22023';
    end if;
  end loop;
  v_phone := regexp_replace(coalesce(p_data->>'phone',''),'[^0-9]','','g');

  if v_version = '2026-11-28.v3' then
    if coalesce(p_data->>'consultation_type','') <> 'coaching'
      or coalesce(p_data->>'trade','') not in ('house_repair','aircon_cleaning','sofa_clinic','furniture_repair','interior','move_cleaning','plumbing','electrical','other') then
      raise exception 'invalid_input' using errcode='22023';
    end if;
  else
    if coalesce(p_data->>'consultation_type','') not in ('online','offline')
      or coalesce(p_data->>'situation','') not in ('employee','freelancer','student','technician','other') then
      raise exception 'invalid_input' using errcode='22023';
    end if;
  end if;

  if char_length(btrim(coalesce(p_data->>'name',''))) not between 1 and 50
    or coalesce(p_data->>'phone','') !~ '^[0-9+ ()-]+$' or v_phone !~ '^0[0-9]{8,10}$'
    or char_length(coalesce(p_data->>'email',''))>254
    or (btrim(coalesce(p_data->>'email',''))<>'' and btrim(p_data->>'email') !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')
    or char_length(btrim(coalesce(p_data->>'region',''))) not between 1 and 80
    or coalesce(p_data->>'age_range','') !~ '^([1-9][0-9]?|1[01][0-9]|120)$'
    or coalesce(p_data->>'repair_experience','') not in ('experienced','explored','beginner')
    or coalesce(p_data->>'marketing_experience','') not in ('business','personal','beginner')
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

  insert into public.academy_consultations(id,consultation_type,situation,trade,name,phone,email,region,age_range,repair_experience,marketing_experience,available_time,message,consent_version)
  values(p_id,p_data->>'consultation_type',
    case when v_version = '2026-11-28.v3' then null else p_data->>'situation' end,
    case when v_version = '2026-11-28.v3' then p_data->>'trade' else null end,
    btrim(p_data->>'name'),v_phone,
    btrim(coalesce(p_data->>'email','')),btrim(p_data->>'region'),p_data->>'age_range',
    p_data->>'repair_experience',p_data->>'marketing_experience',
    btrim(p_data->>'available_time'),btrim(coalesce(p_data->>'message','')),v_version);
end;
$$;

revoke all on function public.submit_academy_consultation(uuid,jsonb) from public;
grant execute on function public.submit_academy_consultation(uuid,jsonb) to anon, authenticated;
