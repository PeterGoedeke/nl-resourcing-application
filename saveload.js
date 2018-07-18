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
    fs.writeFile('employeetypes.json', JSON.stringify(state.employeeTypes, null, 4), 'utf8', function(err) {
        if(err) throw err
    })
    fs.writeFile('projects.json', JSON.stringify(state.projects, null, 4), 'utf8', function(err) {
        if(err) throw err
    })
    fs.writeFile('employees.json', JSON.stringify(state.employees, null, 4), 'utf8', function(err) {
        if(err) throw err
    })
}

function load() {
    fs.readFile('employeetypes.json', function(err, data) {
        JSON.parse(data).forEach(employeeType => createEmployeeType(employeeType.type))
        fs.readFile('employees.json', function(err, data) {
            JSON.parse(data).forEach(employeeInformation => createEmployee(employeeInformation.employeeType, employeeInformation.name))
            fs.readFile('projects.json', function(err, data) {
                console.log(JSON.parse(data))
                JSON.parse(data).forEach(projectInformation => {
                    let project = createProject(
                        projectInformation.name, projectInformation.group, projectInformation.security, projectInformation.startDate, projectInformation.endDate, false
                    )
                    for(let type in projectInformation.employeeSlots) {
                        projectInformation.employeeSlots[type].forEach(employeeSlot => {
                            project.employeeSlots[type].push(createEmployeeSlot(
                                project, employeeSlot.employeeType, employeeSlot.workload, state.getEmployeeFromName(employeeSlot.employee, employeeSlot.employeeType), employeeSlot.startDate, employeeSlot.endDate
                            ))
                            project.employeeSlots[type][project.employeeSlots[type].length - 1].updateDisplay()
                            project.updateDisplay()
                        })
                    }
                })
                sm.updateDisplay()
                sm.updateVerticalDisplay()
                state.calculateDateRange()
            })
        })
    })
}