-- Insight Ad Preview - Initial Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clients table
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_email text,
  contact_phone text,
  created_at timestamptz not null default now()
);

-- Submission links table
create table submission_links (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  token text not null unique,
  platforms text[] not null default '{"google","facebook","instagram","linkedin","pinterest"}',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_submission_links_token on submission_links(token);

-- Submissions table
create table submissions (
  id uuid primary key default uuid_generate_v4(),
  link_id uuid not null references submission_links(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'needs_changes')),
  admin_notes text,
  published_platforms text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_submissions_client_id on submissions(client_id);
create index idx_submissions_status on submissions(status);

-- Submission content (one row per platform per submission)
create table submission_content (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references submissions(id) on delete cascade,
  platform text not null check (platform in ('google', 'facebook', 'instagram', 'linkedin', 'pinterest')),
  content jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(submission_id, platform)
);

-- Images table
create table images (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references submissions(id) on delete cascade,
  platform text not null,
  field_name text not null,
  storage_path text not null,
  original_filename text not null,
  created_at timestamptz not null default now()
);

-- Publishing progress (tracks checklist state per platform)
create table publishing_progress (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references submissions(id) on delete cascade,
  platform text not null,
  checked_fields text[] not null default '{}',
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(submission_id, platform)
);

-- Auto-update updated_at on submissions
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger submissions_updated_at
  before update on submissions
  for each row execute function update_updated_at();

create trigger publishing_progress_updated_at
  before update on publishing_progress
  for each row execute function update_updated_at();

-- Row Level Security
alter table clients enable row level security;
alter table submission_links enable row level security;
alter table submissions enable row level security;
alter table submission_content enable row level security;
alter table images enable row level security;
alter table publishing_progress enable row level security;

-- Authenticated users (admin) can do everything
create policy "Admin full access on clients"
  on clients for all
  using (auth.role() = 'authenticated');

create policy "Admin full access on submission_links"
  on submission_links for all
  using (auth.role() = 'authenticated');

create policy "Admin full access on submissions"
  on submissions for all
  using (auth.role() = 'authenticated');

create policy "Admin full access on submission_content"
  on submission_content for all
  using (auth.role() = 'authenticated');

create policy "Admin full access on images"
  on images for all
  using (auth.role() = 'authenticated');

create policy "Admin full access on publishing_progress"
  on publishing_progress for all
  using (auth.role() = 'authenticated');

-- Anonymous users can read submission_links by token (for validation)
create policy "Anon can read links by token"
  on submission_links for select
  using (true);

-- Anonymous users can insert submissions and content
create policy "Anon can insert submissions"
  on submissions for insert
  with check (true);

create policy "Anon can insert submission_content"
  on submission_content for insert
  with check (true);

create policy "Anon can insert images"
  on images for insert
  with check (true);

-- Create storage bucket for ad images
insert into storage.buckets (id, name, public)
values ('ad-images', 'ad-images', true)
on conflict do nothing;

-- Storage policies
create policy "Anyone can upload ad images"
  on storage.objects for insert
  with check (bucket_id = 'ad-images');

create policy "Anyone can read ad images"
  on storage.objects for select
  using (bucket_id = 'ad-images');

create policy "Admin can delete ad images"
  on storage.objects for delete
  using (bucket_id = 'ad-images' and auth.role() = 'authenticated');
