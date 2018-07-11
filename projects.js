let projectProto = {
    initDisplay() {
        this.initDraggable()
        this.display.addEventListener('mouseup', event => {
            if(event.which == 3) openProjectDialogue(this, event)
        })
        this.createEmployeeSlotButton.addEventListener('mouseup', (event) => {
            this.employeeSlots[state.visibleType].push(createEmployeeSlot(this, state.visibleType))
            this.employeeSlots[state.visibleType][this.employeeSlots[state.visibleType].length - 1].updateDisplay()
            this.updateDisplay()
        })
        this.display.addEventListener('mouseup', event => {
            if(event.which == 3) {
                openProjectDialogue(this, event)
            }
        })
        this.label.addEventListener('change', event => {
            this.name = this.label.value
        })
        this.container.appendChild(this.createEmployeeSlotButton)
        this.container.appendChild(this.display)
        sq.contentPane.appendChild(this.container)
        this.labelContainer.appendChild(this.verticalDragger)
        this.labelContainer.appendChild(this.label)
        sq.leftSidebar.insertBefore(this.labelContainer, sq.createProjectButton)
        this.updateDisplay()
        this.employeeSlots[state.visibleType].forEach(employeeSlot => employeeSlot.updateDisplay())
    },
    updateVerticalDisplay() {
        this.employeeSlots[state.visibleType].forEach((employeeSlot, i) => {
            employeeSlot.display.style.top = sq.getElementTop(this.display) + i * 25 + 'px'
            employeeSlot.label.style.top = parseInt(employeeSlot.display.style.top) - sq.contentPane.scrollTop + 'px'
        })
        this.display.style.height = this.employeeSlots[state.visibleType].length * 25 + 5 + 'px'
        this.labelContainer.style.height = this.display.style.height
        this.createEmployeeSlotButton.style.top = sq.getElementBottom(this.display) - 25 + 'px'
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
        this.createEmployeeSlotButton.style.left = parseInt(this.display.style.left) + parseInt(this.display.style.width) + 10 + 'px'
        this.showVisibleTypes()
        state.projects.forEach(project => project.updateVerticalDisplay())
    },
    showVisibleTypes() {
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => {
            employeeSlot.display.style.display = 'none'
            employeeSlot.label.style.display = 'none'
        })
        this.employeeSlots[state.visibleType].forEach(employeeSlot => {
            employeeSlot.display.style.display = 'block'
            employeeSlot.label.style.display = 'block'
        })
    },
    deleteProject() {
        sq.contentPane.removeChild(this.container)
        sq.leftSidebar.removeChild(this.labelContainer)
        for(type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => sq.rightSidebar.removeChild(employeeSlot.label))
        state.projects.splice(state.projects.indexOf(this), 1)
    }
}

function createProject(name, group, security) {
    let [startDate, endDate] = sq.getVisibleTimeBlockRange(true)
    let container = document.createElement('div')
    container.className = 'projectContainer'
    
    let display = document.createElement('div')
    display.className = 'projectDisplay'

    let labelContainer = document.createElement('div')
    labelContainer.className = 'projectLabelContainer'

    let verticalDragger = document.createElement('div')
    verticalDragger.className = 'projectVerticalDragger'

    let label = document.createElement('input')
    label.type = 'text'
    label.className = 'projectLabel'
    label.value = name

    let createEmployeeSlotButton = document.createElement('div')
    createEmployeeSlotButton.className = 'createEmployeeSlot'
    createEmployeeSlotButton.textContent = '+'

    let dragging = false
    let project = Object.assign(
        Object.create(projectProto),
        draggable,
        {container, display, label, labelContainer, verticalDragger, createEmployeeSlotButton, dragging,
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