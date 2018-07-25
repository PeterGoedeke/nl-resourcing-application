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