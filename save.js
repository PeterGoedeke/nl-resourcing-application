function setDefaultLocation() {
    setCookie('openDirectory', mainDirectory.substr(5), 365)
}

const save = {
    all() {
        this.projects()
        this.employees()
        this.sheets()

    },
    projects() {
        makeSaveRequest(JSON.stringify({data: projects.list, type: 'projects'}))
        setDefaultLocation()
    },
    employees() {
        makeSaveRequest(JSON.stringify({data: employees.list, type: 'employees'}))
        setDefaultLocation()
    },
    sheets() {
        makeSaveRequest(JSON.stringify({data: sheets, type: 'sheets'}))
    },
    renameDir(oldName, newName) {
        this.dir({oldName, newName}, 'rename')
    },
    dir(data, location) {
        const http = new XMLHttpRequest()
        http.open('POST', window.location.href)
        http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        http.setRequestHeader('request', location)
        http.send(data ? JSON.stringify(data) : '')
        
        return new Promise(function(resolve) {
            http.onreadystatechange = function() {
                if(this.readyState == 4) resolve(null)
            }
        })
    },
    duplicateDir(name) {
        return this.dir(name, 'duplicate')
    },
    newDir() {
        return this.dir(null, 'newDir')
    },
    deleteDir(name) {
        return this.dir(name, 'delete')
    }
}

function makeSaveRequest(data) {
    const http = new XMLHttpRequest()
    http.open('POST', window.location.href)
    http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    http.setRequestHeader('request', mainDirectory)
    http.send(data)
}

function makeRestoreRequest() {
    
}