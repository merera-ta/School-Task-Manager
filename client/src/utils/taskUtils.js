import { dueKey, isOverdue, todayKey } from "./dates.js";

export function getStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(isOverdue).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, overdue, progress };
}

const byDueDate = (a, b) => dueKey(a).localeCompare(dueKey(b));

export function getUpcoming(tasks, limit) {
  const today = todayKey();
  const list = tasks
    .filter((t) => !t.completed && dueKey(t) && dueKey(t) >= today)
    .sort(byDueDate);
  return limit ? list.slice(0, limit) : list;
}

export function getRecent(tasks, limit = 5) {
  return [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

export function filterAndSort(tasks, { search, status, priority, sort }) {
  const term = search.trim().toLowerCase();

  const list = tasks.filter((task) => {
    if (term && !task.title.toLowerCase().includes(term)) return false;
    if (priority !== "all" && task.priority !== priority) return false;
    if (status === "pending") return !task.completed;
    if (status === "completed") return task.completed;
    if (status === "overdue") return isOverdue(task);
    return true;
  });

  const created = (t) => new Date(t.createdAt).getTime();

  list.sort((a, b) => {
    if (sort === "oldest") return created(a) - created(b);
    if (sort === "dueAsc" || sort === "dueDesc") {
      const ka = dueKey(a);
      const kb = dueKey(b);
      if (!ka && !kb) return created(b) - created(a);
      if (!ka) return 1;
      if (!kb) return -1;
      return sort === "dueAsc" ? ka.localeCompare(kb) : kb.localeCompare(ka);
    }
    return created(b) - created(a);
  });

  return list;
}

export function groupUpcoming(tasks) {
  const groups = [
    { id: "overdue", label: "Overdue", tasks: [] },
    { id: "today", label: "Today", tasks: [] },
    { id: "tomorrow", label: "Tomorrow", tasks: [] },
    { id: "week", label: "Next 7 days", tasks: [] },
    { id: "later", label: "Later", tasks: [] },
    { id: "none", label: "No due date", tasks: [] },
  ];
  const pick = (id) => groups.find((g) => g.id === id).tasks;
  const today = todayKey();

  for (const task of tasks.filter((t) => !t.completed)) {
    const key = dueKey(task);
    if (!key) pick("none").push(task);
    else if (key < today) pick("overdue").push(task);
    else {
      const diff = Math.round(
        (new Date(`${key}T00:00:00Z`) - new Date(`${today}T00:00:00Z`)) /
          86400000,
      );
      if (diff === 0) pick("today").push(task);
      else if (diff === 1) pick("tomorrow").push(task);
      else if (diff <= 7) pick("week").push(task);
      else pick("later").push(task);
    }
  }

  for (const group of groups) {
    if (group.id !== "none") group.tasks.sort(byDueDate);
  }
  return groups.filter((g) => g.tasks.length > 0);
}

const csvCell = (value) => {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

export function exportTasksToCsv(tasks) {
  const header = [
    "Title",
    "Description",
    "Subject",
    "Priority",
    "Due date",
    "Status",
    "Created",
  ];
  const rows = tasks.map((t) => [
    t.title,
    t.description,
    t.subject,
    t.priority,
    dueKey(t) || "",
    t.completed ? "Completed" : "Pending",
    t.createdAt.slice(0, 10),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `school-tasks-${todayKey()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
