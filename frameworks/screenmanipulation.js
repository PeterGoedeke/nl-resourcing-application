let timeBlocksBeforeBase = 0
let timeBlocksAfterBase = 0
let even = false
const sm = {
    initTimeFrame() {
        if(state.projects.length > 0 || leave.leaveSlots.length > 0) state.calculateDateRange()
        state.baseDate = state.earliestDate - 1
        if(state.baseDate % 2 == 0) even = true
        this.appendTimeBlock(state.baseDate)
        if(state.earliestDate < state.baseDate) for(let i = state.earliestDate; i < state.baseDate; i++) this.appendTimeBlock(i, false, true)
        if(state.latestDate > state.earliestDate) for(let i = state.baseDate + 1; i <= state.latestDate; i++) this.appendTimeBlock(i)
        this.appendUntilFit()
    },
    appendToEdges() {
        let i = sq.topAxisContainer.firstChild.textContent
        let j = sq.topAxisContainer.lastChild.textContent
        while(state.earliestDate <= sq.topAxisContainer.firstChild.textContent) {
            this.appendTimeBlock(i, true)
            i --
        }
        while(state.latestDate > sq.topAxisContainer.lastChild.textContent) {
            this.appendTimeBlock(j)
            j ++
        }
        sq.positioner.style.width = getXLocationFromID(Number(sq.topAxisContainer.lastChild.textContent) + 1) + 'px'
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
        sq.positioner.style.top = sq.surplusRow.offsetTop + sq.surplusRow.offsetHeight - 8 + 'px'
        sq.backgroundPositioner.style.top = sq.surplusRow.offsetTop + sq.surplusRow.offsetHeight + 'px'
    },
    appendTimeBlock(dateID, firstChild = false, beforeBase = false) {
        let timeBlock = document.createElement('div')
        timeBlock.className = 'timeBlock'
        if(firstChild || beforeBase) {
            timeBlocksBeforeBase ++
            if(timeBlocksBeforeBase % 2 == 0 && even) timeBlock.classList.add('labeledTimeBlock')
            else if(timeBlocksBeforeBase % 2 == 1 && !even) timeBlock.classList.add('labeledTimeBlock')
        }
        else {
            timeBlocksAfterBase ++
            if(timeBlocksAfterBase % 2 == 0 && !even) timeBlock.classList.add('labeledTimeBlock')
            else if(timeBlocksAfterBase % 2 == 1 && even) timeBlock.classList.add('labeledTimeBlock')
        }
        timeBlock.textContent = dateID
        timeBlock.setAttribute('value', convertIDToDate(dateID))
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
        // if(leave.leaveSlots[state.visibleType.type].length * 50 * zoom.scale < sq.leaveLabel.offsetHeight) {
        //     sq.employeeContainer.style.top = 54 + state.projects.length * 10 * zoom.scale + 'px'
        // }
        //else sq.employeeContainer.style.top = 50 + state.projects.length * 10 * zoom.scale + 'px'
        sq.employeeContainer.style.top = 30 + state.projects.length * 10 * zoom.scale + 'px'
        leave.updateVerticalDisplay()
        state.getVisibleEmployees().forEach((employee, i) => employee.updateVerticalDisplay(i))
        this.fixContentPaneHeight()
        this.updateBackground()
    },
    resizeHorizontalLines() {
        let gridLines = Array.from(document.querySelectorAll('.line')).concat(Array.from(document.querySelectorAll('.mid')))
        let totalRows = Array.from(document.querySelectorAll('.surplusRow, .emptyRow, .totalWorkloadRow, .totalEmployeesRow'))
        gridLines.forEach(gridLine => gridLine.style.width = Number(state.sidebarWidth) + Number(sq.contentPane.offsetWidth) - 17 + 'px')
        totalRows.forEach(totalRow => totalRow.style.width = Number(sq.contentPane.offsetWidth) - 17 + 'px')
        console.log(gridLines)
    },
    resizeVerticalLines() {
        let gridLines = Array.from(document.querySelectorAll('.gridLine'))
        gridLines.forEach(gridLine => gridLine.style.height = Number(sq.contentPane.offsetHeight) - 49 + 'px')
    },
    updateProjectVerticalDisplay() {
        state.projects.forEach((project, i) => project.updateVerticalDisplay(i))
        this.updateBackground()
    },
    updateBackground(remove = false) {
        let stripes = Array.from(document.querySelectorAll('.stripe'))
        if(remove) sq.background.removeChild(stripes.pop())
        for(let i = 0; i < state.projects.length; i++) {
            if(!stripes[i]) {
                let stripe = document.createElement('div')
                stripe.className = 'stripe'
                sq.background.appendChild(stripe)
                stripes[i] = stripe
            }
            stripes[i].style.height = state.projects[i].display.offsetHeight + 'px'
        }
    },
    validateScroll(display) {
        if(sq.contentPane.scrollTop > 0) {
            sq.contentPane.scrollTop -= (display.offsetHeight + 25)
        }
    },
    syncPositionersWidth() {
        sq.totalRowPositioners.forEach(positioner => positioner.style.width = sq.positioner.style.width)
    },
    populateTotalRows() {
        Array.from(sq.emptyRow.childNodes).filter(childNode => childNode.textContent).forEach(workloadBlock => {
            sq.emptyRow.removeChild(workloadBlock)
        })
        Array.from(sq.totalWorkloadRow.childNodes).filter(childNode => childNode.textContent).forEach(workloadBlock => {
            sq.totalWorkloadRow.removeChild(workloadBlock)
        })
        Array.from(sq.totalEmployeesRow.childNodes).filter(childNode => childNode.textContent).forEach(workloadBlock => {
            sq.totalEmployeesRow.removeChild(workloadBlock)
        })
        Array.from(sq.surplusRow.childNodes).filter(childNode => childNode.textContent).forEach(workloadBlock => {
            sq.surplusRow.removeChild(workloadBlock)
        })
        const totalWorkload = state.flattenWorkload()
        let [start, end] = [Infinity, -Infinity]
        for(const key in totalWorkload) {
            if(Number(key) < start) start = Number(key)
            if(Number(key) > end) end = Number(key)
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeWorkloadBlock'
            workloadBlock.style.left = getXLocationFromID(key) + 'px'
            workloadBlock.style.width = 100 * zoom.scale + 'px'
            workloadBlock.textContent = totalWorkload[key] / 5
            sq.totalWorkloadRow.appendChild(workloadBlock)
        }
        const summedEmpty = state.sumEmpty()
        for(let i = start; i <= end; i++) {
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeWorkloadBlock'
            workloadBlock.style.left = getXLocationFromID(i) + 'px'
            workloadBlock.style.width = 100 * zoom.scale + 'px'
            workloadBlock.textContent = summedEmpty[i] / 5 || 0
            sq.emptyRow.appendChild(workloadBlock)
        }
        const totalDaysAWeek = state.flattenEmployeeDaysAWeek(start, end)
        //combine two loops?
        for(let i = start; i <= end; i++) {
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeWorkloadBlock'
            workloadBlock.style.left = getXLocationFromID(i) + 'px'
            workloadBlock.style.width = 100 * zoom.scale + 'px'
            workloadBlock.textContent = totalDaysAWeek[i] || 0
            sq.totalEmployeesRow.appendChild(workloadBlock)
        }
        for(let i = start; i <= end; i++) {
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeWorkloadBlock'
            workloadBlock.style.left = getXLocationFromID(i) + 'px'
            workloadBlock.style.width = 100 * zoom.scale + 'px'
            const value = (totalDaysAWeek[i] || 0) - totalWorkload[i] / 5
            workloadBlock.textContent = Math.round(value * 10) / 10
            const colour = (value > 0 ? '#ffff3e' : (value == 0 ? '#5eff3e' : '#ff3e3e'))
            workloadBlock.style.backgroundColor = colour
            sq.surplusRow.appendChild(workloadBlock)
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