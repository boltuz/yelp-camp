const mongoose = require('mongoose');
const { Schema } = mongoose;

//Passport tool will help with client authenthication
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//This will add on a username key and a field for password to userSchema.
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;