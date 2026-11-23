-- NULL identifies free-form addresses collected before a customer could confirm the detail.
alter table public.customer_intakes add column address_confirmed boolean;

create function intake_private.visit_address(p_base text, p_detail text, p_mode text)
returns text language plpgsql immutable security invoker set search_path = '' as $$
declare
  base text := regexp_replace(btrim(coalesce(p_base, '')), '[[:space:]]+', ' ', 'g');
  detail text := regexp_replace(btrim(coalesce(p_detail, '')), '[[:space:]]+', ' ', 'g');
begin
  base := btrim(base);
  detail := btrim(detail);
  if length(base) not between 4 and 250 or
     base !~ '[로길동리가읍면][[:space:]]*(지하[[:space:]]*|산[[:space:]]*)?[0-9]+(-[0-9]+)?($|[[:space:],(]|번지)' then
    raise exception 'invalid_address_base' using errcode = '22023';
  end if;
  if p_mode is null or p_mode not in ('detail','none','later') or
     (p_mode = 'detail' and (detail = '' or length(detail) > 100 or detail ~ '^([?？._[:space:]-]+|모름|몰라요|미정|없음)$')) or
     (p_mode <> 'detail' and detail <> '') then
    raise exception 'invalid_address_detail' using errcode = '22023';
  end if;
  if p_mode = 'detail' then base := base || ' ' || detail; end if;
  if length(base) > 250 then raise exception 'address_too_long' using errcode = '22023'; end if;
  return base;
end;
$$;
revoke all on function intake_private.visit_address(text,text,text) from public, anon, authenticated;

create function intake_private.submit_request(p_id uuid, p_name text, p_phone text, p_address text,
  p_item text, p_notes text, p_consent boolean, p_photos jsonb, p_detail text, p_address_mode text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  digits text := regexp_replace(coalesce(p_phone,''), '[[:space:]()-]', '', 'g');
  attachment jsonb;
  jpeg bytea;
  thumb bytea;
  number smallint := 0;
begin
  digits := regexp_replace(digits, '^\+820?', '0');
  p_name := regexp_replace(p_name, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  p_address := regexp_replace(p_address, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  if p_address_mode is not null then
    p_address := intake_private.visit_address(p_address, p_detail, p_address_mode);
  end if;
  p_item := regexp_replace(p_item, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  if p_id is null or p_consent is distinct from true or
     coalesce(length(p_name),0) not between 1 and 60 or
     digits !~ '^(0[1-9][0-9]{7,9}|050[0-9]{9})$' or
     coalesce(length(p_address),0) not between 2 and 250 or
     coalesce(length(p_item),0) not between 1 and 100 or
     length(coalesce(p_notes,'')) > 800 then
    raise exception 'invalid_intake' using errcode = '22023';
  end if;
  if jsonb_typeof(p_photos) is distinct from 'array' then raise exception 'invalid_photos' using errcode='22023'; end if;
  if jsonb_array_length(p_photos) > 6 then raise exception 'too_many_photos' using errcode='22023'; end if;
  insert into public.customer_intakes (id, customer_name, phone, address, item, notes, photo_count, address_confirmed)
  values (p_id, p_name, digits, p_address, p_item,
    nullif(btrim(replace(p_notes, '<!--RESTORY_', 'RESTORY_')), ''), jsonb_array_length(p_photos), p_address_mode <> 'later')
  on conflict (id) do nothing;
  if not found then return; end if;
  for attachment in select value from jsonb_array_elements(p_photos) loop
    if coalesce(length(attachment->>'image'),0) not between 8 and 586668 or
       coalesce(length(attachment->>'thumbnail'),0) not between 8 and 29336 then
      raise exception 'invalid_photo_size' using errcode='22023';
    end if;
    jpeg := decode(attachment->>'image','base64');
    thumb := decode(attachment->>'thumbnail','base64');
    if substr(jpeg,1,3) <> decode('ffd8ff','hex') or substr(jpeg,length(jpeg)-1) <> decode('ffd9','hex')
       or substr(thumb,1,3) <> decode('ffd8ff','hex') or substr(thumb,length(thumb)-1) <> decode('ffd9','hex')
       or length(jpeg) > 440000 or length(thumb) > 22000 then
      raise exception 'invalid_jpeg' using errcode='22023';
    end if;
    number := number + 1;
    insert into public.customer_intake_photos(request_id, photo_number, image, thumbnail) values(p_id, number, jpeg, thumb);
  end loop;
end;
$$;
revoke all on function intake_private.submit_request(uuid,text,text,text,text,text,boolean,jsonb,text,text) from public, anon, authenticated;
grant execute on function intake_private.submit_request(uuid,text,text,text,text,text,boolean,jsonb,text,text) to anon, authenticated;

-- The original API still accepts open forms. Its free-form address awaits staff review.
create or replace function intake_private.submit_request(p_id uuid, p_name text, p_phone text, p_address text,
  p_item text, p_notes text, p_consent boolean, p_photos jsonb)
returns void language sql security invoker set search_path = '' as $$
  select intake_private.submit_request(p_id,p_name,p_phone,p_address,p_item,p_notes,p_consent,p_photos,null,null);
$$;

create function public.submit_customer_intake(p_id uuid, p_name text, p_phone text, p_address text,
  p_item text, p_notes text, p_consent boolean, p_photos jsonb, p_detail text, p_address_mode text)
returns void language sql security invoker set search_path = '' as $$
  select intake_private.submit_request(p_id,p_name,p_phone,p_address,p_item,p_notes,p_consent,p_photos,p_detail,p_address_mode);
$$;
revoke all on function public.submit_customer_intake(uuid,text,text,text,text,text,boolean,jsonb,text,text) from public, anon, authenticated;
grant execute on function public.submit_customer_intake(uuid,text,text,text,text,text,boolean,jsonb,text,text) to anon, authenticated;

create function intake_private.confirm_address(p_id uuid, p_expected text, p_base text, p_detail text, p_mode text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  request public.customer_intakes%rowtype;
  confirmed text;
begin
  if not exists (select 1 from public.intake_staff where user_id = (select auth.uid()) and role = 'admin') then
    raise exception 'staff_access_required' using errcode = '42501';
  end if;
  select * into strict request from public.customer_intakes where id = p_id for update;
  if request.scheduled_at is not null then raise exception 'already_scheduled' using errcode = 'P0002'; end if;
  if p_mode is null or p_mode not in ('detail','none') then
    raise exception 'invalid_address_detail' using errcode = '22023';
  end if;
  confirmed := intake_private.visit_address(p_base, p_detail, p_mode);
  if request.address_confirmed is true and request.address = confirmed then return confirmed; end if;
  if request.address_confirmed is true or request.address is distinct from p_expected then
    raise exception 'address_changed' using errcode = '40001';
  end if;
  update public.customer_intakes set address = confirmed, address_confirmed = true where id = p_id;
  return confirmed;
end;
$$;
revoke all on function intake_private.confirm_address(uuid,text,text,text,text) from public, anon, authenticated;
grant execute on function intake_private.confirm_address(uuid,text,text,text,text) to authenticated;

create function public.confirm_customer_intake_address(p_id uuid, p_expected text, p_base text, p_detail text, p_mode text)
returns text language sql security invoker set search_path = '' as $$
  select intake_private.confirm_address(p_id,p_expected,p_base,p_detail,p_mode);
$$;
revoke all on function public.confirm_customer_intake_address(uuid,text,text,text,text) from public, anon, authenticated;
grant execute on function public.confirm_customer_intake_address(uuid,text,text,text,text) to authenticated;

-- All scheduling RPC versions complete the receipt and create its job in one transaction.
create function intake_private.require_confirmed_address()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  raise exception 'address_confirmation_required' using errcode = '22023';
end;
$$;
revoke all on function intake_private.require_confirmed_address() from public, anon, authenticated;
create trigger require_confirmed_intake_address before update of scheduled_at on public.customer_intakes
  for each row when (old.scheduled_at is null and new.scheduled_at is not null and old.address_confirmed is not true)
  execute function intake_private.require_confirmed_address();

notify pgrst, 'reload schema';
