var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var express = require('express');
var cookieParser = require("cookie-parser");
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: Date.now() + 3600 }}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash());
var auth   = require('./controllers/auth');
var users   = require('./controllers/users');
var device   = require('./controllers/device');

app.get('/signin', auth.signin.get);
app.post('/signin', auth.signin.post);
app.get('/signout', auth.signout);

app.get('/register' ,auth.register.get);
app.post('/register', auth.register.post);

const routeAdmin = require('./route/admin');

app.use('/admin', auth.check, routeAdmin); 

var server = http.createServer(app).listen(8080,()=>console.log("server running"));