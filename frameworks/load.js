fs = require('fs')

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
    if(!fs.existsSync('./data')) fs.mkdirSync('./data');
    if(!fs.existsSync('./errors')) fs.mkdirSync('./errors');

    if(!fs.existsSync('./data/employeetypes.json')) fs.writeFileSync('./data/employeetypes.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    if(!fs.existsSync('./data/employees.json')) fs.writeFileSync('./data/employees.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    if(!fs.existsSync('./data/groups.json')) fs.writeFileSync('./data/groups.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    if(!fs.existsSync('./data/projects.json')) fs.writeFileSync('./data/projects.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    if(!fs.existsSync('./data/leave.json')) fs.writeFileSync('./data/leave.json', '', 'utf8', function(err) {
        if(err) throw err
    })
    if(!fs.existsSync('./data/cookies.json')) fs.writeFileSync('./data/cookies.json', '175', 'utf8', function(err) {
        if(err) throw err
    })

    fs.readFile('./data/cookies.json', function(err, data) {
        if(err) throw err
        sidebar.setSidebarWidth(data)
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
            if(testData(data)) JSON.parse(data).forEach(employeeInformation => createEmployee(
                employeeInformation.employeeType, employeeInformation.name, employeeInformation.joiningDate, employeeInformation.leavingDate, employeeInformation.daysAWeek
            ))
            fs.readFile('./data/groups.json', function(err, data) {
                if(err) throw err
                if(testData(data)) JSON.parse(data).forEach(group => {
                    state.groups.push(createGroup(group.name, group.colour))
                })
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