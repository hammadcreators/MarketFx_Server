const mongoose = require('mongoose');
let {Schema} = mongoose;

let complaintSchema = new Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    Text: {
        type: String,
        required: true
    },
    SubmissionDate: Date,
    Reply: String,
    IsReplied: String,
    ReplyDate: Date,
    CustomerSupportId: {
        type: Schema.Types.ObjectId,
        ref: "CustomerSupport"
    }
});

module.exports = mongoose.model("Complaint", complaintSchema);
