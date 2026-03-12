import { NavLink, Outlet } from "react-router";
import {
  Home,
  Inbox,
  FolderOpen,
  Wallet,
  CalendarDays,
  Users,
} from "lucide-react";
import { ColorSchemeToggle } from "~/components/ui/color-scheme-toggle/color-scheme-toggle";
import styles from "./app-layout.module.css";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/inbox", label: "Inbox", icon: Inbox, end: false },
  { to: "/projects", label: "Projects", icon: FolderOpen, end: false },
  { to: "/wallets", label: "Wallets", icon: Wallet, end: false },
  { to: "/tasks", label: "Tasks", icon: CalendarDays, end: false },
  { to: "/identities", label: "Identities", icon: Users, end: false },
];

export default function AppLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandName}>AirdropPulse</div>
          <div className={styles.brandTagline}>Crypto Airdrop Intelligence</div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
              }
            >
              <Icon className={styles.navIcon} />
              {label}
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
