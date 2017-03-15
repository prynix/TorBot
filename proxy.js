var http = require('http')
  , https = require('https')
  , fs = require('fs')

  , torReq = require('./tor')
  , S = require('./devlibs/settings.json')
  , REF = require('./devlibs/referer.js')
  , UA_storage = require('./devlibs/UA_storage.js')
  , custom_cookie = require('./devlibs/cookie.js').google
  , startRandomRefererWashingPoint = REF.static[getRandomInt(0, REF.static.length - 1)]
  //, PRETENDER_cookie = custom_cookie[getRandomInt(0, custom_cookie.length - 1)]

  , PRETENDER_headers = {
    //"Cookie": custom_cookie,
    //'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    //"Accept-Encoding": "gzip, deflate, sdch, br",
    //'Upgrade-Insecure-Requests': '1',
    'Accept-Language': 'en-US,en;q=0.9',
    //'Connection': 'keep-alive',
    "Cache-Control": "no-cache",
    "Host": startRandomRefererWashingPoint,
    "Origin": startRandomRefererWashingPoint,
    //"Pragma": "no - cache",
    'Referer': startRandomRefererWashingPoint,
    'X-Forwarded-For': startRandomRefererWashingPoint,
    "User-Agent": generateNewUserAgent()
  }

  , httpsServerSettings = {
    key: fs.readFileSync('certificates/server-key.pem'),
    cert: fs.readFileSync('certificates/server-crt.pem'),
    ca: fs.readFileSync('certificates/ca-crt.pem'),
    crl: fs.readFileSync('certificates/ca-crl.pem')
  };


/*
sudo nano /etc/environment

export http_proxy="http://127.0.0.1:3000/"
export https_proxy="https://127.0.0.1:4000/"
*/

// casperjs --ssl-protocol=any --ignore-ssl-errors=true traffic-bot.js
// phantomjs --ssl-protocol=any --ignore-ssl-errors=true bot.js



//
// HTTP -- PROXY:
//
var SERVER_http = http.createServer(onRequest).listen(3000, function () {
  console.info('(1)===> -HTTP__TOR__PROXY-===');
})
  .on('request', function (request, response) {
    let options = {
      headers: PRETENDER_headers,
      method: request.method
    };
    torReq(request, options, response);
  });
//
// HTTPS -- PROXY:
//
var SERVER_httpS = https.createServer(httpsServerSettings, onRequest).listen(4000, function () {
  console.info('(2)===> -HTTPS__TOR__PROXY-===');
})
  .on('request', function (request, response) {
    console.log(`SERVER_httpS.on('request', function (request, response)`);
    let options = {
      headers: PRETENDER_headers,
      method: request.method
    };
    torReq(request, options, response);
  });
//
// utils:
//
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function generateNewUserAgent() {
  return UA_storage[getRandomInt(0, UA_storage.length - 1)];
}
function onRequest(client_req, client_res) { }