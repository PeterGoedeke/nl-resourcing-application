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
        else if(req.url.match(/file\/[A-Za-z1-9_]*$/)) {
            const directory = req.url.split('/file/')[1]
            checkFiles(directory).then(function(value) {
                if(value.every(isTrue => isTrue)) {
                    loadFiles(directory).then(function(value) {
                        res.writeHead(200, {'Content-Type': 'text/js'})
                        res.end(JSON.stringify(value))
                    }, function(err) { throw err })
                }
                else createFiles(directory)
            }, () => createFiles(directory))
        }
        else if(req.url.match(/filelist$/)) {
            res.writeHead(200, {'Content-Type': 'text/js'})
            res.end(JSON.stringify(fs.readdirSync('./data')))
        }
        else {
            fs.readFile('./login.html', 'utf-8', function(err, data) {
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
            if(req.url === '/main') {
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
            else if(req.url.endsWith('/rename')) {
                const details = JSON.parse(body)
                if(fs.existsSync('./data/' + details.oldName)) {
                    fs.renameSync('./data/' + details.oldName, './data/' + details.newName)
                }
            }
            else if(req.url.match(/file\/[A-Za-z]*$/)) {
                const directory = req.url.split('/file/')[1]
                const data = JSON.parse(body)
                save(data.type, data.data, directory)
                res.end()
            }
        })
    }
}).listen(3000)

function verifyAccount(details) {
    return accounts.find(account => account.username === details[0][1] && account.password === details[1][1])
}

function checkFiles(directory) {
    return Promise.all([
        new Promise(resolve => fs.exists(`./data/${directory}/projects.json`, exists => resolve(exists))),
        new Promise(resolve => fs.exists(`./data/${directory}/employees.json`, exists => resolve(exists))),
        new Promise(resolve => fs.exists(`./data/${directory}/sheets.json`, exists => resolve(exists))),
    ])
}
function loadFiles(directory) {
    return Promise.all([
        new Promise((resolve, reject) => fs.readFile(`./data/${directory}/sheets.json`, 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(data ? JSON.parse(data) : '')
        })),
        new Promise((resolve, reject) => fs.readFile(`./data/${directory}/projects.json`, 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(data ? JSON.parse(data) : '')
        })),
        new Promise((resolve, reject) => fs.readFile(`./data/${directory}/employees.json`, 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(data ? JSON.parse(data) : '')
        }))
    ])
}

function createFiles(directory) {
    if(!fs.existsSync(`./data/${directory}`)) {
        fs.mkdirSync(`./data/${directory}`)
    }
    fs.writeFile(`./data/${directory}/projects.json`, '', 'utf8', function(err) {
        if(err) throw err
    })
    fs.writeFile(`./data/${directory}/employees.json`, '', 'utf8', function(err) {
        if(err) throw err
    })
    fs.writeFile(`./data/${directory}/sheets.json`, '', 'utf8', function(err) {
        if(err) throw err
    })
}

function save(type, data, directory) {
    fs.writeFile(`./data/${directory}/${type}.json`, JSON.stringify(data, null, 4), 'utf8', function(err) {
        if(err) throw err
    })
}