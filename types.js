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
                this.type = displayInput.value
                this.display.removeChild(displayInput)
                this.display.appendChild(document.createTextNode(this.type.toUpperCase()))
                state.setVisibleType(state.visibleType)
            })

            this.display.removeChild(this.display.firstChild)
            this.display.appendChild(displayInput)
            displayInput.focus()
        })
    },
    delete() {

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