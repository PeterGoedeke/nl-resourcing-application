const projectContainer = (function() {
    let container = document.createElement('div')
    container.className = 'projectContainer'
    let body = document.createElement('div')
    body.className = 'projectBody'

    let bodyStartHandle = document.createElement('div')
    bodyStartHandle.className = 'start'
    let bodyEndHandle = document.createElement('div')
    bodyEndHandle.className = 'end'
    body.appendChild(bodyStartHandle)
    body.appendChild(bodyEndHandle)
    
    let createSlotButton = document.createElement('div')
    createSlotButton.className = 'projectCreateSlotButton'
    let projectLabel = document.createElement('div')
    projectLabel.className = 'projectLabel'
    let projectSlotLabelContainer = document.createElement('div')
    projectSlotLabelContainer.className = 'projectSlotLabelContainer'
    projectSlotLabelContainer.appendChild(createSlotButton)
    
    container.appendChild(projectLabel)
    container.appendChild(projectSlotLabelContainer)
    container.appendChild(body)
    return container
})()
const slotBody = (function() {
    let slotBody = document.createElement('div')
    slotBody.className = 'slotBody'

    let slotStartHandle = document.createElement('div')
    slotStartHandle.className = 'start'
    let slotEndHandle = document.createElement('div')
    slotEndHandle.className = 'end'
    slotBody.appendChild(slotStartHandle)
    slotBody.appendChild(slotEndHandle)

    return slotBody
})()
const slotLabel = (function() {
    let slotLabel = document.createElement('div')
    slotLabel.className = 'slotLabel'
    return slotLabel
})()
const slotCell = (function() {
    let slotCell = document.createElement('div')
    slotCell.className = 'slotCell'
    return slotCell
})()
const slotStartDrag = (function() {
    let slotStartDrag = document.createElement('div')
    
})()
const slotEndDrag = (function() {

})()

const headerCell = (function() {
    let headerCell = document.createElement('div')
    headerCell.className = 'headerCell'
    return headerCell
})()
const columnLine = (function() {
    let columnLine = document.createElement('div')
    columnLine.className = 'columnLine'
    return columnLine
})()

const employeeContainer = (function() {
    let container = document.createElement('div')
    container.className = 'employeeContainer'
    let body = document.createElement('div')
    body.className = 'employeeBody'

    let label = document.createElement('div')
    label.className = 'employeeLabel'

    container.appendChild(label)
    container.appendChild(body)
    return container
})()

const typeCell = (function() {
    let typeCell = document.createElement('div')
    typeCell.className = 'typeCell'
    return typeCell
})()