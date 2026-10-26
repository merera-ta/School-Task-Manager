const mongoose = require("mongoose");

const PRIORITIES = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    subject: {
      type: String,
      trim: true,
      default: "",
      maxlength: [60, "Subject cannot exceed 60 characters"],
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITIES,
        message: "Priority must be low, medium or high",
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
module.exports.PRIORITIES = PRIORITIES;
