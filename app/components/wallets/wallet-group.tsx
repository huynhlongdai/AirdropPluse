import React from "react";
import { ChevronRight, Wallet, Building2, Flame, Snowflake, Copy, Check, Plus, Pencil, Trash2 } from "lucide-react";
import classNames from "classnames";
import type { MainWallet, SubWallet } from "~/data/wallets";
import SubWalletRow from "./sub-wallet-row";
import styles from "./wallet-group.module.css";

interface WalletGroupProps {
  main: MainWallet;
  allSubWallets: SubWallet[]; // all sub-wallets across system for sybil detection
  onEditMain: (main: MainWallet) => void;
  onDeleteMain: (id: string) => void;
  onAddSub: (mainId: string) => void;
  onEditSub: (sub: SubWallet, mainId: string) => void;
}

const ICON_MAP: Record<MainWallet["type"], React.ElementType> = {
  hot: Flame,
  cold: Snowflake,
  cex: Building2,
  burner: Wallet,
};

const TYPE_LABELS: Record<MainWallet["type"], string> = {
  hot: "Hot Wallet",
  cold: "Cold Wallet",
  cex: "Exchange (CEX)",
  burner: "Burner",
};

function getMainIconClass(type: MainWallet["type"]) {
  switch (type) {
    case "cold": return styles.mainIconCold;
    case "hot": return styles.mainIconHot;
    case "cex": return styles.mainIconCex;
    default: return styles.mainIconBurner;
  }
}

function getMainBadgeClass(type: MainWallet["type"]) {
  switch (type) {
    case "cold": return styles.badgeCold;
    case "hot": return styles.badgeHot;
    case "cex": return styles.badgeCex;
    default: return styles.badgeBurner;
  }
}

/** Detect sybil conflict: sub-wallet identity also used by another sub-wallet across all mains */
function getSybilConflicts(subs: SubWallet[], allSubs: SubWallet[]): Set<string> {
  const conflicts = new Set<string>();
  subs.forEach((sub) => {
    sub.linkedIdentityIds.forEach((identityId) => {
      const others = allSubs.filter(
        (s) => s.id !== sub.id && s.linkedIdentityIds.includes(identityId),
      );
      if (others.length > 0) conflicts.add(sub.id);
    });
  });
  return conflicts;
}

function shortenAddress(addr: string) {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

export default function WalletGroup({ main, allSubWallets, onEditMain, onDeleteMain, onAddSub, onEditSub }: WalletGroupProps) {
  const [expanded, setExpanded] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [copied, setCopied] = React.useState(false);

  const Icon = ICON_MAP[main.type];
  const sybilConflicts = getSybilConflicts(main.subWallets, allSubWallets);
  const activeCount = main.subWallets.filter((s) => s.status === "active").length;
  const lowGasCount = main.subWallets.filter((s) => s.status === "low-gas").length;
  const totalProjects = new Set(main.subWallets.flatMap((s) => s.activeProjectIds)).size;

  const handleCopyMain = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(main.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditMain(main);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteMain(main.id);
  };

  return (
    <div className={styles.group}>
      {/* Header */}
      <div className={styles.header} onClick={() => setExpanded((v) => !v)}>
        <ChevronRight
          size={16}
          className={classNames(styles.chevron, { [styles.chevronOpen]: expanded })}
        />

        <div className={classNames(styles.mainIcon, getMainIconClass(main.type))}>
          <Icon size={20} />
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.headerTop}>
            <span className={styles.mainName}>{main.name}</span>
            <span className={classNames(styles.mainTypeBadge, getMainBadgeClass(main.type))}>
              {TYPE_LABELS[main.type]}
            </span>
          </div>
          <div className={styles.mainAddress}>
            {shortenAddress(main.address)}
            <button
              className={classNames(styles.copyBtn, { [styles.copyBtnCopied]: copied })}
              onClick={handleCopyMain}
              title="Copy address"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{main.subWallets.length}</div>
            <div className={styles.statLabel}>Sub-wallets</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{activeCount}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
          {lowGasCount > 0 && (
            <div className={styles.stat}>
              <div className={styles.statValue} style={{ color: "var(--color-error-11)" }}>{lowGasCount}</div>
              <div className={styles.statLabel}>Low Gas</div>
            </div>
          )}
          <div className={styles.stat}>
            <div className={styles.statValue}>{totalProjects}</div>
            <div className={styles.statLabel}>Projects</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={handleEdit} title="Edit wallet">
            <Pencil size={14} />
          </button>
          <button className={styles.actionBtn} onClick={handleDelete} title="Delete wallet">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className={styles.body}>
          {selectedIds.size > 0 && (
            <div className={styles.bulkBar}>
              <span className={styles.bulkLabel}>{selectedIds.size} selected</span>
              <div className={styles.bulkActions}>
                <button className={styles.bulkBtn}>Assign to Campaign</button>
                <button className={classNames(styles.bulkBtn, styles.bulkBtnDanger)}
                  onClick={() => setSelectedIds(new Set())}>
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className={styles.bodyHeader}>
            <span className={styles.subLabel}>
              Sub-wallets ({main.subWallets.length})
            </span>
            <button className={styles.addSubBtn} onClick={(e) => { e.stopPropagation(); onAddSub(main.id); }}>
              <Plus size={12} />
              Add Sub-wallet
            </button>
          </div>

          {main.subWallets.length === 0 ? (
            <div className={styles.emptyState}>No sub-wallets yet. Add one to get started.</div>
          ) : (
            main.subWallets.map((sub) => (
              <SubWalletRow
                key={sub.id}
                wallet={sub}
                selected={selectedIds.has(sub.id)}
                onSelect={() => toggleSelect(sub.id)}
                hasSybilConflict={sybilConflicts.has(sub.id)}
                onClick={() => onEditSub(sub, main.id)}
              />
            ))
          )}

          {main.notes && <div className={styles.notes}>📝 {main.notes}</div>}
        </div>
      )}
    </div>
  );
}
