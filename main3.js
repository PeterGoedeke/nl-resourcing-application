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
            positioner.style.width = currentlyDragging.offsetWidth - 175 + screenQuery.getTimeBlockWidth() + 'px'
            if(event.pageX < contentPane.getBoundingClientRect().left + 30 && direction == 'left') {
                timer = timer || setInterval(() => {
                    contentPane.scrollLeft -= 6
                    if(screenQuery.getVisibleTimeBlockRange()[0] < timeAxis.firstChild.textContent + 5) {
                        appendTimeBlock(parseInt(timeAxis.firstChild.textContent) - 1, true)
                        positioner.style.width = screenQuery.getTimeBlockWidth() * timeAxis.childNodes.length + 'px'
                        projects.forEach(project => project.updateDisplay())
                    }
                    appendUntilFit()
                }, 10)
            }
            else if(event.pageX > contentPane.getBoundingClientRect().right - 30 && direction == 'right') {
                console.log(timer)
                timer = timer || setInterval(() => {
                    //console.log('hello')
                    contentPane.scrollLeft += 6
                    if(screenQuery.getVisibleTimeBlockRange()[1] > timeAxis.lastChild.textContent - 5) {
                        appendTimeBlock(parseInt(timeAxis.lastChild.textContent) + 1)
                        positioner.style.width = screenQuery.getTimeBlockWidth() * timeAxis.childNodes.length + 'px'
                    }
                    appendUntilFit()
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
    let cursorPastLeftSide = getCursorXLocation(event.pageX) > parseInt(this.projectDisplay.style.left)
    let cursorCloseToLeftSide = getCursorXLocation(event.pageX) < parseInt(this.projectDisplay.style.left) + 10
    
    let cursorBeforeRightSide = getCursorXLocation(event.pageX) < parseInt(this.projectDisplay.style.left) + parseInt(this.projectDisplay.style.width)
    let cursorCloseToRightSide = getCursorXLocation(event.pageX) > parseInt(this.projectDisplay.style.left) + parseInt(this.projectDisplay.style.width) - 10
    return {cursorPastLeftSide, cursorCloseToLeftSide, cursorBeforeRightSide, cursorCloseToRightSide}
}

let projectProto = {
    initDisplay() {
        this.projectDisplay.addEventListener('mousedown', (event) => {
            const {
                cursorPastLeftSide,
                cursorCloseToLeftSide,
                cursorBeforeRightSide,
                cursorCloseToRightSide
            } = calculateCursors.call(this)
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

        contentPane.appendChild(this.projectDisplay)
        document.querySelector('.leftSidebar').insertBefore(this.projectLabel, document.querySelector('.createProject'))
        this.updateDisplay()
    },
    updateDisplay() {
        this.projectDisplay.style.left = getXLocationFromID(this.startDate) + 'px'
        this.projectDisplay.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
    },
    rename(newName) {
        this.name = newName
        this.projectLabel.textContent = this.name
    },
    drag(event, side) {
        contentPane.style.cursor = 'pointer'
        if(side == 'left') {
            this.projectDisplay.style.left = getCursorXLocation(event.pageX) + 'px'
            this.projectDisplay.style.width = getXLocationFromID(this.endDate) - getCursorXLocation(event.pageX) + 'px'
        }
        else if(side == 'right') {
            this.projectDisplay.style.width = getCursorXLocation(event.pageX) - parseInt(this.projectDisplay.style.left) + 'px'
        }
    },
    stopDrag(direction) {
        contentPane.style.cursor = 'auto'
        this.startDate = getNearestTimeBlock(parseInt(this.projectDisplay.style.left))
        this.endDate = getNearestTimeBlock(parseInt(this.projectDisplay.style.left) + parseInt(this.projectDisplay.style.width))
        if(direction == 'left' && this.startDate == this.endDate) this.startDate --
        else if(direction == 'right' && this.startDate == this.endDate) this.endDate ++
        this.updateDisplay()
        console.log(this.startDate, this.endDate)
    }
}

function createProject(name, group, security) {
    let [startDate, endDate] = screenQuery.getVisibleTimeBlockRange(true)
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