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
    element.addEventListener('mousemove', event => {
        if(event.pageX > element.getBoundingClientRect().right - 10 && event.target.classList != 'projectCreateSlotButton') element.style.cursor = 'e-resize'
        else element.style.cursor = 'initial'
    })
    element.addEventListener('mouseout', event => {
        element.style.cursor = 'initial'
    })
    element.addEventListener('mousedown', event => {
        if(event.target.classList != 'projectCreateSlotButton') {
            function move(event) {
                element.style.width = event.pageX - parseInt(getDistanceToLeft()) + 'px'
            }  
            function end(event) {
                cb(event.pageX - parseInt(getDistanceToLeft()))
                removeEventListener('mouseup', end)
                removeEventListener('mousemove', move)
            }
            if(event.pageX > element.getBoundingClientRect().right - 10) {
                addEventListener('mouseup', end)
                addEventListener('mousemove', move)
            }
        }
    })
}