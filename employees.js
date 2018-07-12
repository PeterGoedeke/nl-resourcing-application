let employeeProto = {
    initDisplay() {
        sq.contentPane.appendChild(this.display)
        sq.rightSidebar.appendChild(this.label)
        this.updateVerticalDisplay()
        this.updateDisplay()

        this.label.addEventListener('change', event => {
            this.name = this.label.value
        })
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
            workloadBlock.textContent = workload[key]
            this.display.appendChild(workloadBlock)
        }
    },
    flattenWorkload() {
        let flattenedWorkload = {}
        console.log(Object.getOwnPropertySymbols(this.workload))
        Object.getOwnPropertySymbols(this.workload).forEach((symbol) => {
            for(key in this.workload[symbol]) {
                flattenedWorkload[key] = (flattenedWorkload[key] + this.workload[symbol][key]) || this.workload[symbol][key]
            }
        })
        return flattenedWorkload
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