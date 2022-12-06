const express = require('express');
let router = express.Router();

const UserModel = require('../models/User');
const WatchlistModel = require('../models/Watchlist');
const CurrencyPairModel = require('../models/CurrencyPair');

router.post("/create/:uid", async (req, res) => {
   let user =  await UserModel.findOne({_id: req.params.uid});
   if(user == null){
       res.writeHead(404, "User does not exists");
       res.end();
       return;
   }

   if(await WatchlistModel.findOne({UserId: req.params.uid}) != null){
       res.writeHead(200, "Watchlist Already Exists");
       res.end();
       return;
   }

   await WatchlistModel.create({UserId: req.params.uid});
   res.writeHead(200, "Watchlist Added Successfully");
   res.end();
});

router.post("/add/:id/:cid", async (req, res) => {
    let watchlist = await WatchlistModel.findOne({_id: req.params.id});
    if(watchlist == null){
        res.writeHead(404, "Watchlist not found");
        res.end();
        return;
    }
    let currencyPair = await CurrencyPairModel.findOne({_id: req.params.cid});
    if(currencyPair == null){
        res.writeHead(404, "Currency pair not found");
        res.end();
        return;
    }
    watchlist.CurrencyPairs.push(req.params.cid);
    watchlist.save();
    res.writeHead(200, "Currency pair added to the watchlist");
    res.end();
});

router.delete("/remove/:id/:cid", async (req, res) => {
    let watchlist = await WatchlistModel.findOne({_id: req.params.id});
    if(watchlist == null){
        res.writeHead(404, "Watchlist not found");
        res.end();
        return;
    }
    let currencyPair = await CurrencyPairModel.findOne({_id: req.params.cid});
    if(currencyPair == null){
        res.writeHead(404, "Currency pair not found");
        res.end();
        return;
    }
    watchlist.CurrencyPairs.pop(req.params.cid);
    watchlist.save();
    res.writeHead(200, "Currency pair removed from the watchlist");
    res.end();
});

router.get("/:id", async (req, res) => {
    let watchlist = await WatchlistModel.findOne({UserId: req.params.id}).populate("CurrencyPairs");
    if(watchlist == null){
        res.writeHead(404, "Watchlist not found");
        res.end();
        return;
    }
    res.writeHead(200);
    res.write(JSON.stringify(watchlist));
    res.end();
});

router.post("/currencypair", async (req, res) => {
    try{
        await CurrencyPairModel.create(req.body);
        res.writeHead(200);
        res.write("Currency Pair Added Successfully");
        res.end();
    }
    catch(err){
        res.writeHead(400);
        res.write(JSON.stringify(err.message));
        res.end();
    }
});

router.delete("/currencypair/:id", async (req, res) => {
   try{
       await CurrencyPairModel.deleteOne({_id: req.params.id});
       res.writeHead(200, "Deleted Successfully");
       res.end();
   }
   catch (err){
       res.writeHead(400, "Delete Failed");
       res.end();
   }
});

module.exports = router;
