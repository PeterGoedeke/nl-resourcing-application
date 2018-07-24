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
    topMargin: document.querySelector('.topMargin'),
    bottomMargin: document.querySelector('.bottomMargin'),
    addTypeButton: document.querySelector('.addType'),
    zoomContainer: document.querySelector('.zoomContainer'),
    zoomInButton: document.querySelector('.zoomIn'),
    zoomDisplay: document.querySelector('.zoomDisplay'),
    zoomOutButton: document.querySelector('.zoomOut'),
    employeeContainer: document.querySelector('.employeeContainer'),

    getTimeBlockWidth() {
        return 100 * zoom.scale
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
    getTotalProjectHeight() {
        let totalProjectHeight = 0
        state.projects.forEach(project => totalProjectHeight += project.display.offsetHeight)
        return totalProjectHeight
    },
    getTotalLeaveHeight() {
        let totalLeaveHeight = 0
        leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => totalLeaveHeight += leaveSlot.display.offsetHeight)
        return totalLeaveHeight > 50 ? totalLeaveHeight : 50
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
        if(state.projects.length > 0 || leave.leaveSlots.length > 0) state.calculateDateRange()
        state.baseDate = state.earliestDate - 1
        this.appendTimeBlock(state.baseDate)
        if(state.earliestDate < state.baseDate) for(let i = state.earliestDate; i < state.baseDate; i++) this.appendTimeBlock(i, false, true)
        if(state.latestDate > state.earliestDate) for(let i = state.baseDate + 1; i <= state.latestDate; i++) this.appendTimeBlock(i)
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
    appendTimeBlock(dateID, firstChild = false, beforeBase = false) {
        let timeBlock = document.createElement('div')
        timeBlock.className = 'timeBlock'
        timeBlock.textContent = dateID
        timeBlock.style.width = 100 * zoom.scale + 'px'

        let gridLine = document.createElement('div')
        gridLine.className = 'gridLine'
        timeBlock.appendChild(gridLine)
        if(firstChild) sq.topAxisContainer.insertBefore(timeBlock, sq.topAxisContainer.firstChild)
        else if(beforeBase) {
            const baseBlock = Array.from(sq.topAxisContainer.childNodes).find(timeBlock => timeBlock.textContent == state.baseDate)
            sq.topAxisContainer.insertBefore(timeBlock, baseBlock)
        }
        else sq.topAxisContainer.appendChild(timeBlock)
    },
    updateVerticalDisplay() {
        state.projects.forEach((project, i) => project.updateVerticalDisplay(i))
        sq.typeLabel.style.height = state.getVisibleEmployees().length * 50 * zoom.scale + 'px'
        sq.leaveLabel.style.height = leave.leaveSlots[state.visibleType.type].length * 50 * zoom.scale + 'px'
        sq.employeeContainer.style.top = 50 + state.projects.length * 10 * zoom.scale + 'px'
        leave.updateVerticalDisplay()
        state.employees.forEach((employee, i) => employee.updateVerticalDisplay(i))
        this.fixContentPaneHeight()
    },
    validateScroll(display) {
        if(sq.contentPane.scrollTop > 0) {
            sq.contentPane.scrollTop -= (display.offsetHeight + 25)
        }
    },
    updateDisplay() {
        sq.positioner.style.width = sq.getTimeBlockWidth() * sq.topAxisContainer.childNodes.length + 'px'
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
        if(project.security && this.projects.includes(project => !project.security)) {
            this.projects.splice(this.projects.indexOf(this.projects.find(project => !project.security)), 0, project)
        } else this.projects.push(project)
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
        leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => {
            if(leaveSlot.startDate < this.earliestDate) this.earliestDate = leaveSlot.startDate
            if(leaveSlot.endDate > this.latestDate) this.latestDate = leaveSlot.endDate
        })
        console.log(this.earliestDate, this.latestDate)
    }
};

(function() {
    //let ctrlPressed = false
    addEventListener('load', event => {
        load()
    })
    addEventListener('resize', sm.appendUntilFit)

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

function initInput(input) {
    input.addEventListener('focus', event => input.select())
}

function safe(func) {
    setTimeout(func, 0)
}