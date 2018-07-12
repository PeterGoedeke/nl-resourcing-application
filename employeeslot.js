function calculateCursors() {
    let cursorPastLeftSide = sq.getCursorXLocation(event.pageX) > parseInt(this.display.style.left)
    let cursorCloseToLeftSide = sq.getCursorXLocation(event.pageX) < parseInt(this.display.style.left) + 10
    
    let cursorBeforeRightSide = sq.getCursorXLocation(event.pageX) < parseInt(this.display.style.left) + parseInt(this.display.style.width)
    let cursorCloseToRightSide = sq.getCursorXLocation(event.pageX) > parseInt(this.display.style.left) + parseInt(this.display.style.width) - 10
    return {cursorPastLeftSide, cursorCloseToLeftSide, cursorBeforeRightSide, cursorCloseToRightSide}
}

let employeeSlotProto = {
    initDisplay() {
        this.refreshWorkloadDisplay()
        this.display.style.display = 'none'
        this.hostProject.container.appendChild(this.display)
        sq.rightSidebar.appendChild(this.label)
        this.initDraggable()

        this.display.addEventListener('mouseup', event => {
            if(event.which == 3) {
                openEmployeeSlotDialogue(this, event)
            }
        })
        this.label.addEventListener('keyup', event => {

        })
        this.label.addEventListener('change', event => {
            if(state.employeeExists(this.label.value)) {
                this.assignEmployee(state.getEmployeeFromName(this.label.value))
                this.label.value = this.employee.name
            }
        })
        this.label.addEventListener('blur', event => {
            if(this.label.value === '') {
                this.removeEmployee()
                this.label.value = 'Empty'
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
        }
    },
    setEmployeeWorkload() {
        if(this.employee) {
            this.employee.workload[this.requestWorkloadKey()] = this.requestWorkload()
            this.employee.updateDisplay()
        }
    },
    /*
    temp(newWorkload) {
        this[workloadInformation].length = 0
        this[workloadInformation].push(...newWorkload)
    }*/
    enterWorkloadInformation(id, value) {
        this.requestWorkload()[id] = value
        this.employee.updateDisplay()
    },
    refreshWorkloadInformation() {
        let workload = this.requestWorkload()
        for(key in workload) if(key >= this.endDate || key < this.startDate) delete workload[key]
        for(let i = this.startDate; i < this.endDate; i++) if(!workload[i]) {
            workload[i] = 5
        }
        this.setEmployeeWorkload()
    },
    refreshWorkloadDisplay() {
        let workload = this.requestWorkload()
        while(this.display.firstChild) this.display.removeChild(this.display.firstChild)
        for(let i = this.startDate; i < this.endDate; i++) {            
            let workloadBlock = document.createElement('input')
            workloadBlock.className = 'employeeSlotWorkloadBlock'
            workloadBlock.type = 'text'
            workloadBlock.value = workload[i]

            workloadBlock.addEventListener('change', () => {
                let value = parseInt(workloadBlock.value)
                workloadBlock.value = value
                this.enterWorkloadInformation.call(this, i, value)
            })

            this.display.appendChild(workloadBlock)
        }
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) + 10 + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) - 20 + 'px'
        this.refreshWorkloadInformation()
        this.refreshWorkloadDisplay()
    },
    deleteEmployeeSlot() {
        this.hostProject.container.removeChild(this.display)
        sq.rightSidebar.removeChild(this.label)
        this.hostProject.employeeSlots[this.employeeType].splice(this.hostProject.employeeSlots[this.employeeType].indexOf(this), 1)
    }
}

function createEmployeeSlot(hostProject, employeeType) {
    let workloadInformation = Symbol('workload information')
    let workload = Object.create(null)
    for(let i = hostProject.startDate; i < hostProject.endDate; i++) workload[i] = 5
    let employee = null

    let display = document.createElement('form')
    display.className = 'employeeSlot'

    let label = document.createElement('input')
    label.type = 'text'
    label.value = 'Empty'
    label.className = 'employeeSlotLabel'

    let employeeSlot = Object.assign(
        Object.create(employeeSlotProto),
        horizontalDraggable,
        {hostProject, employeeType, startDate: hostProject.startDate, endDate: hostProject.endDate, employee,
        [workloadInformation]: workload,
        display, label}
    )
    employeeSlot.initDisplay()
    return employeeSlot
}

function createEmployee() {

}