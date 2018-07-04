let projectProto = {
    initDisplay() {
        this.initDraggable()
        this.createEmployeeSlotButton.addEventListener('mouseup', (event) => {
            this.employeeSlots[state.visibleType].push(createEmployeeSlot(this, state.visibleType))
            this.employeeSlots[state.visibleType][this.employeeSlots[state.visibleType].length - 1].updateDisplay()
            this.updateDisplay()
        })
        this.container.appendChild(this.createEmployeeSlotButton)
        this.container.appendChild(this.display)
        sq.contentPane.appendChild(this.container)
        sq.leftSidebar.insertBefore(this.projectLabel, sq.createProjectButton)
        this.updateDisplay()
        this.employeeSlots[state.visibleType].forEach(employeeSlot => employeeSlot.updateDisplay())
    },
    updateVerticalDisplay() {
        this.createEmployeeSlotButton.style.top = sq.getElementBottom(this.display) - 25 + 'px'
        this.employeeSlots[state.visibleType].forEach((employeeSlot, i) => {
            employeeSlot.display.style.top = sq.getElementTop(this.display) + i * 25 + 'px'
            employeeSlot.employeeSlotLabel.style.top = parseInt(employeeSlot.display.style.top) - sq.contentPane.scrollTop + 'px'
        })
        this.projectLabel.style.height = this.display.style.height
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
        this.createEmployeeSlotButton.style.left = parseInt(this.display.style.left) + parseInt(this.display.style.width) + 10 + 'px'
        this.display.style.height = this.employeeSlots[state.visibleType].length * 25 + 5 + 'px'
        this.showVisibleTypes()
        state.projects.forEach(project => project.updateVerticalDisplay())
    },
    rename(newName) {
        this.name = newName
        this.projectLabel.textContent = this.name
    },
    showVisibleTypes() {
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => {
            employeeSlot.display.style.display = 'none'
            employeeSlot.employeeSlotLabel.style.display = 'none'
        })
        this.employeeSlots[state.visibleType].forEach(employeeSlot => {
            employeeSlot.display.style.display = 'block'
            employeeSlot.employeeSlotLabel.style.display = 'block'
        })
    }
}

function createProject(name, group, security) {
    let [startDate, endDate] = sq.getVisibleTimeBlockRange(true)
    let container = document.createElement('div')
    container.className = 'projectContainer'
    
    let display = document.createElement('div')
    display.className = 'projectDisplay'
    
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
        {container, display, projectLabel, createEmployeeSlotButton, dragging,
            name, group, security, startDate, endDate}
    )
    
    let employeeSlots = {}
    state.employeeTypes.forEach(type => employeeSlots[type] = [])
    for(let type in employeeSlots) employeeSlots[type].push(createEmployeeSlot(project, type))
    project.employeeSlots = employeeSlots
    
    state.registerProject(project)
    project.initDisplay()
    return project
}