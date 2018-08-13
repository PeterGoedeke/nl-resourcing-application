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
        this.labelWrapper.appendChild(this.label)
        this.labelWrapper.appendChild(this.autocompleteLabel)
        this.hostProject.employeeSlotLabelContainer.appendChild(this.labelWrapper)
        this.initDraggable()
        
        this.label.addEventListener('keydown', event => {
            if(event.which == 39 && event.target.selectionStart == this.label.value.length) {
                tab.right(this.label, this)
            }
            if(event.which == 37 && event.target.selectionStart == 0) {
                tab.left(this.label, this)
            }
            if(event.which == 38) {
                tab.up(this.label, this)
            }
            if(event.which == 40) {
                tab.down(this.label, this)
            }
        })
        bindDialogueListeners.call(this, 'Employee Slot')
        this.updateDisplay()
        sm.updateBackground()
    },
    enterWorkloadInformation(id, value) {
        this.requestWorkload()[id] = value
        if(this.employee) this.employee.updateDisplay()
    },
    refreshWorkloadInformation(enter = 5) {
        let workload = this.requestWorkload()
        for(key in workload) if(key >= this.endDate || key < this.startDate) delete workload[key]
        for(let i = this.startDate; i < this.endDate; i++) if(!workload[i]) {
            workload[i] = enter
        }
        this.setEmployeeWorkload()
    },
    refreshWorkloadDisplay() {
        let workload = this.requestWorkload()
        while(this.display.firstChild) this.display.removeChild(this.display.firstChild)
        for(let i = this.startDate; i < this.endDate; i++) {            
            let workloadBlock = document.createElement('input')
            workloadBlock.className = 'employeeSlotWorkloadBlock'
            if(i == this.startDate) {
                workloadBlock.style.width = 60 * zoom.scale + 'px'
                workloadBlock.style.marginLeft = 20 * zoom.scale + 'px'
            }
            else if(i == this.endDate - 1) {
                workloadBlock.style.width = 60 * zoom.scale + 'px'
                workloadBlock.style.marginRight = 20 * zoom.scale + 'px'
            }
            else {
                workloadBlock.style.width = 100 * zoom.scale + 'px'
            }
            workloadBlock.type = 'text'
            workloadBlock.value = workload[i]

            workloadBlock.addEventListener('change', () => {
                if(isNaN(workloadBlock.value)) {
                    workloadBlock.value = workloadBlock.value = workload[i]
                } else {
                    this.enterWorkloadInformation.call(this, i, Math.abs(workloadBlock.value))
                    workloadBlock.value = workloadBlock.value = workload[i]
                    save.projects()
                }
            })
            workloadBlock.addEventListener('keydown', event => {
                if(event.which == 39) {
                    tab.right(workloadBlock, this)
                }
                if(event.which == 37) {
                    tab.left(workloadBlock, this)
                }
                if(event.which == 38) {
                    tab.up(workloadBlock, this)
                }
                if(event.which == 40) {
                    tab.down(workloadBlock, this)
                }
            })
            initInput(workloadBlock)
            this.display.appendChild(workloadBlock)
        }
    },
    updateZoom() {
        this.display.style.height = 50 * zoom.scale + 'px'
        this.labelWrapper.style.height = 50 * zoom.scale + 'px'

        this.display.style.lineHeight = 50 * zoom.scale + 'px'
        this.display.style.fontSize = 40 * zoom.scale + 'px'
        if(zoom.scale <= 0.2) this.display.style.fontWeight = 'bold'
        else this.display.style.fontWeight = 'initial'
    },
    updateDisplay(enter = 5) {
        this.display.style.left = getXLocationFromID(this.startDate) - 2 + 20 * zoom.scale + 'px'
        this.display.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) - 40 * zoom.scale + 'px'
        this.label.value = this.employee && this.employee.name || 'Empty'
        this.refreshWorkloadInformation(enter)
        this.refreshWorkloadDisplay()
    },
    requestWorkload() {
        return this[Object.getOwnPropertySymbols(this)[0]]
    },
    delete() {
        if(this.hostProject.employeeSlots[state.visibleType.type].length > 1) sm.validateScroll(this.display)
        this.hostProject.container.removeChild(this.display)
        this.hostProject.employeeSlotLabelContainer.removeChild(this.labelWrapper)
        this.removeEmployee()
        this.hostProject.employeeSlots[this.employeeType].splice(this.hostProject.employeeSlots[this.employeeType].indexOf(this), 1)
    },
    save() {
        save.projects()
    }
}

function createEmployeeSlot(hostProject, employeeType, workload = Object.create(null), employee = null, startDate, endDate) {
    let workloadInformation = Symbol('workload information')
    if(Object.keys(workload).length == 0) for(let i = hostProject.startDate; i < hostProject.endDate; i++) workload[i] = 5
    if(!startDate && !endDate) [startDate, endDate] = [hostProject.startDate, hostProject.endDate]

    let display = document.createElement('form')
    display.className = 'employeeSlot'

    let label = document.createElement('input')
    label.type = 'text'
    label.value = 'Empty'
    label.className = 'employeeSlotLabel'

    let labelWrapper = document.createElement('div')
    labelWrapper.className = 'employeeSlotLabelWrapper'
    let autocompleteLabel = document.createElement('input')
    autocompleteLabel.type = 'text'
    autocompleteLabel.disabled = true
    autocompleteLabel.className = 'autocompleteLabel'

    let employeeSlot = Object.assign(
        Object.create(employeeSlotProto),
        horizontalDraggable, slot,
        {hostProject, employeeType, startDate, endDate, employee,
        [workloadInformation]: workload,
        display, label, labelWrapper, autocompleteLabel}
    )
    employeeSlot.initDisplay()
    employeeSlot.initSlot()
    return employeeSlot
}