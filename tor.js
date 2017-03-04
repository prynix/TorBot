/*
http://en.engdraft.com/implement-nodejs-with-tor-to-change-ip-address/
*/
/*
 https://whoer.net/ru    проверка
*/
let counter = 0
const TOR = require('tor-request')
    , mime_picture = 'image/'
    , mime_css = 'text/css'
    , mime_js = 'text/javascript'
    , mime_html = 'text/html';
TOR.TorControlPort.password = 'mypassword';
//TOR.setTorAddress ( ipaddress , port ) ;



module.exports = function (origin_req, options, origin_res) {
    console.log(`<<<<<<<<<<<<<<<==ИДЁТ ЗАПРОС:   ${origin_req.url}`);
    TOR.renewTorSession(function (e, msg) {
        if (msg) {
            //    
            //origin_res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
            //          
            TOR.torRequest(origin_req.url, options, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    //
                    //
                    //
                    if (origin_req.url.lastIndexOf('.css') !== -1) {
                        console.log(`proxyReqHandler CSS  ${origin_req.url}  mime  ${mime_css}`);
                        origin_res.writeHead(200, {
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
                    } else if (origin_req.url.lastIndexOf('.js') !== -1) {
                        console.log(`proxyReqHandler JS  ${origin_req.url} mime  ${mime_js}`);
                        origin_res.writeHead(200, {
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
                    } else if (/.jpg|.png|.gif/.exec(origin_req.url)) {
                        let pictureMimeKind = origin_req.url.substring(origin_req.url.lastIndexOf('.') + 1);
                        if (pictureMimeKind == 'jpg') pictureMimeKind = 'jpeg';
                        console.log(`proxyReqHandler PICTURE  ${origin_req.url}  mime:   ${mime_picture + pictureMimeKind}`);
                        origin_res.writeHead(200, {
                            'Connection': 'Keep-Alive;charset=utf-8',
                            'Content-Type': mime_picture + pictureMimeKind,
                            'Content-Language': 'en-US',
                            //'Date': 'Sun, 19 Feb 2017 08:13: 53 GMT',
                            //'Last-Modified': new Date(),
                            //'Server': 'nginx',
                            'Transfer-Encoding': 'chunked',
                            //'X-Frame-Options': 'SAMEORIGIN',
                            //'X-XSS-Protection': '1; mode=block'
                        });
                    } else {
                        console.log(`proxyReqHandler HTML  ${origin_req.url}  mime  ${mime_html}`);
                        origin_res.writeHead(200, {
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
                    }
                    //
                    //
                    //
                    origin_res.write(body);
                    origin_res.end();
                    counter++
                    console.log(`()=>   Сервер ответил на  <<${counter}>>  запросов!`);
                    //
                    //
                    //
                } else {
                    console.log('TOR.torRequest ON.ERROR-0: ', error);
                    origin_res.end();
                }
            });
        } else {
            console.log("ERROR renewTorSession: ", e);
            return;
        }
    });
};