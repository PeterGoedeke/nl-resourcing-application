fs = require('fs')

// fs.stat('data.json', function(err, stat) {
//     if(error == null) {
//         //readfile
//     } else if(err.code == 'ENOENT') {
//         fs.writeFile('data.json', 'w')
//     } else {
        
//     }
// })

//fs.readFilesync('', 'utf8')

function save() {
    console.log('and here too')
    fs.writeFile('data.json', JSON.stringify(state.projects, null, 4), function(err) {
        if(err) throw err
    })
}