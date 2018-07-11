let dialogueProto = {

}

function openProjectDialogue(hostProject, event) {
    let dialogue = document.createElement('div')
    dialogue.className = 'projectDialogue dialogue'
    if(event.pageY > sq.mainWindow.getBoundingClientRect().bottom - 120) {
        dialogue.style.top = event.pageY - 150 + 'px'
    } else {
        dialogue.style.top = event.pageY + 'px'
    }
    dialogue.style.left = event.pageX - 40 + 'px'
    dialogueInterface.registerDialogue(dialogue)
}

function createProject(name, group, security) {
    let [startDate, endDate] = sq.getVisibleTimeBlockRange(true)
    let container = document.createElement('div')
    container.className = 'projectContainer'
    
    let display = document.createElement('div')
    display.className = 'projectDisplay'
    
    let projectLabel = document.createElement('div')
    projectLabel.className = 'projectLabel'
    projectLabel.textContent = name

    let createEmployeeSlotButton = document.createElement('div')
    createEmployeeSlotButton.className = 'createEmployeeSlot'
    createEmployeeSlotButton.textContent = '+'

    let dragging = false
    let project = Object.assign(
        Object.create(projectProto),
        draggable,
        {container, display, projectLabel, createEmployeeSlotButton, dragging,
            name, group, security, startDate, endDate}
    )
    
    let employeeSlots = {}
    state.employeeTypes.forEach(type => employeeSlots[type] = [])
    for(let type in employeeSlots) employeeSlots[type].push(createEmployeeSlot(project, type))
    project.employeeSlots = employeeSlots
    
    state.registerProject(project)
    project.initDisplay()
    return project
}