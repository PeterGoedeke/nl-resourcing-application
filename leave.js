let leave = (function() {
    let container = document.createElement('div')
    sq.contentPane.appendChild(container)

    let leaveSlots = {}
    state.employeeTypes.forEach(type => leaveSlots[type] = [])
    return {
        container, 
        leaveSlots,
        updateVerticalDisplay() {
            this.container.style.top = sq.getElementTop(sq.leaveLabel) + 'px'

            this.leaveSlots[state.visibleType].forEach((leaveSlot, i) => {
                leaveSlot.display.style.top = sq.getElementTop(sq.leaveLabel) + i * 25 + 'px'
                leaveSlot.label.style.top = parseInt(leaveSlot.display.style.top) - sq.contentPane.scrollTop + 'px'
            })
        }
    }
})();

let leaveSlotProto = {
    initDisplay() {
        leave.container.appendChild(this.display)
        sq.rightSidebar.appendChild(this.label)
        this.initDraggable()
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) + 10 + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) - 20 + 'px'
    },
    assignEmployee(employee) {
        this.removeEmployee()
        this.employee = employee
        this.employee.updateDisplay()
    },
    removeEmployee() {
        if(this.employee) {
            this.employee.updateDisplay()
            this.employee = null
            this.label.value = 'Empty'
        }
    },
    deleteLeaveSlot() {
        leave.container.removeChild(this.display)
        sq.rightSidebar.removeChild(this.label)
        this.removeEmployee()
        leave.leaveSlots[this.employeeType].splice(leave.leaveSlots[this.employeeType].indexOf(this), 1)
    }
}

function createLeaveSlot(employeeType) {
    let employee = null

    let display = document.createElement('div')
    display.className = 'employeeSlot'

    let label = document.createElement('input')
    label.type = 'text'
    label.value = 'Empty'
    label.className = 'employeeSlotLabel'

    let leaveSlot = Object.assign(
        Object.create(leaveSlotProto),
        horizontalDraggable, slot,
        {employeeType, startDate: sq.getVisibleTimeBlockRange()[0], endDate: sq.getVisibleTimeBlockRange()[1], employee,
        display, label}
    )
    leaveSlot.initDisplay()
    leaveSlot.initSlot()
    return leaveSlot
}