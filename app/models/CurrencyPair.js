const mongoose = require('mongoose');
let {Schema} = mongoose;

let currencyPair = new Schema({
    Currency1: {
        type: String,
        required: [true, "First Currency is required in the pair"]
    },
    Currency2: {
        type: String,
        required: [true, "Second Currency is required in the pair"]
    }
});

module.exports = mongoose.model("CurrencyPair", currencyPair);
