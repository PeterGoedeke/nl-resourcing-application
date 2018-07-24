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

function openObjectDialogue(clickedObject, event, type) {
    let dialogue = Object.create(dialogueProto)
    dialogue.initDisplay(event)
    dialogue.display.className = 'dialogue'

    let deleteHostButton = document.createElement('div')
    deleteHostButton.className = 'deleteHostButton'
    deleteHostButton.addEventListener('mouseup', event => {
        let promise = new Promise(function(resolve) {
            clickedObject.delete()
            resolve()
        })
        promise.then(() => {
            dialogueInterface.closeDialogue()
            if(type == 'project') save.projects()
            else if(type == 'employee') save.employees()
            else if(type == 'leaveSlot') save.leave()
            else if(type == 'employeeType') save.employeeTypes()
            else save.all()
            safe(sm.updateVerticalDisplay())
        })
    })

    if(type == 'project') {
        let toggleSecurityButton = document.createElement('div')
        toggleSecurityButton.className = 'toggleSecurityButton'
        toggleSecurityButton.addEventListener('mouseup', event => {
            clickedObject.toggleSecurity()
        })
        dialogue.display.appendChild(toggleSecurityButton)
    }

    dialogue.display.appendChild(deleteHostButton)
    dialogueInterface.registerDialogue(dialogue)
}

function bindDialogueListeners(type) {
    this.display.addEventListener('mouseup', event => {
        if(event.which == 3) {
            openObjectDialogue(this, event, type)
        }
    })
    this.label.addEventListener('mouseup', event => {
        if(event.which == 3) {
            openObjectDialogue(this, event, type)
        }
    })
}