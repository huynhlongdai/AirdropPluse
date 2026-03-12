import { NavLink, Outlet } from "react-router";
import {
  Home,
  Inbox,
  FolderOpen,
  Wallet,
  CalendarDays,
  Users,
  Settings,
} from "lucide-react";
import { ColorSchemeToggle } from "~/components/ui/color-scheme-toggle/color-scheme-toggle";
import { useStore } from "~/hooks/use-store";
import styles from "./app-layout.module.css";

export default function AppLayout() {
  const { inboxItems } = useStore();
  const pendingCount = inboxItems.filter((item) => item.status === "review").length;

  const NAV_ITEMS = [
    { to: "/", label: "Home", icon: Home, end: true, badge: 0 },
    { to: "/inbox", label: "Inbox", icon: Inbox, end: false, badge: pendingCount },
    { to: "/projects", label: "Projects", icon: FolderOpen, end: false, badge: 0 },
    { to: "/wallets", label: "Wallets", icon: Wallet, end: false, badge: 0 },
    { to: "/tasks", label: "Tasks", icon: CalendarDays, end: false, badge: 0 },
    { to: "/identities", label: "Identities", icon: Users, end: false, badge: 0 },
    { to: "/settings", label: "Settings", icon: Settings, end: false, badge: 0 },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandName}>AirdropPulse</div>
          <div className={styles.brandTagline}>Crypto Airdrop Intelligence</div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
              }
            >
              <Icon className={styles.navIcon} />
              <span className={styles.navLabel}>{label}</span>
              {badge > 0 && (
                <span className={styles.navBadge}>{badge > 99 ? "99+" : badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.footerLabel}>Theme</span>
          <ColorSchemeToggle />
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
