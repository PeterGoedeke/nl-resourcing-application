fs = require('fs')

process.on('uncaughtException', err => {
    logError(err)
})

function logError(err) {
    fs.writeFile('./errors/Error' + Date.now() + '.txt', err.stack, 'utf8', function(err) {
        if(err) throw err
    })
   throw err
}