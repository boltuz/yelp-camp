//mongoose model
const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    //location const is used in the navbar partials to set active class on navlinks
    const location = req.url;
    res.render('users/register', { location })
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, error => { //req.login is a passport method that does NOT support await
            if (error) return next(error)
            else {
                req.flash('success', 'Welcome to Yelp Camp');
                res.redirect('/campgrounds');
            }
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    //location const is used in the navbar partials to set active class on navlinks
    const location = req.url;
    res.render('users/login', { location })
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}