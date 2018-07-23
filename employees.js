let employeeProto = {
    initDisplay() {
        initInput(this.label)
        sq.contentPane.appendChild(this.display)
        sq.employeeContainer.appendChild(this.label)
        this.updateVerticalDisplay()
        this.updateDisplay()
        this.updateZoom()

        this.label.addEventListener('blur', event => {
            if(state.employeeExists(this.label.value)) {
                this.label.value = this.name || 'Unnamed'
            }
            else if(this.label.value == false) {
                this.name = null
                this.label.value = 'Unnamed'
                state.projects.forEach(project => {
                    project.employeeSlots[state.visibleType.type].forEach(employeeSlot => {
                        if(employeeSlot.employee === this) employeeSlot.removeEmployee()
                    })
                })
                leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => { if(leaveSlot.employee === this) leaveSlot.removeEmployee() })
                save.projects()
                save.leave()
            } else if(this.label.value != this.name) {
                this.name = this.label.value
                state.projects.forEach(project => {
                    project.employeeSlots[state.visibleType.type].forEach(employeeSlot => {
                        if(employeeSlot.employee === this) employeeSlot.label.value = this.name
                    })
                })
                leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => { if(leaveSlot.employee === this) leaveSlot.label.value = this.name })
                save.projects()
                save.leave()
            }
            save.employees()
        })
        bindDialogueListeners.call(this)
    },
    updateVerticalDisplay(index) {
        this.display.style.top = sq.getElementTop(sq.typeLabel) + index * 50 * zoom.scale + 'px'
    },
    updateDisplay() {
        while(this.display.firstChild) this.display.removeChild(this.display.firstChild)
        let workload = this.flattenWorkload()
        for(key in workload) {
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeWorkloadBlock'
            workloadBlock.style.left = getXLocationFromID(key) + 'px'
            workloadBlock.style.width = 100 * zoom.scale + 'px'
            workloadBlock.style.backgroundColor = workload[key] == 'leave' ? 'white' : ((workload[key] == 4 || workload[key] == 5) ? 'green' : (workload[key] < 4 ? 'yellow' : 'red'))
            if(!isNaN(workload[key])) workloadBlock.textContent = workload[key]
            this.display.appendChild(workloadBlock)
        }
        this.display.style.width = sq.positioner.style.width
        this.label.value = this.name || 'Unnamed'
    },
    flattenWorkload() {
        let flattenedWorkload = {}
        Object.getOwnPropertySymbols(this.workload).forEach((symbol) => {
            for(key in this.workload[symbol]) {
                if(isNaN(this.workload[symbol][key])) {
                    flattenedWorkload[key] = 'leave'
                } else if(flattenedWorkload[key] != 'leave') {
                    flattenedWorkload[key] = (parseInt(flattenedWorkload[key]) + parseInt(this.workload[symbol][key])) || this.workload[symbol][key]
                }
            }
        })
        return flattenedWorkload
    },
    showVisibleTypes() {
        if(this.employeeType == state.visibleType.type) {
            this.display.style.display = 'block'
            this.label.style.display = 'block'
            console.log('shown')
        } else {
            this.display.style.display = 'none'
            this.label.style.display = 'none'
            console.log('hidden')
        }
    },
    updateZoom() {
        this.display.style.height = 50 * zoom.scale + 'px'
        this.label.style.height = 50 * zoom.scale + 'px'
    },
    delete() {
        sm.validateScroll(this.display)
        sq.contentPane.removeChild(this.display)
        sq.employeeContainer.removeChild(this.label)
        state.employees.splice(state.employees.indexOf(this), 1)
        state.projects.forEach(project => {
            project.employeeSlots[state.visibleType.type].forEach(employeeSlot => {
                if(employeeSlot.employee === this) employeeSlot.removeEmployee()
            })
        })
    },
    toJSON() {
        return {
            name: this.name, employeeType: this.employeeType
        }
    }
}

function createEmployee(employeeType, name = null) {
    let display = document.createElement('div')
    display.className = 'employee'

    let label = document.createElement('input')
    label.type = 'text'
    label.value = 'Unnamed'
    label.className = 'employeeLabel'

    let workload = {}
    let employee = Object.assign(
        Object.create(employeeProto),
        {display, label,
        employeeType, name, workload}
    )
    state.registerEmployee(employee)
    employee.initDisplay()
    return employee
}