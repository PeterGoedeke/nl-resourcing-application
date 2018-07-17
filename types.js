const employeeTypeProto = {
    initDisplay() {
        sq.bottomMargin.insertBefore(this.display, sq.zoomContainer)
        
        this.display.addEventListener('mouseup', event => {
            if(event.which == 3) {
                openObjectDialogue(this, event)
            }
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