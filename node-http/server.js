var http = require('http');
var path = require('path');
var fs = require('fs');

var hostname = 'localhost';
var port = 3000;

// Create an HTTP server
var server = http.createServer(function(req, res) {
    // Log the request URL and method
    console.log(`Request for ${req.url} by method ${req.method}`);

    if (req.method === 'GET') {
        let fileUrl = req.url;
        if (fileUrl === '/') {
            fileUrl = '/index.html';
        }
        // Resolve the file path in the public directory
        const filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);

        if (fileExt === '.html') {
            // Check if the HTML file exists
            fs.access(filePath, function(err) {
                if (err) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(`<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            });
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html><body><h1>Error 404: ${fileUrl} is not an HTML file</h1></body></html>`);
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<html><body><h1>Error 404: ${req.method} not supported</h1></body></html>`);
    }
});

// Start the server and listen on the specified port and hostname
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
