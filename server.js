const http = require('http')
const fs = require('fs-extra')
const path = require('path')
const accounts = require('./accounts.json')

function findEditDate(dir) {
    if(fs.lstatSync(dir).isFile()) return 0
    return fs.readdirSync(dir).map(file => fs.lstatSync(`${dir}/${file}`).mtimeMs).sort((a, b) => {
        return b - a
    })[0]
}

let lastDuplicatedFile

http.createServer(function(req, res) {
    if(req.method == 'GET' && req.headers.referer && req.headers.referer.endsWith('index')) {
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
        else if(req.headers.request) {
            if(req.headers.request.match(/file\/.*$/)) {
                const directory = req.headers.request.split('file/')[1]
                checkFiles(directory).then(function(value) {
                    if(value.every(isTrue => isTrue)) {
                        loadFiles(directory).then(function(value) {
                            res.writeHead(200, {'Content-Type': 'text/js'})
                            res.end(JSON.stringify(value))
                        }, function(err) { throw err })
                    }
                    else {
                        createFiles(directory)
                        res.end()
                    }
                }, () => createFiles(directory))
            }
            else if(req.headers.request.match(/filelist$/)) {
                res.writeHead(200, {'Content-Type': 'text/js'})
                res.end(JSON.stringify(fs.readdirSync('./data').sort((a, b) => {
                        return findEditDate(`./data/${b}`) - findEditDate(`./data/${a}`)
                })))
                // res.end(JSON.stringify(fs.readdirSync('./data')))
            }
            else if(req.headers.request.match(/duplicatedfile/)) {
                res.writeHead(200, {'Content-Type': 'text/js'})
                res.end(JSON.stringify(lastDuplicatedFile))
            }
        }
    } else if(req.method == 'GET') {
        if(req.url.match(/login.css$/)) {
            let fileStream = fs.createReadStream(path.join(__dirname, req.url), 'utf-8')
            res.writeHead(200, {'Content-Type': 'text/css'})
    
            fileStream.pipe(res)
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

            if(req.headers.request) {
                if(req.headers.request.endsWith('rename')) {
                    const details = JSON.parse(body)
                    if(fs.existsSync('./data/' + details.oldName)) {
                        fs.renameSync('./data/' + details.oldName, './data/' + details.newName)
                    }
                    return
                }
                else if(req.headers.request.endsWith('duplicate')) {
                    const details = JSON.parse(body)
                    if(fs.existsSync('./data/' + details)) {
                        let i = 1
                        while(fs.existsSync('./data/' + details + `_(${i})`)) {
                            i++
                        }
                        fs.copySync('./data/' + details, './data/' + details + `_(${i})`)
                        lastDuplicatedFile = details + `_(${i})`
                    }
                    res.end()
                    return
                }
                else if(req.headers.request.endsWith('newDir')) {
                    let i = 1
                    while(fs.existsSync(`./data/unnamed_(${i})`)) {
                        i++
                    }
                    createFiles(`unnamed_(${i})`)
                    res.end()
                    return
                }
                else if(req.headers.request.endsWith('delete')) {
                    const details = JSON.parse(body)
                    fs.removeSync('./data/' + details)
                    res.end()
                    return
                }
                else if(req.headers.request.match(/file\/.*$/)) {
                    const directory = req.headers.request.split('file/')[1]
                    const data = JSON.parse(body)
                    save(data.type, data.data, directory)
                    res.end()
                    return
                }
            }

            const details = body.split('&').map(segment => segment.split('='))

            if(verifyAccount(details)) {
                fs.readFile('./index.html', 'utf-8', function(err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                    console.log(req.connection ? req.connection.remoteAddress : 'client connected')
                })
            } else {
                fs.readFile('./login-failed.html', 'utf-8', function(err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                    console.log('client rejected')
                })
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
            try {
                resolve(data ? JSON.parse(data) : '')
            } catch(err) {
                resolve('PARSE_ISSUE')
            }
        })),
        new Promise((resolve, reject) => fs.readFile(`./data/${directory}/projects.json`, 'utf8', (err, data) => {
            if(err) reject(err)
            try {
                resolve(data ? JSON.parse(data) : '')
            } catch(err) {
                resolve('PARSE_ISSUE')
            }
        })),
        new Promise((resolve, reject) => fs.readFile(`./data/${directory}/employees.json`, 'utf8', (err, data) => {
            if(err) reject(err)
            try {
                resolve(data ? JSON.parse(data) : '')
            } catch(err) {
                resolve('PARSE_ISSUE')
            }
        }))
    ])
}

function createFiles(directory) {
    if(!fs.existsSync(`./data/${directory}`)) {
        fs.mkdirSync(`./data/${directory}`)
    }
    if(fs.lstatSync(`./data/${directory}`).isFile()) return
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