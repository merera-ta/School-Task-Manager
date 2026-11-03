import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useTasks } from "../context/TaskContext.jsx";
import { taskApi } from "../services/api.js";

const EMPTY_FORM = {
  title: "",
  description: "",
  subject: "",
  priority: "medium",
  dueDate: "",
  completed: false,
};

const toForm = (task) => ({
  title: task.title,
  description: task.description || "",
  subject: task.subject || "",
  priority: task.priority,
  dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
  completed: task.completed,
});

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Please enter a task title.";
  else if (form.title.trim().length > 120)
    errors.title = "Title must be 120 characters or fewer.";
  if (form.description.trim().length > 1000)
    errors.description = "Description must be 1000 characters or fewer.";
  if (form.subject.trim().length > 60)
    errors.subject = "Subject must be 60 characters or fewer.";
  return errors;
}

export default function TaskFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { tasks, loading, createTask, updateTask } = useTasks();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [ready, setReady] = useState(!editing);
  const filled = useRef(false);

  const existing = editing ? tasks.find((task) => task._id === id) : null;
  const subjects = [
    ...new Set(tasks.map((task) => task.subject).filter(Boolean)),
  ];

  useEffect(() => {
    if (!editing || filled.current) return;

    if (existing) {
      filled.current = true;
      setForm(toForm(existing));
      setReady(true);
      return;
    }

    if (loading) return;

    filled.current = true;
    taskApi
      .get(id)
      .then((response) => {
        setForm(toForm(response.data));
        setReady(true);
      })
      .catch((err) =>
        setLoadError(
          err.status === 404 ? "This task no longer exists." : err.message,
        ),
      );
  }, [editing, existing, loading, id]);

  const setField = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field])
      setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      subject: form.subject.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
    };

    setSaving(true);
    try {
      if (editing)
        await updateTask(id, { ...payload, completed: form.completed });
      else await createTask(payload);
      navigate("/tasks");
    } catch (err) {
      if (err.errors?.length) {
        setErrors(
          Object.fromEntries(
            err.errors.map((item) => [item.field, item.message]),
          ),
        );
      }
      setFormError(err.message);
      setSaving(false);
    }
  };

  const title = editing ? "Edit task" : "New task";

  if (loadError) {
    return (
      <>
        <PageHeader title={title} />
        <ErrorState message={loadError} />
        <p className="center-text">
          <Link to="/tasks" className="btn btn-secondary">
            Back to tasks
          </Link>
        </p>
      </>
    );
  }

  if (!ready)
    return (
      <>
        <PageHeader title={title} />
        <LoadingState label="Loading task..." />
      </>
    );

  return (
    <>
      <PageHeader
        title={title}
        subtitle={
          editing
            ? "Update the details of this task."
            : "Add an assignment, project, exam or deadline."
        }
        actions={
          <Link to="/tasks" className="btn btn-secondary">
            <ArrowLeft size={18} aria-hidden="true" /> Back
          </Link>
        }
      />

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="form-alert" role="alert">
            {formError}
          </div>
        )}

        <div className="field">
          <label htmlFor="field-title">
            Title <span className="req">*</span>
          </label>
          <input
            id="field-title"
            type="text"
            value={form.title}
            onChange={setField("title")}
            placeholder="e.g. Database systems assignment 2"
            maxLength={130}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "err-title" : undefined}
            autoFocus
          />
          {errors.title && (
            <p id="err-title" className="field-error">
              {errors.title}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="field-description">Description</label>
          <textarea
            id="field-description"
            rows={4}
            value={form.description}
            onChange={setField("description")}
            placeholder="Notes, requirements or links (optional)"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "err-description" : undefined
            }
          />
          <p className="field-hint">{form.description.length}/1000</p>
          {errors.description && (
            <p id="err-description" className="field-error">
              {errors.description}
            </p>
          )}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="field-subject">Subject</label>
            <input
              id="field-subject"
              type="text"
              list="subject-options"
              value={form.subject}
              onChange={setField("subject")}
              placeholder="e.g. Software Engineering"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "err-subject" : undefined}
            />
            <datalist id="subject-options">
              {subjects.map((subject) => (
                <option key={subject} value={subject} />
              ))}
            </datalist>
            {errors.subject && (
              <p id="err-subject" className="field-error">
                {errors.subject}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="field-dueDate">Due date</label>
            <input
              id="field-dueDate"
              type="date"
              value={form.dueDate}
              onChange={setField("dueDate")}
            />
            {errors.dueDate && <p className="field-error">{errors.dueDate}</p>}
          </div>
        </div>

        <fieldset className="field">
          <legend>Priority</legend>
          <div className="segmented">
            {["low", "medium", "high"].map((level) => (
              <label
                key={level}
                className={`segment segment-${level}${form.priority === level ? " active" : ""}`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={level}
                  checked={form.priority === level}
                  onChange={setField("priority")}
                />
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>

        {editing && (
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={setField("completed")}
            />
            Mark this task as completed
          </label>
        )}

        <div className="form-actions">
          <Link to="/tasks" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={18} aria-hidden="true" />{" "}
            {saving ? "Saving..." : editing ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </>
  );
}
