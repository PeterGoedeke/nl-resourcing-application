const employeeTypeProto = {
    initDisplay() {
        sq.bottomMargin.insertBefore(this.display, sq.zoomContainer)
        
        this.display.addEventListener('mouseup', event => {
            if(event.which == 3) {
                openObjectDialogue(this, event)
            }
        })
        this.display.addEventListener('mouseup', event => {
            state.setVisibleType(this)

        })
        this.display.addEventListener('dblclick', event => {
            let displayInput = document.createElement('input')
            displayInput.type = 'text'
            displayInput.className = 'employeeTypeInput'
            displayInput.value = this.type
            displayInput.addEventListener('blur', event => {
                if(displayInput.value != this.type && !state.employeeTypes
                    .map(employeeType => employeeType.type).includes(displayInput.value.toUpperCase())) {
                    
                    displayInput.value = displayInput.value.toUpperCase()
                    state.projects.forEach(project => {
                        project.employeeSlots[displayInput.value] = project.employeeSlots[this.type].slice(0)
                        project.employeeSlots[displayInput.value].forEach(employeeSlot => {
                            employeeSlot.employeeType = displayInput.value
                        })
                        delete project.employeeSlots[this.type]
                    })
                    leave.leaveSlots[displayInput.value] = leave.leaveSlots[this.type].slice(0)
                    leave.leaveSlots[displayInput.value].forEach(leaveSlot => {
                        leaveSlot.employeeType = displayInput.value
                    })
                    delete leave.leaveSlots[this.type]

                    state.employees.filter(employee => employee.employeeType == this.type).forEach(employee => employee.employeeType = displayInput.value)
                    this.type = displayInput.value
                    this.display.removeChild(displayInput)
                    this.display.appendChild(document.createTextNode(this.type))
                    state.setVisibleType(state.visibleType)
                } else {
                    displayInput.value = this.type
                }
            })

            this.display.removeChild(this.display.firstChild)
            this.display.appendChild(displayInput)
            initInput(displayInput)
            displayInput.focus()
        })
    },
    delete() {
        if(state.employeeTypes.length > 1) {
            state.employees.filter(employee => employee.employeeType == this.type).forEach(employee => employee.delete())
            sq.bottomMargin.removeChild(this.display)
            state.projects.forEach(project => project.employeeSlots[this.type].forEach(employeeSlot => employeeSlot.delete()))
            state.projects.forEach(project => delete project.employeeSlots[this.type])
            leave.leaveSlots[this.type].forEach(leaveSlot => leaveSlot.delete())
            delete leave.leaveSlots[this.type]
            
            state.employeeTypes.splice(state.employeeTypes.indexOf(this), 1)
            if(state.visibleType == this) state.setVisibleType(state.employeeTypes[0])
        }
    },
    toJSON() {
        return {type: this.type}
    }
}

function createEmployeeType(type) {
    let display = document.createElement('div')
    display.className = 'employeeType marginElement'
    display.textContent = type

    let employeeType = Object.assign(
        Object.create(employeeTypeProto),
        {display,
        type}
    )
    employeeType.initDisplay()
    state.addEmployeeType(employeeType)
    return employeeType
}