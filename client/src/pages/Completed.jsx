import { PartyPopper } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import TaskCard from "../components/TaskCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useTasks } from "../context/TaskContext.jsx";

export default function Completed() {
  const { tasks, loading, error, loadTasks } = useTasks();

  if (loading)
    return (
      <>
        <PageHeader title="Completed" />
        <LoadingState />
      </>
    );
  if (error)
    return (
      <>
        <PageHeader title="Completed" />
        <ErrorState message={error} onRetry={loadTasks} />
      </>
    );

  const done = tasks
    .filter((task) => task.completed)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <>
      <PageHeader
        title="Completed"
        subtitle={
          done.length
            ? `${done.length} finished ${done.length === 1 ? "task" : "tasks"}, most recent first.`
            : "Your finished work appears here."
        }
      />
      {done.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={PartyPopper}
            title="No completed tasks yet"
            message="Tick a task as done and it will move here."
          />
        </div>
      ) : (
        <div className="task-list">
          {done.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </>
  );
}
