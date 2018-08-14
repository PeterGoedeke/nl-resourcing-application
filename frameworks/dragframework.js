let draggingInterface = (function() {
    let currentlyDragging = null
    let direction = null
    let timer
    let firstTickOfDrag = false
    addEventListener('mouseup', (event) => {
        if(currentlyDragging) {
            currentlyDragging.dragging = false
            currentlyDragging.stopDrag(direction)
            currentlyDragging = null
        }
    })

    addEventListener('mousemove', (event) => {
        if(currentlyDragging) {
            if(firstTickOfDrag) {
                sq.positioner.style.width = getXLocationFromID(Number(sq.topAxisContainer.lastChild.textContent) + 1) - 16 + 'px'
                firstTickOfDrag = false
            }
            currentlyDragging.drag(event, direction)
            sq.positioner.style.width = currentlyDragging.offsetWidth - state.sidebarWidth + sq.getTimeBlockWidth() - 16 + 'px'
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
                                sq.positioner.style.width = sq.getTimeBlockWidth() * sq.topAxisContainer.childNodes.length - 16 + 'px'
                                state.baseDate --
                                state.projects.forEach(project => {
                                    project.updateDisplay()
                                    project.employeeSlots[state.visibleType.type].forEach(employeeSlot => employeeSlot.updateDisplay())
                                })
                                leave.leaveSlots[state.visibleType.type].forEach(leaveSlot => leaveSlot.updateDisplay())
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
                            if(sq.getVisibleTimeBlockRange()[1] >= parseInt(sq.topAxisContainer.lastChild.textContent)) {
                                sm.appendTimeBlock(parseInt(sq.topAxisContainer.lastChild.textContent) + 1)
                                sq.positioner.style.width = sq.getTimeBlockWidth() * sq.topAxisContainer.childNodes.length - 16 + 'px'
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
            firstTickOfDrag = true
        },
        get currentlyDragging() { return currentlyDragging }
    }
})()

let verticalDraggable = {
    draggableType: 'vertical',
    initDraggable() {
        
    }
}

let horizontalDraggable = {
    draggableType: 'horizontal',
    initDraggable() {
        this.display.addEventListener('mousedown', (event) => {
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

        this.display.addEventListener('mousemove', (event) => {
            const {
                cursorPastLeftSide,
                cursorCloseToLeftSide,
                cursorBeforeRightSide,
                cursorCloseToRightSide
            } = calculateCursors.call(this)
            if(cursorPastLeftSide && cursorCloseToLeftSide) {
                this.display.style.cursor = 'e-resize'
            }
            else if(cursorBeforeRightSide && cursorCloseToRightSide) {
                this.display.style.cursor = 'e-resize'
            }
            else {
                this.display.style.cursor = 'auto'
            }
        })
    },
    drag(event, side) {
        sq.contentPane.style.cursor = 'e-resize'
        if(side == 'left') {
            if(sq.getCursorXLocation(event.pageX) < getXLocationFromID(this.endDate)) this.display.style.left = sq.getCursorXLocation(event.pageX) + 'px'
            this.display.style.width = getXLocationFromID(this.endDate) - sq.getCursorXLocation(event.pageX) + 'px'
        }
        else if(side == 'right') {
            this.display.style.width = sq.getCursorXLocation(event.pageX) - parseInt(this.display.style.left) + 'px'
        }
    },
    stopDrag(direction) {
        sq.contentPane.style.cursor = 'auto'
        if(this.employeeSlotLabelContainer) {
            const fromEnd = direction == 'right'
            let amount
            if(fromEnd) amount = sq.getNearestTimeBlock(parseInt(this.display.style.left) + parseInt(this.display.style.width)) - this.endDate
            else amount = sq.getNearestTimeBlock(parseInt(this.display.style.left)) - this.startDate
            this.resizeEmployeeSlots(amount, fromEnd)
        }
        this.startDate = sq.getNearestTimeBlock(parseInt(this.display.style.left))
        if(this.startDate < sq.getVisibleTimeBlockRange()[0] && direction == 'left') this.startDate = sq.getVisibleTimeBlockRange(true)[0]
        this.endDate = sq.getNearestTimeBlock(parseInt(this.display.style.left) + parseInt(this.display.style.width))
        if(direction == 'left' && this.startDate == this.endDate) this.startDate --
        else if(direction == 'right' && this.startDate == this.endDate) this.endDate ++
        if(this.hostProject) {
            this.updateDisplay(direction == 'left' ? this.display.firstElementChild.value : this.display.lastElementChild.value)
        }
        else this.updateDisplay()
        state.calculateDateRange()
        sm.appendToEdges()
        this.save()
    }
}