const path = require("path");
const ErrorResponse = require("./../utils/errorResponse");
const asyncHandler = require("./../middleware/async");
const geocoder = require("./../utils/geocoder");
const Bootcamp = require("./../models/Bootcamp");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
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
  //Add user to req.body
  req.body.user = req.user.id;
 
  //Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !=='admin') {
    return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400)); 
  }
 
  const bootcamp = await Bootcamp.create(req.body);



  res.status(201).json({
    success: true,
    data: bootcamp
  });
});
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}.`,
        404
      )
    );
  }

//Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !=='admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp.`,
        401
      ));
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}.`,
        404
      )
    );
  }
//Make sure user is bootcamp owner
if (bootcamp.user.toString() !== req.user.id && req.user.role !=='admin') {
  return next(
    new ErrorResponse(
      `User ${req.params.id} is not authorized to delete this bootcamp.`,
      401
    ));
}

  bootcamp.remove();

  res.status(204).json({
    success: true,
    data: null
  });
});

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get latitude and longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //calc radius using radians
  //divide dist by radius of earth
  //earth radius =3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });
  res.status(200).json({
    success: true,
    data: bootcamps
  });
});

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    );
  }
  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !=='admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to upload the photo.`,
        401
      ));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  //Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  //check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `,
        400
      )
    );
  }
  //Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(
        new ErrorResponse(`There is a problem in the file upload `, 400)
      );
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  });
  res.status(200).json({
    success: true,
    data: file.name
  });
});
