let slot = {
    initSlot() {
        initInput(this.label)
        this.updateZoom()
        this.label.addEventListener('keyup', event => {
            if(event.which == 13) {
                this.label.value = this.autocompleteLabel.value
                this.assignEmployeeFromLabel()
            }
            else if(this.label.value) {
                let value = state.getVisibleEmployees().map(employee => employee.name).find(name => name.startsWith(this.label.value)) || ''
                this.autocompleteLabel.value = value
            }
        })
        this.label.addEventListener('change', event => {
            this.assignEmployeeFromLabel()
        })
        this.label.addEventListener('blur', event => {
            this.autocompleteLabel.value = ''
            if(this.label.value === '') {
                this.removeEmployee()
                this.save()
            }
            if(!state.employeeExists(this.label.value)) {
                this.label.value = this.employee && this.employee.name || 'Empty'
            }
        })
    },
    assignEmployeeFromLabel() {
        if(state.employeeExists(this.label.value)) {
            this.assignEmployee(state.getEmployeeFromName(this.label.value))
            this.label.value = this.employee.name
            this.save()
        }
    },
    requestWorkload() {
        return this[Object.getOwnPropertySymbols(this)[0]]
    },
    requestWorkloadKey() {
        return Object.getOwnPropertySymbols(this)[0]
    },
    assignEmployee(employee) {
        this.removeEmployee()
        this.employee = employee
        this.setEmployeeWorkload()
        this.employee.updateDisplay()
    },
    removeEmployee() {
        if(this.employee) {
            delete this.employee.workload[this.requestWorkloadKey()]
            this.employee.updateDisplay()
            this.employee = null
            this.label.value = 'Empty'
        }
    },
    setEmployeeWorkload() {
        if(this.employee) {
            this.employee.workload[this.requestWorkloadKey()] = this.requestWorkload()
            this.employee.updateDisplay()
        }
    },
    updateZoom() {
        this.display.style.height = 50 * zoom.scale + 'px'
        this.labelWrapper.style.height = 50 * zoom.scale + 'px'
    }
}