import React from "react";
import { Plus, Search, Wallet, CheckCircle2, Circle } from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/wallets";
import { mockMainWallets, mockWallets as flatWallets } from "~/data/wallets";
import { mockProjects } from "~/data/projects";
import type { MainWallet, SubWallet, ChainId } from "~/data/wallets";
import WalletGroup from "~/components/wallets/wallet-group";
import WalletForm from "~/components/wallets/wallet-form";
import styles from "./wallets.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wallet Manager - AirdropPulse" },
    { name: "description", content: "Manage your hierarchical crypto wallet groups" },
  ];
}

type ActiveTab = "groups" | "matrix";
type FormState =
  | { open: false }
  | { open: true; mode: "create-main" }
  | { open: true; mode: "edit-main"; main: MainWallet }
  | { open: true; mode: "create-sub"; mainId: string }
  | { open: true; mode: "edit-sub"; sub: SubWallet; mainId: string };

function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Wallets() {
  const [tab, setTab] = React.useState<ActiveTab>("groups");
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<"all" | MainWallet["type"]>("all");
  const [wallets, setWallets] = React.useState<MainWallet[]>(mockMainWallets);
  const [formState, setFormState] = React.useState<FormState>({ open: false });

  const allSubWallets = React.useMemo(() => wallets.flatMap((m) => m.subWallets), [wallets]);

  const filtered = React.useMemo(() => {
    return wallets.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.address.toLowerCase().includes(search.toLowerCase()) ||
        m.subWallets.some(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase()),
        );
      const matchType = filterType === "all" || m.type === filterType;
      return matchSearch && matchType;
    });
  }, [wallets, search, filterType]);

  // Summary stats
  const totalSubs = wallets.reduce((n, m) => n + m.subWallets.length, 0);
  const activeSubs = wallets.reduce((n, m) => n + m.subWallets.filter((s) => s.status === "active").length, 0);
  const lowGasSubs = wallets.reduce((n, m) => n + m.subWallets.filter((s) => s.status === "low-gas").length, 0);

  // Handlers
  const handleSaveMain = (data: Partial<Pick<MainWallet, "id">> & Omit<MainWallet, "id" | "subWallets" | "createdAt">) => {
    setWallets((prev) => {
      if (data.id) {
        return prev.map((m) => (m.id === data.id ? { ...m, ...data } : m));
      }
      return [...prev, { ...data, id: genId("main"), subWallets: [], createdAt: new Date().toISOString().slice(0, 10) }];
    });
    setFormState({ open: false });
  };

  const handleSaveSub = (
    data: Partial<Pick<SubWallet, "id">> & Omit<SubWallet, "id" | "gasBalances" | "activeProjectIds" | "createdAt">,
    mainId: string,
  ) => {
    setWallets((prev) =>
      prev.map((m) => {
        if (m.id !== mainId) return m;
        if (data.id) {
          return { ...m, subWallets: m.subWallets.map((s) => (s.id === data.id ? { ...s, ...data } : s)) };
        }
        const newSub: SubWallet = {
          ...data,
          id: genId("sub"),
          gasBalances: [],
          activeProjectIds: [],
          createdAt: new Date().toISOString().slice(0, 10),
        };
        return { ...m, subWallets: [...m.subWallets, newSub] };
      }),
    );
    setFormState({ open: false });
  };

  const handleImportSubs = (addresses: string[], mainId: string) => {
    setWallets((prev) =>
      prev.map((m) => {
        if (m.id !== mainId) return m;
        const newSubs: SubWallet[] = addresses.map((addr, i) => ({
          id: genId("sub"),
          name: `Imported Wallet ${m.subWallets.length + i + 1}`,
          address: addr,
          type: "burner",
          chains: ["ethereum"],
          status: "active",
          purpose: "",
          linkedIdentityIds: [],
          gasBalances: [],
          activeProjectIds: [],
          createdAt: new Date().toISOString().slice(0, 10),
        }));
        return { ...m, subWallets: [...m.subWallets, ...newSubs] };
      }),
    );
    setFormState({ open: false });
  };

  const handleDeleteMain = (id: string) => {
    setWallets((prev) => prev.filter((m) => m.id !== id));
  };

  // For matrix tab — use flat list
  const matrixWallets = flatWallets.slice(0, 5);

  return (
    <main className={styles.wallets}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Wallet Manager</h1>
            <p className={styles.subtitle}>Hierarchical wallet groups for airdrop farming</p>
          </div>
          <button className={styles.addBtn} onClick={() => setFormState({ open: true, mode: "create-main" })}>
            <Plus size={16} />
            New Main Wallet
          </button>
        </header>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statCardValue}>{wallets.length}</div>
            <div className={styles.statCardLabel}>Main Wallets</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardValue}>{totalSubs}</div>
            <div className={styles.statCardLabel}>Sub-wallets</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardValue} style={{ color: "var(--color-success-11)" }}>{activeSubs}</div>
            <div className={styles.statCardLabel}>Active</div>
          </div>
          {lowGasSubs > 0 && (
            <div className={styles.statCard}>
              <div className={styles.statCardValue} style={{ color: "var(--color-error-11)" }}>{lowGasSubs}</div>
              <div className={styles.statCardLabel}>⚠ Low Gas</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={classNames(styles.tab, { [styles.tabActive]: tab === "groups" })} onClick={() => setTab("groups")}>
            Wallet Groups
          </button>
          <button className={classNames(styles.tab, { [styles.tabActive]: tab === "matrix" })} onClick={() => setTab("matrix")}>
            Participation Matrix
          </button>
        </div>

        {/* Groups tab */}
        {tab === "groups" && (
          <>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search wallets by name or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className={styles.filterSelect} value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}>
                <option value="all">All Types</option>
                <option value="hot">Hot Wallet</option>
                <option value="cold">Cold Wallet</option>
                <option value="cex">CEX</option>
                <option value="burner">Burner</option>
              </select>
            </div>

            <div className={styles.groupsList}>
              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <Wallet size={40} className={styles.emptyIcon} />
                  <p>No wallets found. Create your first main wallet.</p>
                </div>
              ) : (
                filtered.map((main) => (
                  <WalletGroup
                    key={main.id}
                    main={main}
                    allSubWallets={allSubWallets}
                    onEditMain={(m) => setFormState({ open: true, mode: "edit-main", main: m })}
                    onDeleteMain={handleDeleteMain}
                    onAddSub={(mainId) => setFormState({ open: true, mode: "create-sub", mainId })}
                    onEditSub={(sub, mainId) => setFormState({ open: true, mode: "edit-sub", sub, mainId })}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* Matrix tab */}
        {tab === "matrix" && (
          <div className={styles.matrixSection}>
            <h2 className={styles.matrixTitle}>Participation Matrix</h2>
            <div className={styles.matrix}>
              <div className={styles.matrixHeader}>
                <div className={styles.matrixHeaderCell}>Project</div>
                {matrixWallets.map((w) => (
                  <div key={w.id} className={styles.matrixHeaderCell}>{w.name}</div>
                ))}
              </div>
              {mockProjects.slice(0, 8).map((project) => (
                <div key={project.id} className={styles.matrixRow}>
                  <div className={styles.matrixProjectName}>{project.name}</div>
                  {matrixWallets.map((wallet) => {
                    const participated = project.tasks.some((t) => t.walletId === wallet.id && t.completed);
                    return (
                      <div key={wallet.id} className={styles.matrixCell}>
                        {participated
                          ? <CheckCircle2 className={styles.checkIcon} />
                          : <Circle className={styles.emptyIcon} />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form drawer */}
      {formState.open && (
        <WalletForm
          key={formState.mode + (formState.mode === "edit-main" ? formState.main.id : formState.mode === "edit-sub" ? formState.sub.id : "")}
          mode={formState.mode}
          editingMain={formState.mode === "edit-main" ? formState.main : undefined}
          editingSub={formState.mode === "edit-sub" ? formState.sub : undefined}
          parentMainId={
            formState.mode === "create-sub"
              ? formState.mainId
              : formState.mode === "edit-sub"
              ? formState.mainId
              : undefined
          }
          onSaveMain={handleSaveMain}
          onSaveSub={handleSaveSub}
          onImportSubs={handleImportSubs}
          onClose={() => setFormState({ open: false })}
        />
      )}
    </main>
  );
}
