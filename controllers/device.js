var sensorhub = require("../model/airvantage");
var async = require("async");

exports.get = function(req, resp, next){
    async.parallel({
        devices: async.apply(
            async.waterfall ,[
                sensorhub.devices_query({access_token: req.session.token}),
                function(devices, callback){
                    async.map(devices, function(device, cb){
                        sensorhub.data_query({
                            device_id : device.device_id, 
                            access_token: req.session.token
                        })(
                            (err, device_info)=>{
                            if(err){
                                console.log("ERR with body: " + err);
                            } else {
                                device = device_info[0];
                                cb(err, device);                                        
                            }
                        })
                    }, callback)
                }
            ]
        )
    }, (err, res)=>{
        if(err){
            console.log("ERR: "+ err);
            next(err);
        } else{
            resp.render('devices', {
                // alerts_count : alerts_count,
                devices: res.devices,
                msg:req.flash('msg')
                // active : "systems"
            }); 
        }
    })
}


exports.delete = (req, resp, next) =>{
    var params = {
        device_id : req.params.id,
        access_token: req.session.token,
        method: "DELETE"
    }

    sensorhub.device_delete(params)(function(err, res){
        if(!err) {
            req.flash('msg',"Delete success")
            resp.redirect('/admin/devices');
        }
    })
}

exports.edit = {};

exports.edit.get = (req, res)=>{
    var device_id = req.params.id;
    console.log("flash: ", req.flash('msg'))
    res.render('devices_edit', {device_id: device_id});
}

exports.edit.post = (req, resp)=>{
    var params = {
        device_id : req.body.device_id,
        device_name: req.body.device_name,
        access_token: req.session.token
    }

    sensorhub.device_update(params)(function(err, res){
        if(!err) {
            req.flash('msg',"Update success")
            resp.redirect('/admin/devices');
        }
    })
}