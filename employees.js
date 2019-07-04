const employeeProto = {
    batchLoad() {
        this.container = employeeContainer.cloneNode(true)
        this.body = this.container.querySelector('.employeeBody')
        this.label = this.container.querySelector('.employeeLabel')
        this.body.style.width = columns.applicationWidth + 'px'
        this.container.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'

        this.label.addEventListener('click', this.inputifyLabel.bind(this))
        this.body.addEventListener('contextmenu', this.contextMenu.bind(this))
        this.label.addEventListener('contextmenu', this.contextMenu.bind(this))

        const snapshotTotalWorkload = this.totalWorkload
        for(const key in snapshotTotalWorkload) {
            const cell = createCell(sanitiseForDisplay(snapshotTotalWorkload[key]))
            this.body.appendChild(cell)
            this.cells[key] = cell
        }

        this.label.textContent = this.name || 'Unnamed'
        return this.container
    },
    inputifyLabel() {
        this.label.style.height = columns.rowHeight + 'px'
        inputifyNav(this.label, newName => {
            if(!employees.visibleNames.map(name => name.toLowerCase()).includes(newName.toLowerCase()) && newName) {
                this.label.innerHTML = newName
                this.name = newName
                this.notifySlots()
                save.employees()
                save.projects()
            } else {
                this.label.innerHTML = this.name || 'Unnamed'
            }
            this.label.style.height = 'initial'
        }, direction => {
            if(direction == DIRECTIONS.up) {
                if(employees.visibleList.indexOf(this) > 0) employees.visibleList[employees.visibleList.indexOf(this) - 1].inputifyLabel()
            } else if(direction == DIRECTIONS.down) {
                if(employees.visibleList.indexOf(this) < employees.visibleList.length - 1) employees.visibleList[employees.visibleList.indexOf(this) + 1].inputifyLabel()
            }
        })
    },
    contextMenu(event) {
        contextMenus.open(2, [
            () => {
                for(const key in this.cells) {
                    if(this.cells[key] === event.target) {
                        this.joining = key
                        this.colorCells(columns.baseID, columns.endID - 1)
                        rows.refreshCellsEmployees()
                    }
                }
                save.employees()
            },
            () => {
                for(const key in this.cells) {
                    if(this.cells[key] === event.target) {
                        this.leaving = key
                        this.colorCells(columns.baseID, columns.endID - 1)
                        rows.refreshCellsEmployees()
                    }
                }
                save.employees()
            },
            () => {
                this.joining = undefined
                this.leaving = undefined
                this.colorCells(columns.baseID, columns.endID - 1)
                rows.refreshCellsEmployees()
                save.employees()
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
                    this.fullTime = Number(input.value)
                    this.colorCells(columns.baseID, columns.endID - 1)
                    rows.refreshCellsEmployees()
                    save.employees()
                }
            })
            input.addEventListener('focus', event => input.select())
            pane.querySelector('.e4').appendChild(input)
            pane.querySelector('.e4').style.cursor = 'initial'
        })
    },
    notifySlots() {
        this.slots.forEach(slot => slot.refreshLabel())
    },
    showVisible() {
        if(this.type == sheets.visible) {
            if(this.interiors) insertAfter(this.container, interiorsEmployeeAreaSeparator)
            else insertAfter(this.container, employeeAreaSeparator)
        }
        else try {
            document.body.removeChild(this.container)
        } catch (err) {

        }
    },
    toggleInteriors() {
        if(this.interiors) {
            this.interiors = false
            insertAfter(this.container, employeeAreaSeparator)
        } else {
            this.interiors = true
            insertAfter(this.container, interiorsEmployeeAreaSeparator)
        }
        save.employees()
    },
    delete() {
        employees.list.splice(employees.list.indexOf(this), 1)
        if(this.type == sheets.active.name) document.body.removeChild(this.container)
        this.slots.forEach(slot => slot.removeEmployee())
        rows.refreshCellsEmployees()
        save.employees()
        save.projects()
        //clash
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
        save.employees()
    },
    refreshCells(preChange) {
        const postChange = this.totalWorkload
        for(const key in postChange) {
            if(this.cells[key] && Number(postChange[key]) != Number(preChange[key])) {
                this.cells[key].textContent = sanitiseForDisplay(postChange[key])
                this.colorCell(this.cells[key], key)
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
            if(this.totalWorkload[ID] > this.fullTime) color = '#ff0000'
            else if(this.totalWorkload[ID] < this.fullTime - 1) color = '#ffa500'
            else color = '#008000'
            return color
        })()
        if(!(this.joining && ID <= this.joining || this.leaving && ID >= this.leaving)) cell.style.background = color
        else cell.style.background = `repeating-linear-gradient(-45deg, grey, lightgrey 5px, grey 5px, lightgrey 5px)`
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
    },
    toJSON() {
        return {
            fullTime: this.fullTime,
            interiors: this.interiors,
            name: this.name,
            type: this.type,
            joining: this.joining,
            leaving: this.leaving
        }
    }
}

const employees = {
    list: [],
    showVisible() {
        this.list.forEach(employee => employee.showVisible())
    },
    sortByName() {
        this.list.sort((a, b) => {
            if(!a.name) return -1
            if(!b.name) return 1
            if((a.name.toLowerCase()) < (b.name.toLowerCase())) return -1
            return 1
        })
        this.list = this.list.filter(employee => !employee.interiors).concat(this.list.filter(employee => employee.interiors))
        this.visibleList.slice().reverse().forEach(employee => {
            if(employee.interiors) {
                insertAfter(employee.container, interiorsEmployeeAreaSeparator)
            } else {
                insertAfter(employee.container, employeeAreaSeparator)
            }
        })
        save.employees()
    },
    get safeList() {
        return this.list.filter(employee => employee.name)
    },
    get visibleList() {
        return this.list.filter(employee => employee.type == sheets.visible)
    },
    get visibleNames() {
        return this.visibleList.map(employee => employee.name).filter(name => name)
    },
    byType(type) {
        return this.list.filter(employee => employee.type == type)
    },
    getEmployee(name, list = this.visibleList) {
        return list.find(employee => employee.name && employee.name.toLowerCase() == name.toLowerCase())
    }
}

function createEmployee(details) {
    let employee = Object.create(employeeProto)
    if(details) Object.assign(employee, details)
    else {
        employee.name = undefined
        employee.type = sheets.visible
        employee.fullTime = 5
    }
    employee.slots = []
    employee.cells = {}
    employees.list.push(employee)
    return employee
}

const employeeAreaSeparator = document.querySelector('.employeeAreaSeparator')
const newEmployeeButton = document.querySelector('.newEmployee')
newEmployeeButton.addEventListener('click', event => addEmployee())

const interiorsEmployeeAreaSeparator = document.querySelector('.interiorsEmployeeAreaSeparator')
const newInteriorsEmployeeButton = document.querySelector('.newInteriorsEmployee')
newInteriorsEmployeeButton.addEventListener('click', event => addEmployee(true))

const sortButton = document.querySelector('.sort')
sortButton.addEventListener('click', event => {
    employees.sortByName()
})

function addEmployee(interiors = false) {
    if(sheets.types.length > 0) {
        const newEmployee = createEmployee()
        const container = newEmployee.batchLoad()
        rows.refreshCellsEmployees()
        if(interiors) newEmployee.interiors = true
        insertAfter(container, interiors ? interiorsEmployeeAreaSeparator : employeeAreaSeparator)
        newEmployee.inputifyLabel()
    } else {
        const element = (interiors ? newInteriorsEmployeeButton : newInteriorsProjectButton)
        element.classList.add('invalid')
        setTimeout(() => element.classList.remove('invalid'), 200)
    }
    employees.sortByName()
}