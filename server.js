const http = require('http')
const fs = require('fs')
const path = require('path')
const accounts = require('./accounts.json')

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
                if(value.every(isTrue => isTrue)) {
                    loadFiles().then(function(value) {
                        res.writeHead(200, {'Content-Type': 'text/js'})
                        res.end(JSON.stringify(value))
                    }, function(err) { throw err })
                }
                else createFiles()
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
            if(req.url === '/login') {
                console.log(body)
                const details = body.split('&').map(segment => segment.split('='))

                if(verifyAccount(details)) {
                    fs.readFile('./index.html', 'utf-8', function(err, data) {
                        res.writeHead(200, {'Content-Type': 'text/html'})
                        res.write(data)
                        res.write(`<script>const account = ${JSON.stringify(verifyAccount(details))}</script>`)
                        res.end()
                    })
                }
            }
        })
    }
}).listen(3000)

function checkFiles() {
function verifyAccount(details) {
    return accounts.find(account => account.username === details[0][1] && account.password === details[1][1])
}
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
            resolve(data ? JSON.parse(data) : '')
        })),
        new Promise((resolve, reject) => fs.readFile('./data/projects.json', 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(data ? JSON.parse(data) : '')
        })),
        new Promise((resolve, reject) => fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(data ? JSON.parse(data) : '')
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
}

function save(type, data) {
    fs.writeFile(`./data/${type}.json`, JSON.stringify(data, null, 4), 'utf8', function(err) {
        if(err) throw err
    })
}