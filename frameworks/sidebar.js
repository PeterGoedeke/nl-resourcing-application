const sidebar = (function() {
    let currentlyResizing = false
    let timer

    function setSidebarWidth(data) {
        state.sidebarWidth = data
        sq.sidebar.style.width = state.sidebarWidth + 'px'
        sq.totalWorkloadRow.style.left = state.sidebarWidth + 'px'
        sq.totalEmployeesRow.style.left = state.sidebarWidth + 'px'
        sq.surplusRow.style.left = state.sidebarWidth + 'px'
        sq.topAxisContainer.style.left = state.sidebarWidth + 'px'

        sq.leftSidebar.style.width = state.sidebarWidth - 88 + 'px'
        
        sq.totalWorkloadLabel.style.left = state.sidebarWidth - 88 + 'px'
        sq.totalEmployeesLabel.style.left = state.sidebarWidth - 88 + 'px'
        sq.surplusLabel.style.left = state.sidebarWidth - 88 + 'px'

        sq.totalWorkloadRow.style.width = sq.contentPane.offsetWidth + 'px'
        sq.totalEmployeesRow.style.width = sq.contentPane.offsetWidth + 'px'
        sq.surplusRow.style.width = sq.contentPane.offsetWidth + 'px'
    }

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

            sm.appendUntilFit()
            sq.totalWorkloadRow.style.width = sq.contentPane.offsetWidth + 'px'
            sq.totalEmployeesRow.style.width = sq.contentPane.offsetWidth + 'px'
            sq.surplusRow.style.width = sq.contentPane.offsetWidth + 'px'
            save.cookies()
        }
    })
    addEventListener('mousemove', event => {
        const notFarPastEdge = event.pageX <= sq.leftSidebar.offsetWidth + sq.leftSidebar.offsetLeft + 2
        const notFarBeforeEdge = event.pageX >= sq.leftSidebar.offsetWidth + sq.leftSidebar.offsetLeft - 2
        if(currentlyResizing) {
            sq.leftSidebar.style.width = event.pageX + 'px'
            sq.sidebar.style.width = sq.leftSidebar.offsetWidth + sq.rightSidebar.offsetWidth + 'px'
        }
        if(notFarPastEdge && notFarBeforeEdge) {
            sq.sidebar.classList.add('resizing')
        } else sq.sidebar.classList.remove('resizing')

    })
    addEventListener('mousedown', event => {
        const notFarPastEdge = event.pageX <= sq.leftSidebar.offsetWidth + sq.leftSidebar.offsetLeft + 2
        const notFarBeforeEdge = event.pageX >= sq.leftSidebar.offsetWidth + sq.leftSidebar.offsetLeft - 2
        if(notFarPastEdge && notFarBeforeEdge) {
            currentlyResizing = true
        }
    })
    return {
        setSidebarWidth
    }
})()