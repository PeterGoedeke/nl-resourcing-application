const http = require('http')
const fs = require('fs')
const path = require('path')

http.createServer(function(req, res) {
    if(req.method == 'GET') {
        if(req.url.match(/.css$/)) {
            let fileStream = fs.createReadStream(path.join(__dirname, req.url), 'utf-8')
            res.writeHead(200, {'Content-Type': 'text/css'})
    
            fileStream.pipe(res)
        }
        else if(req.url.match(/.js$/)) {
            let fileStream = fs.createReadStream(path.join(__dirname, req.url), 'utf-8')
            res.writeHead(200, {'Content-Type': 'text/js'})
    
            fileStream.pipe(res)
        }
        else if(req.url.match(/.png$/)) {
            let fileStream = fs.createReadStream(path.join(__dirname, req.url))
            res.writeHead(200, {'Content-Type': 'image/png'})
    
            fileStream.pipe(res)
        }
            fs.readFile('./index.html', 'utf-8', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(data)
            })
    }
}).listen(3000)
