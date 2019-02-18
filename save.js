const save = {
    all() {
        this.projects()
        this.employees()
        this.sheets()
    },
    projects() {
        makeSaveRequest(JSON.stringify({data: projects.list, type: 'projects'}))
        console.log('saved')
        console.trace()
    },
    employees() {
        makeSaveRequest(JSON.stringify({data: employees.list, type: 'employees'}))
        console.log('saved')
        console.trace()
    },
    sheets() {
        makeSaveRequest(JSON.stringify({data: sheets, type: 'sheets'}))
    },
    renameDir(oldName, newName) {
        const http = new XMLHttpRequest()
        http.open('POST', window.location.href + '/rename')
        http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        http.send(JSON.stringify({oldName, newName}))
    },
    duplicateDir(name) {
        const http = new XMLHttpRequest()
        http.open('POST', window.location.href + '/duplicate')
        http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        http.send(JSON.stringify(name))

        return new Promise(function(resolve) {
            http.onreadystatechange = function() {
                if(this.readyState == 4) resolve(null)
            }
        })
    }
}

function makeSaveRequest(data) {
    const http = new XMLHttpRequest()
    http.open('POST', window.location.href + mainDirectory)
    http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    http.send(data)
}

function makeRestoreRequest() {
    
}