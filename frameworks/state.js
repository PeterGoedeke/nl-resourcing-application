const state = {
    baseDate: 29,
    earliestDate: 29,
    latestDate: 35,
    projects: [],
    groups: [],
    employees: [],
    employeeTypes: [],
    visibleType: null,

    setVisibleType(type) {
        if(this.visibleType) this.visibleType.display.classList.remove('selectedType')
        type.display.classList.add('selectedType')
        this.visibleType = type
        state.projects.forEach(project => project.showVisibleTypes())
        leave.showVisibleTypes()
        state.employees.forEach(employee => employee.showVisibleTypes())
        sq.typeLabel.textContent = state.visibleType.type.toUpperCase()
        sm.updateVerticalDisplay()
        sm.updateDisplay()
    },
    getIndexBeforeFirstGroup(exclude) {
        if(this.projects.filter(project => project !== exclude).map(project => project.group).every(group => group == null)) return this.getIndexBeforeUnsecured(exclude)
        const index = state.projects.filter(project => project !== exclude).findIndex(project => project.group != null)
        return (index == -1 ? 0 : index)
    },
    getIndexBeforeGroup(exclude, group) {
        if(!this.projects.filter(project => project !== exclude).map(project => project.group).includes(group)) return this.getIndexBeforeUnsecured(exclude)
        const index = this.projects.filter(project => project !== exclude).map(project => project.group).indexOf(group)
        return (index == -1 ? 0 : index)
    },
    getIndexBeforeUnsecured(exclude) {
        if(!this.projects.filter(project => project !== exclude).map(project => project.security).includes(false)) return state.projects.length
        const index = this.projects.filter(project => project !== exclude).map(project => project.security).indexOf(false)
        return (index == -1 ? 0 : index)
    },
    validateGroup(name, exclude) {
        if(name) {
            if(!this.projects.filter(project => project !== exclude).map(project => project.group).includes(`${name}`)) {
                this.groups.splice(this.groups.map(group => group.name).indexOf(`${name}`), 1)
                save.groups()
            }
        }
    },
    getColourFromGroup(name) {
        return this.groups.map(group => group.colour)[(this.groups.map(group => group.name).indexOf(`${name}`))]
    },
    setGroupColour(name, colour) {
        let group = this.groups[this.groups.map(group => group.name).indexOf(name)]
        group.colour = colour
        state.projects.forEach(project => {
            if(project.group === group.name) project.display.style.backgroundColor = colour
        })
        save.groups()
    },
    addEmployeeType(type) {
        this.employeeTypes.push(type)
        this.projects.forEach(project => project.employeeSlots[type.type] = [])
        leave.leaveSlots[type.type] = []
    },
    registerProject(project) {
        this.projects.push(project)
        sm.updateVerticalDisplay()
    },
    registerEmployee(employee) {
        this.employees.push(employee)
    },
    employeeExists(name) {
        return this.getVisibleEmployees().filter(employee => employee.name !== null).map(employee => employee.name.toLowerCase()).includes(name.toLowerCase())
    },
    getEmployeeFromName(name, type = this.visibleType.type) {
        if(name === null) return null
        return this.employees.filter(employee => employee.employeeType == type).find(employee => employee.name.toLowerCase() == name.toLowerCase())
    },
    getVisibleEmployees() {
        return this.employees.filter(employee => employee.employeeType == this.visibleType.type)
    },
    flattenWorkload() {
        let totalWorkload = {}
        this.getVisibleEmployees().forEach(employee => {
            let flattenedWorkload = employee.flattenWorkload()
            for(const key in flattenedWorkload) totalWorkload[key] = parseInt(flattenedWorkload[key]) + parseInt(totalWorkload[key]) || flattenedWorkload[key]
        })
        return totalWorkload
    },
    flattenEmployeeDaysAWeek(start, end) {
        let totalDaysAWeek = {}
        this.employees.forEach(employee => {
            if(employee.joiningDate && employee.leavingDate) {
                for(let i = employee.joiningDate; i < employee.leavingDate; i++) totalDaysAWeek[i] = totalDaysAWeek[i] + employee.daysAWeek / 5 || employee.daysAWeek / 5
            } else if(employee.joiningDate) {
                for(let i = employee.joiningDate; i <= end; i++) totalDaysAWeek[i] = totalDaysAWeek[i] + employee.daysAWeek / 5 || employee.daysAWeek / 5
            } else if(employee.leavingDate) {
                for(let i = start; i < employee.leavingDate; i++) totalDaysAWeek[i] = totalDaysAWeek[i] + employee.daysAWeek / 5 || employee.daysAWeek / 5
            } else {
                for(let i = start; i <= end; i++) totalDaysAWeek[i] = totalDaysAWeek[i] + employee.daysAWeek / 5 || employee.daysAWeek / 5
            }
        })
        return totalDaysAWeek
    },
    calculateDateRange() {
        let temporary = this.earliestDate
        this.earliestDate = this.latestDate
        this.latestDate = temporary
        
        this.projects.forEach(project => {
            for(let employeeSlot in project.employeeSlots[this.visibleType.type]) {
                if(project.employeeSlots[this.visibleType.type][employeeSlot].startDate < this.earliestDate) this.earliestDate = project.employeeSlots[this.visibleType.type][employeeSlot].startDate
                if(project.employeeSlots[this.visibleType.type][employeeSlot].endDate > this.latestDate) this.latestDate = project.employeeSlots[this.visibleType.type][employeeSlot].endDate
            }
            if(project.startDate < this.earliestDate) this.earliestDate = project.startDate
            if(project.endDate > this.latestDate) this.latestDate = project.endDate
        })
        leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => {
            if(leaveSlot.startDate < this.earliestDate) this.earliestDate = leaveSlot.startDate
            if(leaveSlot.endDate > this.latestDate) this.latestDate = leaveSlot.endDate
        })
    }
};

(function() {
    //let ctrlPressed = false
    addEventListener('load', event => {
        load()
    })
    addEventListener('resize', () => {
        sm.appendUntilFit()
        sq.totalWorkloadRow.style.width = sq.contentPane.offsetWidth + 'px'
        sq.totalEmployeesRow.style.width = sq.contentPane.offsetWidth + 'px'
        sq.surplusRow.style.width = sq.contentPane.offsetWidth + 'px'
        Array.from(document.querySelectorAll('.line')).forEach(line => line.style.width = sq.contentPane.offsetWidth + 'px')
    })

    // addEventListener('keypress', event => {
    //     if(event.which == 17) ctrlPressed = true 
    // })
    // addEventListener('scroll', event => {
    //     if(event.ctrlKey) console.log('ay')
    // })

    sq.createProjectButton.addEventListener('mouseup', event => {
        createProject('Default', null, true)
        sm.updateVerticalDisplay()
        state.calculateDateRange()
        save.projects()
    })
    sq.createEmployeeButton.addEventListener('mouseup', event => {
        createEmployee(state.visibleType.type)
        sm.updateVerticalDisplay()
        state.calculateDateRange()
        save.employees()
    })
    sq.createLeaveSlotButton.addEventListener('mouseup', event => {
        leave.leaveSlots[state.visibleType.type].push(createLeaveSlot(state.visibleType.type))
        sm.updateVerticalDisplay()
        leave.leaveSlots[state.visibleType.type][leave.leaveSlots[state.visibleType.type].length - 1].updateDisplay()
        save.leave()
    })
    sq.contentPane.addEventListener('scroll', event => {
        sq.sidebar.scrollTop = sq.contentPane.scrollTop
        sq.topAxisContainer.scrollLeft = sq.contentPane.scrollLeft
        sq.topAxisContainer.style.width = sq.contentPane.offsetWidth + 'px'
        sq.totalWorkloadRow.scrollLeft = sq.contentPane.scrollLeft
        sq.totalEmployeesRow.scrollLeft = sq.contentPane.scrollLeft
        sq.surplusRow.scrollLeft = sq.contentPane.scrollLeft
        sm.syncPositionersWidth()
        sm.fixContentPaneHeight()
        //console.log(sq.getVisibleTimeBlockRange()[0] - 1, state.earliestDate)
        //if(sq.topAxisContainer.firstChild.textContent < state.earliestDate && sq.getVisibleTimeBlockRange()[0] - 1 > sq.topAxisContainer.firstChild.textContent && !draggingInterface.currentlyDragging) {
            //console.log('hi')
            // state.baseDate = sq.getVisibleTimeBlockRange()[0] - 2
            // sq.positioner.style.left = sq.contentPane.scrollLeft + 'px'
            // sq.positioner.style.width = getXLocationFromID(state.latestDate) - sq.contentPane.scrollLeft + 'px'
            // sm.updateDisplay()
        //}
    })
    sq.addTypeButton.addEventListener('mouseup', event => {
        let i = ''
        while(state.employeeTypes.map(employeeType => employeeType.type).includes('NA' + i)) {
            i ++
        }
        createEmployeeType('NA' + i)
        save.employeeTypes()
    })

    sq.zoomInButton.addEventListener('mouseup', event => {
        zoom.in()
    })
    sq.zoomOutButton.addEventListener('mouseup', event => {
        zoom.out()
    })
})()

function test() {
    state.baseDate = sq.getVisibleTimeBlockRange()[0] - 2
    sq.positioner.style.left = sq.contentPane.scrollLeft + 'px'
    sq.positioner.style.width = getXLocationFromID(state.latestDate) - sq.contentPane.scrollLeft + 'px'
    sm.updateDisplay()
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
function convertIDToDate(id) {
    let year = 2000
    id = Math.floor(id / 2)
    if(Math.abs(id) >= 12) year += Math.floor(id / 12)
    if(id < 0) year --
    return months[id < 0 ? 12 + id % 12 : id % 12] + ' ' + String(year).substring(2)
}
function convertDateToID(date) {
    return months.indexOf(date)
}
function getXLocationFromID(id) {
    return (id - state.baseDate) * 100 * zoom.scale
}

function initInput(input) {
    input.addEventListener('focus', event => input.select())
}

function safe(func) {
    setTimeout(func, 0)
}

function toTitleCase(string) {
    return string.replace(/\b\w+/g, (string) => string.charAt(0).toUpperCase() + string.substr(1).toLowerCase())
}

setStyleRule = function(selector, rule) {
    var stylesheet = document.styleSheets[(document.styleSheets.length - 1)];

    for( var i in document.styleSheets ){
        if( document.styleSheets[i].href && document.styleSheets[i].href.indexOf("myStyle.css") ) {
            stylesheet = document.styleSheets[i];
            break;
        }
    }

    if( stylesheet.addRule ){
        stylesheet.addRule(selector, rule);
    } else if( stylesheet.insertRule ){
        stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
    }
}