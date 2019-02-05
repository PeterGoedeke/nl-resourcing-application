const http = require('http')
const fs = require('fs')
const path = require('path')

http.createServer(function(req, res) {
    if(req.method == 'GET') {
            fs.readFile('./index.html', 'utf-8', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(data)
            })
    }
}).listen(3000)
