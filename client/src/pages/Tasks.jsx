import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Download, ClipboardList, SearchX } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import TaskToolbar from "../components/TaskToolbar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { filterAndSort, exportTasksToCsv } from "../utils/taskUtils.js";

const DEFAULT_FILTERS = {
  search: "",
  status: "all",
  priority: "all",
  sort: "newest",
};

export default function Tasks() {
  const { tasks, loading, error, loadTasks } = useTasks();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const visible = useMemo(
    () => filterAndSort(tasks, filters),
    [tasks, filters],
  );

  return (
    <>
      <PageHeader
        title="All Tasks"
        subtitle="Search, filter and manage every task."
        actions={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => exportTasksToCsv(visible)}
              disabled={visible.length === 0}
            >
              <Download size={18} aria-hidden="true" />{" "}
              <span className="btn-text">Export CSV</span>
            </button>
            <Link to="/tasks/new" className="btn btn-primary">
              <Plus size={18} aria-hidden="true" /> New task
            </Link>
          </>
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={loadTasks} />
      ) : tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ClipboardList}
            title="No tasks yet"
            message="Create your first task to start organizing your schoolwork."
            action={
              <Link to="/tasks/new" className="btn btn-primary">
                <Plus size={18} aria-hidden="true" /> Create task
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <TaskToolbar filters={filters} onChange={setFilters} />
          <p className="result-count" aria-live="polite">
            Showing {visible.length} of {tasks.length}{" "}
            {tasks.length === 1 ? "task" : "tasks"}
          </p>
          {visible.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={SearchX}
                title="No matching tasks"
                message="Try a different search or clear the filters."
                action={
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                  >
                    Clear filters
                  </button>
                }
              />
            </div>
          ) : (
            <div className="task-list">
              {visible.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
