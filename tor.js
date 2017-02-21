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
            //origin_res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
            //           
            TOR.torRequest(uri, options, function (err, res, body) {
                if (!err && res.statusCode == 200) {
                    //
                    origin_res.writeHead(200, {
                        'Connection': 'Keep-Alive;charset=utf-8',
                        'Content-Type': 'text/HTML',
                        'Content-Language': 'en-US',
                        //'Date': 'Sun, 19 Feb 2017 08:13: 53 GMT',
                        //'Last-Modified': new Date(),
                        //'Server': 'nginx',
                        'Transfer-Encoding': 'chunked',
                        //'X-Frame-Options': 'SAMEORIGIN',
                        //'X-XSS-Protection': '1; mode=block'
                    });
                    //
                    console.log("ORIGIN RESPONSE", body.length);
                    //res.pipe(origin_res)
                    origin_res.write(body);
                    origin_res.end();
                }
            });
            //  
        } else {
            console.log("ERROR renewTorSession: ", err);
            return;
        }
    })
};


