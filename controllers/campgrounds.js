//mongoose model
const Campground = require('../models/campground');

module.exports.index = async (req, res, next) => {
    //location const is used in the navbar partials to set active class on navlinks
    const location = req.url;
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds, location })
}

module.exports.renderNewForm = (req, res) => {
    //location const is used in the navbar partials to set active class on navlinks
    const location = req.url;
    res.render('campgrounds/new', { location })
}

module.exports.createCampground = async (req, res, next) => {
    //req.body.campground becauese all properties are now stored in a campground object from the HTML
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Succesfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res, next) => {
    //location const is used in the navbar partials to set active class on navlinks
    const location = req.url;
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } }) //Populates reviews + their authors
        .populate('author'); //Populates the campground authors
    if (!campground) {
        req.flash('error', `Cannot find that campground!`);
        return res.redirect('/campgrounds');
    } else res.render('campgrounds/show', { campground, location })
}

module.exports.renderEditForm = async (req, res, next) => {
    //location const is used in the navbar partials to set active class on navlinks
    const location = req.url;
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //Validating if campground exists && user has the permissions to edit
    if (!campground) {
        req.flash('error', `Cannot find that campground!`);
        return res.redirect('/campgrounds');
    } else res.render('campgrounds/edit', { campground, location });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Succesfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted Campground!');
    res.redirect('/campgrounds')
}