create extension if not exists "pgcrypto";

create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  record_code text not null unique,
  title text not null,
  category text not null,
  type text not null,
  danger text not null,
  corruption integer not null default 0,
  discovered_at timestamptz,
  location text,
  summary text,
  content text,
  image_url text,
  tags text[] not null default '{}',
  hidden_message text,
  glitch_level integer not null default 0,
  visibility text not null default 'public',
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint records_category_check check (
    category in (
      '괴담',
      '도시전설',
      '발견 문서',
      '실화 제보',
      '악몽 기록',
      'CCTV',
      '음성 기록',
      '이미지 기록',
      '시스템 로그',
      '미분류'
    )
  ),
  constraint records_type_check check (
    type in ('text', 'image', 'log', 'cctv', 'memo', 'nightmare')
  ),
  constraint records_danger_check check (
    danger in ('LOW', 'MEDIUM', 'HIGH', 'UNKNOWN')
  ),
  constraint records_corruption_check check (
    corruption >= 0 and corruption <= 100
  ),
  constraint records_glitch_level_check check (
    glitch_level >= 0 and glitch_level <= 5
  ),
  constraint records_visibility_check check (
    visibility in ('public', 'private')
  )
);

create index if not exists records_visibility_is_hidden_idx
  on public.records (visibility, is_hidden);

create index if not exists records_created_at_idx
  on public.records (created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists records_set_updated_at on public.records;

create trigger records_set_updated_at
before update on public.records
for each row
execute function public.set_updated_at();

alter table public.records enable row level security;

create policy "Public records are readable"
on public.records
for select
using (visibility = 'public');
