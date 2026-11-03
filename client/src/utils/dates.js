// Due dates are stored as calendar dates (UTC midnight). We compare "YYYY-MM-DD" keys
// so a task due today never flips to overdue because of the viewer's time zone.
export const todayKey = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

export const dueKey = (task) =>
  task.dueDate ? task.dueDate.slice(0, 10) : null;

export const dayDiff = (key) => {
  const [y1, m1, d1] = key.split("-").map(Number);
  const [y2, m2, d2] = todayKey().split("-").map(Number);
  return Math.round(
    (Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86400000,
  );
};

export const isOverdue = (task) => {
  const key = dueKey(task);
  return !task.completed && key !== null && key < todayKey();
};

export const formatDueDate = (task) => {
  const key = dueKey(task);
  if (!key) return "No due date";
  return new Date(`${key}T00:00:00.000Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const dueLabel = (task) => {
  const key = dueKey(task);
  if (!key) return "No due date";
  const diff = dayDiff(key);
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  if (diff === -1) return "Due yesterday";
  if (diff < 0) return `${Math.abs(diff)} days overdue`;
  if (diff < 7) return `Due in ${diff} days`;
  return formatDueDate(task);
};

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
