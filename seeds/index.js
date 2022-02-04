//mongoose setup
const mongoose = require('mongoose');
async function connectMongoDB() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

const axios = require('axios');

const path = require('path');

connectMongoDB()
    .then(console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

//mongoose model
const Campground = require(path.join(__dirname, '../models/campground'));
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

//this funcion will request a random image url from the unsplash API
getUnsplashImgURL = async () => {
    try {
        console.log('Axios is fetching an image URL');
        const unsplashObject = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'oQxa5kajFE37-i7AX75Zb0DNrK8HzHhYPL3PzpPtk-E',
                collections: 1114848
            },
        });
        return unsplashObject.data.urls.small;
    } catch (err) {
        console.error(err)
    }
}

//sample() will throw a random element of any given array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

//seedDB() will:
//1- delete all of mongoDB campgrounds collection contents
//2- create 50 new isntances of campground and store them in the now empty mongoDB
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61e5f2b32cfec1adf5ad4ab2',
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            geometry: { 
                type: "Point", 
                coordinates: [
                    cities[random1000].longitude, 
                    cities[random1000].latitude
                ] 
            },
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt saepe voluptatum iure, molestias, pariatur explicabo fugit reprehenderit nostrum voluptas repudiandae blanditiis. Incidunt, architecto provident quod itaque rem voluptas corrupti adipisci?',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmlopez5505501/image/upload/v1643606709/YelpCamp/lmuljtojiy9qcfmxjdri.jpg',
                    filename: 'YelpCamp/lmuljtojiy9qcfmxjdri'
                },
                {
                    url: 'https://res.cloudinary.com/dmlopez5505501/image/upload/v1643606709/YelpCamp/mc5vq5krhfobweidj3nw.jpg',
                    filename: 'YelpCamp/mc5vq5krhfobweidj3nw'
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => { mongoose.connection.close() });