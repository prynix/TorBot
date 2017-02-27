/*
http://en.engdraft.com/implement-nodejs-with-tor-to-change-ip-address/
*/
let counter = 0;
const TOR = require('tor-request');
TOR.TorControlPort.password = 'mypassword';
//TOR.setTorAddress ( ipaddress , port ) ;
module.exports = function (uri, options, origin_res) {
    TOR.renewTorSession(function (e, msg) {
        if (msg) {
            //    
            //origin_res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
            //           
            TOR.torRequest(uri, options, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    counter++;
                    console.log("Send responses: ", counter);
                } else {
                    console.log('TOR.torRequest ON.ERROR-0: ', error);
                }
            })
                //
                // EVENT LISTENERS:
                //
                .on('error', function (err) {
                    console.log('TOR.torRequest ON.ERROR: ', err);
                })
                .on('request', function (request) {
                    //console.log('TOR.torRequest ON.REQUEST: ', request);
                    proxyReqHandler(options, request, origin_res);
                })
                .on('data', function (data) {
                    // decompressed data as it is received
                    //console.log('TOR.torRequest ON.DATA:: ' + data);
                    //origin_res.write(data);
                })
                .on('response', function (response) {
                    //console.log('TOR.torRequest ON.RESPONSE::: ', response);
                    console.log(response.headers);
                    response.on('data', function (data) {
                        // compressed data as it is received
                        //console.log('received ' + data.length + ' bytes of compressed data')
                    });
                })
                .on('end', function () {
                    console.log('TOR.torRequest ON.END!!!');
                    origin_res.end();
                });
            //
            //
            //  
        } else {
            console.log("ERROR renewTorSession: ", e);
            return;
        }
    })
};



function proxyReqHandler(options, request, response) {
    let mime_css = 'text/css'
        , mime_js = 'text/javascript'
        , mime_html = 'text/html';
    if (request.path.lastIndexOf('.css') !== -1) {
        console.log(`proxyReqHandler CSS  ${request._headers.host + request.path}`);
        response.writeHead(200, {
            'Connection': 'Keep-Alive;charset=utf-8',
            'Content-Type': mime_css,
            'Content-Language': 'en-US',
            //'Date': 'Sun, 19 Feb 2017 08:13: 53 GMT',
            //'Last-Modified': new Date(),
            //'Server': 'nginx',
            'Transfer-Encoding': 'chunked',
            //'X-Frame-Options': 'SAMEORIGIN',
            //'X-XSS-Protection': '1; mode=block'
        });
        TOR.torRequest.get(request._headers.host + request.path, options).pipe(response);
    } else if (request.path.lastIndexOf('.js') !== -1) {
        console.log(`proxyReqHandler JS  ${request._headers.host + request.path}`);
        response.writeHead(200, {
            'Connection': 'Keep-Alive;charset=utf-8',
            'Content-Type': mime_js,
            'Content-Language': 'en-US',
            //'Date': 'Sun, 19 Feb 2017 08:13: 53 GMT',
            //'Last-Modified': new Date(),
            //'Server': 'nginx',
            'Transfer-Encoding': 'chunked',
            //'X-Frame-Options': 'SAMEORIGIN',
            //'X-XSS-Protection': '1; mode=block'
        });
        TOR.torRequest.get(request._headers.host + request.path, options).pipe(response);
    } else {
        console.log(`proxyReqHandler HTML  ${request._headers.host + request.path}`);
        response.writeHead(200, {
            'Connection': 'Keep-Alive;charset=utf-8',
            'Content-Type': mime_html,
            'Content-Language': 'en-US',
            //'Date': 'Sun, 19 Feb 2017 08:13: 53 GMT',
            //'Last-Modified': new Date(),
            //'Server': 'nginx',
            'Transfer-Encoding': 'chunked',
            //'X-Frame-Options': 'SAMEORIGIN',
            //'X-XSS-Protection': '1; mode=block'
        });
        TOR.torRequest.get(request._headers.host + request.path, options).pipe(response);
    }
}