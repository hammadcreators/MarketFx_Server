const mongoose = require('mongoose');
let {Schema} = mongoose;

let watchlistSchema = new Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    CurrencyPairs: {
        type: [{type: Schema.Types.ObjectId, ref: "CurrencyPair"}]
    }
});

module.exports = mongoose.model("Watchlist", watchlistSchema);
