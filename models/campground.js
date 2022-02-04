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

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
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
}, opts );

//Virtual used to create a link on each of the campgrounds in the cluster map.
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
})

CampgroundSchema.post('findOneAndDelete', async function (deletedCampground) {
    if (deletedCampground) {
        await Review.deleteMany({
            _id: { $in: deletedCampground.reviews } //Delete every REVIEW with an _id in the reviews array of the deleted campground
        })
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;