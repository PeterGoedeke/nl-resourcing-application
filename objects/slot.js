let slot = {
    initSlot() {
        initInput(this.label)
        this.updateZoom()
        this.label.addEventListener('keyup', event => {
            if(event.which == 13 && this.autocompleteLabel.value) {
                this.label.value = this.autocompleteLabel.value
                this.assignEmployeeFromLabel()
                tab.after(this.label, this)
            }
            else if(this.label.value) {
                this.label.value = toTitleCase(this.label.value)
                let value = state.getVisibleEmployees().map(employee => employee.name).sort().filter(name => name).find(name => name.startsWith(this.label.value)) || ''
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
        console.log(arguments.callee.name)
    },
    requestWorkload() {
        console.log(arguments.callee.name)
        return this[Object.getOwnPropertySymbols(this)[0]]
    },
    requestWorkloadKey() {
        console.log(arguments.callee.name)
        return Object.getOwnPropertySymbols(this)[0]
    },
    assignEmployee(employee) {
        this.removeEmployee()
        this.employee = employee
        this.setEmployeeWorkload()
        this.employee.updateDisplay()
        console.log(arguments.callee.name)
    },
    removeEmployee() {
        if(this.employee) {
            delete this.employee.workload[this.requestWorkloadKey()]
            this.employee.updateDisplay()
            this.employee = null
            this.label.value = 'Empty'
        }
        console.log(arguments.callee.name)
    },
    setEmployeeWorkload() {
        if(this.employee) {
            this.employee.workload[this.requestWorkloadKey()] = this.requestWorkload()
            this.employee.updateDisplay()
        }
        console.log(arguments.callee.name)
    }
}