let employeeProto = {
    initDisplay() {
        sq.contentPane.appendChild(this.display)
        sq.rightSidebar.appendChild(this.label)
        this.updateVerticalDisplay()
    },
    updateVerticalDisplay(index) {
        this.display.style.top = sq.getElementTop(sq.typeLabel) + index * 25 + 'px'
        this.label.style.top = parseInt(this.display.style.top) - sq.contentPane.scrollTop + 'px'
    },
    flattenWorkload() {
        let flattenedWorkload = {}
        Object.getOwnPropertySymbols(this.workload).forEach((symbol) => {
            for(key in this.workload[symbol]) {
                flattenedWorkload[key] = (flattenedWorkload[key] + this.workload[symbol][key]) || this.workload[symbol][key]
            }
        })
        console.log(flattenedWorkload)
    },
    refreshDisplay() {

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
    let name = 'Unnamed'
    let employee = Object.assign(
        Object.create(employeeProto),
        {display, label,
        employeeType, name, workload}
    )
    state.registerEmployee(employee)
    employee.initDisplay()
    return employee
}