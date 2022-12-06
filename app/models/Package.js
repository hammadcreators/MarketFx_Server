const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
    
    // name price, description duration 

    name: {
        type: String,
        required: [true, "Name is a required field"],
    },

    price: {
        type: Number, 
        required: [true, "Price is a required field"],
    },

    description: {
        type: String,
        required: [true, "Description is a required field"],
    },

    duration: {
        type: Number, 
        required: [true, "Duration is a required field"],
    },

});


const Package = mongoose.model("Package", packageSchema);
module.exports = Package;