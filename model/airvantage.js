var host = "sensorhub.tech";
var authurl = "/api/";
const https = require("https");
var _ = require("underscore");

var query_get_ctor = function (host, base, url) {
    return function (params) {
        return function (callback) {

            var u = _.reduce(_.pairs(params), function (orgURL, prmt) {
                return orgURL.replace(":" + prmt[0], prmt[1]);
            }, url);

            // define url option
            var options = {
                host: host,
                path: base + u,
                method: "GET",
                headers: {
                    'content-type': 'application/json', 
                    authorization: 'Bearer ' + params.access_token
                }
            };
        
            // execute the request
            https
                .request(options, function (resp) {
                    resp.setEncoding("utf8");
                    var value = "";
                    resp.on("data", function (data) {
                        value = value + data;
                    });
                    resp.on("end", function () {
                        var err = null,
                            res = null;
                        if (resp.statusCode != 200) {
                            err = "Status Code " + resp.statusCode;
                            callback(err, res);
                        } else {
                            try {
                                res = JSON.parse(value);
                            } catch (e) {
                                err = e;
                            }
                            callback(err, res);
                        }
                    });
                })
                .on("error", function (e) {
                    callback(e);
                })
                .end();
        };
    };
};

var query_post_ctor = function (host, base, url) {
    return function (params) {
        return function (callback) {
            var u = _.reduce(_.pairs(params), 
            function (orgURL, prmt) {
                return orgURL.replace(":" + prmt[0], prmt[1]);
            }, url);

            const data = JSON.stringify(params);

            const options = {
                hostname: host,
                port: 443,
                path: base+u,
                method: params.method ? params.method : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": data.length,
                    "Authorization": "Bearer " + params.access_token
                },
            };
            console.log(options)
            
            const req = https.request(options, (res) => {
                var value = "";

                res.on("data", (d) => {
                    value = value + d;
                    //  process.stdout.write(d);
                });
                
                res.on("end", function () {
                    var err = null,
                        resp = null;
                    if (res.statusCode != 200) {
                        err = "Status Code " + res.statusCode;
                        callback(err, resp);
                    } else {
                        try {
                            resp = JSON.parse(value);

                        } catch (e) {
                            err = e;
                        }
                        callback(err, resp);
                    }
                });
            });

            req.on("error", (error) => {
                console.error(error);
            });

            req.write(data);
            req.end(function () { });
        };
    };
};

exports.token_query = query_post_ctor(host, authurl, "login");

exports.register = query_post_ctor(host, authurl, "register");

exports.getUser = query_get_ctor(host,authurl, "me")

exports.devices_query = query_get_ctor(host,authurl, "device");

exports.data_query =  query_get_ctor(host,authurl, "get_device_info/:device_id");

exports.device_delete = query_post_ctor (host,authurl, "provision")

exports.device_update = query_post_ctor (host,authurl, "update_device")