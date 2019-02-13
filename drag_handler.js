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

function addResizing(element, getDistanceToLeft, cb) {
    element.onmousedown = event => {
        if(event.which == 1) {
            function move(event) {
                element.style.width = event.pageX - parseInt(getDistanceToLeft()) + 'px'
            }
            function end(event) {
                document.body.style.cursor = 'initial'
                removeEventListener('mousemove', move)
                removeEventListener('mouseup', end)
                cb(event.pageX - parseInt(getDistanceToLeft()))
            }
            addEventListener('mousemove', move)
            addEventListener('mouseup', end)
        }
    }
}