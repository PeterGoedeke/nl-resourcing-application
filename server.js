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
        else if(req.url.match(/main$/)) {
            checkFiles().then(function(value) {
                if(checkFiles().every)
                console.log('hmm')
                loadFiles().then(function(value) {
                    res.writeHead(200, {'Content-Type': 'text/js'})
                    res.end(JSON.stringify(value))
                }, function(err) { throw err })
            }, createFiles)
        }
        else {
            fs.readFile('./index.html', 'utf-8', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(data)
            })
        }
    }
    else if(req.method == 'POST') {
        let body = ''
        req.on('data', function(chunk) {
            body += chunk
        })
        req.on('end', function() {
            const data = JSON.parse(body)
            save(data.type, data.data)
        })
    }
}).listen(3000)

function checkFiles() {
    return Promise.all([
        new Promise(resolve => fs.exists('./data/projects.json', exists => resolve(exists))),
        new Promise(resolve => fs.exists('./data/employees.json', exists => resolve(exists))),
        new Promise(resolve => fs.exists('./data/sheets.json', exists => resolve(exists))),
    ])
}
function loadFiles() {
    return Promise.all([
        new Promise((resolve, reject) => fs.readFile('./data/sheets.json', 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(JSON.parse(data))
        })),
        new Promise((resolve, reject) => fs.readFile('./data/projects.json', 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(JSON.parse(data))
        })),
        new Promise((resolve, reject) => fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(JSON.parse(data))
        }))
    ])
}

function createFiles() {
    fs.writeFile('./data/projects.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    fs.writeFile('./data/employees.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    fs.writeFile('./data/sheets.json', '', 'utf8', function(err) {
        if(err) throw err
    })

    console.log('did it ya boy')
}

function save(type, data) {
    fs.writeFile(`./data/${type}.json`, JSON.stringify(data, null, 4), 'utf8', function(err) {
        if(err) throw err
    })
}