let draggingInterface = (function() {
    let currentlyDragging = null
    let direction = null
    let timer
    addEventListener('mouseup', (event) => {
        if(currentlyDragging) {
            currentlyDragging.dragging = false
            currentlyDragging.stopDrag(direction)
            currentlyDragging = null
        }
    })

    addEventListener('mousemove', (event) => {
        if(currentlyDragging) {
            currentlyDragging.drag(event, direction)
            sq.positioner.style.width = currentlyDragging.offsetWidth - 175 + sq.getTimeBlockWidth() + 'px'
            /*
            timer = timer || setInterval(() => {
                if(currentlyDragging) {
                    //console.log(event.pageX)
                    if(event.pageX < sq.contentPane.getBoundingClientRect().left + 30) {
                        console.log('hello')
                    }
                    else if(event.pageX > sq.contentPane.getBoundingClientRect().right - 30) {
                        console.log('hi')
                    }
                }
            }, 10)
            */
            if(event.pageX < sq.contentPane.getBoundingClientRect().left + 30) {
                timer = timer || setInterval(() => {
                    if(currentlyDragging) {
                        currentlyDragging.drag(event, direction)
                        if(direction == 'left') {
                            sq.contentPane.scrollLeft -= 6
                            if(sq.getVisibleTimeBlockRange()[0] == parseInt(sq.topAxisContainer.firstChild.textContent)) {
                                sm.appendTimeBlock(parseInt(sq.topAxisContainer.firstChild.textContent) - 1, true)
                                sq.positioner.style.width = sq.getTimeBlockWidth() * sq.topAxisContainer.childNodes.length + 'px'
                                state.baseDate --
                                state.projects.forEach(project => project.updateDisplay())
                                sq.contentPane.scrollLeft = sq.getTimeBlockWidth() * 2
                            }
                            sm.appendUntilFit()
                        }
                        else if(direction == 'right') {
                            sq.contentPane.scrollLeft -= 6
                        }
                    }
                }, 10)
            }
            else if(event.pageX > sq.contentPane.getBoundingClientRect().right - 30) {
                timer = timer || setInterval(() => {
                    if(currentlyDragging) {
                        currentlyDragging.drag(event, direction)
                        if(direction == 'right') {
                            sq.contentPane.scrollLeft += 6
                            if(sq.getVisibleTimeBlockRange()[1] == parseInt(sq.topAxisContainer.lastChild.textContent)) {
                                sm.appendTimeBlock(parseInt(sq.topAxisContainer.lastChild.textContent) + 1)
                                sq.positioner.style.width = sq.getTimeBlockWidth() * sq.topAxisContainer.childNodes.length + 'px'
                            }
                            sm.appendUntilFit()
                        }
                        else if(direction == 'left') {
                            sq.contentPane.scrollLeft += 6
                        }
                    }
                }, 10)
            }
            else {
                clearInterval(timer)
                timer = undefined    
            }
        }
        else {
            clearInterval(timer)
            timer = undefined
        }
    })
    return {
        registerDragging(draggedObject, directionParam) {
            currentlyDragging = draggedObject
            currentlyDragging.dragging = true
            direction = directionParam
        }
    }
})()

let draggable = {
    drag(event, side) {
        sq.contentPane.style.cursor = 'pointer'
        if(side == 'left') {
            this.display.style.left = sq.getCursorXLocation(event.pageX) + 'px'
            this.display.style.width = getXLocationFromID(this.endDate) - sq.getCursorXLocation(event.pageX) + 'px'
        }
        else if(side == 'right') {
            this.display.style.width = sq.getCursorXLocation(event.pageX) - parseInt(this.display.style.left) + 'px'
        }
    },
    stopDrag(direction) {
        sq.contentPane.style.cursor = 'auto'
        this.startDate = sq.getNearestTimeBlock(parseInt(this.display.style.left))
        this.endDate = sq.getNearestTimeBlock(parseInt(this.display.style.left) + parseInt(this.display.style.width))
        if(direction == 'left' && this.startDate == this.endDate) this.startDate --
        else if(direction == 'right' && this.startDate == this.endDate) this.endDate ++
        this.updateDisplay()
        console.log(this.startDate, this.endDate)
    }
}

function calculateCursors() {
    let cursorPastLeftSide = sq.getCursorXLocation(event.pageX) > parseInt(this.display.style.left)
    let cursorCloseToLeftSide = sq.getCursorXLocation(event.pageX) < parseInt(this.display.style.left) + 10
    
    let cursorBeforeRightSide = sq.getCursorXLocation(event.pageX) < parseInt(this.display.style.left) + parseInt(this.display.style.width)
    let cursorCloseToRightSide = sq.getCursorXLocation(event.pageX) > parseInt(this.display.style.left) + parseInt(this.display.style.width) - 10
    return {cursorPastLeftSide, cursorCloseToLeftSide, cursorBeforeRightSide, cursorCloseToRightSide}
}

let employeeSlotProto = {
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
    reallocateWorkload(newWorkload) {
        this[workloadInformation].length = 0
        this[workloadInformation].push(...newWorkload)
    }
}

function createEmployeeSlot(hostProject, employeeType) {
    let workloadInformation = Symbol('workload information')
    let workload = Object.create(null)
    for(let i = hostProject.startDate; i < hostProject.endDate; i++) workload[i] = 5

    let assignedEmployee = 'Empty'

    let employeeSlot = Object.assign(
            Object.create(employeeSlotProto,
            {hostProject, employeeType, startDate: hostProject.startDate, endDate: hostProject.endDate, assignedEmployee,
            [workloadInformation]: workload}
        )
    )

    return employeeSlot
}

function createEmployee() {

}