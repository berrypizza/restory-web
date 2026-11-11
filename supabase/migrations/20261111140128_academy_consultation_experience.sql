-- Historical requests keep their original answers and consent version.
alter table public.academy_consultations
  add column repair_experience text check (repair_experience in ('experienced','explored','beginner')),
  add column marketing_experience text check (marketing_experience in ('business','personal','beginner')),
  add constraint academy_consultations_v2_required check (
    consent_version <> '2026-11-11.v2' or (
      btrim(region) <> ''
      and age_range ~ '^([1-9][0-9]?|1[01][0-9]|120)$'
      and repair_experience is not null
      and marketing_experience is not null
    )
  );

-- Keep the existing write-only public intake; contacts remain admin-only.
create or replace function public.submit_academy_consultation(p_id uuid, p_data jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_phone text;
  v_key text;
begin
  if p_id is null or jsonb_typeof(p_data) is distinct from 'object' or octet_length(p_data::text)>12000
    or p_data->'consent' is distinct from 'true'::jsonb
    or p_data->>'consent_version' is distinct from '2026-11-11.v2'
    or coalesce(p_data->>'website','')<>'' then
    raise exception 'invalid_input' using errcode='22023';
  end if;
  foreach v_key in array array['consultation_type','situation','name','phone','email','region','age_range','repair_experience','marketing_experience','available_time','message'] loop
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
  insert into public.academy_consultations(id,consultation_type,situation,name,phone,email,region,age_range,repair_experience,marketing_experience,available_time,message,consent_version)
  values(p_id,p_data->>'consultation_type',p_data->>'situation',btrim(p_data->>'name'),v_phone,
    btrim(coalesce(p_data->>'email','')),btrim(p_data->>'region'),p_data->>'age_range',
    p_data->>'repair_experience',p_data->>'marketing_experience',
    btrim(p_data->>'available_time'),btrim(coalesce(p_data->>'message','')),'2026-11-11.v2');
end;
$$;

revoke all on function public.submit_academy_consultation(uuid,jsonb) from public;
grant execute on function public.submit_academy_consultation(uuid,jsonb) to anon, authenticated;
