const express = require('express');
const router = express.Router();

//Async Error Handler function & custom Error App
const catchAsync = require('../utilities/catchAsync');

//middleware that validates if a user is logged in + authorization
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//Multer NPM package for parsing form-files
const multer = require('multer');
//cloudinary storage spec
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//Basic CRUD functionality blueprint. REST compliant
// Index route -> GET /campgrounds - list all campgrounds
// New route -> GET /campgrounds/new - Form to create a new campground.
// Create route -> POST / campgrounds - create a new campground on the server
// Show route -> GET /campgrounds/:id - Get one campground
// Edit route -> GET /campgrounds/:id/edit - form to edit a spicific campground
// Update route -> PATCH /campgrounds/:id - update campground on the server
// Destroy route -> DELETE /campgrounds/:id - Destroy campground on server

//Campgrounds routes controllers import
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.index)) //index route
    .post(isLoggedIn,  upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

//New Route
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) //show route
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) //edit route
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); //delete route

//Edit Route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;