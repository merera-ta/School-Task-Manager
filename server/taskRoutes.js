const express = require("express");
const controller = require("../controllers/taskController");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.route("/").get(controller.getTasks).post(controller.createTask);

router.patch("/:id/toggle", validateObjectId, controller.toggleTask);

router
  .route("/:id")
  .get(validateObjectId, controller.getTask)
  .patch(validateObjectId, controller.updateTask)
  .delete(validateObjectId, controller.deleteTask);

module.exports = router;
