const express = require('express');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

const customerSupportModel = require('../models/CustomerSupport');
const chatModel = require('../models/Chat');
const messageModel = require('../models/Message');
const ComplaintModel = require('../models/Complaint');

// Login the customer support
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const customerSupport = await customerSupportModel.findOne({ email });
        // If user is not found
        if (!customerSupport) return res.status(401).json({ message: "User not found" });

        // If the user is found compare the passwords
        const match = await bcrypt.compare(password, customerSupport.password);

        // If the password didn't match
        if (!match) return res.status(401).json({ message: "Password mismatch" });
        const token = jwt.sign({ CustomerSupport: customerSupport }, SECRET_KEY);
        // If the password matched
        return res
            .status(200)
            .json({ message: "Login Successful", info: customerSupport, token: token });
    } catch (ex) {
        res.status(400).json({ message: ex.message });
    }
});

router.post("/reply/:cid/:chatId", async (req, res) => {
   if(await customerSupportModel.findOne({_id: req.params.cid}) == null){
       res.writeHead(404, "Customer Support Account does not exists");
       res.end();
   }
   let chat = await chatModel.findOne({_id: req.params.chatId});
    if(chat == null){
        res.writeHead(404);
        res.write("Chat not found");
        res.end();
    }
    req.body["SenderId"] = req.params.cid;
    req.body["SenderType"] = "CustomerSupport";
    req.body["SentDate"] = Date.now();
    let message = await messageModel.create(req.body);
    chat.MessageIds.push(message);
    chat.save();
    res.writeHead(200, "Chat replied successfully");
    res.end();
});


router.put("/reply-complaint/:csid/:cid", async (req, res) => {

    let customerSupport = await customerSupportModel.findOne({_id: req.params.csid});

    if(customerSupport == null){
        res.writeHead(404, "Customer Support not found");
        res.end();
        return;
    }
    let complaint = await ComplaintModel.findOne({_id: req.params.cid});
    if(complaint == null){
        res.writeHead(404, "Complaint not found");
        res.end();
        return;
    }

    if(complaint.IsReplied){
        res.writeHead(200);
        res.write("Complaint has already been replied");
        res.end();
        return;
    }

    await ComplaintModel.updateOne({_id: req.params.cid}, {$set: {Reply: req.body.reply, IsReplied: true, ReplyDate: Date.now(), CustomerSupportId: req.params.csid}});
    res.writeHead(200, "Complaint has been replied successfully");
    res.end();
});

module.exports = router;
