-- The owner issues these offline. Only a digest is stored, and a ticket can enroll one named manager.
create table public.intake_setup_tickets (
  token_digest text primary key check (token_digest ~ '^[a-f0-9]{64}$'),
  login_id text not null check (login_id in ('고관호','kohh1115')),
  staff_name text generated always as (case login_id when '고관호' then '고관호' else '고현호' end) stored,
  auth_email text generated always as (case login_id when '고관호' then 'manager-01@staff.restory.invalid' else 'manager-02@staff.restory.invalid' end) stored,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references auth.users(id) on delete set null
);
alter table public.intake_setup_tickets enable row level security;
revoke all on public.intake_setup_tickets from public, anon, authenticated;
grant select, update (used_at, used_by) on public.intake_setup_tickets to service_role;

create function public.complete_intake_enrollment(p_digest text, p_user uuid) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  ticket public.intake_setup_tickets%rowtype;
begin
  select * into ticket from public.intake_setup_tickets where token_digest = p_digest for update;
  if not found or ticket.expires_at <= now() then return false; end if;
  if ticket.used_at is not null then return ticket.used_by = p_user; end if;
  insert into public.intake_staff(user_id, staff_name, role) values(p_user, ticket.staff_name, 'admin')
    on conflict do nothing;
  if not exists (select 1 from public.intake_staff where user_id=p_user and staff_name=ticket.staff_name and role='admin') then
    raise exception 'staff_identity_conflict';
  end if;
  update public.intake_setup_tickets set used_at=now(), used_by=p_user where token_digest=p_digest;
  return true;
end;
$$;
revoke all on function public.complete_intake_enrollment(text,uuid) from public, anon, authenticated;
grant execute on function public.complete_intake_enrollment(text,uuid) to service_role;
