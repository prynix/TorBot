var http = require('http')
  , torReq = require('./tor')
  , S = require('./settings.json')
  , REF = require('./referer.js')
  , UA_storage = require('./UA_storage.js')
  , custom_cookie = require('./cookie.js').google
  , startRandomRefererWashingPoint = REF.static[getRandomInt(0, REF.static.length - 1)]
  //, PRETENDER_cookie = custom_cookie[getRandomInt(0, custom_cookie.length - 1)]
  , PRETENDER_headers = {
    //"Cookie": custom_cookie,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    //"Accept-Encoding": "gzip, deflate, sdch, br",
    //'Upgrade-Insecure-Requests': '1',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    "Cache-Control": "no-cache",
    "Host": startRandomRefererWashingPoint,
    "Origin": startRandomRefererWashingPoint,
    "Pragma": "no - cache",
    'Referer': startRandomRefererWashingPoint,
    'X-Forwarded-For': 'http://google.com/',
    "User-Agent": generateNewUserAgent()
  }

http.createServer(onRequest).listen(3000, function () {
  console.info('===-PHANTOMJS__TOR__PROXY-===');
});

function onRequest(client_req, client_res) {
  var options = {
    headers: PRETENDER_headers,
    method: client_req.method
  };
  torReq(client_req.url, options, client_res)
}




function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function generateNewUserAgent() {
  return UA_storage[getRandomInt(0, UA_storage.length - 1)];
}