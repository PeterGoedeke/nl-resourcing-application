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
            if(event.pageX < sq.contentPane.getBoundingClientRect().left + 30 && direction == 'left') {
                timer = timer || setInterval(() => {
                    sq.contentPane.scrollLeft -= 6
                    if(sq.getVisibleTimeBlockRange()[0] < sq.topAxisContainer.firstChild.textContent + 5) {
                        sm.appendTimeBlock(parseInt(sq.topAxisContainer.firstChild.textContent) - 1, true)
                        sq.positioner.style.width = sq.getTimeBlockWidth() * sq.topAxisContainer.childNodes.length + 'px'
                        data.projects.forEach(project => project.updateDisplay())
                    }
                    sm.appendUntilFit()
                }, 10)
            }
            else if(event.pageX > sq.contentPane.getBoundingClientRect().right - 30 && direction == 'right') {
                timer = timer || setInterval(() => {
                    sq.contentPane.scrollLeft += 6
                    if(sq.getVisibleTimeBlockRange()[1] > sq.topAxisContainer.lastChild.textContent - 5) {
                        appendTimeBlock(parseInt(sq.topAxisContainer.lastChild.textContent) + 1)
                        sq.positioner.style.width = sq.getTimeBlockWidth() * sq.topAxisContainer.childNodes.length + 'px'
                    }
                    sm.appendUntilFit()
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

function calculateCursors() {
    console.log(this.projectDisplay.style.left)
    let cursorPastLeftSide = sq.getCursorXLocation(event.pageX) > parseInt(this.projectDisplay.style.left)
    let cursorCloseToLeftSide = sq.getCursorXLocation(event.pageX) < parseInt(this.projectDisplay.style.left) + 10
    
    let cursorBeforeRightSide = sq.getCursorXLocation(event.pageX) < parseInt(this.projectDisplay.style.left) + parseInt(this.projectDisplay.style.width)
    let cursorCloseToRightSide = sq.getCursorXLocation(event.pageX) > parseInt(this.projectDisplay.style.left) + parseInt(this.projectDisplay.style.width) - 10
    return {cursorPastLeftSide, cursorCloseToLeftSide, cursorBeforeRightSide, cursorCloseToRightSide}
}

const projectProto = {
    initDisplay() {
        this.projectDisplay.addEventListener('mousedown', (event) => {
            let {
                cursorPastLeftSide,
                cursorCloseToLeftSide,
                cursorBeforeRightSide,
                cursorCloseToRightSide
            } = calculateCursors.call(this)
            console.log(cursorPastLeftSide, cursorCloseToLeftSide, cursorBeforeRightSide, cursorCloseToRightSide)
            if(cursorPastLeftSide && cursorCloseToLeftSide) {
                draggingInterface.registerDragging(this, 'left')
            }
            else if(cursorBeforeRightSide && cursorCloseToRightSide) {
                draggingInterface.registerDragging(this, 'right')
            }
        })

        this.projectDisplay.addEventListener('mousemove', (event) => {
            const {
                cursorPastLeftSide,
                cursorCloseToLeftSide,
                cursorBeforeRightSide,
                cursorCloseToRightSide
            } = calculateCursors.call(this)
            if(cursorPastLeftSide && cursorCloseToLeftSide) {
                this.projectDisplay.style.cursor = 'pointer'
            }
            else if(cursorBeforeRightSide && cursorCloseToRightSide) {
                this.projectDisplay.style.cursor = 'pointer'
            }
            else {
                this.projectDisplay.style.cursor = 'auto'
            }
        })

        sq.contentPane.appendChild(this.projectDisplay)
        sq.leftSidebar.insertBefore(this.projectLabel, sq.createProjectButton)
        this.updateDisplay()
    },
    updateDisplay() {
        this.projectDisplay.style.left = logic.getXLocationFromID(this.startDate) + 'px'
        this.projectDisplay.style.width = logic.getXLocationFromID(this.endDate) - logic.getXLocationFromID(this.startDate) + 'px'
    },
    rename(newName) {
        this.name = newName
        this.projectLabel.textContent = this.name
    },
    drag(event, side) {
        sq.contentPane.style.cursor = 'pointer'
        if(side == 'left') {
            this.projectDisplay.style.left = sq.getCursorXLocation(event.pageX) + 'px'
            this.projectDisplay.style.width = logic.getXLocationFromID(this.endDate) - sq.getCursorXLocation(event.pageX) + 'px'
        }
        else if(side == 'right') {
            this.projectDisplay.style.width = sq.getCursorXLocation(event.pageX) - parseInt(this.projectDisplay.style.left) + 'px'
        }
    },
    stopDrag(direction) {
        sq.contentPane.style.cursor = 'auto'
        this.startDate = sq.getNearestTimeBlock(parseInt(this.projectDisplay.style.left))
        this.endDate = sq.getNearestTimeBlock(parseInt(this.projectDisplay.style.left) + parseInt(this.projectDisplay.style.width))
        if(direction == 'left' && this.startDate == this.endDate) this.startDate --
        else if(direction == 'right' && this.startDate == this.endDate) this.endDate ++
        this.updateDisplay()
        console.log(this.startDate, this.endDate)
    }
}

function createProject(name, group, security) {
    let [startDate, endDate] = sq.getVisibleTimeBlockRange('inset')
    let projectDisplay = document.createElement('div')
    projectDisplay.className = 'project'
    let projectLabel = document.createElement('div')
    projectLabel.className = 'projectLabel'
    projectLabel.textContent = name
    let dragging = false

    let project = Object.assign(
        Object.create(projectProto),
        {projectDisplay, projectLabel, dragging},
        {name, group, security, startDate, endDate}
    )
    project.initDisplay()
    return project
}
function createEmployeeSlot(hostProject, employeeType) {
    let workloadInformation = Symbol('workload information')
    let workload = Object.create(null)
    for(let i = hostProject.startDate; i < hostProject.endDate; i++) workload[i] = 5

    let assignedEmployee = 'Empty'

    return {
        hostProject, employeeType, startDate: hostProject.startDate, endDate: hostProject.endDate, assignedEmployee,
        [workloadInformation]: workload,
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
}

function createEmployee() {

}