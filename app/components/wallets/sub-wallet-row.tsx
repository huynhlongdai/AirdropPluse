import React from "react";
import { Copy, ExternalLink, Check, AlertTriangle } from "lucide-react";
import classNames from "classnames";
import type { SubWallet } from "~/data/wallets";
import { CHAIN_LABELS, CHAIN_EXPLORERS } from "~/data/wallets";
import styles from "./sub-wallet-row.module.css";

// Chain brand colors
const CHAIN_COLOR: Record<string, string> = {
  ethereum: "#627EEA", eth: "#627EEA",
  bsc: "#c9930d", bnb: "#c9930d",
  arbitrum: "#2980d9", arb: "#2980d9",
  optimism: "#cc0010", op: "#cc0010",
  base: "#0040cc",
  zksync: "#6844c9",
  solana: "#7c2fd4", sol: "#7c2fd4",
  sui: "#2d7db3",
  starknet: "#c45d10", stark: "#c45d10",
  polygon: "#6929c4",
  avalanche: "#b32222", avax: "#b32222",
};
const CHAIN_BG: Record<string, string> = {
  ethereum: "#e8ecff", eth: "#e8ecff",
  bsc: "#fff8e0", bnb: "#fff8e0",
  arbitrum: "#e6f4ff", arb: "#e6f4ff",
  optimism: "#fff0f0", op: "#fff0f0",
  base: "#e6eeff",
  zksync: "#ede9fe",
  solana: "#f3e9ff", sol: "#f3e9ff",
  sui: "#e6f4ff",
  starknet: "#fff3e6", stark: "#fff3e6",
  polygon: "#ede9fe",
  avalanche: "#ffe8e8", avax: "#ffe8e8",
};

interface SubWalletRowProps {
  wallet: SubWallet;
  selected: boolean;
  onSelect: () => void;
  hasSybilConflict: boolean;
  onClick: () => void;
}

const TYPE_LABELS: Record<SubWallet["type"], string> = {
  hot: "Hot",
  cold: "Cold",
  cex: "CEX",
  burner: "Burner",
};

function getStatusClass(status: SubWallet["status"]) {
  switch (status) {
    case "active": return styles.statusActive;
    case "idle": return styles.statusIdle;
    case "low-gas": return styles.statusLowGas;
    default: return styles.statusArchived;
  }
}

function getTypeBadgeClass(type: SubWallet["type"]) {
  switch (type) {
    case "hot": return styles.typeBadgeHot;
    case "cold": return styles.typeBadgeCold;
    case "cex": return styles.typeBadgeCex;
    default: return styles.typeBadgeBurner;
  }
}

function getGasDotClass(balance: number) {
  if (balance > 0.01) return styles.gasDotOk;
  if (balance > 0) return styles.gasDotLow;
  return styles.gasDotEmpty;
}

function shortenAddress(addr: string) {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function SubWalletRow({ wallet, selected, onSelect, hasSybilConflict, onClick }: SubWalletRowProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(wallet.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExplorer = (e: React.MouseEvent) => {
    e.stopPropagation();
    const primaryChain = wallet.chains[0];
    if (primaryChain) {
      window.open(`${CHAIN_EXPLORERS[primaryChain]}${wallet.address}`, "_blank");
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div
      className={classNames(styles.row, {
        [styles.rowSelected]: selected,
        [styles.rowArchived]: wallet.status === "archived",
      })}
      onClick={onClick}
    >
      {/* Checkbox */}
      <div
        className={classNames(styles.checkbox, { [styles.checkboxChecked]: selected })}
        onClick={handleSelect}
      >
        {selected && <Check className={styles.checkmark} />}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <div className={classNames(styles.statusDot, getStatusClass(wallet.status))} />
          <span className={styles.name}>{wallet.name}</span>
          <span className={classNames(styles.typeBadge, getTypeBadgeClass(wallet.type))}>
            {TYPE_LABELS[wallet.type]}
          </span>
          {hasSybilConflict && (
            <span className={styles.sybilWarning}>
              <AlertTriangle size={10} />
              Sybil Risk
            </span>
          )}
        </div>
        <div className={styles.addressRow}>
          <span className={styles.address}>{shortenAddress(wallet.address)}</span>
          {wallet.purpose && <span className={styles.purpose}>· {wallet.purpose}</span>}
        </div>
      </div>

      {/* Chains */}
      <div className={styles.chains}>
        {wallet.chains.slice(0, 4).map((c) => (
          <span key={c} className={`${styles.chainBadge} ${styles[`chain_${c}`] ?? ""}`}
            style={{
              background: CHAIN_BG[c] ?? "#f0f0f3",
              color:      CHAIN_COLOR[c] ?? "#52525b",
              border:     `1px solid ${CHAIN_COLOR[c] ?? "#c4c4c8"}44`,
            }}>
            {CHAIN_LABELS[c]}
          </span>
        ))}
        {wallet.chains.length > 4 && (
          <span className={styles.chainBadge}>+{wallet.chains.length - 4}</span>
        )}
      </div>

      {/* Gas */}
      <div className={styles.gasSection}>
        {wallet.gasBalances.slice(0, 2).map((g) => (
          <div key={g.chain} className={styles.gasItem}>
            <div className={classNames(styles.gasDot, getGasDotClass(g.balance))} />
            <span className={styles.gasValue}>{g.balance.toFixed(4)} {g.symbol}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={classNames(styles.actionBtn, { [styles.actionBtnCopied]: copied })}
          onClick={handleCopy}
          title="Copy address"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        <button className={styles.actionBtn} onClick={handleExplorer} title="View on Explorer">
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
