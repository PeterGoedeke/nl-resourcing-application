let dialogueInterface = (function() {
    let currentlyOpenDialogue
    addEventListener('mousedown', event => {
        if(event.target != currentlyOpenDialogue && currentlyOpenDialogue) {
            sq.mainWindow.removeChild(currentlyOpenDialogue)
            currentlyOpenDialogue = null
        }
    })
    return {
        registerDialogue(dialogue) {
            if(currentlyOpenDialogue) sq.mainWindow.removeChild(currentlyOpenDialogue)
            currentlyOpenDialogue = dialogue
            sq.mainWindow.appendChild(dialogue)
        }
    }
})()