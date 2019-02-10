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
        makeSaveRequest(JSON.stringify({data: sheets.types, type: 'sheets'}))
    }
}

function makeSaveRequest(data) {
    const http = new XMLHttpRequest()
    http.open('POST', window.location.href)
    http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    http.send(data)
}