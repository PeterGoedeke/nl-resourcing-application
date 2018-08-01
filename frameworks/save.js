fs = require('fs')

const save = (function() {
    return {
        all() {
            this.employeeTypes()
            this.employees()
            this.projects()
            this.groups()
            this.leave()
        },
        employeeTypes() {
            fs.writeFile('./data/employeetypes.json', JSON.stringify(state.employeeTypes, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
        },
        employees() {
            fs.writeFile('./data/employees.json', JSON.stringify(state.employees, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
        },
        groups() {
            fs.writeFile('./data/groups.json', JSON.stringify(state.groups, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
        },
        projects() {
            fs.writeFile('./data/projects.json', JSON.stringify(state.projects, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
        },
        leave() {
            fs.writeFile('./data/leave.json', JSON.stringify(leave, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
        }
    }
})()