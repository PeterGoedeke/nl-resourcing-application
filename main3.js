function calculateCursors() {
    let cursorPastLeftSide = sq.getCursorXLocation(event.pageX) > parseInt(this.display.style.left)
    let cursorCloseToLeftSide = sq.getCursorXLocation(event.pageX) < parseInt(this.display.style.left) + 10
    
    let cursorBeforeRightSide = sq.getCursorXLocation(event.pageX) < parseInt(this.display.style.left) + parseInt(this.display.style.width)
    let cursorCloseToRightSide = sq.getCursorXLocation(event.pageX) > parseInt(this.display.style.left) + parseInt(this.display.style.width) - 10
    return {cursorPastLeftSide, cursorCloseToLeftSide, cursorBeforeRightSide, cursorCloseToRightSide}
}

let employeeSlotProto = {
    initDisplay(workload) {
        this.refreshWorkload(workload)
        this.display.style.display = 'none'
        this.hostProject.display.appendChild(this.display)
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
    refreshWorkload(workload) {
        while(this.display.firstChild) this.display.removeChild(this.display.firstChild)
        for(let i = this.startDate; i < this.endDate; i++) {
            let workloadBlock = document.createElement('div')
            workloadBlock.className = 'employeeSlotWorkloadBlock'
            
            let workloadBlockInput = document.createElement('input')
            workloadBlockInput.className = 'employeeSlotWorkloadBlockInput'
            workloadBlockInput.type = 'text'
            workloadBlockInput.value = workload[i]
            
            workloadBlock.appendChild(workloadBlockInput)
            this.display.appendChild(workloadBlock)
        }
    }
}

function createEmployeeSlot(hostProject, employeeType) {
    let workloadInformation = Symbol('workload information')
    let workload = Object.create(null)
    for(let i = hostProject.startDate; i < hostProject.endDate; i++) workload[i] = 5
    let assignedEmployee = 'Empty'

    let display = document.createElement('div')
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
    employeeSlot.initDisplay(employeeSlot[workloadInformation])
    return employeeSlot
}

function createEmployee() {

}