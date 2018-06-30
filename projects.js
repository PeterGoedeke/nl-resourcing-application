let projectProto = {
    initDisplay() {
        this.display.addEventListener('mousedown', (event) => {
            const {
                cursorPastLeftSide,
                cursorCloseToLeftSide,
                cursorBeforeRightSide,
                cursorCloseToRightSide
            } = calculateCursors.call(this)
            if(cursorPastLeftSide && cursorCloseToLeftSide) {
                draggingInterface.registerDragging(this, 'left')
            }
            else if(cursorBeforeRightSide && cursorCloseToRightSide) {
                draggingInterface.registerDragging(this, 'right')
            }
        })

        this.display.addEventListener('mousemove', (event) => {
            const {
                cursorPastLeftSide,
                cursorCloseToLeftSide,
                cursorBeforeRightSide,
                cursorCloseToRightSide
            } = calculateCursors.call(this)
            if(cursorPastLeftSide && cursorCloseToLeftSide) {
                this.display.style.cursor = 'pointer'
            }
            else if(cursorBeforeRightSide && cursorCloseToRightSide) {
                this.display.style.cursor = 'pointer'
            }
            else {
                this.display.style.cursor = 'auto'
            }
        })

        this.createEmployeeSlotButton.addEventListener('mouseup', (event) => {

        })

        this.display.appendChild(this.createEmployeeSlotButton)
        sq.contentPane.appendChild(this.display)
        document.querySelector('.leftSidebar').insertBefore(this.projectLabel, sq.createProjectButton)
        this.updateDisplay()
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
        this.showVisibleTypes()
    },
    rename(newName) {
        this.name = newName
        this.projectLabel.textContent = this.name
    },
    showVisibleTypes() {
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => employeeSlot.display.style.display = 'none')
        this.employeeSlots[state.visibleType].forEach(employeeSlot => employeeSlot.display.style.display = 'block')
    }
}

function createProject(name, group, security) {
    let [startDate, endDate] = sq.getVisibleTimeBlockRange(true)
    let display = document.createElement('div')
    display.className = 'project'
    
    let projectLabel = document.createElement('div')
    projectLabel.className = 'projectLabel'
    projectLabel.textContent = name

    let createEmployeeSlotButton = document.createElement('div')
    createEmployeeSlotButton.className = 'createEmployeeSlot'
    createEmployeeSlotButton.textContent = '+'

    let dragging = false
    let project = Object.assign(
        Object.create(projectProto),
        draggable,
        {display, projectLabel, createEmployeeSlotButton, dragging,
            name, group, security, startDate, endDate}
    )
    
    let employeeSlots = {}
    state.employeeTypes.forEach(type => employeeSlots[type] = [])
    for(let type in employeeSlots) employeeSlots[type].push(createEmployeeSlot(project, type))
    project.employeeSlots = employeeSlots
    
    project.initDisplay()
    state.registerProject(project)
    return project
}