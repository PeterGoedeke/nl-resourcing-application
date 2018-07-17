let employeeProto = {
    initDisplay() {
        sq.contentPane.appendChild(this.display)
        sq.rightSidebar.appendChild(this.label)
        this.updateVerticalDisplay()
        this.updateDisplay()

        this.label.addEventListener('change', event => {
            if(!state.employeeExists(this.label.value) && this.label.value.toLowerCase() != 'empty') this.name = this.label.value
        })
        this.label.addEventListener('blur', event => {
            if(this.label.value != this.name) this.label.value = this.name || 'Unnamed'
        })
        bindDialogueListeners.call(this)
    },
    updateVerticalDisplay(index) {
        this.display.style.top = sq.getElementTop(sq.typeLabel) + index * 25 + 'px'
        this.label.style.top = parseInt(this.display.style.top) - sq.contentPane.scrollTop + 'px'
    },
    updateDisplay() {
        while(this.display.firstChild) this.display.removeChild(this.display.firstChild)
        let workload = this.flattenWorkload()
        for(key in workload) {
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeWorkloadBlock'
            workloadBlock.style.left = getXLocationFromID(key) + 'px'
            workloadBlock.style.backgroundColor = workload[key] == 'leave' ? 'white' : ((workload[key] == 4 || workload[key] == 5) ? 'green' : (workload[key] < 4 ? 'yellow' : 'red'))
            if(!isNaN(workload[key])) workloadBlock.textContent = workload[key]
            this.display.appendChild(workloadBlock)
        }
        this.display.style.width = sq.positioner.style.width
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
        console.log(flattenedWorkload)
        return flattenedWorkload
    },
    delete() {
        sq.contentPane.removeChild(this.display)
        sq.rightSidebar.removeChild(this.label)
        state.employees.splice(state.employees.indexOf(this), 1)
        state.projects.forEach(project => {
            project.employeeSlots[state.visibleType].forEach(employeeSlot => {
                if(employeeSlot.employee === this) employeeSlot.removeEmployee()
            })
        })
    }
}

function createEmployee(employeeType) {
    let display = document.createElement('div')
    display.className = 'employee'

    let label = document.createElement('input')
    label.type = 'text'
    label.value = 'Unnamed'
    label.className = 'employeeLabel'

    let workload = {}
    let name = null
    let employee = Object.assign(
        Object.create(employeeProto),
        {display, label,
        employeeType, name, workload}
    )
    state.registerEmployee(employee)
    employee.initDisplay()
    return employee
}