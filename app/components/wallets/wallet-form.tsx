import React from "react";
import { X } from "lucide-react";
import classNames from "classnames";
import type { MainWallet, SubWallet, ChainId, WalletType } from "~/data/wallets";
import { CHAIN_LABELS } from "~/data/wallets";
import styles from "./wallet-form.module.css";

const ALL_CHAINS = Object.keys(CHAIN_LABELS) as ChainId[];

type FormMode = "main" | "sub" | "import";

interface WalletFormProps {
  mode: "create-main" | "edit-main" | "create-sub" | "edit-sub";
  editingMain?: MainWallet;
  editingSub?: SubWallet;
  parentMainId?: string;
  onSaveMain: (data: Partial<Pick<MainWallet, "id">> & Omit<MainWallet, "id" | "subWallets" | "createdAt">) => void;
  onSaveSub: (data: Partial<Pick<SubWallet, "id">> & Omit<SubWallet, "id" | "gasBalances" | "activeProjectIds" | "createdAt">, mainId: string) => void;
  onImportSubs: (addresses: string[], mainId: string) => void;
  onClose: () => void;
}

interface MainFormState {
  name: string;
  address: string;
  type: WalletType;
  chains: ChainId[];
  notes: string;
}

interface SubFormState {
  name: string;
  address: string;
  type: WalletType;
  chains: ChainId[];
  status: SubWallet["status"];
  purpose: string;
  linkedIdentityIds: string[];
}

export default function WalletForm({
  mode,
  editingMain,
  editingSub,
  parentMainId,
  onSaveMain,
  onSaveSub,
  onImportSubs,
  onClose,
}: WalletFormProps) {
  const isMain = mode === "create-main" || mode === "edit-main";
  const [activeTab, setActiveTab] = React.useState<FormMode>(isMain ? "main" : "sub");

  const [mainForm, setMainForm] = React.useState<MainFormState>({
    name: editingMain?.name ?? "",
    address: editingMain?.address ?? "",
    type: editingMain?.type ?? "hot",
    chains: editingMain?.chains ?? ["ethereum"],
    notes: editingMain?.notes ?? "",
  });

  const [subForm, setSubForm] = React.useState<SubFormState>({
    name: editingSub?.name ?? "",
    address: editingSub?.address ?? "",
    type: editingSub?.type ?? "burner",
    chains: editingSub?.chains ?? ["ethereum"],
    status: editingSub?.status ?? "active",
    purpose: editingSub?.purpose ?? "",
    linkedIdentityIds: editingSub?.linkedIdentityIds ?? [],
  });

  const [bulkText, setBulkText] = React.useState("");
  const parsedAddresses = React.useMemo(() => {
    return bulkText
      .split(/[\n,;]+/)
      .map((a) => a.trim())
      .filter((a) => a.length > 10);
  }, [bulkText]);

  const toggleMainChain = (chain: ChainId) => {
    setMainForm((f) => ({
      ...f,
      chains: f.chains.includes(chain) ? f.chains.filter((c) => c !== chain) : [...f.chains, chain],
    }));
  };

  const toggleSubChain = (chain: ChainId) => {
    setSubForm((f) => ({
      ...f,
      chains: f.chains.includes(chain) ? f.chains.filter((c) => c !== chain) : [...f.chains, chain],
    }));
  };

  const handleSave = () => {
    if (activeTab === "main") {
      if (!mainForm.name || !mainForm.address) return;
      onSaveMain({
        ...(editingMain?.id ? { id: editingMain.id } : {}),
        name: mainForm.name,
        address: mainForm.address,
        type: mainForm.type,
        chains: mainForm.chains,
        notes: mainForm.notes,
      });
    } else if (activeTab === "sub") {
      if (!subForm.name || !subForm.address || !parentMainId) return;
      onSaveSub(
        {
          ...(editingSub?.id ? { id: editingSub.id } : {}),
          name: subForm.name,
          address: subForm.address,
          type: subForm.type,
          chains: subForm.chains,
          status: subForm.status,
          purpose: subForm.purpose,
          linkedIdentityIds: subForm.linkedIdentityIds,
        },
        parentMainId,
      );
    } else {
      if (!parsedAddresses.length || !parentMainId) return;
      onImportSubs(parsedAddresses, parentMainId);
    }
  };

  const title = {
    "create-main": "New Main Wallet",
    "edit-main": "Edit Main Wallet",
    "create-sub": "New Sub-wallet",
    "edit-sub": "Edit Sub-wallet",
  }[mode];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>{title}</span>
          <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        {(mode === "create-sub" || mode === "edit-sub") && (
          <div className={styles.tabs}>
            <button className={classNames(styles.tab, { [styles.tabActive]: activeTab === "sub" })} onClick={() => setActiveTab("sub")}>
              Single Wallet
            </button>
            <button className={classNames(styles.tab, { [styles.tabActive]: activeTab === "import" })} onClick={() => setActiveTab("import")}>
              Bulk Import
            </button>
          </div>
        )}

        <div className={styles.body}>
          {/* Main wallet form */}
          {(activeTab === "main" || isMain) && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Wallet Name <span className={styles.required}>*</span></label>
                <input className={styles.input} placeholder="e.g. Master Vault" value={mainForm.name}
                  onChange={(e) => setMainForm((f) => ({ ...f, name: e.target.value }))} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Address <span className={styles.required}>*</span></label>
                <input className={classNames(styles.input, styles.inputMono)} placeholder="0x... or Solana address"
                  value={mainForm.address}
                  onChange={(e) => setMainForm((f) => ({ ...f, address: e.target.value }))} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Type</label>
                <select className={styles.select} value={mainForm.type}
                  onChange={(e) => setMainForm((f) => ({ ...f, type: e.target.value as WalletType }))}>
                  <option value="hot">Hot Wallet</option>
                  <option value="cold">Cold Wallet</option>
                  <option value="cex">Exchange (CEX)</option>
                  <option value="burner">Burner</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Active Chains</label>
                <div className={styles.chainGrid}>
                  {ALL_CHAINS.map((c) => (
                    <button key={c}
                      className={classNames(styles.chainToggle, { [styles.chainToggleActive]: mainForm.chains.includes(c) })}
                      onClick={() => toggleMainChain(c)}>
                      {CHAIN_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Notes</label>
                <input className={styles.input} placeholder="Usage notes..."
                  value={mainForm.notes}
                  onChange={(e) => setMainForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
            </>
          )}

          {/* Sub-wallet single form */}
          {activeTab === "sub" && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Wallet Name <span className={styles.required}>*</span></label>
                <input className={styles.input} placeholder="e.g. zkSync Farmer #1"
                  value={subForm.name}
                  onChange={(e) => setSubForm((f) => ({ ...f, name: e.target.value }))} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Address <span className={styles.required}>*</span></label>
                <input className={classNames(styles.input, styles.inputMono)} placeholder="0x..."
                  value={subForm.address}
                  onChange={(e) => setSubForm((f) => ({ ...f, address: e.target.value }))} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Type</label>
                <select className={styles.select} value={subForm.type}
                  onChange={(e) => setSubForm((f) => ({ ...f, type: e.target.value as WalletType }))}>
                  <option value="burner">Burner</option>
                  <option value="hot">Hot Wallet</option>
                  <option value="cold">Cold Wallet</option>
                  <option value="cex">Exchange (CEX)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select className={styles.select} value={subForm.status}
                  onChange={(e) => setSubForm((f) => ({ ...f, status: e.target.value as SubWallet["status"] }))}>
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="low-gas">Low Gas</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Active Chains</label>
                <div className={styles.chainGrid}>
                  {ALL_CHAINS.map((c) => (
                    <button key={c}
                      className={classNames(styles.chainToggle, { [styles.chainToggleActive]: subForm.chains.includes(c) })}
                      onClick={() => toggleSubChain(c)}>
                      {CHAIN_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Purpose / Notes</label>
                <input className={styles.input} placeholder="e.g. zkSync Era farming"
                  value={subForm.purpose}
                  onChange={(e) => setSubForm((f) => ({ ...f, purpose: e.target.value }))} />
              </div>
            </>
          )}

          {/* Bulk import */}
          {activeTab === "import" && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Wallet Addresses</label>
                <textarea
                  className={styles.textarea}
                  placeholder={"Paste addresses separated by newlines, commas, or semicolons:\n0xABC...\n0xDEF...\n0xGHI..."}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                />
                <span className={styles.hint}>{parsedAddresses.length} address(es) detected</span>
              </div>

              {parsedAddresses.length > 0 && (
                <div className={styles.importedList}>
                  {parsedAddresses.map((addr, i) => (
                    <div key={i} className={styles.importedItem}>
                      <div className={styles.importDot} />
                      {addr}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>
            {mode.startsWith("edit") ? "Save Changes" : activeTab === "import" ? `Import ${parsedAddresses.length} Wallets` : "Create Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
}
