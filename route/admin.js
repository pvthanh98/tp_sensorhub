const express = require("express");
const route = express.Router();

var auth   = require('../controllers/auth');
var users   = require('../controllers/users');
var device   = require('../controllers/device');

route.get('/', (req,res) => res.render("index"))
route.get('/profile', users.user.get)

route.get('/devices', device.get);
route.get('/devices/del/:id', device.delete);
route.get('/devices/edit/:id', device.edit.get);
route.post('/devices/edit', device.edit.post);

 
module.exports = route;
