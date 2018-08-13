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
                this.rename(this.label.value)
            }
            save.employees()
        })
        this.label.addEventListener('keydown', event => {
            if(event.which == 39 && event.target.selectionStart == this.label.value.length) {
                tab.after(this.label, this)
            }
            if(event.which == 37 && event.target.selectionStart == 0) {
                tab.before(this.label, this)
            }
            if(event.which == 38) {
                tab.up(this.label, this)
            }
            if(event.which == 40) {
                tab.down(this.label, this)
            }
        })
        bindDialogueListeners.call(this, 'employee')
    },
    rename(newName) {
        undo.registerEmployeeChange('rename', [this, this.name])
        this.name = toTitleCase(newName)
        this.label.value = this.name
        state.projects.forEach(project => {
            project.employeeSlots[state.visibleType.type].forEach(employeeSlot => {
                if(employeeSlot.employee === this) employeeSlot.label.value = this.name
            })
        })
        leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => { if(leaveSlot.employee === this) leaveSlot.label.value = this.name })
        save.projects()
        save.leave()
    },
    updateVerticalDisplay(index) {
        this.display.style.top = Math.ceil(sq.beforeEmployeeSeparator.offsetTop + sq.beforeEmployeeSeparator.offsetHeight - 2 + zoom.scale + index * 50 * zoom.scale) + 'px'
    },
    updateDisplay() {
        this.populateEmptyWorkload()
        while(this.display.firstChild) this.display.removeChild(this.display.firstChild)
        let workload = this.flattenWorkload()
        for(key in workload) {
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeWorkloadBlock'
            workloadBlock.style.left = getXLocationFromID(key) - 1 + 'px'
            workloadBlock.style.width = 100 * zoom.scale + 'px'
            const colour = (workload[key] == this.daysAWeek - 1 || workload[key] == this.daysAWeek) ? '#5eff3e' : (workload[key] < this.daysAWeek - 1 ? '#ffff3e' : '#ff3e3e')
            if(this.joiningDate && key < this.joiningDate || this.leavingDate && key >= this.leavingDate) {
                workloadBlock.style.background = `repeating-linear-gradient(45deg, grey, darkgrey 5px, grey 5px, darkgrey 5px)`
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
            for(key in this.workload[symbol]) flattenedWorkload[key] = (Number(flattenedWorkload[key]) + Number(this.workload[symbol][key])) || this.workload[symbol][key]
        })
        return flattenedWorkload
    },
    showVisibleTypes() {
        if(this.employeeType == state.visibleType.type) {
            this.display.style.display = 'block'
            this.label.style.display = 'block'
        } else {
            this.display.style.display = 'none'
            this.label.style.display = 'none'
        }
    },
    updateZoom() {
        this.display.style.height = 50 * zoom.scale + 'px'
        this.display.style.lineHeight = 50 * zoom.scale + 'px'
        this.display.style.fontSize = 40 * zoom.scale + 'px'
        this.label.style.height = 50 * zoom.scale + 'px'
        if(zoom.scale <= 0.2) this.display.style.fontWeight = 'bold'
        else this.display.style.fontWeight = 'initial'
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
        leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => {
            if(leaveSlot.employee === this) leaveSlot.removeEmployee()
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