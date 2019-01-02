const employeeProto = {
    batchLoad() {
        this.container = employeeContainer.cloneNode(true)
        this.body = this.container.querySelector('.employeeBody')
        this.label = this.container.querySelector('.employeeLabel')
        this.body.style.width = columns.applicationWidth + 'px'
        this.container.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'

        this.label.addEventListener('click', event => {
            this.label.style.height = columns.rowHeight + 'px'
            inputify(this.label, newName => {
                if(!employees.visibleNames.includes(newName) && newName) {
                    this.label.innerHTML = newName
                    this.name = newName
                    this.notifySlots()
                } else {
                    this.label.innerHTML = this.name || 'Unnamed'
                }
                this.label.style.height = 'initial'
            })
        })
        this.body.addEventListener('contextmenu', event => {
            contextMenus.open(2, [
                () => {
                    for(const key in this.cells) {
                        if(this.cells[key] === event.target) {
                            this.joining = key
                            this.colorCells(columns.baseID, columns.endID - 1)
                        }
                    }
                },
                () => {
                    for(const key in this.cells) {
                        if(this.cells[key] === event.target) {
                            this.leaving = key
                            this.colorCells(columns.baseID, columns.endID - 1)
                        }
                    }
                },
                () => {
                    this.joining = undefined
                    this.leaving = undefined
                    this.colorCells(columns.baseID, columns.endID - 1)
                },
                () => {
                    this.toggleInteriors()
                },
                () => {
                    // fulltime
                },
                () => {
                    this.delete()
                    contextMenus.close()
                }], event, pane => {
                    let input = document.createElement('input')
                    input.style.cursor = 'pointer'
                    input.value = this.fullTime
                    input.addEventListener('blur', event => {
                        if(Number(input.value)) {
                            this.fullTime = input.value
                            this.colorCells(columns.baseID, columns.endID - 1)
                        }
                    })
                    input.addEventListener('focus', event => input.select())
                    pane.querySelector('.e4').appendChild(input)
                    pane.querySelector('.e4').style.cursor = 'initial'
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
    notifySlots() {
        this.slots.forEach(slot => slot.refreshLabel())
    },
    showVisible() {

    },
    toggleInteriors() {
        if(this.interiors) {
            this.interiors = false
            insertAfter(this.container, employeeAreaSeparator)
        } else {
            this.interiors = true
            insertAfter(this.container, interiorsEmployeeAreaSeparator)
        }
    },
    delete() {
        employees.list.splice(employees.list.indexOf(this), 1)
        document.body.removeChild(this.container)
    },
    assignSlot(slot) {
        const preChange = JSON.parse(JSON.stringify(this.totalWorkload))
        this.slots.push(slot)
        this.refreshCells(preChange)
    },
    removeSlot(slot) {
        const preChange = JSON.parse(JSON.stringify(this.totalWorkload))
        this.slots.splice(this.slots.indexOf(slot), 1)
        this.refreshCells(preChange)
    },
    refreshCells(preChange) {
        const postChange = this.totalWorkload
        for(const key in postChange) {
            if(Number(postChange[key]) != Number(preChange[key])) {
                this.cells[key].textContent = sanitiseForDisplay(postChange[key])
                this.colorCell(this.cells[key], key)
                console.log('changed')
            }
        }
    },
    colorCells(start, end) {
        for(let i = start; i <= end; i++) {
            this.colorCell(this.cells[i], i)
        }
    },
    colorCell(cell, ID) {
        const color = (() => {
            let color
            if(this.totalWorkload[ID] == 0) color = 'grey'
            else if(this.totalWorkload[ID] > this.fullTime) color = 'red'
            else if(this.totalWorkload[ID] < this.fullTime) color = 'orange'
            else color = 'green'
            return color
        })()
        if(!(this.joining && ID <= this.joining || this.leaving && ID >= this.leaving)) cell.style.background = color
        else cell.style.background = `repeating-linear-gradient(-45deg, ${color}, white 5px, ${color} 5px, white 5px)`
    },
    get totalWorkload() {
        let totalWorkload = {}
        this.slots.map(slot => slot.workload).forEach(workload => {
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
    sortByName() {
        this.list.sort((a, b) => {
            if(!a.name) return -1
            if(!b.name) return 1
            if((a.name.toLowerCase()) < (b.name.toLowerCase())) return -1
            return 1
        })
        this.visibleList.slice().reverse().forEach(employee => {
            insertAfter(employee.container, employeeAreaSeparator)
        })
    },
    get safeList() {
        return this.list.filter(employee => employee.name)
    },
    get visibleList() {
        return this.list.filter(employee => employee.type == projects.visibleType)
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
        employee.slots = []
        employee.cells = {}
        employee.type = projects.visibleType
        employee.fullTime = 5
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
    insertAfter(container, employeeAreaSeparator)
})

const interiorsEmployeeAreaSeparator = document.querySelector('.interiorsEmployeeAreaSeparator')
const newInteriorsEmployeeButton = document.querySelector('.newInteriorsEmployee')
newInteriorsEmployeeButton.addEventListener('click', event => {
    const newEmployee = createEmployee()
    const container = newEmployee.batchLoad()
    newEmployee.interiors = true
    newEmployee.showVisible()
    newEmployee.init()
    insertAfter(container, interiorsEmployeeAreaSeparator)
})

const sortButton = document.querySelector('.sort')
sortButton.addEventListener('click', event => {
    employees.sortByName()
})