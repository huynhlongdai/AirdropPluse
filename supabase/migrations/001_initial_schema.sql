-- =====================================================
-- AIRDROP MANAGER — Initial Schema
-- =====================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────
create table if not exists projects (
  id                      text primary key default gen_random_uuid()::text,
  name                    text not null,
  description             text not null default '',
  category                text not null default 'other',
  project_type            text not null default 'mainnet',
  chain                   text[] not null default '{}',
  ecosystem               text[] not null default '{}',
  status                  text not null default 'discovery',
  cost_type               text not null default 'free',
  estimated_cost          text,
  potential_value         text not null default 'medium',
  hype_score              integer not null default 50,
  risk_level              text not null default 'medium',
  risk_factors            text[] not null default '{}',
  sentiment               text not null default 'neutral',
  funding_amount          text,
  funding_rounds          jsonb not null default '[]',
  investors               text[] not null default '{}',
  tge_date                text,
  total_supply            text,
  vesting_info            text,
  milestones              jsonb not null default '[]',
  image_url               text not null default '',
  logo_url                text,
  snapshot_date           text,
  claim_date              text,
  expiry_date             text,
  priority                text not null default 'medium',
  is_hot                  boolean not null default false,
  is_new                  boolean not null default false,
  source_url              text,
  twitter_url             text,
  discord_url             text,
  telegram_url            text,
  participating_wallet_ids text[] not null default '{}',
  linked_wallets          jsonb not null default '[]',
  linked_identities       jsonb not null default '[]',
  updates                 jsonb not null default '[]',
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_projects_status on projects(status);
create index if not exists idx_projects_category on projects(category);
create index if not exists idx_projects_created_at on projects(created_at desc);

-- ─────────────────────────────────────────
-- PROJECT TASKS
-- ─────────────────────────────────────────
create table if not exists project_tasks (
  id           text primary key default gen_random_uuid()::text,
  project_id   text not null references projects(id) on delete cascade,
  description  text not null,
  completed    boolean not null default false,
  wallet_id    text,
  completed_at text,
  due_date     text,
  priority     text
);

create index if not exists idx_project_tasks_project_id on project_tasks(project_id);

-- ─────────────────────────────────────────
-- WALLETS (main)
-- ─────────────────────────────────────────
create table if not exists wallets (
  id         text primary key,
  name       text not null,
  address    text not null,
  type       text not null default 'hot',
  chains     text[] not null default '{}',
  notes      text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- SUB WALLETS
-- ─────────────────────────────────────────
create table if not exists sub_wallets (
  id                   text primary key,
  main_wallet_id       text not null references wallets(id) on delete cascade,
  name                 text not null,
  address              text not null,
  type                 text not null default 'burner',
  chains               text[] not null default '{}',
  status               text not null default 'active',
  purpose              text,
  linked_identity_ids  text[] not null default '{}',
  gas_balances         jsonb not null default '[]',
  active_project_ids   text[] not null default '{}',
  created_at           timestamptz not null default now()
);

create index if not exists idx_sub_wallets_main_wallet_id on sub_wallets(main_wallet_id);
create index if not exists idx_sub_wallets_status on sub_wallets(status);

-- ─────────────────────────────────────────
-- TASKS (global)
-- ─────────────────────────────────────────
create table if not exists tasks (
  id                   text primary key default gen_random_uuid()::text,
  title                text not null,
  description          text,
  guide                text,
  guide_source         text,
  guide_source_label   text,
  type                 text not null default 'onchain',
  priority             text not null default 'medium',
  status               text not null default 'backlog',
  recurring            text,
  project_id           text,
  project_name         text,
  chain_id             text,
  estimated_gas_fee    text,
  gas_currency         text,
  deadline             text,
  linked_identity_ids  text[] not null default '{}',
  tags                 text[] not null default '{}',
  is_overdue           boolean not null default false,
  is_daily_reset       boolean not null default false,
  guide_url            text,
  proof_images         text[] not null default '{}',
  created_at           timestamptz not null default now()
);

create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_project_id on tasks(project_id);
create index if not exists idx_tasks_priority on tasks(priority);
create index if not exists idx_tasks_created_at on tasks(created_at desc);

-- ─────────────────────────────────────────
-- TASK EXECUTIONS
-- ─────────────────────────────────────────
create table if not exists task_executions (
  id              text primary key default gen_random_uuid()::text,
  task_id         text not null references tasks(id) on delete cascade,
  wallet_id       text not null,
  wallet_name     text not null,
  address         text not null,
  status          text not null default 'not-started',
  completed_at    text,
  tx_hash         text,
  actual_gas_fee  text,
  note            text
);

create index if not exists idx_task_executions_task_id on task_executions(task_id);
create index if not exists idx_task_executions_wallet_id on task_executions(wallet_id);

-- ─────────────────────────────────────────
-- TASK SUBTASKS
-- ─────────────────────────────────────────
create table if not exists task_subtasks (
  id           text primary key default gen_random_uuid()::text,
  task_id      text not null references tasks(id) on delete cascade,
  title        text not null,
  completed    boolean not null default false,
  completed_at text,
  sort_order   integer not null default 0
);

create index if not exists idx_task_subtasks_task_id on task_subtasks(task_id);

-- ─────────────────────────────────────────
-- TASK NOTES
-- ─────────────────────────────────────────
create table if not exists task_notes (
  id         text primary key default gen_random_uuid()::text,
  task_id    text not null references tasks(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_task_notes_task_id on task_notes(task_id);

-- ─────────────────────────────────────────
-- TASK ACTIVITY LOG
-- ─────────────────────────────────────────
create table if not exists task_activity_log (
  id        text primary key default gen_random_uuid()::text,
  task_id   text not null references tasks(id) on delete cascade,
  type      text not null,
  message   text not null,
  timestamp timestamptz not null default now()
);

create index if not exists idx_task_activity_log_task_id on task_activity_log(task_id);

-- ─────────────────────────────────────────
-- IDENTITIES
-- ─────────────────────────────────────────
create table if not exists identities (
  id              text primary key,
  alias           text not null,
  status          text not null default 'active',
  email_data      jsonb not null default '{}',
  twitter_data    jsonb not null default '{}',
  discord_data    jsonb not null default '{}',
  telegram_data   jsonb not null default '{}',
  tiktok_data     jsonb not null default '{}',
  others          jsonb not null default '[]',
  linked_wallets  text[] not null default '{}',
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_identities_status on identities(status);

-- ─────────────────────────────────────────
-- INBOX ITEMS
-- ─────────────────────────────────────────
create table if not exists inbox_items (
  id              text primary key default gen_random_uuid()::text,
  raw_content     text not null,
  source_type     text not null default 'text',
  source_url      text,
  item_type       text not null default 'task',
  status          text not null default 'processing',
  extracted_data  jsonb not null default '{}',
  created_at      timestamptz not null default now(),
  processed_at    timestamptz
);

create index if not exists idx_inbox_items_status on inbox_items(status);
create index if not exists idx_inbox_items_item_type on inbox_items(item_type);
create index if not exists idx_inbox_items_created_at on inbox_items(created_at desc);

-- ─────────────────────────────────────────
-- SETTINGS: PROVIDERS
-- ─────────────────────────────────────────
create table if not exists settings_providers (
  id          text primary key,
  name        text not null,
  provider    text not null,
  category    text not null default 'ai',
  description text not null default '',
  icon_color  text not null default '#000000',
  docs_url    text
);

-- ─────────────────────────────────────────
-- SETTINGS: API KEYS
-- ─────────────────────────────────────────
create table if not exists settings_api_keys (
  id             text primary key,
  provider_id    text not null references settings_providers(id) on delete cascade,
  label          text not null,
  value_masked   text,
  status         text not null default 'untested',
  usage_percent  integer,
  usage_label    text,
  quota_limit    text,
  last_checked   timestamptz,
  is_primary     boolean not null default false
);

create index if not exists idx_settings_api_keys_provider_id on settings_api_keys(provider_id);

-- ─────────────────────────────────────────
-- SETTINGS: AI CONFIG
-- ─────────────────────────────────────────
create table if not exists settings_ai_config (
  feature              text primary key,
  feature_label        text not null,
  feature_description  text not null,
  primary_model        text not null,
  fallback_model       text not null,
  temperature          numeric not null default 0.5,
  max_tokens           integer not null default 1024
);

-- ─────────────────────────────────────────
-- SETTINGS: TAXONOMY
-- ─────────────────────────────────────────
create table if not exists settings_taxonomy (
  id           text primary key,
  type         text not null,
  label        text not null,
  color        text not null,
  built_in     boolean not null default false,
  usage_count  integer not null default 0
);

-- ─────────────────────────────────────────
-- SETTINGS: INGESTION
-- ─────────────────────────────────────────
create table if not exists settings_ingestion (
  id                     text primary key default 'singleton',
  crawl_depth            integer not null default 3,
  skip_images            boolean not null default true,
  text_only              boolean not null default false,
  auto_scrape_enabled    boolean not null default true,
  scrape_interval_hours  integer not null default 6,
  priority_domains       text[] not null default '{}',
  max_items_per_run      integer not null default 50,
  deduplication          boolean not null default true
);

-- ─────────────────────────────────────────
-- API LOGS
-- ─────────────────────────────────────────
create table if not exists api_logs (
  id             text primary key default gen_random_uuid()::text,
  timestamp      timestamptz not null default now(),
  service        text not null,
  endpoint       text not null,
  status_code    integer not null,
  latency_ms     integer not null,
  tokens_used    integer,
  cost_usd       numeric(10,6),
  success        boolean not null default true,
  error_message  text
);

create index if not exists idx_api_logs_timestamp on api_logs(timestamp desc);
create index if not exists idx_api_logs_service on api_logs(service);

-- ─────────────────────────────────────────
-- updated_at TRIGGER function
-- ─────────────────────────────────────────
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at_column();

create trigger identities_updated_at before update on identities
  for each row execute function update_updated_at_column();

-- ─────────────────────────────────────────
-- ENABLE REALTIME
-- ─────────────────────────────────────────
alter publication supabase_realtime add table inbox_items;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table projects;
