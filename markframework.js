let mark = (function() {
    let currentlyMarking = null
    let key = null
    addEventListener('mousedown', event => {
        if(currentlyMarking) {
            if(currentlyMarking.display.contains(event.target)) {
                currentlyMarking[key] = sq.getNearestTimeBlock(sq.getCursorXLocation(event.pageX))
                currentlyMarking.updateDisplay()
                save.employees()
            }
            currentlyMarking = null
            document.querySelector('body').style.cursor = 'initial'
        }
    })
    return {
        registerMarking(markedObject, leaving = true) {
            currentlyMarking = markedObject
            key = leaving ? 'leavingDate' : 'joiningDate'
            document.querySelector('body').style.cursor = 'crosshair'
        }
    }
})()