fs = require('fs')

const save = (function() {
    return {
        all() {
            this.employeeTypes()
            this.employees()
            this.projects()
            this.leave()
        },
        employeeTypes() {
            fs.writeFile('./data/employeetypes.json', JSON.stringify(state.employeeTypes, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
            console.log('saved employee types')
        },
        employees() {
            fs.writeFile('./data/employees.json', JSON.stringify(state.employees, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
            console.log('saved employees')
        },
        projects() {
            fs.writeFile('./data/projects.json', JSON.stringify(state.projects, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
            console.log('saved projects')
        },
        leave() {
            fs.writeFile('./data/leave.json', JSON.stringify(leave, null, 4), 'utf8', function(err) {
                if(err) throw err
            })
            console.log('saved leave')
        }
    }
})()

function testData(data) {
    try {
        JSON.parse(data)
    } catch(error) {
        return false
    }
    return true
}

function load() {
    fs.readFile('./data/employeetypes.json', function(err, data) {
        JSON.parse(data).forEach(employeeType => createEmployeeType(employeeType.type))
        fs.readFile('./data/employees.json', function(err, data) {
            JSON.parse(data).forEach(employeeInformation => createEmployee(employeeInformation.employeeType, employeeInformation.name))
            fs.readFile('./data/projects.json', function(err, data) {
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
                fs.readFile('./data/leave.json', function(err, data) {
                    const leaveInformation = JSON.parse(data)
                    for(let type in leaveInformation) console.log(leaveInformation[type])
                    for(let employeeType in state.employeeTypes) leave.leaveSlots[employeeType.type] = []
                    for(let type in leaveInformation) leaveInformation[type].forEach(leaveSlot => {
                        leave.leaveSlots[type].push(createLeaveSlot(
                            type, state.getEmployeeFromName(leaveSlot.employee, leaveSlot.employeeType), leaveSlot.startDate, leaveSlot.endDate)
                        )
                        leave.leaveSlots[type][leave.leaveSlots[type].length - 1].updateDisplay()
                    })
                    sm.updateDisplay()
                    sm.updateVerticalDisplay()
                    state.calculateDateRange()
                })
            })
        })
    })
}