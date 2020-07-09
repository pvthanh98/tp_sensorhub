var host = "sensorhub.tech";
var authurl = "/api/";
const https = require("https");

var query_get_ctor = function (host, base, url) {
    return function (accesstoken) {
        return function (callback) {
            // define url option
            var options = {
                host: host,
                path: base + url,
                method: "GET",
                headers: {
                    'content-type': 'application/json', 
                    authorization: 'Bearer ' + accesstoken
                }
            };
            console.log("GET options: ",options)
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
    return function (params, content) {
        return function (callback) {
           

            const data = JSON.stringify(params);

            const options = {
                hostname: host,
                port: 443,
                path: base+url,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": data.length,
                },
            };

            

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