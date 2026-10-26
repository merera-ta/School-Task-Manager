const AppError = require("../utils/AppError");

const PRIORITIES = ["low", "medium", "high"];
const ALLOWED_FIELDS = [
  "title",
  "description",
  "subject",
  "priority",
  "dueDate",
  "completed",
];

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Returns a clean object containing only valid task fields.
// create: title is required. update (partial): only provided fields are checked.
const validateTaskInput = (body, { partial = false } = {}) => {
  if (!isPlainObject(body)) {
    throw new AppError("Request body must be a JSON object", 400);
  }

  const errors = [];
  const data = {};
  const has = (field) => Object.prototype.hasOwnProperty.call(body, field);

  if (has("title") || !partial) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      errors.push({
        field: "title",
        message: "A valid task title is required",
      });
    } else if (body.title.trim().length > 120) {
      errors.push({
        field: "title",
        message: "Title cannot exceed 120 characters",
      });
    } else {
      data.title = body.title.trim();
    }
  }

  const textFields = [
    ["description", 1000],
    ["subject", 60],
  ];

  for (const [field, max] of textFields) {
    if (!has(field)) continue;
    const value = body[field];
    if (value === null || value === undefined) {
      data[field] = "";
    } else if (typeof value !== "string") {
      errors.push({ field, message: `${field} must be text` });
    } else if (value.trim().length > max) {
      errors.push({
        field,
        message: `${field} cannot exceed ${max} characters`,
      });
    } else {
      data[field] = value.trim();
    }
  }

  if (has("priority")) {
    if (!PRIORITIES.includes(body.priority)) {
      errors.push({
        field: "priority",
        message: "Priority must be low, medium or high",
      });
    } else {
      data.priority = body.priority;
    }
  }

  if (has("dueDate")) {
    const value = body.dueDate;
    if (value === null || value === "") {
      data.dueDate = null;
    } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      // Store the calendar date only (UTC midnight) so it never shifts between time zones.
      const parsed = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
      if (Number.isNaN(parsed.getTime())) {
        errors.push({
          field: "dueDate",
          message: "Due date is not a valid date",
        });
      } else {
        data.dueDate = parsed;
      }
    } else {
      errors.push({
        field: "dueDate",
        message: "Due date must look like YYYY-MM-DD",
      });
    }
  }

  if (has("completed")) {
    if (typeof body.completed !== "boolean") {
      errors.push({
        field: "completed",
        message: "completed must be true or false",
      });
    } else {
      data.completed = body.completed;
    }
  }

  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  if (partial && Object.keys(data).length === 0) {
    throw new AppError(
      `Provide at least one field to update: ${ALLOWED_FIELDS.join(", ")}`,
      400,
    );
  }

  return data;
};

module.exports = { validateTaskInput };
