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
    }
}