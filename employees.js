const employeeProto = {
    batchLoad() {
        this.container = employeeContainer.cloneNode(true)
        this.body = this.container.querySelector('.employeeBody')
        this.label = this.container.querySelector('.employeeLabel')
        this.body.style.width = columns.applicationWidth + 'px'
        this.container.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'

        this.label.addEventListener('click', event => {
            this.label.style.height = columns.rowHeight + 'px'
            inputify(this.label, newLabel => {
                this.label.innerHTML = newLabel
                this.name = newLabel
                this.label.style.height = 'initial'
            })
        })

        const snapshotTotalWorkload = this.totalWorkload
        for(const key in snapshotTotalWorkload) {
            const cell = createCell(sanitiseForDisplay(snapshotTotalWorkload[key]))
            this.body.appendChild(cell)
            this.cells[key] = cell
        }

        this.label.textContent = this.name || 'Unnamed'
        return this.container
    },
    init() {
        employees.list.push(this)
    },
    showVisible() {

    },
    delete() {

    },
    assignSlot(workload) {
        const preChange = JSON.parse(JSON.stringify(this.totalWorkload))
        this.workload.push(workload)
        refreshCells(preChange)
    },
    removeSlot(workload) {
        const preChange = JSON.parse(JSON.stringify(this.totalWorkload))
        this.workload.splice(this.workload.indexOf(workload), 1)
        refreshCells(preChange)
    },
    refreshCells(preChange) {
        const postChange = this.totalWorkload
        for(const key in postChange) {
            if(Number(postChange[key]) != Number(preChange)) {
                this.cells[key].textContent = sanitiseForDisplay(postChange[key])
                // change colour
            }
        }
    },
    get totalWorkload() {
        let totalWorkload = {}
        this.workload.forEach(workload => {
            for(const key in workload) totalWorkload[key] = totalWorkload[key] + Number(workload[key]) || Number(workload[key])
        })
        for(let i = columns.baseID; i < columns.endID; i++) {
            if(totalWorkload[i]) continue
            totalWorkload[i] = 0
        }
        return totalWorkload
    }
}

const employees = {
    list: [],
    get safeList() {
        return this.list.filter(employee => employee.name)
    },
    get visibleList() {
        return this.safeList.filter(employee => employee.type == projects.visibleType)
    },
    get visibleNames() {
        return this.visibleList.map(employee => employee.name)
    },
    getEmployee(name) {
        return this.visibleList.find(employee => employee.name == name)
    }
}

function createEmployee(details) {
    let employee = Object.create(employeeProto)
    if(details) Object.assign(employee, details)
    else {
        employee.name = undefined
        employee.workload = []
        employee.cells = {}
        employee.type = projects.visibleType
    }
    return employee
}

const employeeAreaSeparator = document.querySelector('.employeeAreaSeparator')
const newEmployeeButton = document.querySelector('.newEmployee')
newEmployeeButton.addEventListener('click', event => {
    const newEmployee = createEmployee()
    const container = newEmployee.batchLoad()
    newEmployee.showVisible()
    newEmployee.init()
    document.body.insertBefore(container, employeeAreaSeparator)
})