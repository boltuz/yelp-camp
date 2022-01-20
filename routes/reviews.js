const express = require('express');
const router = express.Router({ mergeParams: true }); //mergeParams will make the Campground ID query available

//Async Error Handler function & custom Error App
const catchAsync = require('../utilities/catchAsync');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

//Basic CRUD functionality blueprint. REST compliant
// Index route -> GET /campgrounds - list all campgrounds
// New route -> GET /campgrounds/new - Form to create a new campground.
// Create route -> POST / campgrounds - create a new campground on the server
// Show route -> GET /campgrounds/:id - Get one campground
// Edit route -> GET /campgrounds/:id/edit - form to edit a spicific campground
// Update route -> PATCH /campgrounds/:id - update campground on the server
// Destroy route -> DELETE /campgrounds/:id - Destroy campground on server

//Reviews Controllers
const reviews = require('../controllers/reviews');

//New Review
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

//Delete Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;