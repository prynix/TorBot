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
            origin_res.writeHead(200, {
                'Content-Type': 'text/html',
                'Date': 'Sun, 19 Feb 2017 08:13: 53 GMT',
                'Last-Modified': new Date(),
                'Server': 'nginx',
                'Transfer-Encoding': 'chunked',
                'X-Frame-Options': 'SAMEORIGIN',
                'X-XSS-Protection': '1; mode=block'
            });
            //origin_res.setHeader('Content-Type', 'text/plain');
            //origin_res.setHeader('Transfer-Encoding', 'chunked');
            //           
            TOR.torRequest(uri, options).pipe(origin_res).on('error', function (err) {
                console.log(' TOR.torRequest ERROR:', err);
            });
            //  
        } else {
            console.log("ERROR renewTorSession: ", err);
            return;
        }
    })
};