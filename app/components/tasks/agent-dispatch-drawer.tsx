/**
 * AgentDispatchDrawer
 *
 * Slide-in drawer that lets the user:
 *   1. Pick which identity profile the agent should use
 *   2. Optionally pick a sub-wallet for on-chain steps
 *   3. Write extra instructions on top of the task guide
 *   4. Dispatch the job — creating an agent_job record
 *
 * Shows live job status after dispatch + lists previous jobs for this task.
 */
import React from "react";
import { X, Bot, ChevronRight, AlertCircle, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "~/data/tasks";
import type { IdentityProfile } from "~/data/identities";
import type { MainWallet } from "~/data/wallets";
import type { AgentJob } from "~/data/agent-jobs";
import AgentJobStatusBadge from "./agent-job-status-badge";
import { useStore } from "~/hooks/use-store";
import styles from "./agent-dispatch-drawer.module.css";

interface AgentDispatchDrawerProps {
  task: Task;
  identities: IdentityProfile[];
  onClose: () => void;
}

function formatRelativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getPlatformLabel(identity: IdentityProfile): string {
  const platforms: string[] = [];
  if (identity.twitter?.username) platforms.push(`@${identity.twitter.username}`);
  if (identity.discord?.username) platforms.push(`Discord: ${identity.discord.username}`);
  if (identity.telegram?.username) platforms.push(`Telegram: ${identity.telegram.username}`);
  if (identity.email?.address) platforms.push(identity.email.address);
  return platforms.slice(0, 2).join("  ·  ") || "No accounts configured";
}

export default function AgentDispatchDrawer({ task, identities, onClose }: AgentDispatchDrawerProps) {
  const { wallets, dispatchAgentJob, getJobsForTask, cancelAgentJob } = useStore();

  // ── Form state ──────────────────────────────────────────────────
  const [selectedIdentityId, setSelectedIdentityId] = React.useState<string>("");
  const [selectedWalletId, setSelectedWalletId] = React.useState<string>("");
  const [instructions, setInstructions] = React.useState<string>("");
  const [isDispatching, setIsDispatching] = React.useState(false);

  // ── Poll interval for running jobs ──────────────────────────────
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const existingJobs = getJobsForTask(task.id);
  const activeJob = existingJobs.find((j) => j.status === "running" || j.status === "queued");

  // Flatten all sub-wallets for wallet picker
  const allSubWallets = React.useMemo(
    () => wallets.flatMap((m) => m.subWallets.map((s) => ({ ...s, mainName: m.name }))),
    [wallets]
  );

  // Filter to wallets linked to this task's executions, or show all
  const relevantWallets = React.useMemo(() => {
    const execWalletIds = new Set(task.executions.map((e) => e.walletId));
    const relevant = allSubWallets.filter((sw) => execWalletIds.has(sw.id));
    return relevant.length > 0 ? relevant : allSubWallets;
  }, [allSubWallets, task.executions]);

  async function handleDispatch() {
    if (!selectedIdentityId) {
      toast.error("Please select an identity profile");
      return;
    }

    const identity = identities.find((i) => i.id === selectedIdentityId);
    if (!identity) return;

    setIsDispatching(true);
    try {
      await dispatchAgentJob({
        taskId:       task.id,
        identityId:   selectedIdentityId,
        walletId:     selectedWalletId || undefined,
        name:         `${task.title} — ${identity.alias}`,
        instructions: instructions.trim() || undefined,
      });

      toast.success(`Agent job dispatched for "${identity.alias}"`);
      // Reset form
      setInstructions("");
      setSelectedWalletId("");
    } catch (err) {
      toast.error(`Failed to dispatch: ${String(err)}`);
    } finally {
      setIsDispatching(false);
    }
  }

  function handleCancel(jobId: string) {
    cancelAgentJob(jobId);
    toast.success("Job cancelled");
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Bot size={16} className={styles.botIcon} />
            <div>
              <div className={styles.headerTitle}>Agent Dispatch</div>
              <div className={styles.headerSub}>{task.title}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Task guide preview */}
          {task.guide && (
            <div className={styles.guidePreview}>
              <div className={styles.guidePreviewLabel}>Task guide (agent will follow this)</div>
              <div className={styles.guidePreviewText}>
                {task.guide.slice(0, 300)}{task.guide.length > 300 ? "…" : ""}
              </div>
            </div>
          )}

          {/* Active job warning */}
          {activeJob && (
            <div className={styles.activeJobAlert}>
              <AlertCircle size={14} />
              <span>An agent job is already <strong>{activeJob.status}</strong> for this task.</span>
              <AgentJobStatusBadge status={activeJob.status} />
            </div>
          )}

          {/* ── Identity picker ── */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Identity Profile *</div>
            <div className={styles.identityList}>
              {identities.length === 0 && (
                <div className={styles.emptyHint}>No identities found. Add one in the Identities page.</div>
              )}
              {identities.map((id) => (
                <label
                  key={id.id}
                  className={`${styles.identityRow} ${selectedIdentityId === id.id ? styles.selected : ""}`}
                >
                  <input
                    type="radio"
                    name="identity"
                    value={id.id}
                    checked={selectedIdentityId === id.id}
                    onChange={() => setSelectedIdentityId(id.id)}
                    className={styles.radio}
                  />
                  <div className={styles.identityInfo}>
                    <div className={styles.identityAlias}>{id.alias}</div>
                    <div className={styles.identityPlatforms}>{getPlatformLabel(id)}</div>
                  </div>
                  <span className={`${styles.statusDot} ${styles[`dot_${id.status}`]}`} />
                </label>
              ))}
            </div>
          </div>

          {/* ── Wallet picker (optional) ── */}
          {relevantWallets.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                Wallet <span className={styles.optional}>(optional — for on-chain steps)</span>
              </div>
              <select
                className={styles.select}
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
              >
                <option value="">— None —</option>
                {relevantWallets.map((sw) => (
                  <option key={sw.id} value={sw.id}>
                    {sw.name} · {sw.address.slice(0, 10)}… ({sw.mainName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ── Extra instructions ── */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              Extra instructions <span className={styles.optional}>(optional)</span>
            </div>
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder={`e.g. "Use incognito mode, wait 30s between swaps, skip step 3 if balance is below 0.01 ETH"`}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* ── Dispatch button ── */}
          <button
            className={styles.dispatchBtn}
            onClick={handleDispatch}
            disabled={isDispatching || !selectedIdentityId}
          >
            {isDispatching ? (
              <>
                <Loader2 size={14} className={styles.spinIcon} />
                Dispatching…
              </>
            ) : (
              <>
                <Bot size={14} />
                Dispatch to Agent
                <ChevronRight size={14} />
              </>
            )}
          </button>

          {/* ── Job history ── */}
          {existingJobs.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                Job History
                <span className={styles.jobCount}>{existingJobs.length}</span>
              </div>
              <div className={styles.jobList}>
                {existingJobs.map((job) => (
                  <div key={job.id} className={styles.jobRow}>
                    <div className={styles.jobRowLeft}>
                      <AgentJobStatusBadge status={job.status} />
                      <div className={styles.jobMeta}>
                        <div className={styles.jobName}>{job.name}</div>
                        <div className={styles.jobTime}>{formatRelativeTime(job.createdAt)}</div>
                      </div>
                    </div>
                    <div className={styles.jobRowRight}>
                      {job.txHash && (
                        <a
                          href={`https://etherscan.io/tx/${job.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.txLink}
                          title="View on explorer"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                      {(job.status === "pending" || job.status === "queued") && (
                        <button className={styles.cancelBtn} onClick={() => handleCancel(job.id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
