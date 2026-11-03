import { Search, X } from "lucide-react";

export default function TaskToolbar({ filters, onChange }) {
  const set = (key) => (event) =>
    onChange({ ...filters, [key]: event.target.value });

  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={18} aria-hidden="true" />
        <label htmlFor="task-search" className="sr-only">
          Search tasks by title
        </label>
        <input
          id="task-search"
          type="search"
          placeholder="Search tasks by title"
          value={filters.search}
          onChange={set("search")}
        />
        {filters.search && (
          <button
            type="button"
            className="icon-btn icon-btn-sm"
            onClick={() => onChange({ ...filters, search: "" })}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="select-field">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={set("status")}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="select-field">
        <label htmlFor="filter-priority">Priority</label>
        <select
          id="filter-priority"
          value={filters.priority}
          onChange={set("priority")}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="select-field">
        <label htmlFor="filter-sort">Sort by</label>
        <select id="filter-sort" value={filters.sort} onChange={set("sort")}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="dueAsc">Deadline: soonest</option>
          <option value="dueDesc">Deadline: latest</option>
        </select>
      </div>
    </div>
  );
}
