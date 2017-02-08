/*
http://en.engdraft.com/implement-nodejs-with-tor-to-change-ip-address/
*/
const TOR = require('tor-request');
TOR.TorControlPort.password = 'mypassword';
//TOR.setTorAddress ( ipaddress , port ) ;
module.exports = function (uri, options, origin_res) {
    TOR.renewTorSession(function (err, msg) {
        if (msg) {
            //                   
            TOR.torRequest(uri/*,options*/).pipe(origin_res);
            /*TOR.torRequest(
                uri,
                options,
                function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        //
                        // 
                        //               
                        origin_res.end(body);                
                        //
                        //
                        //
                    } else {
                        console.log("ERROR torRequest: ", err);
                    }
                });*/
            //
        } else {
            console.log("ERROR renewTorSession: ", err);
        }
    });
};