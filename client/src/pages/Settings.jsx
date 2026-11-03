import { Moon, Sun, Download, RefreshCw } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { exportTasksToCsv } from "../utils/taskUtils.js";
import { API_URL } from "../services/api.js";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { tasks, loadTasks, notify } = useTasks();

  const handleRefresh = async () => {
    await loadTasks();
    notify("success", "Tasks refreshed from the database");
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Appearance and data options." />

      <section className="card settings-card">
        <h2>Appearance</h2>
        <p className="muted">
          Choose how the app looks. Your choice is remembered on this device.
        </p>
        <div
          className="segmented segmented-wide"
          role="radiogroup"
          aria-label="Theme"
        >
          <button
            type="button"
            role="radio"
            aria-checked={theme === "light"}
            className={`segment${theme === "light" ? " active" : ""}`}
            onClick={() => setTheme("light")}
          >
            <Sun size={16} aria-hidden="true" /> Light
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={theme === "dark"}
            className={`segment${theme === "dark" ? " active" : ""}`}
            onClick={() => setTheme("dark")}
          >
            <Moon size={16} aria-hidden="true" /> Dark
          </button>
        </div>
      </section>

      <section className="card settings-card">
        <h2>Data</h2>
        <p className="muted">
          Download all {tasks.length} saved tasks as a spreadsheet-friendly CSV
          file, or reload them from the database.
        </p>
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportTasksToCsv(tasks)}
            disabled={tasks.length === 0}
          >
            <Download size={18} aria-hidden="true" /> Export all tasks (CSV)
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
          >
            <RefreshCw size={18} aria-hidden="true" /> Refresh from database
          </button>
        </div>
      </section>

      <section className="card settings-card">
        <h2>About</h2>
        <p className="muted">
          School Task Manager - React, Express and MongoDB.
        </p>
        <p className="small">
          API endpoint: <code>{API_URL}</code>
        </p>
      </section>
    </>
  );
}
