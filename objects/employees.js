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
                this.name = toTitleCase(this.label.value)
                this.label.value = this.name
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
        this.label.addEventListener('keydown', event => {
            if(event.which == 39 && event.target.selectionStart == this.label.value.length) {
                tab.after(this.label, this)
            }
        })
        bindDialogueListeners.call(this, 'employee')
    },
    updateVerticalDisplay(index) {
        this.display.style.top = sq.getTotalProjectHeight() + sq.getTotalLeaveHeight() + 80 + 10 * zoom.scale + index * 50 * zoom.scale + 'px'
    },
    updateDisplay() {
        this.populateEmptyWorkload()
        while(this.display.firstChild) this.display.removeChild(this.display.firstChild)
        let workload = this.flattenWorkload()
        for(key in workload) {
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeWorkloadBlock'
            workloadBlock.style.left = getXLocationFromID(key) + 'px'
            workloadBlock.style.width = 100 * zoom.scale + 'px'
            const colour = (workload[key] == this.daysAWeek - 1 || workload[key] == this.daysAWeek) ? 'green' : (workload[key] < this.daysAWeek - 1 ? 'yellow' : 'red')
            if(this.joiningDate && key < this.joiningDate || this.leavingDate && key >= this.leavingDate) {
                workloadBlock.style.background = `repeating-linear-gradient(45deg, ${colour}, white 5px, ${colour} 5px, white 5px)`
            }
            else workloadBlock.style.backgroundColor = colour
            workloadBlock.textContent = workload[key]
            this.display.appendChild(workloadBlock)
        }
        this.display.style.width = sq.positioner.style.width
        this.label.value = this.name || 'Unnamed'
        sm.populateTotalRows()
    },
    populateEmptyWorkload() {
        let [start, end] = sq.getVisibleTimeBlockRange()
        if(state.earliestDate < start) start = state.earliestDate
        if(state.latestDate > end) end = state.latestDate
        for(let i = start; i < end; i++) this.workload[this.empty][i] = 0
    },
    flattenWorkload() {
        let flattenedWorkload = {}
        Object.getOwnPropertySymbols(this.workload).forEach((symbol) => {
            for(key in this.workload[symbol]) flattenedWorkload[key] = (parseInt(flattenedWorkload[key]) + parseInt(this.workload[symbol][key])) || this.workload[symbol][key]
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
            name: this.name, employeeType: this.employeeType, joiningDate: this.joiningDate, leavingDate: this.leavingDate, daysAWeek: this.daysAWeek
        }
    }
}

function createEmployee(employeeType, name = null, joiningDate = null, leavingDate = null, daysAWeek = 5) {
    let display = document.createElement('div')
    display.className = 'employee'

    let label = document.createElement('input')
    label.type = 'text'
    label.value = 'Unnamed'
    label.className = 'employeeLabel'

    let workload = {}
    let emptySymbol = Symbol('empty workload information')
    workload[emptySymbol] = {}

    let employee = Object.assign(
        Object.create(employeeProto),
        {display, label,
        employeeType, name, workload, joiningDate, leavingDate, empty: emptySymbol, daysAWeek}
    )
    employee.populateEmptyWorkload()
    state.registerEmployee(employee)
    employee.initDisplay()
    return employee
}