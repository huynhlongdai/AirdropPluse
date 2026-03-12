import { NavLink, Outlet } from "react-router";
import {
  Home,
  Inbox,
  FolderOpen,
  Wallet,
  CalendarDays,
  Users,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { ColorSchemeToggle } from "~/components/ui/color-scheme-toggle/color-scheme-toggle";
import { useStore } from "~/hooks/use-store";
import { useState } from "react";
import styles from "./app-layout.module.css";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", icon: Home, end: true },
      { to: "/inbox", label: "Inbox", icon: Inbox, end: false, badgeKey: "inbox" as const },
    ],
  },
  {
    label: "Management",
    items: [
      { to: "/projects", label: "Projects", icon: FolderOpen, end: false },
      { to: "/wallets", label: "Wallets", icon: Wallet, end: false },
      { to: "/tasks", label: "Tasks", icon: CalendarDays, end: false },
      { to: "/identities", label: "Identities", icon: Users, end: false },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/settings", label: "Settings", icon: Settings, end: false },
    ],
  },
];

export default function AppLayout() {
  const { inboxItems } = useStore();
  const [collapsed, setCollapsed] = useState(false);

  const pendingCount = inboxItems.filter((item) => item.status === "review").length;

  const getBadge = (key?: "inbox") => {
    if (key === "inbox") return pendingCount;
    return 0;
  };

  return (
    <div className={`${styles.layout} ${collapsed ? styles.layoutCollapsed : ""}`}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Zap className={styles.brandZap} />
          </div>
          {!collapsed && (
            <div className={styles.brandText}>
              <div className={styles.brandName}>AirdropPulse</div>
              <div className={styles.brandTagline}>Crypto Intelligence</div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className={styles.collapseBtnIcon} />
          ) : (
            <ChevronLeft className={styles.collapseBtnIcon} />
          )}
        </button>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className={styles.navGroup}>
              {!collapsed && (
                <span className={styles.navGroupLabel}>{group.label}</span>
              )}
              {group.items.map(({ to, label, icon: Icon, end, badgeKey }) => {
                const badge = getBadge(badgeKey);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
                    }
                    title={collapsed ? label : undefined}
                  >
                    <span className={styles.navIconWrap}>
                      <Icon className={styles.navIcon} />
                      {badge > 0 && collapsed && (
                        <span className={styles.navDot} />
                      )}
                    </span>
                    {!collapsed && (
                      <>
                        <span className={styles.navLabel}>{label}</span>
                        {badge > 0 && (
                          <span className={styles.navBadge}>
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          {!collapsed && (
            <div className={styles.footerNotif}>
              <Bell className={styles.footerNotifIcon} />
              <span className={styles.footerNotifLabel}>Notifications</span>
            </div>
          )}
          <ColorSchemeToggle />
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
