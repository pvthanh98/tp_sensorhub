var airvantage = require('../model/airvantage');

exports.signin = {};

exports.signin.get = function(req, res){
    res.render("signin");
}

exports.signin.post = function(req, resp){
    var options = {
        "email": req.body.email,
        "password": req.body.password,
    }

    airvantage.token_query(options)(function (err, res) {
        if (err) {
            console.log("ERR with body: " + err);
            resp.redirect('/signin');
        } else {
            // on success, refresh access token and continue to the requested page
            req.session.token = res.token;
            //req.session.access_token = res.access_token;
            // req.session.refresh_token = res.refresh_token;
            // req.session.expires_at = new Date().getTime() + res.expires_in * 1000;
            if (req.session.originalUrl)
                resp.redirect(req.session.originalUrl);
            else
                resp.redirect('/');
        }
    });
}


exports.register = {};

exports.register.get = function(req, res){
    res.render("register");
}

exports.register.post = function(req, ressp){
    var options = {
        "email": req.body.email,
        "name" : req.body.name,
        "password": req.body.password,
    }

    airvantage.register(options)(function(err, res){
        if(err){
            console.log("ERR with body: " + err);
        } else {
            console.log("Register successfully");
            ressp.send("Register successfully");
        }
    });
}


exports.signout = function(req, res){
    req.session.token= null;
    res.redirect("/signin");
}