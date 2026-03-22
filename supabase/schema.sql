-- Naamin Supabase Setup
-- Run this in the Supabase SQL Editor.
-- After creating your first auth user, add that user to admin_users:
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where email = 'your-admin-email@example.com';

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'admin',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  eyebrow text default '',
  title text default '',
  description text default '',
  payload jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text default '',
  price_text text default '',
  tag text default '',
  category text default '',
  item_type text default '',
  image text default '',
  accent text default '',
  badge text default '',
  details text default '',
  highlights jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.feature_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  eyebrow text default '',
  title text default '',
  description text default '',
  payload jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_updated_at_site_sections on public.site_sections;
create trigger set_updated_at_site_sections
before update on public.site_sections
for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_catalog_items on public.catalog_items;
create trigger set_updated_at_catalog_items
before update on public.catalog_items
for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_feature_pages on public.feature_pages;
create trigger set_updated_at_feature_pages
before update on public.feature_pages
for each row execute procedure public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.site_sections enable row level security;
alter table public.catalog_items enable row level security;
alter table public.feature_pages enable row level security;

drop policy if exists "Admins can read own profile" on public.admin_users;
create policy "Admins can read own profile"
on public.admin_users
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Public can read published site sections" on public.site_sections;
create policy "Public can read published site sections"
on public.site_sections
for select
using (published = true or public.is_admin());

drop policy if exists "Admins can insert site sections" on public.site_sections;
create policy "Admins can insert site sections"
on public.site_sections
for insert
with check (public.is_admin());

drop policy if exists "Admins can update site sections" on public.site_sections;
create policy "Admins can update site sections"
on public.site_sections
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete site sections" on public.site_sections;
create policy "Admins can delete site sections"
on public.site_sections
for delete
using (public.is_admin());

drop policy if exists "Public can read published catalog items" on public.catalog_items;
create policy "Public can read published catalog items"
on public.catalog_items
for select
using (is_published = true or public.is_admin());

drop policy if exists "Admins can insert catalog items" on public.catalog_items;
create policy "Admins can insert catalog items"
on public.catalog_items
for insert
with check (public.is_admin());

drop policy if exists "Admins can update catalog items" on public.catalog_items;
create policy "Admins can update catalog items"
on public.catalog_items
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete catalog items" on public.catalog_items;
create policy "Admins can delete catalog items"
on public.catalog_items
for delete
using (public.is_admin());

drop policy if exists "Public can read published feature pages" on public.feature_pages;
create policy "Public can read published feature pages"
on public.feature_pages
for select
using (published = true or public.is_admin());

drop policy if exists "Admins can insert feature pages" on public.feature_pages;
create policy "Admins can insert feature pages"
on public.feature_pages
for insert
with check (public.is_admin());

drop policy if exists "Admins can update feature pages" on public.feature_pages;
create policy "Admins can update feature pages"
on public.feature_pages
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete feature pages" on public.feature_pages;
create policy "Admins can delete feature pages"
on public.feature_pages
for delete
using (public.is_admin());
