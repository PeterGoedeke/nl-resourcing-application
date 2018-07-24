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
        },
        employees() {
            fs.writeFile('./data/employees.json', JSON.stringify(state.employees, null, 4), 'utf8', function(err) {
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

function testData(data) {
    try {
        JSON.parse(data)
    } catch(error) {
        return false
    }
    return true
}

function load() {
    let [loadedProjects, loadedLeave] = [false, false]
    if(!fs.existsSync('./data/employeetypes.json')) fs.writeFile('./data/employeetypes.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    if(!fs.existsSync('./data/employees.json')) fs.writeFile('./data/employees.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    if(!fs.existsSync('./data/projects.json')) fs.writeFile('./data/projects.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    if(!fs.existsSync('./data/leave.json')) fs.writeFile('./data/leave.json', '', 'utf8', function(err) {
        if(err) throw err
    })

    fs.readFile('./data/employeetypes.json', function(err, data) {
        if(err) throw err
        if(testData(data)) {
            JSON.parse(data).forEach(employeeType => createEmployeeType(employeeType.type))
            if(state.employeeTypes.length == 0) createEmployeeType('NA')
        }
        else createEmployeeType('NA')
        state.setVisibleType(state.employeeTypes[0])
        fs.readFile('./data/employees.json', function(err, data) {
            if(err) throw err
            if(testData(data)) JSON.parse(data).forEach(employeeInformation => createEmployee(employeeInformation.employeeType, employeeInformation.name))
            fs.readFile('./data/projects.json', function(err, data) {
                if(err) throw err
                if(testData(data)) JSON.parse(data).forEach(projectInformation => {
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
                loadedProjects = true
                if(loadedProjects && loadedLeave) initLoad()
            })
            fs.readFile('./data/leave.json', function(err, data) {
                if(err) throw err
                let leaveInformation = null
                if(testData(data)) leaveInformation = JSON.parse(data)
                else leaveInformation = {}
                for(let employeeType in state.employeeTypes) leave.leaveSlots[employeeType.type] = []
                if(Object.keys(leaveInformation).length > 0) {
                    for(let type in leaveInformation) leaveInformation[type].forEach(leaveSlot => {
                        leave.leaveSlots[type].push(createLeaveSlot(
                            type, state.getEmployeeFromName(leaveSlot.employee, leaveSlot.employeeType), leaveSlot.startDate, leaveSlot.endDate)
                        )
                        leave.leaveSlots[type][leave.leaveSlots[type].length - 1].updateDisplay()
                    })
                }
                loadedLeave = true
                if(loadedProjects && loadedLeave) initLoad()
            })
        })
    })
}

function initLoad() {
    sm.initTimeFrame()
    sq.positioner.style.width = getXLocationFromID(state.latestDate + 1) + 'px'
    sm.updateDisplay()
    sm.updateVerticalDisplay()
    zoom.updateDisplay()
    zoom.initDisplay()
}