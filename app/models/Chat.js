const mongoose = require('mongoose');
let {Schema} = mongoose;

let chatSchema = new Schema({
    UserId: {
       type: Schema.Types.ObjectId,
       required: [true, "User Id is required"],
       ref: "User"
    },
    MessageIds: {
        type: [{type: Schema.Types.ObjectId, ref: "Message"}]
    },
    IsOpen: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model("Chat", chatSchema);
