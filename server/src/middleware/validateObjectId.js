const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new AppError("Invalid task id", 400));
  }
  next();
};

module.exports = validateObjectId;
