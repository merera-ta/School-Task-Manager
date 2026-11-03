import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Pencil,
  Trash2,
  CalendarDays,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import PriorityBadge from "./PriorityBadge.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { dueLabel, isOverdue } from "../utils/dates.js";

export default function TaskCard({ task }) {
  const { toggleTask, deleteTask } = useTasks();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const overdue = isOverdue(task);

  const handleDelete = async () => {
    setBusy(true);
    await deleteTask(task._id);
    setBusy(false);
    setConfirming(false);
  };

  return (
    <article
      className={`task-card${task.completed ? " is-done" : ""}${overdue ? " is-overdue" : ""}`}
    >
      <button
        type="button"
        className={`check-btn${task.completed ? " checked" : ""}`}
        onClick={() => toggleTask(task._id)}
        aria-pressed={task.completed}
        aria-label={
          task.completed
            ? `Mark "${task.title}" as pending`
            : `Mark "${task.title}" as completed`
        }
      >
        {task.completed && (
          <Check size={16} strokeWidth={3} aria-hidden="true" />
        )}
      </button>

      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <PriorityBadge priority={task.priority} />
          {task.subject && (
            <span className="chip">
              <BookOpen size={13} aria-hidden="true" /> {task.subject}
            </span>
          )}
          <span className={`chip${overdue ? " chip-danger" : ""}`}>
            {overdue ? (
              <AlertCircle size={13} aria-hidden="true" />
            ) : (
              <CalendarDays size={13} aria-hidden="true" />
            )}
            {task.completed && task.dueDate
              ? dueLabelCompleted(task)
              : dueLabel(task)}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <Link
          to={`/tasks/${task._id}/edit`}
          className="icon-btn"
          aria-label={`Edit "${task.title}"`}
          title="Edit"
        >
          <Pencil size={18} />
        </Link>
        <button
          type="button"
          className="icon-btn icon-btn-danger"
          onClick={() => setConfirming(true)}
          aria-label={`Delete "${task.title}"`}
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${task.title}" will be permanently removed. This cannot be undone.`}
          busy={busy}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </article>
  );
}

function dueLabelCompleted(task) {
  return `Due ${new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" })}`;
}
