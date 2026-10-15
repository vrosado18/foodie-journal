-- Foodie Journal — initial schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).

-- ─────────────────────────────────────────────────────────────────────────
-- Spots: a shared directory of restaurants/locations. Readable by any
-- signed-in user, insertable by any signed-in user (so Quick Log's "type a
-- new spot" flow can create one). Deduped case-insensitively by name.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  neighborhood text,
  created_at timestamptz not null default now()
);

create unique index if not exists spots_name_lower_unique on public.spots (lower(name));

alter table public.spots enable row level security;

create policy "Spots are readable by authenticated users"
  on public.spots for select
  to authenticated
  using (true);

create policy "Authenticated users can create spots"
  on public.spots for insert
  to authenticated
  with check (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Logs: private per-user meal logs.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  spot_id uuid not null references public.spots (id),
  spot_name text not null,
  dish_name text not null,
  price numeric(10, 2) not null,
  score text not null check (
    score in ('fumble', 'punt', 'first-down', 'touchdown', 'hail-mary-touchdown')
  ),
  note text,
  tags text[] not null default '{}',
  photo_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists logs_user_id_idx on public.logs (user_id);
create index if not exists logs_created_at_idx on public.logs (created_at desc);

alter table public.logs enable row level security;

create policy "Users can view their own logs"
  on public.logs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own logs"
  on public.logs for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own logs"
  on public.logs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own logs"
  on public.logs for delete
  to authenticated
  using (auth.uid() = user_id);

-- Keep updated_at correct even if a client forgets to set it.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists logs_set_updated_at on public.logs;
create trigger logs_set_updated_at
  before update on public.logs
  for each row
  execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- Storage: a public bucket for user-uploaded meal photos, scoped by a
-- "<user_id>/<filename>" path convention so each user can only write/modify
-- objects inside their own folder.
-- ─────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('log-photos', 'log-photos', true)
on conflict (id) do nothing;

create policy "Log photos are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'log-photos');

create policy "Users can upload to their own log-photos folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'log-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own log-photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'log-photos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'log-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own log-photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'log-photos' and (storage.foldername(name))[1] = auth.uid()::text);
