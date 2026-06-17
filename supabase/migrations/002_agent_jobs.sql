-- =====================================================
-- AGENT JOBS — Task automation via browser agents
-- =====================================================
-- Each row represents one "dispatch": a task assigned to
-- an agent that will control a specific identity/wallet
-- and execute the task steps autonomously.

create table if not exists agent_jobs (
  id               text primary key default gen_random_uuid()::text,

  -- The task to execute
  task_id          text not null references tasks(id) on delete cascade,

  -- The identity profile the agent will log in as
  identity_id      text not null references identities(id) on delete cascade,

  -- Optional wallet the agent should use for on-chain steps
  wallet_id        text references sub_wallets(id) on delete set null,

  -- Human-readable job name (auto-generated or user-supplied)
  name             text not null default '',

  -- Extra instructions passed to the agent on top of the task guide
  instructions     text,

  -- Lifecycle status
  status           text not null default 'pending'
                   check (status in ('pending','queued','running','completed','failed','cancelled')),

  -- Output from the agent after completion
  result_summary   text,
  tx_hash          text,
  proof_image_url  text,
  error_message    text,

  -- Timing
  created_at       timestamptz not null default now(),
  queued_at        timestamptz,
  started_at       timestamptz,
  completed_at     timestamptz,

  -- Which agent runner picked up this job (for multi-runner setups)
  runner_id        text
);

-- Indexes for common query patterns
create index if not exists agent_jobs_task_id_idx      on agent_jobs(task_id);
create index if not exists agent_jobs_identity_id_idx  on agent_jobs(identity_id);
create index if not exists agent_jobs_status_idx       on agent_jobs(status);
create index if not exists agent_jobs_created_at_idx   on agent_jobs(created_at desc);

-- RLS: enable but keep permissive for now (same pattern as other tables)
alter table agent_jobs enable row level security;
create policy "agent_jobs_all" on agent_jobs for all using (true) with check (true);
