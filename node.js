var PORT = 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');
var mine = require('./mine').types;
var path = require('path');

var server = http.createServer(function (request, response) {
	var pathname = url.parse(request.url).pathname;
	// add default pathname -- index.html
	if (pathname === '/') {
		pathname = '/index.html';
	}
	
	var realPath = path.join("assets", pathname);
	var ext = path.extname(realPath);
	ext = ext ? ext.slice(1) : 'unknown';
	fs.exists(realPath, function (exists) {
		if (!exists) {
			response.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			response.end();
		} else {
			fs.readFile(realPath, "binary", function (err, file) {
				if (err) {
					response.writeHead(500, {
						'Content-Type': "text/plain"
					});
					response.end();
				} else {
					var contentType = mine[ext] || "text/plain";
					response.writeHead(200, {
						'Content-Type': contentType
					});
					response.write(file, "binary");
					response.end();
				}
			});
		}
		
	});
});

server.listen(PORT);
console.log("server running at port: " + PORT + ".");