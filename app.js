var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var express = require('express');
var cookieParser = require("cookie-parser");
var session = require('express-session');
var bodyParser = require('body-parser');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: Date.now() + 3600 }}));
app.use(bodyParser.urlencoded({ extended: false }))

var auth   = require('./controllers/auth');
var users   = require('./controllers/users');
app.get('/',function(req, res){
    if(req.session.token) return res.render("index");
    return res.send("There is no token found");
})
app.get('/signin', auth.signin.get);
app.post('/signin', auth.signin.post);
app.get('/signout', auth.signout);

app.get('/register', auth.register.get);
app.post('/register', auth.register.post);

app.get("/profile", users.user.get)
var server = http.createServer(app).listen(8080,()=>console.log("server running"));