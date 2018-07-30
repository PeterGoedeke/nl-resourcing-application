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
    function findFirstProject() {
        for(const project of state.projects) {
            if(project.employeeSlots[state.visibleType.type].length > 0) {
                project.employeeSlots[state.visibleType.type][0].label.focus()
                return true
            }
        }
        return false
    }
    function findFirstLeaveSlot() {
        for(const leaveSlot of leave.leaveSlots[state.visibleType.type]) {
            leaveSlot.label.focus()
            return true
        }
        return false
    }
    function findFirstEmployee() {
        for(const employee of state.getVisibleEmployees()) {
            employee.label.focus()
            return true
        }
        return false
    }

    function afterProjectLabel(hostObject) {
        if(hostObject.hasOwnProperty('employeeSlots')) {
            if(state.projects.indexOf(hostObject) == state.projects.length - 1) {
                if(!findFirstLeaveSlot()) if(!findFirstEmployee()) findFirstProject()
            }
            else state.projects[state.projects.indexOf(hostObject) + 1].label.focus()
        }
        else if(!findFirstProject()) if(!findFirstLeaveSlot()) findFirstEmployee()
    }
    function afterEmployeeSlotLabel(hostObject) {
        if(hostObject.hasOwnProperty('hostProject')) {
            if(hostObject.hostProject.employeeSlots[state.visibleType.type].length - 1 == hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject)) {
                if(state.projects.indexOf(hostObject.hostProject) == state.projects.length - 1) {
                    if(!findFirstLeaveSlot()) if(!findFirstEmployee()) findFirstProject()
                }
                else {
                    for(let i = state.projects.indexOf(hostObject.hostProject) + 1; i < state.projects.length; i++) {
                        if(state.projects[i].employeeSlots[state.visibleType.type].length > 0) {
                            state.projects[i].employeeSlots[state.visibleType.type][0].label.focus()
                            return
                        }
                    }
                    if(!findFirstLeaveSlot()) if(!findFirstEmployee()) findFirstProject()
                }
            }
            else hostObject.hostProject.employeeSlots[state.visibleType.type][hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject) + 1].label.focus()
        }
    }
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