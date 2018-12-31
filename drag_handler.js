const test = document.querySelector('.test')

function addDragging(element, getParentLeft, cb) {
    element.addEventListener('mousedown', event => {
        // event.stopPropagation()
        // event.preventDefault()
    })
    element.addEventListener('dragstart', event => {
        console.log('aye')
        // event.stopPropagation()
    })
    element.addEventListener('drag', event => {
        element.style.left = event.pageX - parseInt(getParentLeft()) - columns.sidebarWidth + 'px'
    })
    element.addEventListener('dragend', event => {
        cb(Math.floor((event.pageX - columns.sidebarWidth) / columns.columnWidth) + columns.baseID)
    })
}
addEventListener('mousedown', event => console.log(event.target))