alter table public.jobs
  add column is_aftercare boolean not null default false,
  add column aftercare_source_id uuid references public.jobs(id) on delete set null,
  add constraint jobs_linked_aftercare_check check (
    aftercare_source_id is null or (
      is_aftercare and aftercare_source_id <> id and price is not distinct from 0
      and is_measurement is not true and install_date is null and install_completed is not true
    )
  );

create index jobs_aftercare_source_idx on public.jobs (aftercare_source_id)
  where aftercare_source_id is not null;

-- Old intake forms stored the A/S designation in the product field. Retain the original quote.
update public.jobs set is_aftercare = true
where trim(symptom) ~* '^(a[ /.-]?s|에이에스|애프터서비스)([[:space:][:punct:]]|$)'
   or trim(symptom) ~* '(^|[[:space:][:punct:]])(a[ /.-]?s|에이에스|애프터서비스)$';
