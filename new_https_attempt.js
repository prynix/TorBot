/*
sudo nano /etc/environment

export http_proxy="http://127.0.0.1:3000/"
export https_proxy="https://127.0.0.1:4000/"
*/

var torReq = require('./tor')

  , S = require('./settings.json')
  , REF = require('./referer.js')
  , UA_storage = require('./UA_storage.js')
  , custom_cookie = require('./cookie.js').google
  , startRandomRefererWashingPoint = REF.static[getRandomInt(0, REF.static.length - 1)]
  //, PRETENDER_cookie = custom_cookie[getRandomInt(0, custom_cookie.length - 1)]
  , PRETENDER_headers = {
    //"Cookie": custom_cookie,   
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
  };  
/*
var net = require('net');
var url = require('url');
//
// HTTP -- PROXY:
//
var SERVER_http = http.createServer(onRequest).listen(3000, function () {
console.info('===-PHANTOMJS__TOR__PROXY-===');
});
SERVER_http.on('request', function (request, response) {
console.log(`SERVER_http.on('request', function (request, response)`)
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
console.info('===-CasperJS__HTTPS-----TOR__PROXY-===');
});
SERVER_httpS.on('request', function (request, response) {
console.log(`SERVER_httpS.on('request', function (request, response)`);
let options = {
  headers: PRETENDER_headers,
  method: request.method
};
torReq(request, options, response);
});
SERVER_httpS.on('connect', function (request, socketRequest, head) {
console.log(`on.connect`, request.url);
var ph = url.parse('http://' + request.url)
var socket = net.connect(ph.port, ph.hostname, function () {
  socket.write(head)
  // Сказать клиенту, что соединение установлено
  socketRequest.write("HTTP/" + request.httpVersion + " 200 Connection established\r\n\r\n")
})
// Туннелирование к хосту
socket.on('data', function (chunk) { socketRequest.write(chunk) })
socket.on('end', function () { socketRequest.end() })
socket.on('error', function () {
  // Сказать клиенту, что произошла ошибка
  socketRequest.write("HTTP/" + request.httpVersion + " 500 Connection error\r\n\r\n")
  socketRequest.end()
})
// Туннелирование к клиенту
socketRequest.on('data', function (chunk) { socket.write(chunk) })
socketRequest.on('end', function () { socket.end() })
socketRequest.on('error', function () { socket.end() })
});
//
//
//
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function generateNewUserAgent() {
  return UA_storage[getRandomInt(0, UA_storage.length - 1)];
}
function onRequest(client_req, client_res) { 
  client_res.end();
}

var http = require('http');
var url = require('url');

var server = http.createServer(function (request, response) {
  //
  let options = {
    headers: PRETENDER_headers,
    method: request.method
  };
  torReq(request, options, response);
  //
})



/*
      http://stackoverflow.com/questions/16995184/nodejs-what-does-socket-hang-up-actually-mean
      http://stackoverflow.com/questions/18867185/socket-hang-up-error-during-request
*/
  .on('connect', function (request, socketRequest, head) {
    console.log(`on('connect') `, request.url);
    var ph = url.parse('http://' + request.url);
    var options = {
      port: ph.port,
      hostname: ph.hostname,
      method: 'CONNECT',
      headers: request.headers || {}
    };

    var gatewayRequest = http.request(options,onRequest);

    gatewayRequest.on('error', function (err) { console.log('[error] ' + err); })

    gatewayRequest.on('connect', function (res, socket, head) {
      console.log(`БЛЯДЬ, Я ПОДКЛЮЧИЛСЯ`);
      //assert.equal(res.statusCode, 200)
      //assert.equal(head.length, 0)
      socketRequest.write("HTTP/" + request.httpVersion + " 200 Connection established\r\n\r\n")
      // Туннелирование к хосту
      socket.on('data', function (chunk) { socketRequest.write(chunk, 'binary') })
      socket.on('end', function () { socketRequest.end() })
      socket.on('error', function () {
        // Сказать клиенту, что произошла ошибка
        socketRequest.write("HTTP/" + request.httpVersion + " 500 Connection error\r\n\r\n")
        socketRequest.end()
      })
      // Туннелирование к клиенту
      socketRequest.on('data', function (chunk) { socket.write(chunk, 'binary'); console.info(`HTTPaSS`) })
      socketRequest.on('end', function () { socket.end(); console.info(`Cучка кончила!!!`) })
      socketRequest.on('error', function () { socket.end() })
    }).end();
  }).listen(3000);