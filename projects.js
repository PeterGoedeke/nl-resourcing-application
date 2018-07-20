let projectProto = {
    initDisplay() {
        this.initDraggable()
        this.createEmployeeSlotButton.addEventListener('mouseup', (event) => {
            this.employeeSlots[state.visibleType.type].push(createEmployeeSlot(this, state.visibleType.type))
            this.employeeSlots[state.visibleType.type][this.employeeSlots[state.visibleType.type].length - 1].updateDisplay()
            this.updateDisplay()
        })
        bindDialogueListeners.call(this)
        this.label.addEventListener('change', event => {
            this.name = this.label.value
        })
        this.verticalDragger.addEventListener('drag', event => {

        })
        this.container.appendChild(this.createEmployeeSlotButton)
        this.container.appendChild(this.display)
        sq.contentPane.appendChild(this.container)
        this.labelContainer.appendChild(this.verticalDragger)
        this.labelContainer.appendChild(this.label)
        sq.leftSidebar.insertBefore(this.labelContainer, sq.createProjectButton)
        this.updateDisplay()
        this.employeeSlots[state.visibleType.type].forEach(employeeSlot => employeeSlot.updateDisplay())
        this.updateZoom()
    },
    updateVerticalDisplay() {
        this.employeeSlots[state.visibleType.type].forEach((employeeSlot, i) => {
            employeeSlot.display.style.top = sq.getElementTop(this.display) + i * 50 * zoom.scale + 'px'
            employeeSlot.label.style.top = parseInt(employeeSlot.display.style.top) - sq.contentPane.scrollTop + 'px'
        })
        this.display.style.height = this.employeeSlots[state.visibleType.type].length * 50 * zoom.scale + 10 * zoom.scale + 'px'
        this.labelContainer.style.height = this.display.style.height
        this.createEmployeeSlotButton.style.top = sq.getElementBottom(this.display) - 50 * zoom.scale + 'px'
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
        this.createEmployeeSlotButton.style.left = parseInt(this.display.style.left) + parseInt(this.display.style.width) + 15 * zoom.scale + 2.5 + 'px'
        this.createEmployeeSlotButton.style.height = 40 * zoom.scale + 'px'
        this.showVisibleTypes()
        sm.updateVerticalDisplay()
    },
    showVisibleTypes() {
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => {
            employeeSlot.display.style.display = 'none'
            employeeSlot.label.style.display = 'none'
        })
        this.employeeSlots[state.visibleType.type].forEach(employeeSlot => {
            employeeSlot.display.style.display = 'block'
            employeeSlot.label.style.display = 'block'
        })
    },
    updateZoom() {
        this.display.style.minHeight = 60 * zoom.scale + 'px'
        this.labelContainer.style.height = 60 * zoom.scale + 'px'
        this.labelContainer.style.minHeight = 60 * zoom.scale + 'px'
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => employeeSlot.updateZoom())
        this.createEmployeeSlotButton.style.height = 50 * zoom.scale + 'px'
    },
    delete() {
        sq.contentPane.removeChild(this.container)
        sq.leftSidebar.removeChild(this.labelContainer)
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => {
            sq.rightSidebar.removeChild(employeeSlot.label)
            employeeSlot.removeEmployee()
        })
        state.projects.splice(state.projects.indexOf(this), 1)

        sm.updateVerticalDisplay()
    },
    toJSON() {
        let employeeSlotsToSave = {}
        for(let type in this.employeeSlots) {
            employeeSlotsToSave[type] = []
            this.employeeSlots[type].forEach(employeeSlot => {
                employeeSlotsToSave[type].push({
                    employeeType: employeeSlot.employeeType, startDate: employeeSlot.startDate, endDate: employeeSlot.endDate, employee: employeeSlot.employee && employeeSlot.employee.name, workload: employeeSlot.requestWorkload()
                })
            })
        }
        return {
            name: this.name, group: this.group, security: this.security, startDate: this.startDate, endDate: this.endDate,
            employeeSlots: employeeSlotsToSave
        }
    }
}

function createProject(name, group, security, startDate, endDate, init = true) {
    if(!startDate && !endDate) [startDate, endDate] = sq.getVisibleTimeBlockRange(true)
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
        horizontalDraggable,
        {container, display, label, labelContainer, verticalDragger, createEmployeeSlotButton, dragging,
            name, group, security, startDate, endDate}
    )
    
    let employeeSlots = {}
    state.employeeTypes.map(employeeType => employeeType.type).forEach(type => employeeSlots[type] = [])
    if(init) for(let type in employeeSlots) employeeSlots[type].push(createEmployeeSlot(project, type))
    project.employeeSlots = employeeSlots
    
    state.registerProject(project)
    project.initDisplay()
    return project
}