let dialogueProto = {
    initDisplay(event) {
        this.display = document.createElement('div')
        if(event.pageY > sq.mainWindow.getBoundingClientRect().bottom - 120) {
            this.display.style.top = event.pageY - 150 + 'px'
        } else {
            this.display.style.top = event.pageY + 'px'
        }
        this.display.style.left = event.pageX - 40 + 'px'
    }
}

function openProjectDialogue(hostProject, event) {
    let dialogue = Object.create(dialogueProto)
    dialogue.initDisplay(event)
    dialogue.display.className = 'projectDialogue dialogue'

    let deleteHostButton = document.createElement('div')
    deleteHostButton.className = 'deleteHostButton'
    deleteHostButton.addEventListener('mouseup', event => {
        state.deleteProject(hostProject)
        dialogueInterface.closeDialogue()
    })
    dialogue.display.appendChild(deleteHostButton)
    dialogueInterface.registerDialogue(dialogue)
}

function openEmployeeSlotDialogue(hostEmployeeSlot, event) {
    let dialogue = Object.create(dialogueProto)
    dialogue.initDisplay(event)
    dialogue.display.className = 'employeeSlotDialogue dialogue'

    let deleteHostButton = document.createElement('div')
    deleteHostButton.className = 'deleteHostButton'
    deleteHostButton.addEventListener('mouseup', event => {
        if(hostEmployeeSlot.hostProject.employeeSlots[hostEmployeeSlot.employeeType].length > 1) {
            hostEmployeeSlot.deleteEmployeeSlot()
            sm.updateVerticalDisplay()
        }
        dialogueInterface.closeDialogue()
    })

    dialogue.display.appendChild(deleteHostButton)
    dialogueInterface.registerDialogue(dialogue)
}