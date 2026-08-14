create table if not exists public.business_expenses (
  id uuid primary key default gen_random_uuid(),
  expense_month text not null check (expense_month ~ '^[0-9]{4}-[0-9]{2}$'),
  group_key text not null check (group_key in ('material', 'labor', 'marketing')),
  category text not null,
  amount integer not null default 0 check (amount >= 0),
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_expenses
drop constraint if exists business_expenses_group_key_check;

alter table public.business_expenses
add constraint business_expenses_group_key_check
check (group_key in ('material', 'labor', 'marketing'));

alter table public.business_expenses
drop constraint if exists business_expenses_expense_month_group_key_category_key;

create index if not exists business_expenses_month_group_category_idx
on public.business_expenses (expense_month, group_key, category, created_at desc);

alter table public.business_expenses enable row level security;

drop policy if exists business_expenses_select on public.business_expenses;
drop policy if exists business_expenses_insert on public.business_expenses;
drop policy if exists business_expenses_update on public.business_expenses;
drop policy if exists business_expenses_delete on public.business_expenses;

create policy business_expenses_select
on public.business_expenses
for select
using (true);

create policy business_expenses_insert
on public.business_expenses
for insert
with check (true);

create policy business_expenses_update
on public.business_expenses
for update
using (true)
with check (true);

create policy business_expenses_delete
on public.business_expenses
for delete
using (true);

create or replace function public.set_business_expenses_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_business_expenses_updated_at
on public.business_expenses;

create trigger set_business_expenses_updated_at
before update on public.business_expenses
for each row
execute function public.set_business_expenses_updated_at();
