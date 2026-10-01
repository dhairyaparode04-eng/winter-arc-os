-- Winter Arc OS cloud-first Supabase schema.
-- Run in Supabase SQL Editor, then configure Google OAuth in Authentication.
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null default 'JEE Aspirant',
  class_level text default '11',
  target_exam text default 'JEE Main + Advanced',
  exam_year int,
  exam_target_date date,
  avatar_url text,
  xp int not null default 0,
  level int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists privacy_settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  show_study_hours boolean default true,
  show_questions boolean default true,
  show_streak boolean default true,
  show_tests boolean default true,
  show_accuracy boolean default true,
  show_achievements boolean default true,
  show_activity boolean default true,
  updated_at timestamptz default now()
);

create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
  subject text, chapter text, subtopic text, study_type text, minutes int not null default 0,
  accuracy numeric, notes text, started_at timestamptz, created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
  title text not null, subject text, chapter text, priority text default 'medium',
  estimated_minutes int default 30, due_date date, recurring text, completed boolean default false,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists chapter_progress (
  id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
  subject text not null, chapter text not null, subtopic text, status text default 'not_started',
  mastery numeric default 0, questions int default 0, accuracy numeric default 0,
  last_studied timestamptz, last_revised timestamptz, unique(user_id,subject,chapter,subtopic)
);

create table if not exists revisions (
  id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
  subject text, chapter text, subtopic text, revision_no int default 1,
  due_date date, confidence text default 'weak', completed boolean default false
);

create table if not exists tests (
  id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade,
  title text not null, source text, mode text, score numeric, max_score numeric,
  accuracy numeric, attempted int default 0, correct int default 0, wrong int default 0,
  unattempted int default 0, duration_seconds int, taken_at timestamptz default now()
);

create table if not exists test_questions (
  id uuid primary key default gen_random_uuid(), test_id uuid references tests(id) on delete cascade,
  question_key text, subject text, chapter text, subtopic text, selected_answer text,
  correct_answer text, result text, time_seconds int default 0, mistake_type text
);

create table if not exists mistakes (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  question_key text, subject text, chapter text, subtopic text, mistake_type text,
  explanation text, resolved boolean default false, reattempt_due date, created_at timestamptz default now()
);

create table if not exists xp_events (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  amount int not null, reason text, created_at timestamptz default now()
);

create table if not exists user_achievements (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  achievement_key text not null, unlocked_at timestamptz default now(),
  unique(user_id,achievement_key)
);

create table if not exists friend_requests (
  id uuid primary key default gen_random_uuid(), sender_id uuid references auth.users(id) on delete cascade,
  receiver_id uuid references auth.users(id) on delete cascade, status text default 'pending',
  created_at timestamptz default now(), unique(sender_id,receiver_id)
);

create table if not exists friendships (
  id uuid primary key default gen_random_uuid(), user_a uuid references auth.users(id) on delete cascade,
  user_b uuid references auth.users(id) on delete cascade, created_at timestamptz default now(),
  unique(user_a,user_b)
);

create table if not exists challenges (
  id uuid primary key default gen_random_uuid(), creator_id uuid references auth.users(id) on delete cascade,
  title text, goal_minutes int, start_date date, end_date date, created_at timestamptz default now()
);

create table if not exists challenge_members (
  challenge_id uuid references challenges(id) on delete cascade, user_id uuid references auth.users(id) on delete cascade,
  minutes int default 0, primary key(challenge_id,user_id)
);

create table if not exists activity_events (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  kind text, payload jsonb default '{}'::jsonb, created_at timestamptz default now()
);

create table if not exists doubts (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  title text, subject text, chapter text, subtopic text, status text default 'open',
  notes text, created_at timestamptz default now()
);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  question_key text, tag text, note text, created_at timestamptz default now()
);

create table if not exists notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision_due boolean default true, target_progress boolean default true,
  achievements boolean default true, friend_activity boolean default true
);

alter table profiles enable row level security;
alter table privacy_settings enable row level security;
alter table study_sessions enable row level security;
alter table tasks enable row level security;
alter table chapter_progress enable row level security;
alter table revisions enable row level security;
alter table tests enable row level security;
alter table test_questions enable row level security;
alter table mistakes enable row level security;
alter table xp_events enable row level security;
alter table user_achievements enable row level security;
alter table friend_requests enable row level security;
alter table friendships enable row level security;
alter table challenges enable row level security;
alter table challenge_members enable row level security;
alter table activity_events enable row level security;
alter table doubts enable row level security;
alter table bookmarks enable row level security;
alter table notification_preferences enable row level security;

-- Owner-only baseline policies. Shared-friend visibility should be added with
-- explicit privacy-aware SQL functions/policies before production launch.
create policy "own profiles" on profiles for all using (id=auth.uid()) with check (id=auth.uid());
create policy "own privacy" on privacy_settings for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own sessions" on study_sessions for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own tasks" on tasks for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own chapter progress" on chapter_progress for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own revisions" on revisions for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own tests" on tests for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own mistakes" on mistakes for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own xp" on xp_events for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own achievements" on user_achievements for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own activity" on activity_events for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own doubts" on doubts for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own bookmarks" on bookmarks for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own notifications" on notification_preferences for all using (user_id=auth.uid()) with check (user_id=auth.uid());
