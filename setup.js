const sq = (function() {
    const contentPane = document.querySelector('.contentPane')
    const mainWindow = document.querySelector('.mainWindow')

    const sidebar = document.querySelector('.sidebar')
    const leftSidebar = document.querySelector('.leftSidebar')
    const rightSidebar = document.querySelector('.rightSidebar')
    const typeLabel = document.querySelector('.typeLabel')
    const createLeaveSlotButton = document.querySelector('.createLeaveSlot')
    const leaveLabel = document.querySelector('.leaveLabel')
    const topAxisContainer = document.querySelector('.topAxisContainer')
    const positioner = document.querySelector('.positioner')
    const createEmployeeButton = document.querySelector('.createEmployee')
    const createProjectButton = document.querySelector('.createProject')
    return {
        contentPane, mainWindow,
        sidebar, leftSidebar, rightSidebar, typeLabel, createLeaveSlotButton, leaveLabel, topAxisContainer, positioner, createEmployeeButton, createProjectButton,
        getTimeBlockWidth() {
            //exists becuase timeBlocks are subject to change
            return document.querySelector('.timeBlock').offsetWidth
        },  
        getVisibleTimeBlockRange(border = false) {
            let firstTimeBlockOnScreen = Math.floor(contentPane.scrollLeft / this.getTimeBlockWidth()) + state.baseDate
            let timeBlocksOnScreen = Math.floor((mainWindow.offsetWidth - 175) / this.getTimeBlockWidth())
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
            return absoluteCursorPosition + contentPane.scrollLeft - contentPane.getBoundingClientRect().left
        },
        getNearestTimeBlock(xPosition) {
            return Math.round(xPosition / this.getTimeBlockWidth()) + state.baseDate
        },
        getElementTop(element) {
            return element.getBoundingClientRect().top + contentPane.scrollTop
        },
        getElementBottom(element) {
            return element.getBoundingClientRect().bottom + contentPane.scrollTop
        }
    }
})();

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
        sq.leaveLabel.style.height = leave.leaveSlots[state.visibleType].length * 25 + 'px'
        state.employees.forEach((employee, i) => employee.updateVerticalDisplay(i))
        this.fixContentPaneHeight()
    }
}

const state = (function() {
    let scale = 50
    let baseDate = 29
    let earliestDate = 29
    let latestDate = 35
    let projects = []
    let employees = []
    let employeeTypes = ['qs', 'pm', 'sm']
    let visibleType = 'qs'
    return {
        projects, employees, scale, baseDate, earliestDate, latestDate, employeeTypes, visibleType,
        registerProject(project) {
            projects.push(project)
            sm.updateVerticalDisplay()
        },
        registerEmployee(employee) {
            employees.push(employee)
        },
        employeeExists(name) {
            return employees.filter(employee => employee.name !== null).map(employee => employee.name.toLowerCase()).includes(name.toLowerCase())
        },
        getEmployeeFromName(name) {
            return employees.find(employee => employee.name.toLowerCase() == name.toLowerCase())
        },
        calculateDateRange() {
            let temporary = earliestDate
            earliestDate = latestDate
            latestDate = temporary
            
            projects.forEach(project => {
                for(let employeeSlot in project.employeeSlots[visibleType]) {
                    if(project.employeeSlots[visibleType][employeeSlot].startDate < earliestDate) earliestDate = project.employeeSlots[visibleType][employeeSlot].startDate
                    if(project.employeeSlots[visibleType][employeeSlot].endDate > latestDate) latestDate = project.employeeSlots[visibleType][employeeSlot].endDate
                }
                if(project.startDate < earliestDate) earliestDate = project.startDate
                if(project.endDate > latestDate) latestDate = project.endDate
            })
        },
        get earliestDate() { return earliestDate },
        get latestDate() { return latestDate }
    }
})();

(function() {
    addEventListener('load', event => {
        sm.initTimeFrame()
        sq.typeLabel.textContent = state.visibleType.toUpperCase()
    })
    addEventListener('resize', sm.appendUntilFit)

    sq.createProjectButton.addEventListener('mouseup', event => {
        createProject('Default', null, 'Secure')
        sm.fixContentPaneHeight()
        state.calculateDateRange()
    })
    sq.createEmployeeButton.addEventListener('mouseup', event => {
        createEmployee(state.visibleType)
        sm.updateVerticalDisplay()
        state.calculateDateRange()
    })
    sq.createLeaveSlotButton.addEventListener('mouseup', event => {
        leave.leaveSlots[state.visibleType].push(createLeaveSlot(state.visibleType))
        sm.updateVerticalDisplay()
        leave.leaveSlots[state.visibleType][leave.leaveSlots[state.visibleType].length - 1].updateDisplay()
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