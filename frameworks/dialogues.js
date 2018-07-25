let dialogueProto = {
    initDisplay(event) {
        this.display = document.createElement('div')
        if(event.pageY > sq.mainWindow.getBoundingClientRect().bottom - 120) {
            this.display.style.top = event.pageY - 150 + 'px'
        } else {
            this.display.style.top = event.pageY + 'px'
        }
        
        if(event.pageX > sq.mainWindow.getBoundingClientRect().right - 50) {
            this.display.style.left = sq.mainWindow.getBoundingClientRect().right - 90 + 'px'
        } else if(event.pageX < sq.mainWindow.getBoundingClientRect().left + 50) {
            this.display.style.left = 10 + 'px'
        }else {
            this.display.style.left = event.pageX - 40 + 'px'
        }
    }
}

function openObjectDialogue(clickedObject, event, type) {
    let dialogue = Object.create(dialogueProto)
    dialogue.initDisplay(event)
    dialogue.display.className = 'dialogue'

    let deleteHostButton = document.createElement('div')
    deleteHostButton.className = 'deleteHostButton'
    deleteHostButton.addEventListener('mouseup', event => {
        clickedObject.delete()
        dialogueInterface.closeDialogue()
        if(type == 'project') save.projects()
        else if(type == 'employee') save.employees()
        else if(type == 'leaveSlot') save.leave()
        else if(type == 'employeeType') save.employeeTypes()
        else save.all()
        safe(sm.updateVerticalDisplay())
    })

    if(type == 'project') {
        let toggleSecurityButton = document.createElement('div')
        toggleSecurityButton.className = 'toggleSecurityButton'
        toggleSecurityButton.addEventListener('mouseup', event => {
            clickedObject.toggleSecurity()
            dialogueInterface.closeDialogue()
        })
        let assignGroupWrapper = document.createElement('div')
        assignGroupWrapper.className = 'assignGroupWrapper'
        let assignGroupLabel = document.createElement('input')
        assignGroupLabel.className = 'assignGroupLabel'
        assignGroupLabel.type = 'text'
        assignGroupLabel.value = clickedObject.group || 'No Group'

        assignGroupLabel.addEventListener('keyup', event => {
            if(event.which == 13 && assignGroupAutocomplete.value) {
                assignGroupLabel.value = assignGroupAutocomplete.value
                clickedObject.setGroup(assignGroupLabel.value)
                dialogueInterface.closeDialogue()
            }
            else if(assignGroupLabel.value) {
                let value = state.groups.map(group => group.name).sort().find(name => name.startsWith(assignGroupLabel.value)) || ''
                assignGroupAutocomplete.value = value
            }
        })
        assignGroupLabel.addEventListener('change', event => {
            if(state.groups.map(group => group.name).includes(assignGroupLabel.value)) {
                clickedObject.setGroup(assignGroupLabel.value)
                save.projects()
            }
        })
        // this.label.addEventListener('change', event => {
        //     if(state.employeeExists(this.label.value)) {
        //         this.assignEmployee(state.getEmployeeFromName(this.label.value))
        //         this.label.value = this.employee.name
        //         this.save()
        //     }
        // })
        assignGroupLabel.addEventListener('blur', event => {
            assignGroupAutocomplete.value = ''
            if(!assignGroupLabel.value) {
                clickedObject.removeGroup()
                save.projects()
            }
            else if(!state.groups.map(group => group.name).includes(assignGroupLabel.value) && assignGroupLabel.value != 'No Group') {
                state.groups.push(createGroup(assignGroupLabel.value, colourPicker.value))
                clickedObject.setGroup(assignGroupLabel.value)
                save.groups()
            }
            // else {
            //     clickedObject.setGroup(assignGroupLabel.value)
            // }
        })
        initInput(assignGroupLabel)

        let assignGroupAutocomplete = document.createElement('input')
        assignGroupAutocomplete.className = 'assignGroupAutocomplete'
        assignGroupAutocomplete.type = 'text'
        assignGroupAutocomplete.disabled = true

        let colourPicker = document.createElement('input')
        colourPicker.className = 'colourPicker'
        colourPicker.type = 'color'

        colourPicker.addEventListener('blur', event => {
            if(assignGroupLabel.value && assignGroupLabel.value != 'No Group') state.setGroupColour(assignGroupLabel.value, colourPicker.value)
        })

        assignGroupWrapper.appendChild(assignGroupAutocomplete)
        assignGroupWrapper.appendChild(assignGroupLabel)

        dialogue.display.appendChild(toggleSecurityButton)
        dialogue.display.appendChild(assignGroupWrapper)
        dialogue.display.appendChild(colourPicker)
    }
    else if(type == 'employee') {
        let markJoiningDateButton = document.createElement('div')
        markJoiningDateButton.className = 'markJoiningDateButton'
        markJoiningDateButton.addEventListener('mouseup', event => {
            mark.registerMarking(clickedObject, false)
            dialogueInterface.closeDialogue()
        })

        let markLeavingDateButton = document.createElement('div')
        markLeavingDateButton.className = 'markLeavingDateButton'
        markLeavingDateButton.addEventListener('mouseup', event => {
            mark.registerMarking(clickedObject)
            dialogueInterface.closeDialogue()
        })
        dialogue.display.appendChild(markJoiningDateButton)
        dialogue.display.appendChild(markLeavingDateButton)
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