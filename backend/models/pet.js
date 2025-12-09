// Load required packages
var mongoose = require('mongoose');

// Define our pet schema
var PetSchema = new mongoose.Schema({
    shelterId: {type: String, required: true},
    name: {type: String, required: true},
    breed: {type: [String], required: true},
    age: {type: Number, required: true},
    gender: {type: String, required: true},
    size: {type: String, required: true},
    location: {type: String, required: true},
    thumbnail: {type: String, required: true},
    photos: [{type: String}],
    profile: {
        summary: {type: String, required: true},
        personalityTraits: [{type: String}],
        routine: {type: String},
        goodWithChildren: {type: Boolean, required: true},
        goodWithDogs: {type: Boolean, required: true},
        goodWithCats: {type: Boolean, required: true}
    },
    availability: {type: String, required: true, enum: ['available', 'pending', 'adopted']},
    datePosted: {type: Date, required: true, default: Date.now}
});

// Export the Mongoose model
module.exports = mongoose.model('Pet', PetSchema);

