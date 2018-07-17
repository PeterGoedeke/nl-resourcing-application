const sq = {
    contentPane: document.querySelector('.contentPane'),
    mainWindow: document.querySelector('.mainWindow'),
    sidebar: document.querySelector('.sidebar'),
    leftSidebar: document.querySelector('.leftSidebar'),
    rightSidebar: document.querySelector('.rightSidebar'),
    typeLabel: document.querySelector('.typeLabel'),
    createLeaveSlotButton: document.querySelector('.createLeaveSlot'),
    leaveLabel: document.querySelector('.leaveLabel'),
    topAxisContainer: document.querySelector('.topAxisContainer'),
    positioner: document.querySelector('.positioner'),
    createEmployeeButton: document.querySelector('.createEmployee'),
    createProjectButton: document.querySelector('.createProject'),
    bottomMargin: document.querySelector('.bottomMargin'),
    addTypeButton: document.querySelector('.addType'),
    zoomContainer: document.querySelector('.zoomContainer'),

    getTimeBlockWidth() {
        //exists becuase timeBlocks are subject to change
        return document.querySelector('.timeBlock').offsetWidth
    },  
    getVisibleTimeBlockRange(border = false) {
        let firstTimeBlockOnScreen = Math.floor(this.contentPane.scrollLeft / this.getTimeBlockWidth()) + state.baseDate
        let timeBlocksOnScreen = Math.floor((this.mainWindow.offsetWidth - 175) / this.getTimeBlockWidth())
        let lastTimeBlockOnScreen = firstTimeBlockOnScreen + timeBlocksOnScreen
        
        if(border) {
            firstTimeBlockOnScreen ++
            lastTimeBlockOnScreen --
        }
        while(firstTimeBlockOnScreen >= lastTimeBlockOnScreen) {
            firstTimeBlockOnScreen --
            lastTimeBlockOnScreen ++
        }
        return [firstTimeBlockOnScreen, lastTimeBlockOnScreen]
    },
    getCursorXLocation(absoluteCursorPosition) {
        return absoluteCursorPosition + this.contentPane.scrollLeft - this.contentPane.getBoundingClientRect().left
    },
    getNearestTimeBlock(xPosition) {
        return Math.round(xPosition / this.getTimeBlockWidth()) + state.baseDate
    },
    getElementTop(element) {
        return element.getBoundingClientRect().top + this.contentPane.scrollTop
    },
    getElementBottom(element) {
        return element.getBoundingClientRect().bottom + this.contentPane.scrollTop
    }
}

const sm = {
    initTimeFrame() {
        for(let i = state.baseDate; i <= state.latestDate; i++) sm.appendTimeBlock(i)
        sm.appendUntilFit()
    },
    appendUntilFit() {
        let timeBlocks = sq.topAxisContainer.childNodes.length
        const contentWidth = sq.contentPane.offsetWidth
        while((sq.getTimeBlockWidth() * timeBlocks) < contentWidth) {
            sm.appendTimeBlock(Number(sq.topAxisContainer.lastChild.textContent) + 1)
            timeBlocks ++
        }
    },
    fixContentPaneHeight() {
        sq.positioner.style.top = sq.getElementTop(sq.createEmployeeButton) + 'px'
    },
    appendTimeBlock(dateID, firstChild = false) {
        let timeBlock = document.createElement('div')
        timeBlock.className = 'timeBlock marginElement'
        timeBlock.textContent = dateID
        if(firstChild) sq.topAxisContainer.insertBefore(timeBlock, sq.topAxisContainer.firstChild)
        else sq.topAxisContainer.appendChild(timeBlock)
    },
    updateVerticalDisplay() {
        state.projects.forEach(project => project.updateVerticalDisplay())
        leave.updateVerticalDisplay()
        sq.typeLabel.style.height = state.employees.length * 25 + 'px'
        sq.leaveLabel.style.height = leave.leaveSlots[state.visibleType.type].length * 25 + 'px'
        state.employees.forEach((employee, i) => employee.updateVerticalDisplay(i))
        this.fixContentPaneHeight()
    }
}

const state = {
    scale: 50,
    baseDate: 29,
    earliestDate: 29,
    latestDate: 35,
    projects: [],
    employees: [],
    employeeTypes: [],
    visibleType: null,

    registerProject(project) {
        this.projects.push(project)
        sm.updateVerticalDisplay()
    },
    registerEmployee(employee) {
        this.employees.push(employee)
    },
    addEmployeeType(type) {
        this.employeeTypes.push(type)
    },
    employeeExists(name) {
        return this.employees.filter(employee => employee.name !== null).map(employee => employee.name.toLowerCase()).includes(name.toLowerCase())
    },
    getEmployeeFromName(name) {
        return this.employees.find(employee => employee.name.toLowerCase() == name.toLowerCase())
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
    }
};

(function() {
    createEmployeeType('qs')
    state.visibleType = state.employeeTypes[0]
    console.log(state.visibleType.type)

    addEventListener('load', event => {
        sm.initTimeFrame()
        sq.typeLabel.textContent = state.visibleType.type.toUpperCase()
    })
    addEventListener('resize', sm.appendUntilFit)

    sq.createProjectButton.addEventListener('mouseup', event => {
        createProject('Default', null, 'Secure')
        sm.fixContentPaneHeight()
        state.calculateDateRange()
    })
    sq.createEmployeeButton.addEventListener('mouseup', event => {
        createEmployee(state.visibleType.type)
        sm.updateVerticalDisplay()
        state.calculateDateRange()
    })
    sq.createLeaveSlotButton.addEventListener('mouseup', event => {
        leave.leaveSlots[state.visibleType.type].push(createLeaveSlot(state.visibleType.type))
        sm.updateVerticalDisplay()
        leave.leaveSlots[state.visibleType.type][leave.leaveSlots[state.visibleType.type].length - 1].updateDisplay()
    })
    sq.contentPane.addEventListener('scroll', event => {
        sq.sidebar.scrollTop = sq.contentPane.scrollTop
        sq.topAxisContainer.scrollLeft = sq.contentPane.scrollLeft
        sq.topAxisContainer.style.width = sq.contentPane.offsetWidth + 'px'
        sm.updateVerticalDisplay()
        // if(sq.getVisibleTimeBlockRange()[0] - 1 > state.earliestDate) {
        //     console.log('ello')
        //     sq.positioner.style.left = sq.contentPane.scrollLeft + 'px'
        //     sq.positioner.style.width = getXLocationFromID(state.latestDate) - sq.contentPane.scrollLeft + 'px'
        // }
    })
    sq.addTypeButton.addEventListener('mouseup', event => {
        createEmployeeType()
    })
})()

function convertIDToDate(id) {
    let year = 2000
    if(id / 12 > 0) year += Math.floor(id / 12)
    let month = Math.floor((id % 12) / 2) + 1
    let timeOfMonth = id % 2 == 0 ? 0 : 1 //0 = early, 1 = late
    return (timeOfMonth == 0 ? 'Early ' : 'Late ') + month + "/" + year
}
function getXLocationFromID(id) {
    return (id - state.baseDate) * state.scale 
}