let slot = {
    initSlot() {
        this.label.addEventListener('change', event => {
            if(state.employeeExists(this.label.value)) {
                this.assignEmployee(state.getEmployeeFromName(this.label.value))
                this.label.value = this.employee.name
            }
        })
        this.label.addEventListener('blur', event => {
            if(this.label.value === '') {
                this.removeEmployee()
            }
            if(!state.employeeExists(this.label.value)) {
                this.label.value = this.employee && this.employee.name || 'Empty'
            }
        })
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
}