let dialogueInterface = (function() {
    let currentlyOpenDialogue
    addEventListener('mousedown', event => {
        if(currentlyOpenDialogue && event.target != currentlyOpenDialogue.display && !currentlyOpenDialogue.display.contains(event.target)) {
            sq.mainWindow.removeChild(currentlyOpenDialogue.display)
            currentlyOpenDialogue = null
        }
    })
    return {
        registerDialogue(dialogue) {
            if(currentlyOpenDialogue) sq.mainWindow.removeChild(currentlyOpenDialogue.display)
            currentlyOpenDialogue = dialogue
            sq.mainWindow.appendChild(dialogue.display)
        },
        closeDialogue() {
            if(currentlyOpenDialogue) sq.mainWindow.removeChild(currentlyOpenDialogue.display)
            currentlyOpenDialogue = null
        }
    }
})()