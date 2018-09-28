let projectProto = {
    initDisplay() {
        initInput(this.label)
        this.initDraggable()
        this.createEmployeeSlotButton.onclick = () => {
            this.employeeSlots[state.visibleType.type].push(createEmployeeSlot(this, state.visibleType.type))
            this.employeeSlots[state.visibleType.type][this.employeeSlots[state.visibleType.type].length - 1].updateDisplay()
            this.employeeSlots[state.visibleType.type][this.employeeSlots[state.visibleType.type].length - 1].label.focus()
            this.updateDisplay()
            sm.updateVerticalDisplay()
            sm.populateTotalRows()
            save.projects()
        }
        this.label.addEventListener('keydown', event => {
            if(event.which == 39 && event.target.selectionStart == this.label.value.length) {
                tab.right(this.label, this)
            }
            if(event.which == 37 && event.target.selectionStart == 0) {
                tab.left(this.label, this)
            }
            if(event.which == 38) {
                tab.up(this.label, this)
            }
            if(event.which == 40) {
                tab.down(this.label, this)
            }
        })

        bindDialogueListeners.call(this, 'project')
        this.label.addEventListener('blur', event => {
            if(!this.label.value) {
                this.name = 'Default'
                this.label.value = 'Default'
                save.projects()
            }
            else {
                this.name = this.label.value
                this.label.value = this.name
                save.projects()
            }
        })
        this.container.appendChild(this.display)
        this.labelContainer.appendChild(this.label)
        sq.contentPane.appendChild(this.container)
        sq.leftSidebar.insertBefore(this.labelContainer, sq.createProjectButton)
        this.employeeSlotLabelContainer.appendChild(this.createEmployeeSlotButton)
        sq.rightSidebar.insertBefore(this.employeeSlotLabelContainer, leave.leaveSlotLabelContainer)
        this.employeeSlots[state.visibleType.type].forEach(employeeSlot => employeeSlot.updateDisplay())

        this.updateZoom()
        if(this.group) this.display.style.backgroundColor = state.getColourFromGroup(this.group)
        if(!this.security) {
            this.container.classList.add('unsecuredContainer')
            this.labelContainer.classList.add('unsecuredLabel')
            this.employeeSlotLabelContainer.classList.add('unsecuredEmployeeLabelContainer')
            this.display.classList.add('unsecured')
        }
        let bottomLine = document.createElement('div')
        bottomLine.className = 'line'
        this.labelContainer.appendChild(bottomLine)

        if(this.security && this.group == null) this.move(state.getIndexBeforeFirstGroup(this))
        if(this.group) this.move(state.getIndexBeforeGroup(this, this.group))
        this.updateDisplay()
        sm.updateBackground()
    },
    updateVerticalDisplay(i) {
        this.employeeSlots[state.visibleType.type].forEach((employeeSlot, i) => employeeSlot.display.style.top = sq.getElementTop(this.display) + i * 50 * zoom.scale + 'px')
        if(i || i === 0) {
            this.employeeSlotLabelContainer.style.top = i * 10 * zoom.scale + 'px'
            this.employeeSlotLabelContainer.style.minHeight = 50 * zoom.scale + 'px'
        }
        this.display.style.height = this.employeeSlots[state.visibleType.type].length * 50 * zoom.scale + 10 * zoom.scale + 'px'
        this.labelContainer.style.height = this.display.style.height
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) - 2 + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
        this.createEmployeeSlotButton.style.height = 40 * zoom.scale + 'px'
        this.showVisibleTypes()
    },
    resizeEmployeeSlots(amount, fromEnd = true) {
        let employees = []
        for(const type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => employees.push(employeeSlot))
        employees.forEach(employee => {
            if(fromEnd) {
                employee.endDate += amount
                if(employee.endDate <= employee.startDate) employee.endDate = employee.startDate + 1
                employee.updateDisplay(employee.display.lastElementChild.value)
            } else {
                employee.startDate += amount
                if(employee.startDate >= employee.endDate) employee.startDate = employee.endDate - 1
                employee.updateDisplay(employee.display.firstElementChild.value)
            }
        })
    },
    showVisibleTypes() {
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => {
            employeeSlot.display.style.display = 'none'
            employeeSlot.labelWrapper.style.display = 'none'
        })
        this.employeeSlots[state.visibleType.type].forEach(employeeSlot => {
            employeeSlot.display.style.display = 'block'
            employeeSlot.labelWrapper.style.display = 'block'
        })
    },
    toggleSecurity() {
        this.security = !this.security
        if(this.group) {
            this.move(state.getIndexBeforeGroup(this.group, this.security))
        } else if(this.security) {
            this.move(state.getIndexBeforeUnsecured(this, this.security))
        } else {
            this.move(state.getIndexBeforeFirstGroup(this, this.security))
        }
        this.toggleSecurityClasses()
        save.projects()
    },
    toggleSecurityClasses() {
        this.container.classList.toggle('unsecuredContainer')
        this.labelContainer.classList.toggle('unsecuredLabel')
        this.employeeSlotLabelContainer.classList.toggle('unsecuredEmployeeLabelContainer')
        this.display.classList.toggle('unsecured')
    },
    setGroup(group) {
        this.move(state.getIndexBeforeGroup(this, group, this.security))
        this.group = group
        this.display.style.backgroundColor = state.getColourFromGroup(group)
        save.projects()
    },
    removeGroup() {
        this.display.style.backgroundColor = ''
        state.validateGroup(this.group, this)
        this.group = null
        this.move(state.getIndexBeforeFirstGroup(this))
        save.projects()
    },
    move(newIndex) {
        state.projects.splice(state.projects.indexOf(this), 1)
        state.projects.splice(newIndex, 0, this)
        const projectAfter = state.projects[newIndex + 1]
        if(projectAfter) {
            sq.contentPane.insertBefore(this.container, projectAfter.container)
            sq.leftSidebar.insertBefore(this.labelContainer, projectAfter.labelContainer)
            sq.rightSidebar.insertBefore(this.employeeSlotLabelContainer, projectAfter.employeeSlotLabelContainer)
        } else {
            sq.contentPane.appendChild(this.container) // this line might result in problems...?
            sq.leftSidebar.insertBefore(this.labelContainer, sq.createProjectButton)
            sq.rightSidebar.insertBefore(this.employeeSlotLabelContainer, leave.leaveSlotLabelContainer)
        }
        sm.updateProjectVerticalDisplay()
    },
    updateZoom() {
        this.display.style.minHeight = 60 * zoom.scale + 'px'
        this.labelContainer.style.height = 60 * zoom.scale + 'px'
        this.labelContainer.style.minHeight = 60 * zoom.scale + 'px'
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => employeeSlot.updateZoom())
        this.createEmployeeSlotButton.style.fontSize = 40 * zoom.scale + 'px'
        this.createEmployeeSlotButton.style.height = 40 * zoom.scale + 'px'
        this.createEmployeeSlotButton.style.lineHeight = 40 * zoom.scale + 'px'
    },
    delete() {
        sm.validateScroll(this.display)
        sq.contentPane.removeChild(this.container)
        sq.leftSidebar.removeChild(this.labelContainer)
        sq.rightSidebar.removeChild(this.employeeSlotLabelContainer)
        state.validateGroup(this.group, this)
        for(let type in this.employeeSlots) this.employeeSlots[type].forEach(employeeSlot => employeeSlot.delete())
        state.projects.splice(state.projects.indexOf(this), 1)
        sm.updateBackground(true) 
    },
    save() {
        save.projects()
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

function createProject(name, group = null, security = false, startDate, endDate, init = true) {
    if(!startDate && !endDate) [startDate, endDate] = sq.getVisibleTimeBlockRange(true)
    let container = document.createElement('div')
    container.className = 'projectContainer'
    
    let display = document.createElement('div')
    display.className = 'projectDisplay'

    let labelContainer = document.createElement('div')
    labelContainer.className = 'projectLabelContainer'

    let label = document.createElement('input')
    label.type = 'text'
    label.className = 'projectLabel'
    label.value = name

    let employeeSlotLabelContainer = document.createElement('div')
    employeeSlotLabelContainer.className = 'employeeSlotLabelContainer'

    let createEmployeeSlotButton = document.createElement('div')
    createEmployeeSlotButton.className = 'createEmployeeSlot'
    createEmployeeSlotButton.textContent = '+'

    let dragging = false
    let project = Object.assign(
        Object.create(projectProto),
        horizontalDraggable,
        {container, display, label, labelContainer, employeeSlotLabelContainer, createEmployeeSlotButton, dragging,
            name, group, security, startDate, endDate}
    )
    
    let employeeSlots = {}
    state.employeeTypes.map(employeeType => employeeType.type).forEach(type => employeeSlots[type] = [])
    project.employeeSlots = employeeSlots
    state.registerProject(project)
    project.initDisplay()
    if(init) {
        for(let type in employeeSlots) employeeSlots[type].push(createEmployeeSlot(project, type))
        project.showVisibleTypes()
    }
    
    return project
}