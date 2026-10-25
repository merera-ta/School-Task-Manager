const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.send("School Task Manager API is running!");
});

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const database = states[mongoose.connection.readyState] || "unknown";
  const healthy = database === "connected";

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? "ok" : "degraded",
    database,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.send("School Task Manager API is running!");
});

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const database = states[mongoose.connection.readyState] || "unknown";
  const healthy = database === "connected";

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? "ok" : "degraded",
    database,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;