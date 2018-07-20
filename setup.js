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
    zoomInButton: document.querySelector('.zoomIn'),
    zoomOutButton: document.querySelector('.zoomOut'),

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
        this.appendUntilFit()
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
        timeBlock.style.width = 100 * zoom.scale + 'px'
        if(firstChild) sq.topAxisContainer.insertBefore(timeBlock, sq.topAxisContainer.firstChild)
        else sq.topAxisContainer.appendChild(timeBlock)
    },
    updateVerticalDisplay() {
        state.projects.forEach(project => project.updateVerticalDisplay())
        leave.updateVerticalDisplay()
        sq.typeLabel.style.height = state.getVisibleEmployees().length * 50 * zoom.scale + 'px'
        sq.leaveLabel.style.height = leave.leaveSlots[state.visibleType.type].length * 50 * zoom.scale + 'px'
        state.getVisibleEmployees().forEach((employee, i) => employee.updateVerticalDisplay(i))
        this.fixContentPaneHeight()
    },
    updateDisplay() {
        state.projects.forEach(project => {
            project.updateDisplay()
            for(let type in project.employeeSlots) project.employeeSlots[type].forEach(employeeSlot => employeeSlot.updateDisplay())
        })
        state.employees.forEach(employee => employee.updateDisplay())
        leave.updateDisplay()
    }
}

const state = {
    baseDate: 29,
    earliestDate: 29,
    latestDate: 35,
    projects: [],
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
    //let ctrlPressed = false
    addEventListener('load', event => {
        sm.initTimeFrame()
        createEmployeeType('QS')
        state.setVisibleType(state.employeeTypes[0])
    })
    addEventListener('resize', sm.appendUntilFit)

    // addEventListener('keypress', event => {
    //     if(event.which == 17) ctrlPressed = true 
    // })
    // addEventListener('scroll', event => {
    //     if(event.ctrlKey) console.log('ay')
    // })

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
        let i = ''
        while(state.employeeTypes.map(employeeType => employeeType.type).includes('NA' + i)) {
            i ++
        }
        createEmployeeType('NA' + i)
    })

    sq.zoomInButton.addEventListener('mouseup', event => {
        zoom.in()
    })
    sq.zoomOutButton.addEventListener('mouseup', event => {
        zoom.out()
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
    return (id - state.baseDate) * 100 * zoom.scale
}