const sidebar = (function() {
    let currentlyResizing = false
    let timer

    addEventListener('mouseup', event => {
        if(currentlyResizing) {
            currentlyResizing = false
            state.sidebarWidth = sq.leftSidebar.offsetWidth + sq.rightSidebar.offsetWidth
            sq.totalWorkloadRow.style.left = state.sidebarWidth + 'px'
            sq.totalEmployeesRow.style.left = state.sidebarWidth + 'px'
            sq.surplusRow.style.left = state.sidebarWidth + 'px'
            sq.topAxisContainer.style.left = state.sidebarWidth + 'px'
            
            sq.totalWorkloadLabel.style.left = sq.leftSidebar.offsetWidth + 'px'
            sq.totalEmployeesLabel.style.left = sq.leftSidebar.offsetWidth + 'px'
            sq.surplusLabel.style.left = sq.leftSidebar.offsetWidth + 'px'
        }
    })
    addEventListener('mousemove', event => {
        if(currentlyResizing) {
            sq.leftSidebar.style.width = event.pageX + 'px'
            sq.sidebar.style.width = sq.leftSidebar.offsetWidth + sq.rightSidebar.offsetWidth + 'px'
        }
    })
    addEventListener('mousedown', event => {
        const notFarPastEdge = event.pageX <= sq.leftSidebar.offsetWidth + sq.leftSidebar.offsetLeft + 2
        const notFarBeforeEdge = event.pageX >= sq.leftSidebar.offsetWidth + sq.leftSidebar.offsetLeft - 2
        if(notFarPastEdge && notFarBeforeEdge) {
            currentlyResizing = true
        }
    })

})()