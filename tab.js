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
                } else {
                    hostObject.hostProject.employeeSlots[state.visibleType.type][indexInProject + 1].label.focus()
                }
            }
        }
    }
})()