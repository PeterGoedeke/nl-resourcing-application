const projectContainer = (function() {
    let container = document.createElement('div')
    container.className = 'projectContainer'
    let body = document.createElement('div')
    body.className = 'projectBody'
    let createSlotButton = document.createElement('div')
    createSlotButton.className = 'projectCreateSlotButton'
    let projectLabel = document.createElement('div')
    projectLabel.className = 'projectLabel'
    let projectSlotLabelContainer = document.createElement('div')
    projectSlotLabelContainer.className = 'projectSlotLabelContainer'
    
    container.appendChild(projectLabel)
    container.appendChild(projectSlotLabelContainer)
    container.appendChild(body)
    container.appendChild(createSlotButton)
    return container
})()
const slotBody = (function() {
    let slotBody = document.createElement('div')
    slotBody.className = 'slotBody'
    return slotBody
})()
const slotCell = (function() {
    let slotCell = document.createElement('div')
    slotCell.className = 'slotCell'
    slotCell.innerHTML = '5.0'
    return slotCell
})()