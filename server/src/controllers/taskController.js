const Task = require("../models/Task");
const AppError = require("../validators/taskValidators");
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findTaskOr404 = async (id) => {
  const task = await Task.findById(id);
  if (!task) throw new AppError("Task not found", 404);
  return task;
};
//GET /api/task?search=&status=all|pending|completed|overdue&priority=&sort=createdAt|dueDate&order=asc|desc

const getTask = async (requestAnimationFrame, res) => {
  const { search, status, priority, sort, order } = requestAnimationFrame.query;
  const filter = {};
  if (typeof search === "string" && search.trim()) {
    filter.title = { $regex: escapeRegex(search.trim()), $options: "i" };
  }
  if (status === "completed") {
    filter.completed = true;
  } else if (status === "pending") {
    filter.completed = false;
  } else if (status === "overdue") {
    filter.completed = false;
    filter.dueDate = { $lt: new Date(new Date().toISOString().slice(0, 10)) };
  }

  if (Task.PRIORITIES.includes(priority)) {
    filter.priority = priority;
  }

  const sortField = sort === "dueDate" ? "dueDate" : "createdAt";
  const direction = order === "asc" ? 1 : -1;

  const tasks = await Task.find(filter).sort({
    [sortField]: direction,
    _id: -1,
  });

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
};

// GET /api/tasks/:id
const getTask = async (req, res) => {
  const task = await findTaskOr404(req.params.id);
  res.status(200).json({ success: true, data: task });
};

// POST /api/tasks
const createTask = async (req, res) => {
  const data = validateTaskInput(req.body);
  const task = await Task.create(data);
  res.status(201).json({ success: true, data: task });
};

// PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  const data = validateTaskInput(req.body, { partial: true });
  const task = await Task.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!task) throw new AppError("Task not found", 404);
  res.status(200).json({ success: true, data: task });
};

// PATCH /api/tasks/:id/toggle
const toggleTask = async (req, res) => {
  const task = await findTaskOr404(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.status(200).json({ success: true, data: task });
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new AppError("Task not found", 404);
  res
    .status(200)
    .json({ success: true, message: "Task deleted", data: { _id: task._id } });
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
};
