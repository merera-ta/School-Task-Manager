import { Link } from "react-router-dom";
import { CalendarCheck, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import TaskCard from "../components/TaskCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { groupUpcoming } from "../utils/taskUtils.js";

export default function Upcoming() {
  const { tasks, loading, error, loadTasks } = useTasks();

  if (loading)
    return (
      <>
        <PageHeader title="Upcoming" />
        <LoadingState />
      </>
    );
  if (error)
    return (
      <>
        <PageHeader title="Upcoming" />
        <ErrorState message={error} onRetry={loadTasks} />
      </>
    );

  const groups = groupUpcoming(tasks);

  return (
    <>
      <PageHeader
        title="Upcoming"
        subtitle="Pending tasks organized by deadline."
      />
      {groups.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CalendarCheck}
            title="Nothing pending"
            message="You're all caught up. Add a task with a due date to plan ahead."
            action={
              <Link to="/tasks/new" className="btn btn-primary">
                <Plus size={18} aria-hidden="true" /> New task
              </Link>
            }
          />
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.id} className="group">
            <h2
              className={`group-title${group.id === "overdue" ? " text-danger" : ""}`}
            >
              {group.label}{" "}
              <span className="group-count">{group.tasks.length}</span>
            </h2>
            <div className="task-list">
              {group.tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
