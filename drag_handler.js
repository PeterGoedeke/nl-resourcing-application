const test = document.querySelector('.test')

function addDragging(element, getParentLeft, cb) {
    element.onmousedown = event => {
        if(event.which == 1) {
            function move(event) {
                element.style.left = event.pageX - parseInt(getParentLeft()) - columns.sidebarWidth + 'px'
            }
            function end(event) {
                removeEventListener('mousemove', move)
                removeEventListener('mouseup', end)
                cb(Math.floor((event.pageX - columns.sidebarWidth) / columns.columnWidth) + columns.baseID)
            }
            addEventListener('mousemove', move)
            addEventListener('mouseup', end)
        }
    }

    element.addEventListener('mousedown', event => {
        event.preventDefault()
    })
}