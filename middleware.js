
const Campground = require('./models/campground');
const Review = require('./models/review');

//Object schema Joi validation parameters
const { campgroundSchema, reviewSchema } = require('./schemas');

//Custom express error
const ExpressError = require('./utilities/expressError');


//validating if user ir signed in with Passport method
module.exports.isLoggedIn = function(req, res, next){
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    } else next();
}

//Joi module pacakge helps validate server side requests
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        console.log(error.details);
        throw new ExpressError(msg, 400);
    } else next();
}

//middleware to check if the current session user has permission to edit or delete a campground.
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //verify if the current session user is the owner of the campground
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    } else next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    //verify if the current session user is the owner of the campground
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    } else next();
}
    
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(element => element.message).join(',');
        console.log(error.details);
        throw new ExpressError(msg, 400);
    } else next();
}
    