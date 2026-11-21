alter table public.jobs add column install_completed_on date;

-- Preserve the date already used in settlement, including older jobs without a slot.
update public.jobs
set install_completed_on = coalesce(install_date, visit_date)
where is_measurement and install_completed and status = '완료';

create function public.record_install_completion_date()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_measurement and new.install_completed and new.status = '완료' then
    if new.install_date is not null then
      new.install_completed_on := new.install_date;
    elsif tg_op = 'UPDATE' then
      new.install_completed_on := coalesce(old.install_completed_on, old.install_date, new.visit_date);
    else
      new.install_completed_on := new.visit_date;
    end if;
  else
    new.install_completed_on := null;
  end if;
  return new;
end;
$$;

revoke all on function public.record_install_completion_date() from public, anon, authenticated;

create trigger jobs_record_install_completion
before insert or update of status, is_measurement, install_completed, install_date, visit_date, install_completed_on
on public.jobs for each row execute function public.record_install_completion_date();
