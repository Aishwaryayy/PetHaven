// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var ShelterUserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
});

// Export the Mongoose model
module.exports = mongoose.model('ShelterUser', ShelterUserSchema);