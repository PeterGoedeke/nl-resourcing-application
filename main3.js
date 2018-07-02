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
        this.initDraggable()
    },
    requestWorkload() {
        return this[Object.getOwnPropertySymbols(this)[0]]
    },
    assignEmployee(employee) {
        this.assignedEmployee = employee
        this.assignedEmployee.workload[workloadInformation] = this[workloadInformation]
    },
    removeEmployee() {
        if(this.employee.name) {
            delete this.employee.workload[workloadInformation]
            this.employee = null
        }
    },
    temp(newWorkload) {
        this[workloadInformation].length = 0
        this[workloadInformation].push(...newWorkload)
    },
    changeWorkloadAtIndex(index, newWorkload) {
        this[workloadInformation][index] = newWorkload
    },
    enterWorkloadInformation(id, value) {
        this.requestWorkload()[id] = value
    },
    refreshWorkloadInformation() {
        let workload = this.requestWorkload()
        for(key in workload) if(key >= this.endDate || key < this.startDate) delete workload[key]
        for(let i = this.startDate; i < this.endDate; i++) if(!workload[i]) {
            workload[i] = 5
        }
        console.log('--------')
        for(key in workload) console.log(key, workload[key])
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
                this.enterWorkloadInformation.call(this, i, workloadBlock.value)
                console.log(workloadBlock.value)
            })

            this.display.appendChild(workloadBlock)
        }
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) + 10 + 'px'
        this.display.style.top = this.hostProject.display.getBoundingClientRect().top + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) - 20 + 'px'
        this.refreshWorkloadInformation()
        this.refreshWorkloadDisplay()
    }
}

function createEmployeeSlot(hostProject, employeeType) {
    let workloadInformation = Symbol('workload information')
    let workload = Object.create(null)
    for(let i = hostProject.startDate; i < hostProject.endDate; i++) workload[i] = 5
    let assignedEmployee = 'Empty'

    let display = document.createElement('form')
    display.className = 'employeeSlot'

    let employeeSlotLabel = document.createElement('div')
    employeeSlotLabel.className = 'employeeSlotLabel'

    let employeeSlot = Object.assign(
        Object.create(employeeSlotProto),
        draggable,
        {hostProject, employeeType, startDate: hostProject.startDate, endDate: hostProject.endDate, assignedEmployee,
        [workloadInformation]: workload,
        display, employeeSlotLabel}
    )
    employeeSlot.initDisplay()
    return employeeSlot
}

function createEmployee() {

}