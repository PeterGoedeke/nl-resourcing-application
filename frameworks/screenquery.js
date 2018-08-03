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
    positioner: document.querySelector('.main'),
    backgroundPositioner: document.querySelector('.backgroundPositioner'),
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
    totalWorkloadRow: document.querySelector('.totalWorkloadRow'),
    totalEmployeesRow: document.querySelector('.totalEmployeesRow'),
    surplusLabel: document.querySelector('.surplusLabel'),
    surplusRow: document.querySelector('.surplusRow'),
    totalTypeLabel: document.querySelector('.totalTypeLabel'),
    totalRowPositioners: Array.from(document.querySelectorAll('.total')),
    beforeEmployeeSeparator: document.querySelector('.es'),
    beforeLeaveSeparator: document.querySelector('.ls'),
    background: document.querySelector('.background'),

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
        console.log('getvisibletimeblockrange', 'arguments.callee.name')
        return [firstTimeBlockOnScreen, lastTimeBlockOnScreen]
    },
    getTotalProjectHeight() {
        let totalProjectHeight = 0
        state.projects.forEach(project => totalProjectHeight += project.display.offsetHeight)
        console.log(arguments.callee.name)
        return totalProjectHeight
    },
    getTotalLeaveHeight() {
        let totalLeaveHeight = 0
        leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => totalLeaveHeight += leaveSlot.display.offsetHeight)
        console.log(arguments.callee.name)
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