/*
http://en.engdraft.com/implement-nodejs-with-tor-to-change-ip-address/
*/
const TOR = require('tor-request');
TOR.TorControlPort.password = 'mypassword';
//TOR.setTorAddress ( ipaddress , port ) ;
TOR.renewTorSession(function (err, msg) {
    if (msg) {
        //
        TOR.torRequest('https://api.ipify.org', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                console.log("Your public (through Tor) IP is: " + body);
            } else {
                console.log("ERROR torRequest: ", err);
            }
        });
        //
    } else {
        console.log("ERROR renewTorSession: ", err);
    }
});