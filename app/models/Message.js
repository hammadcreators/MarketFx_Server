const mongoose = require('mongoose');
let {Schema} = mongoose;

let messageSchema = new Schema({
   SenderId: Schema.Types.ObjectId,
    Text: {
       type: String,
        required: [true, "Message is required"]
    },
    SentDate: Date,
    SenderType: {
       type: String,
        enum: ["User", "CustomerSupport"],
        required: [true, "Sender is required"]
    }
});

module.exports = mongoose.model("Message", messageSchema);
