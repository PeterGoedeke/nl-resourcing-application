const employeeProto = {
    batchLoad() {
        this.container = employeeContainer.cloneNode(true)
        this.body = this.container.querySelector('.employeeBody')
        this.label = this.container.querySelector('.employeeLabel')
        this.body.style.width = columns.applicationWidth + 'px'
        this.container.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'

        const snapshotTotalWorkload = this.totalWorkload
        for(const key in snapshotTotalWorkload) {
            const cell = createCell(snapshotTotalWorkload[key])
            this.body.appendChild(cell)
            this.cells[key] = cell
        }
        console.log(this.totalWorkload)

        this.label.textContent = this.name || 'Unnamed'
        x = this
        return this.container
    },
    showVisible() {

    },
    delete() {

    },
    get totalWorkload() {
        let totalWorkload = {}
        this.workload.forEach(workload => {
            console.log('ye')
            for(const key in workload) totalWorkload[key] = totalWorkload[key] + Number(workload[key]) || Number(workload[key])
        })
        for(let i = columns.baseID; i < columns.endID; i++) {
            if(totalWorkload[i]) continue
            totalWorkload[i] = 0
        }
        return totalWorkload
    }
}

function createEmployee(details) {
    let employee = Object.create(employeeProto)
    if(details) Object.assign(employee, details)
    else {
        employee.name = undefined
        employee.workload = []
        employee.cells = {}
    }
    return employee
}

const employeeAreaSeparator = document.querySelector('.employeeAreaSeparator')
const newEmployeeButton = document.querySelector('.newEmployee')
newEmployeeButton.addEventListener('click', event => {
    const newEmployee = createEmployee()
    const container = newEmployee.batchLoad()
    newEmployee.showVisible()
    document.body.insertBefore(container, employeeAreaSeparator)
    console.log(newEmployee, container)
})