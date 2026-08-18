create table if not exists public.tip_views (
  tip_id text primary key,
  views integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.increment_tip_view(
  p_tip_id text,
  p_base_views integer default 0
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_views integer;
begin
  insert into public.tip_views (tip_id, views, updated_at)
  values (p_tip_id, greatest(p_base_views, 0) + 1, now())
  on conflict (tip_id)
  do update set
    views = greatest(public.tip_views.views, excluded.views - 1) + 1,
    updated_at = now()
  returning views into next_views;

  return next_views;
end;
$$;

alter table public.tip_views enable row level security;

drop policy if exists "tip views are readable" on public.tip_views;
create policy "tip views are readable"
on public.tip_views
for select
using (true);
