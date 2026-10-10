// Understanding the Express server:
// - require('express') loads the Express library.
// - express() creates your application.
// - app.get('/') registers a route for HTTP GET requests to '/'.
// - req represents the incoming request.
// - res lets your server send a response.
// - app.listen() starts the server listening on port 5000.

const express = require("express");

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("School Task Manager API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
