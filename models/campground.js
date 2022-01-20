const { application } = require('express');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

async function connectMongoDB() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

connectMongoDB()
    .then(console.log('Connected to mongoDB'))
    .catch(err => console.log(err));

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (deletedCampground) {
    if(deletedCampground){
        await Review.deleteMany({
            _id: {$in: deletedCampground.reviews} //Delete every REVIEW with an _id in the reviews array of the deleted campground
        })
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;