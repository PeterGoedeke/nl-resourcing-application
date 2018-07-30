const tab = (function() {
    function findFirstProject() {
        for(const project of state.projects) {
            if(project.employeeSlots[state.visibleType.type].length > 0) {
                project.employeeSlots[state.visibleType.type][0].label.focus()
                return true
            }
        }
        return false
    }
    function findLastProject() {
        for(let i = state.projects.length - 1; i >= 0; i--) {
            if(state.projects[i].employeeSlots[state.visibleType.type].length > 0) {
                state.projects[i].employeeSlots[state.visibleType.type][state.projects[i].employeeSlots[state.visibleType.type.length - 1]].label.focus()
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
    function findLastLeaveSlot() {
        for(let i = leave.leaveSlots[state.visibleType.type].length - 1; i >= 0; i--) {
            leave.leaveSlots[state.visibleType.type][i].label.focus()
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
    function afterLeaveSlotLabel(hostObject) {
        if(leave.leaveSlots[state.visibleType.type].indexOf(hostObject) == leave.leaveSlots[state.visibleType.type].length - 1) {
            if(!findFirstEmployee()) if(!findFirstProject()) findFirstLeaveSlot()
        }
        else leave.leaveSlots[state.visibleType.type][leave.leaveSlots[state.visibleType.type].indexOf(hostObject) + 1].label.focus()
    }
    function afterEmployeeLabel(hostObject) {
        if(hostObject.hasOwnProperty('joiningDate')) {
            if(state.getVisibleEmployees().indexOf(hostObject) > state.getVisibleEmployees().length - 1) {
                if(!findFirstProject()) if(!findFirstLeaveSlot()) findFirstEmployee()
            }
            else state.getVisibleEmployees()[state.getVisibleEmployees().indexOf(hostObject) + 1].label.focus()
        }
        else if(!findFirstEmployee()) if(!findFirstProject()) findFirstLeaveSlot()
    }

    return {
        up(focused, hostObject) {

        },
        right(focused, hostObject) {
            if(hostObject.hasOwnProperty('security')) {
                if(hostObject.employeeSlots[state.visibleType.type][0]) {
                    hostObject.employeeSlots[state.visibleType.type][0].label.focus()
                } else {
                    this.after(focused, hostObject)
                }
            }
            else if(hostObject.hasOwnProperty('hostProject')) {
                if(focused.className == 'employeeSlotLabel') {
                    hostObject.display.firstChild.focus()
                } else {
                    if(hostObject.display.lastChild === focused) {
                        this.after(focused, hostObject)
                    } else {
                        hostObject.display.childNodes[Array.from(hostObject.display.childNodes).indexOf(focused) + 1].focus()
                    }
                }
            }
        },
        below(focused, hostObject) {

        },
        left(focused, hostObject) {

        },
        after(focused, hostObject) {
            if(hostObject.hasOwnProperty('employeeSlots')) afterProjectLabel(hostObject)
            else if(hostObject.hasOwnProperty('hostProject')) afterEmployeeSlotLabel(hostObject)
            else if(hostObject.hasOwnProperty('joiningDate')) afterEmployeeLabel(hostObject)
            else afterLeaveSlotLabel(hostObject)
        }
    }
})()