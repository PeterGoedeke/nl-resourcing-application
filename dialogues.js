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

function openObjectDialogue(clickedObject, event) {
    let dialogue = Object.create(dialogueProto)
    dialogue.initDisplay(event)
    dialogue.display.className = 'dialogue'

    let deleteHostButton = document.createElement('div')
    deleteHostButton.className = 'deleteHostButton'
    deleteHostButton.addEventListener('mouseup', event => {
        clickedObject.delete()
        dialogueInterface.closeDialogue()
        sm.updateVerticalDisplay()
    })

    dialogue.display.appendChild(deleteHostButton)
    dialogueInterface.registerDialogue(dialogue)
}

function bindDialogueListeners() {
    this.display.addEventListener('mouseup', event => {
        if(event.which == 3) {
            openObjectDialogue(this, event)
        }
    })
    this.label.addEventListener('mouseup', event => {
        if(event.which == 3) {
            openObjectDialogue(this, event)
        }
    })
}