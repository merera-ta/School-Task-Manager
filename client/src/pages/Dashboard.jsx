import { Link } from "react-router-dom";
import {
  ListChecks,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  CalendarClock,
  Sparkles,
  BellRing,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import PriorityBadge from "../components/PriorityBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { getStats, getUpcoming, getRecent } from "../utils/taskUtils.js";
import { dueLabel, isOverdue, dueKey, todayKey } from "../utils/dates.js";

function MiniTask({ task }) {
  return (
    <li>
      <Link to={`/tasks/${task._id}/edit`} className="mini-task">
        <span className="mini-main">
          <span className="mini-title">{task.title}</span>
          <span className={`mini-sub${isOverdue(task) ? " text-danger" : ""}`}>
            {task.subject ? `${task.subject} · ` : ""}
            {dueLabel(task)}
          </span>
        </span>
        <PriorityBadge priority={task.priority} />
      </Link>
    </li>
  );
}

export default function Dashboard() {
  const { tasks, loading, error, loadTasks } = useTasks();

  if (loading) return <LoadingState label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={loadTasks} />;

  const stats = getStats(tasks);
  const upcoming = getUpcoming(tasks, 5);
  const recent = getRecent(tasks, 5);
  const dueToday = tasks.filter(
    (t) => !t.completed && dueKey(t) === todayKey(),
  ).length;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your academic workload at a glance."
        actions={
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={18} aria-hidden="true" /> New task
          </Link>
        }
      />

      {tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Sparkles}
            title="Welcome! Add your first task"
            message="Track assignments, projects and exams in one place. Your dashboard fills in as you add tasks."
            action={
              <Link to="/tasks/new" className="btn btn-primary">
                <Plus size={18} aria-hidden="true" /> Create task
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {(stats.overdue > 0 || dueToday > 0) && (
            <div className="banner" role="status">
              <BellRing size={20} aria-hidden="true" />
              <p>
                {stats.overdue > 0 && <strong>{stats.overdue} overdue</strong>}
                {stats.overdue > 0 && dueToday > 0 && " and "}
                {dueToday > 0 && <strong>{dueToday} due today</strong>}.{" "}
                <Link to="/upcoming">Review deadlines</Link>
              </p>
            </div>
          )}

          <section className="stat-grid" aria-label="Task statistics">
            <StatCard
              icon={ListChecks}
              label="Total tasks"
              value={stats.total}
              tone="primary"
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={stats.completed}
              tone="success"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={stats.pending}
              tone="warning"
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue"
              value={stats.overdue}
              tone="danger"
            />
          </section>

          <div className="dash-grid">
            <section className="card progress-card">
              <h2>Completion progress</h2>
              <ProgressRing percent={stats.progress} />
              <p className="muted">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Upcoming deadlines</h2>
                <Link to="/upcoming" className="link-sm">
                  View all
                </Link>
              </div>
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No upcoming deadlines"
                  message="Pending tasks with a due date will show here."
                />
              ) : (
                <ul className="mini-list">
                  {upcoming.map((task) => (
                    <MiniTask key={task._id} task={task} />
                  ))}
                </ul>
              )}
            </section>

            <section className="card dash-wide">
              <div className="card-head">
                <h2>Recently added</h2>
                <Link to="/tasks" className="link-sm">
                  All tasks
                </Link>
              </div>
              <ul className="mini-list">
                {recent.map((task) => (
                  <MiniTask key={task._id} task={task} />
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </>
  );
}
