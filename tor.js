/*
    http://en.engdraft.com/implement-nodejs-with-tor-to-change-ip-address/
    https://whoer.net/ru    проверка
*/
const TOR = require('tor-request')
    , mime_picture = 'image/'
    , mime_font = 'application/font-'
    , mime_css = 'text/css'
    , mime_js = 'text/javascript'
    , mime_html = 'text/html';
let counter = 0;

TOR.TorControlPort.password = 'mypassword';
//TOR.setTorAddress ( ipaddress , port ) ;



module.exports = function (origin_req, options, origin_res) {
    console.log(`<<<<<<<<<<<<<<<==ИДЁТ ЗАПРОС:   ${origin_req.url}`);
    TOR.renewTorSession(function (e, msg) {
        if (msg) {
            TOR.torRequest(origin_req.url, options, function (error, res, body) {
                if (!error) {
                    //
                    //
                    //                        
                    if (origin_req.url.lastIndexOf('.css') !== -1) {
                        //console.log(`proxyReqHandler CSS  ${origin_req.url}  mime  ${mime_css}`);
                        setCustomHeadersForStaticFiles(origin_res, mime_css);
                    } else if (origin_req.url.lastIndexOf('.js') !== -1) {
                        //console.log(`proxyReqHandler JS  ${origin_req.url} mime  ${mime_js}`);
                        setCustomHeadersForStaticFiles(origin_res, mime_js);
                    } else if (/.jpg|.png|.gif|.svg/.exec(origin_req.url)) {
                        let pictureMimeKind = origin_req.url.substring(origin_req.url.lastIndexOf('.') + 1);
                        if (pictureMimeKind == 'jpg') pictureMimeKind = 'jpeg';
                        //console.log(`proxyReqHandler PICTURE  ${origin_req.url}  mime:   ${mime_picture + pictureMimeKind}`);
                        setCustomHeadersForStaticFiles(origin_res, mime_picture + pictureMimeKind);
                    } else if (/.ttf|.woff/.exec(origin_req.url)) {
                        let fontMimeKind = origin_req.url.substring(origin_req.url.lastIndexOf('.') + 1);
                        //console.log(`proxyReqHandler FONT  ${origin_req.url}  mime:   ${mime_font + fontMimeKind}`);
                        setCustomHeadersForStaticFiles(origin_res, mime_font + fontMimeKind);
                    } else {
                        //console.log(`proxyReqHandler HTML  ${origin_req.url}  mime  ${mime_html}`);
                        setCustomHeadersForStaticFiles(origin_res, mime_html);
                    }                    
                    //
                    //
                    origin_res.write(body);
                    origin_res.end();
                    counter++
                    //console.log(`()=>   Сервер ответил на  <<${counter}>>  запросов!`);
                    //
                    //
                    //
                } else {
                    console.log('TOR.torRequest ON.ERROR: ', error);
                    origin_res.end();
                }
            });
        } else {
            console.log("ERROR renewTorSession: ", e);
            return;
        }
    });
};
//
//
// utils:
//
//
function setCustomHeadersForStaticFiles(responseObject, mimeType) {
    responseObject.writeHead(200, {
        'Connection': 'Keep-Alive;charset=utf-8',
        'Content-Type': mimeType,
        'Content-Language': 'en-US',
        'Transfer-Encoding': 'chunked',
    });
}