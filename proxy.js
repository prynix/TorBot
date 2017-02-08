var http = require('http')
  , torReq = require('./tor');
http.createServer(onRequest).listen(3000, function () {
  console.info('===PHANTOMJS_TOR_PROXY===');
});

function onRequest(client_req, client_res) {
  var options = {
    headers: client_req.headers,
    method: client_req.method
  };
  console.log("TOR request with next settings:  ", client_req.url, options);
  torReq(client_req.url.substring(1), options, client_res);


  /*
     var str = '';
                        res.on('data', function (chunk) {
                            str += chunk;
                        });
                        res.on('end', function () {
                            console.log(str)
                            client_res.end(str);
                        });
                        res.pipe(client_res, {
                            end: true
                        });
  */
}



/*
http.get({
  host: client_req.url,
  path: '/'
}, function (response) {
  // Continuously update stream with data
  var body = '';
  response.on('data', function (d) {
    body += d;
  });
  response.on('end', function () {
    // Data reception is done, do whatever with it!
    var parsed = JSON.parse(body);
    client_res.send(parsed);
  });
});
*/