let leave = (function() {
    let container = document.createElement('div')
    sq.contentPane.appendChild(container)

    let leaveSlotLabelContainer = document.createElement('div')
    leaveSlotLabelContainer.className = 'leaveSlotLabelContainer'
    sq.rightSidebar.insertBefore(leaveSlotLabelContainer, sq.employeeContainer)

    let leaveSlots = {}
    return {
        container, leaveSlotLabelContainer,
        leaveSlots,
        updateDisplay() {
            for(let type in leaveSlots) leaveSlots[type].forEach(leaveSlot => leaveSlot.updateDisplay())
        },
        updateVerticalDisplay() {
            this.container.style.top = sq.getElementTop(sq.leaveLabel) + 'px'
            this.leaveSlotLabelContainer.style.top = 25 + state.projects.length * 10 * zoom.scale + 'px'

            this.leaveSlots[state.visibleType.type].forEach((leaveSlot, i) => leaveSlot.display.style.top = sq.getTotalProjectHeight() + 55 + 10 * zoom.scale + i * 50 * zoom.scale + 'px')
            console.log(sq.getElementTop(this.leaveSlotLabelContainer))
        },
        showVisibleTypes() {
            for(let type in leaveSlots) leaveSlots[type].forEach(leaveSlot => {
                if(leaveSlot.employeeType == state.visibleType.type) {
                    leaveSlot.display.style.display = 'block'
                    leaveSlot.label.style.display = 'block'
                } else {
                    leaveSlot.display.style.display = 'none'
                    leaveSlot.label.style.display = 'none'
                }
            })
        },
        updateZoom() {
            for(let type in this.leaveSlots) this.leaveSlots[type].forEach(leaveSlot => leaveSlot.updateZoom())
        },
        toJSON() {
            let leaveSlotsToSave = {}
            for(let type in leaveSlots) {
                leaveSlotsToSave[type] = []
                leaveSlots[type].forEach(leaveSlot => {
                    leaveSlotsToSave[type].push({
                        employeeType: leaveSlot.employeeType, startDate: leaveSlot.startDate, endDate: leaveSlot.endDate, employee: leaveSlot.employee && leaveSlot.employee.name
                    })
                })
            }
            return Object.assign({}, leaveSlotsToSave)
        }
    }
})();

let leaveSlotProto = {
    initDisplay() {
        sq.contentPane.appendChild(this.display)
        leave.leaveSlotLabelContainer.appendChild(this.label)
        this.initDraggable()
        bindDialogueListeners.call(this)
    },
    updateDisplay() {
        this.display.style.left = getXLocationFromID(this.startDate) + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
        this.refreshWorkloadInformation()
        this.label.value = this.employee && this.employee.name || 'Empty'
    },
    refreshWorkloadInformation() {
        let workload = this.requestWorkload()
        for(let key in workload) if(key >= this.endDate || key < this.startDate) delete workload[key]
        for(let i = this.startDate; i < this.endDate; i++) if(!workload[i]) {
            workload[i] = 5
        }
        this.setEmployeeWorkload()
    },
    delete() {
        sm.validateScroll(this.display)
        sq.contentPane.removeChild(this.display)
        leave.leaveSlotLabelContainer.removeChild(this.label)
        this.removeEmployee()
        leave.leaveSlots[this.employeeType].splice(leave.leaveSlots[this.employeeType].indexOf(this), 1)
    },
    save() {
        save.leave()
    }
}

function createLeaveSlot(employeeType, employee = null, startDate, endDate) {
    if(!startDate && !endDate) [startDate, endDate] = sq.getVisibleTimeBlockRange(true)
    let workloadInformation = Symbol('workload information')
    let workload = Object.create(null)
    for(let i = startDate; i < endDate; i++) workload[i] = 5

    let display = document.createElement('div')
    display.className = 'employeeSlot'

    let label = document.createElement('input')
    label.type = 'text'
    label.value = 'Empty'
    label.className = 'employeeLabel'

    let leaveSlot = Object.assign(
        Object.create(leaveSlotProto),
        horizontalDraggable, slot,
        {employeeType, startDate, endDate, employee,
        [workloadInformation]: workload,
        display, label}
    )
    leaveSlot.initDisplay()
    leaveSlot.initSlot()
    return leaveSlot
}