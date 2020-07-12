var airvantage = require('../model/airvantage');
const { response } = require('express');

exports.user = {};

exports.user.get = function(req, resp){
   // resp.render("profile");
    if(req.session.token){
        airvantage.getUser({access_token:req.session.token})(function(err, res){
            if (err) {
                console.log("ERR with body: " + err);
                resp.redirect('/signin');
            } else {
                resp.render("profile" ,{user_info : res})
            }
        })
    } else {
        resp.send("Unauthorised")
    }
}

