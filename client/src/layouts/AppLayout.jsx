import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  CalendarClock,
  CheckCircle2,
  Settings as SettingsIcon,
  GraduationCap,
  Menu,
  X,
  Moon,
  Sun,
  Plus,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { getStats } from "../utils/taskUtils.js";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "All Tasks", icon: ListChecks },
  { to: "/upcoming", label: "Upcoming", icon: CalendarClock },
  { to: "/completed", label: "Completed", icon: CheckCircle2 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { tasks } = useTasks();
  const location = useLocation();
  const stats = getStats(tasks);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {open && (
        <div
          className="scrim"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar${open ? " open" : ""}`} aria-label="Primary">
        <div className="sidebar-head">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <span>TaskManager</span>
          </Link>
          <button
            type="button"
            className="icon-btn drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
              {to === "/tasks" && stats.pending > 0 && (
                <span className="nav-count">{stats.pending}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <p className="muted small">
            {stats.completed} of {stats.total} tasks done
          </p>
          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${stats.progress}%` }} />
          </div>
        </div>
      </aside>

      <div className="main-col">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={22} />
          </button>
          <span className="topbar-title">School Task Manager</span>
          <div className="topbar-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/tasks/new" className="btn btn-primary">
              <Plus size={18} aria-hidden="true" />
              <span className="btn-text">New task</span>
            </Link>
          </div>
        </header>

        <main id="main" className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
