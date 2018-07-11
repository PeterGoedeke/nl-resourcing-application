let employeeProto = {
    initDisplay() {
        sq.contentPane.appendChild(this.display)
        sq.rightSidebar.appendChild(this.label)
        this.updateVerticalDisplay()
    },
    updateVerticalDisplay() {
        this.display.style.top
    }
}

function createEmployee(employeeType) {
    let display = document.createElement('div')
    display.className = 'employee'

    for(let i = state.earliestDate; i < state.latestDate; i++) {
        let workloadBlock = document.createElement('div')
        workloadBlock.className = 'employeeWorkloadBlock'
        display.appendChild(workloadBlock)
    }

    let label = document.createElement('input')
    label.type = 'text'
    label.value = 'Unnamed'
    label.className = 'employeeLabel'

    let workload = {}
    let employee = Object.assign(
        Object.create(employeeProto),
        {display, label,
        employeeType}
    )
    employee.initDisplay()
    return employee
}