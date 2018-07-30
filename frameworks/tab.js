const tab = (function() {
    return {
        after(focused, hostObject) {
            if(hostObject.hostProject) {
                const indexInProject = hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject)
                const lastIndexInProject = hostObject.hostProject.employeeSlots[state.visibleType.type].length - 1
                if(indexInProject == lastIndexInProject) {
                    const indexOfProjectInProjects = state.projects.indexOf(hostObject.hostProject)
                    if(indexOfProjectInProjects == state.projects.length - 1) {
                        if(leave.leaveSlots[state.visibleType.type].length > 0) leave.leaveSlots[state.visibleType.type][0].label.focus()
                        else if(state.getVisibleEmployees().length > 0) state.getVisibleEmployees()[0].label.focus()
                    }
                    else state.projects[indexOfProjectInProjects + 1].employeeSlots[state.visibleType.type][0].label.focus()
        right(focused, hostObject) {
            if(hostObject.hasOwnProperty('security')) {
                if(hostObject.employeeSlots[state.visibleType.type][0]) {
                    hostObject.employeeSlots[state.visibleType.type][0].label.focus()
                } else {
                    this.after(focused, hostObject)
                }
            }
            else if(hostObject.hostProject) {
                if(focused.className = 'employeeSlotLabel') {
                    hostObject.display.childNodes.firstChild.focus()
                } else {
                    if(hostObject.display.childNodes.lastChild === focused) {
                        this.after(focused, hostObject)
                    } else {
                        hostObject.display.childNodes[Array.from(hostObject.display.childNodes).indexOf(focused)].focus()
                    }
                }
            }
        },
        }
    }
})()