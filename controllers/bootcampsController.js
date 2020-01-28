const ErrorResponse = require("./../utils/errorResponse");
const asyncHandler = require('./../middleware/async');
const Bootcamp = require("./../models/Bootcamp");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  console.log("Bibesh");
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}.`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}.`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}.`,
        404
      )
    );
  }

  res.status(204).json({
    success: true,
    data: null
  });
});
