if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log(process.env.CLOUDINARY_CLOUD_NAME)
console.log(process.env.CLOUDINARY_KEY)
console.log(process.env.CLOUDINARY_SECRET)

//express library setup
const express = require('express');
const app = express();
const port = 3000;

//expresss form handling
app.use(express.urlencoded({ extended: true }));

//Method override HTML to use PATCH, PUT, DELETE form methods
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//required node.js libraries
const path = require('path');

//Serve Public Directories for scripts and css
app.use(express.static(path.join(__dirname, 'public')));

//ejs templating configuration
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Express Session configuration
const session = require('express-session');
const sessionConfig = {
    secret: 'secretCode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //added security
        expires: Date.now() + 10000 * 60 * 60 * 24 * 7, // Expire from current date + 7 weeks
        maxAge: 10000 * 60 * 60 * 24 * 7 //7 weeks
    }
}
app.use(session(sessionConfig));

const flash = require('connect-flash');
app.use(flash());

//mongoose setup
const mongoose = require('mongoose');
async function connectMongoDB() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp')
}

connectMongoDB();

//mongoose models
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');

//Async Error Handler function & custom Error App
const ExpressError = require('./utilities/expressError');

//passport client authenthication setup
const passport = require('passport');
const localStrategy = require('passport-local');
app.use(passport.initialize());
app.use(passport.session()); //will mantain persistent login sessions throughout browsing requests
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //Passport's way to serialize a user. Store a user in the session
passport.deserializeUser(User.deserializeUser()); //Passport's way to get a user out of that session

//MIDDLEWARE
app.use((req, res, next) => {
    //req.user (Current logged in user information) will be available in ALL EJS templates
    res.locals.currentUser = req.user;
    //success will be available on ALL EJS templates automatically where success flash is called
    res.locals.success = req.flash('success');
    //error will be available on ALL EJS templates automatically where error flash is called
    res.locals.error = req.flash('error');
    next();
})

//ROUTERS
//campgrounds routers
const campgroundsRoutes = require('./routes/campgrounds');
app.use('/campgrounds', campgroundsRoutes);
//reviews routers
const reviewsRoutes = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviewsRoutes);
//User Authenthication routers
const usersRoutes = require('./routes/users');
const catchAsync = require('./utilities/catchAsync');
app.use('/', usersRoutes);

//Error Handlers
//if no other Route Handler runs, the code will hit this code where '*' means for ALL routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const location = req.url;
    const { statusCode = 500, message = 'Oh No!, Something Went Wrong!' } = err;
    // if (!err.message) err.message = 'Oh No!, Something Went Wrong!';
    res.status(statusCode).render('error', { message, location, err })
})

//port connection
app.listen(port, () => console.log('Connected on port 3000'));