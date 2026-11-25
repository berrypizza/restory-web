alter table public.customer_intakes
  add column on_hold boolean not null default false,
  add constraint customer_intake_hold_unscheduled check (not on_hold or scheduled_at is null);

create index customer_intake_folder on public.customer_intakes (on_hold, received_at, id)
  where scheduled_at is null;
drop index public.customer_intake_queue;

create function intake_private.change_folder(p_id uuid, p_expected_hold boolean, p_action text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.intake_staff where user_id = (select auth.uid()) and role = 'admin') then
    raise exception 'staff_access_required' using errcode = '42501';
  end if;
  if p_action = 'delete' then
    delete from public.customer_intakes
      where id = p_id and scheduled_at is null and on_hold = p_expected_hold;
  elsif (p_action = 'hold' and p_expected_hold is false) or (p_action = 'restore' and p_expected_hold is true) then
    update public.customer_intakes set on_hold = not p_expected_hold
      where id = p_id and scheduled_at is null and on_hold = p_expected_hold;
  else
    raise exception 'invalid_folder_action' using errcode = '22023';
  end if;
  if not found then raise exception 'intake_changed' using errcode = 'P0002'; end if;
end;
$$;
revoke all on function intake_private.change_folder(uuid,boolean,text) from public, anon, authenticated;
grant execute on function intake_private.change_folder(uuid,boolean,text) to authenticated;

create function public.change_customer_intake_folder(p_id uuid, p_expected_hold boolean, p_action text)
returns void language sql security invoker set search_path = '' as $$
  select intake_private.change_folder(p_id, p_expected_hold, p_action);
$$;
revoke all on function public.change_customer_intake_folder(uuid,boolean,text) from public, anon, authenticated;
grant execute on function public.change_customer_intake_folder(uuid,boolean,text) to authenticated;

notify pgrst, 'reload schema';
