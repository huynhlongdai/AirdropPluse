import React from "react";
import { X, Plus, Trash2, Wallet, Check } from "lucide-react";
import { toast } from "sonner";
import classNames from "classnames";
import type { Project, Milestone, Chain, ProjectCategory, ProjectStatus, RiskLevel, Sentiment, FundingRound } from "~/data/projects";
import { mockMainWallets } from "~/data/wallets";
import styles from "./project-form-drawer.module.css";

/** Flat list of all sub-wallets across all main wallets */
const ALL_SUB_WALLETS = mockMainWallets.flatMap((m) =>
  m.subWallets.map((s) => ({ id: s.id, name: s.name, address: s.address, mainWallet: m.name }))
);

interface Props {
  project?: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const CHAINS: Chain[] = ["ethereum", "solana", "arbitrum", "optimism", "base", "polygon", "zksync", "starknet", "sui", "aptos", "bnb", "avalanche", "near"];
const CATEGORIES: ProjectCategory[] = ["testnet", "mainnet", "galxe", "zealy", "layer3", "social", "defi", "nft", "ai", "other"];
const STATUSES: ProjectStatus[] = ["discovery", "active", "snapshot", "claiming", "claimed", "archived"];
const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high", "critical"];
const SENTIMENTS: Sentiment[] = ["bullish", "neutral", "bearish"];
const FUNDING_ROUNDS: FundingRound[] = ["pre-seed", "seed", "series-a", "series-b", "series-c", "strategic", "public"];

function generateId() {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateMilestoneId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

export default function ProjectFormDrawer({ project, onClose, onSave }: Props) {
  const isEdit = !!project;

  const [name, setName] = React.useState(project?.name ?? "");
  const [description, setDescription] = React.useState(project?.description ?? "");
  const [imageUrl, setImageUrl] = React.useState(project?.imageUrl ?? "");
  const [sourceUrl, setSourceUrl] = React.useState(project?.sourceUrl ?? "");
  const [twitterUrl, setTwitterUrl] = React.useState(project?.twitterUrl ?? "");
  const [discordUrl, setDiscordUrl] = React.useState(project?.discordUrl ?? "");
  const [telegramUrl, setTelegramUrl] = React.useState(project?.telegramUrl ?? "");
  const [category, setCategory] = React.useState<ProjectCategory>(project?.category ?? "mainnet");
  const [status, setStatus] = React.useState<ProjectStatus>(project?.status ?? "discovery");
  const [hypeScore, setHypeScore] = React.useState(project?.hypeScore ?? 50);
  const [riskLevel, setRiskLevel] = React.useState<RiskLevel>(project?.riskLevel ?? "medium");
  const [sentiment, setSentiment] = React.useState<Sentiment>(project?.sentiment ?? "neutral");
  const [potentialValue, setPotentialValue] = React.useState(project?.potentialValue ?? "medium");
  const [costType, setCostType] = React.useState(project?.costType ?? "free");
  const [estimatedCost, setEstimatedCost] = React.useState(project?.estimatedCost ?? "");
  const [fundingAmount, setFundingAmount] = React.useState(project?.fundingAmount ?? "");
  const [fundingRound, setFundingRound] = React.useState<FundingRound>("seed");
  const [fundingDate, setFundingDate] = React.useState("");
  const [leadInvestors, setLeadInvestors] = React.useState("");
  const [tgeDate, setTgeDate] = React.useState(project?.tgeDate ?? "");
  const [totalSupply, setTotalSupply] = React.useState(project?.totalSupply ?? "");
  const [vestingInfo, setVestingInfo] = React.useState(project?.vestingInfo ?? "");
  const [snapshotDate, setSnapshotDate] = React.useState(project?.snapshotDate ?? "");
  const [claimDate, setClaimDate] = React.useState(project?.claimDate ?? "");
  const [expiryDate, setExpiryDate] = React.useState(project?.expiryDate ?? "");
  const [priority, setPriority] = React.useState(project?.priority ?? "medium");
  const [isHot, setIsHot] = React.useState(project?.isHot ?? false);
  const [isNew, setIsNew] = React.useState(project?.isNew ?? false);
  const [notes, setNotes] = React.useState(project?.notes ?? "");
  const [milestones, setMilestones] = React.useState<Milestone[]>(project?.milestones ?? []);
  const [newMilestoneTitle, setNewMilestoneTitle] = React.useState("");
  const [newMilestoneDate, setNewMilestoneDate] = React.useState("");
  const [chains, setChains] = React.useState<string[]>(project?.chain ?? []);
  const [ecosystemInput, setEcosystemInput] = React.useState("");
  const [ecosystems, setEcosystems] = React.useState<string[]>(project?.ecosystem ?? []);
  const [investorInput, setInvestorInput] = React.useState("");
  const [investors, setInvestors] = React.useState<string[]>(project?.investors ?? []);
  const [participatingWalletIds, setParticipatingWalletIds] = React.useState<string[]>(
    project?.participatingWalletIds ?? []
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Project name is required.";
    if (!description.trim()) e.description = "Description is required.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const now = new Date().toISOString().slice(0, 10);
    const saved: Project = {
      id: project?.id ?? generateId(),
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop`,
      logoUrl: project?.logoUrl,
      category,
      projectType: project?.projectType ?? "mainnet",
      chain: chains as Chain[],
      ecosystem: ecosystems,
      status,
      costType: costType as "free" | "paid",
      estimatedCost: estimatedCost || undefined,
      potentialValue: potentialValue as Project["potentialValue"],
      hypeScore,
      riskLevel,
      riskFactors: project?.riskFactors ?? [],
      sentiment,
      fundingAmount: fundingAmount || undefined,
      fundingRounds: project?.fundingRounds ?? [],
      investors: investors.length > 0 ? investors : undefined,
      tgeDate: tgeDate || undefined,
      totalSupply: totalSupply || undefined,
      vestingInfo: vestingInfo || undefined,
      milestones,
      tasks: project?.tasks ?? [],
      snapshotDate: snapshotDate || undefined,
      claimDate: claimDate || undefined,
      expiryDate: expiryDate || undefined,
      priority: priority as "low" | "medium" | "high",
      isHot: isHot || undefined,
      isNew: isNew || undefined,
      sourceUrl: sourceUrl || undefined,
      twitterUrl: twitterUrl || undefined,
      discordUrl: discordUrl || undefined,
      telegramUrl: telegramUrl || undefined,
      participatingWalletIds,
      linkedWallets: project?.linkedWallets ?? [],
      linkedIdentities: project?.linkedIdentities ?? [],
      updates: project?.updates ?? [],
      notes: notes || undefined,
      createdAt: project?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(saved);
    toast.success(isEdit ? `"${saved.name}" updated successfully.` : `"${saved.name}" added to your projects.`);
    onClose();
  }

  function toggleWallet(id: string) {
    setParticipatingWalletIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleChain(c: string) {
    setChains((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }

  function addEcosystem(e: React.KeyboardEvent) {
    if (e.key === "Enter" && ecosystemInput.trim()) {
      e.preventDefault();
      const val = ecosystemInput.trim();
      if (!ecosystems.includes(val)) setEcosystems((prev) => [...prev, val]);
      setEcosystemInput("");
    }
  }

  function addInvestor(e: React.KeyboardEvent) {
    if (e.key === "Enter" && investorInput.trim()) {
      e.preventDefault();
      const val = investorInput.trim();
      if (!investors.includes(val)) setInvestors((prev) => [...prev, val]);
      setInvestorInput("");
    }
  }

  function addMilestone() {
    if (!newMilestoneTitle.trim()) return;
    setMilestones((prev) => [
      ...prev,
      { id: generateMilestoneId(), title: newMilestoneTitle.trim(), date: newMilestoneDate, completed: false },
    ]);
    setNewMilestoneTitle("");
    setNewMilestoneDate("");
  }

  function removeMilestone(id: string) {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  }

  function toggleMilestoneCompleted(id: string) {
    setMilestones((prev) => prev.map((m) => m.id === id ? { ...m, completed: !m.completed } : m));
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? "Edit Project" : "Add New Project"}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit} noValidate>
          {/* Basic Info */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Basic Information</div>

            <div className={styles.field}>
              <label className={styles.label}>Project Name <span className={styles.required}>*</span></label>
              <input
                className={classNames(styles.input, { [styles.error]: errors.name })}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                placeholder="e.g. zkSync Era"
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description <span className={styles.required}>*</span></label>
              <textarea
                className={classNames(styles.textarea, { [styles.error]: errors.description })}
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
                placeholder="Describe the project and airdrop opportunity..."
              />
              {errors.description && <span className={styles.errorText}>{errors.description}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Cover Image URL</label>
              <input className={styles.input} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value as ProjectCategory)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Priority</label>
                <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Cost Type</label>
                <select className={styles.select} value={costType} onChange={(e) => setCostType(e.target.value as "free" | "paid")}>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            {costType === "paid" && (
              <div className={styles.field}>
                <label className={styles.label}>Estimated Cost</label>
                <input className={styles.input} value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} placeholder="e.g. $50-100" />
              </div>
            )}

            <div className={styles.checkboxRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={isHot} onChange={(e) => setIsHot(e.target.checked)} />
                🔥 Hot Project
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
                ⚡ New Project
              </label>
            </div>
          </div>

          {/* Social Links */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Social Links</div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Website</label>
                <input className={styles.input} value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Twitter</label>
                <input className={styles.input} value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://twitter.com/..." />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Discord</label>
                <input className={styles.input} value={discordUrl} onChange={(e) => setDiscordUrl(e.target.value)} placeholder="https://discord.gg/..." />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Telegram</label>
                <input className={styles.input} value={telegramUrl} onChange={(e) => setTelegramUrl(e.target.value)} placeholder="https://t.me/..." />
              </div>
            </div>
          </div>

          {/* Evaluation */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Evaluation Metrics</div>
            <div className={styles.field}>
              <label className={styles.label}>Hype Score: {hypeScore}/100</label>
              <div className={styles.rangeWrapper}>
                <span className={styles.rangeValue}>0</span>
                <input type="range" className={styles.range} min={0} max={100} value={hypeScore} onChange={(e) => setHypeScore(Number(e.target.value))} />
                <span className={styles.rangeValue}>{hypeScore}</span>
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Risk Level</label>
                <select className={styles.select} value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}>
                  {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Sentiment</label>
                <select className={styles.select} value={sentiment} onChange={(e) => setSentiment(e.target.value as Sentiment)}>
                  {SENTIMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Potential Value</label>
              <select className={styles.select} value={potentialValue} onChange={(e) => setPotentialValue(e.target.value as Project["potentialValue"])}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very-high">Very High</option>
              </select>
            </div>
          </div>

          {/* Financial */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Financial Data</div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Total Funding</label>
                <input className={styles.input} value={fundingAmount} onChange={(e) => setFundingAmount(e.target.value)} placeholder="e.g. $458M" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>TGE Date</label>
                <input className={styles.input} value={tgeDate} onChange={(e) => setTgeDate(e.target.value)} placeholder="e.g. 2024-Q2" />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Total Supply</label>
                <input className={styles.input} value={totalSupply} onChange={(e) => setTotalSupply(e.target.value)} placeholder="e.g. 21,000,000,000" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Vesting Info</label>
                <input className={styles.input} value={vestingInfo} onChange={(e) => setVestingInfo(e.target.value)} placeholder="e.g. 4-year linear vesting" />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Lead Investors (press Enter to add)</label>
              <div className={styles.tagInput}>
                {investors.map((inv) => (
                  <span key={inv} className={styles.tagChip}>
                    {inv}
                    <button type="button" className={styles.tagChipRemove} onClick={() => setInvestors((p) => p.filter((x) => x !== inv))}>×</button>
                  </span>
                ))}
                <input
                  className={styles.tagInputField}
                  value={investorInput}
                  onChange={(e) => setInvestorInput(e.target.value)}
                  onKeyDown={addInvestor}
                  placeholder="a16z, Sequoia..."
                />
              </div>
            </div>
          </div>

          {/* Ecosystem & Chain */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Ecosystem & Chains</div>
            <div className={styles.field}>
              <label className={styles.label}>Ecosystems (press Enter to add)</label>
              <div className={styles.tagInput}>
                {ecosystems.map((e) => (
                  <span key={e} className={styles.tagChip}>
                    {e}
                    <button type="button" className={styles.tagChipRemove} onClick={() => setEcosystems((p) => p.filter((x) => x !== e))}>×</button>
                  </span>
                ))}
                <input
                  className={styles.tagInputField}
                  value={ecosystemInput}
                  onChange={(e) => setEcosystemInput(e.target.value)}
                  onKeyDown={addEcosystem}
                  placeholder="Layer 2, ZK Rollup..."
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Chains</label>
              <div className={styles.checkboxRow}>
                {CHAINS.map((c) => (
                  <label key={c} className={styles.checkboxLabel}>
                    <input type="checkbox" checked={chains.includes(c)} onChange={() => toggleChain(c)} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Key Dates */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Key Dates</div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Snapshot Date</label>
                <input type="date" className={styles.input} value={snapshotDate} onChange={(e) => setSnapshotDate(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Claim Date</label>
                <input type="date" className={styles.input} value={claimDate} onChange={(e) => setClaimDate(e.target.value)} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Expiry Date</label>
              <input type="date" className={styles.input} value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
          </div>

          {/* Milestones */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Roadmap Milestones</div>
            <div className={styles.milestoneList}>
              {milestones.map((m) => (
                <div key={m.id} className={styles.milestoneItem}>
                  <span className={styles.milestoneItemTitle}>{m.title}</span>
                  <span className={styles.milestoneItemDate}>{m.date}</span>
                  <input type="checkbox" className={styles.milestoneCheck} checked={m.completed} onChange={() => toggleMilestoneCompleted(m.id)} />
                  <button type="button" className={styles.removeBtn} onClick={() => removeMilestone(m.id)}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.addRowForm}>
              <input className={styles.input} style={{ flex: 1 }} value={newMilestoneTitle} onChange={(e) => setNewMilestoneTitle(e.target.value)} placeholder="Milestone title..." />
              <input type="date" className={styles.input} value={newMilestoneDate} onChange={(e) => setNewMilestoneDate(e.target.value)} />
              <button type="button" className={styles.addRowBtn} onClick={addMilestone}><Plus size={14} /> Add</button>
            </div>
          </div>

          {/* Participating Wallets */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Participating Wallets</div>
            <div className={styles.field}>
              <label className={styles.label}>
                <Wallet size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                Select wallets that will participate in this project
              </label>
              <div className={styles.walletPicker}>
                {ALL_SUB_WALLETS.map((w) => {
                  const selected = participatingWalletIds.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      className={classNames(styles.walletPickerItem, { [styles.walletPickerItemSelected]: selected })}
                      onClick={() => toggleWallet(w.id)}
                    >
                      <div className={classNames(styles.walletPickerCheck, { [styles.walletPickerCheckSelected]: selected })}>
                        {selected && <Check size={10} />}
                      </div>
                      <div className={styles.walletPickerInfo}>
                        <span className={styles.walletPickerName}>{w.name}</span>
                        <span className={styles.walletPickerAddr}>{w.address.slice(0, 8)}...{w.address.slice(-4)}</span>
                      </div>
                      <span className={styles.walletPickerGroup}>{w.mainWallet}</span>
                    </button>
                  );
                })}
              </div>
              {participatingWalletIds.length > 0 && (
                <p style={{ fontSize: "var(--font-size-0)", color: "var(--color-success-11)", margin: 0 }}>
                  ✓ {participatingWalletIds.length} wallet{participatingWalletIds.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Personal Notes</div>
            <div className={styles.field}>
              <textarea className={styles.textarea} style={{ minHeight: 100 }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Your notes, strategies, warnings..." />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>{isEdit ? "Save Changes" : "Add Project"}</button>
          </div>
        </form>
      </aside>
    </>
  );
}
