const tab = (function() {
    function focus(element) {
        element.focus()
        setTimeout(() => element.select(), 0)
    }
    function findFirstProject() {
        for(const project of state.projects) {
            focus(project.label)
            return true
        }
        return false
    }
    function findLastProject() {
        for(let i = state.projects.length - 1; i >= 0; i--) {
            if(state.projects[i].employeeSlots[state.visibleType.type].length > 0) {
                focus(state.projects[i].employeeSlots[state.visibleType.type][state.projects[i].employeeSlots[state.visibleType.type].length - 1].display.lastChild)
                return true
            }
        }
        return false
    }
    function findLastProjectLabel() {
        for(let i = state.projects.length - 1; i >= 0; i--) {
            focus(state.projects[i].label)
            return true
        }
        return false
    }
    function findLastEmployeeSlot() {
        for(let i = state.projects.length - 1; i >= 0; i--) {
            if(state.projects[i].employeeSlots[state.visibleType.type].length > 0) {
                focus(state.projects[i].employeeSlots[state.visibleType.type][state.projects[i].employeeSlots[state.visibleType.type].length - 1].label)
                return true
            }
        }
        return false
    }
    function findFirstEmployeeSlot() {
        for(const project of state.projects) {
            if(project.employeeSlots[state.visibleType.type].length > 0) {
                focus(project.employeeSlots[state.visibleType.type][0].label)
                return true
            }
        }
        return false
    }

    function findFirstLeaveSlot() {
        for(const leaveSlot of leave.leaveSlots[state.visibleType.type]) {
            focus(leaveSlot.label)
            return true
        }
        return false
    }
    function findLastLeaveSlot() {
        for(let i = leave.leaveSlots[state.visibleType.type].length - 1; i >= 0; i--) {
            focus(leave.leaveSlots[state.visibleType.type][i].label)
            return true
        }
        return false
    }

    function findFirstEmployee() {
        for(const employee of state.getVisibleEmployees()) {
            focus(employee.label)
            return true
        }
        return false
    }
    function findLastEmployee() {
        for(let i = state.getVisibleEmployees().length - 1; i >= 0; i--) {
            focus(state.getVisibleEmployees()[i].label)
            return true
        }
        return false
    }

    function afterProjectLabel(hostObject) {
        if(hostObject.hasOwnProperty('employeeSlots')) {
            if(state.projects.indexOf(hostObject) == state.projects.length - 1) {
                if(!findFirstLeaveSlot()) if(!findFirstEmployee()) findFirstProject()
            }
            else focus(state.projects[state.projects.indexOf(hostObject) + 1].label)
        }
        else if(!findFirstProject()) if(!findFirstLeaveSlot()) findFirstEmployee()
    }
    function beforeProjectLabel(hostObject) {
        if(hostObject.hasOwnProperty('employeeSlots')) {
            if(state.projects.indexOf(hostObject) == 0) {
                if(!findLastEmployee()) if(!findLastLeaveSlot()) findLastProject()
            }
            else focus(state.projects[state.projects.indexOf(hostObject) - 1].label)
        }
        else if(!findLastProject()) if(!findLastLeaveSlot()) findLastEmployee()
    }

    function afterEmployeeSlotLabel(hostObject) {
        if(hostObject.hasOwnProperty('hostProject')) {
            if(hostObject.hostProject.employeeSlots[state.visibleType.type].length - 1 == hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject)) {
                if(state.projects.indexOf(hostObject.hostProject) == state.projects.length - 1) {
                    if(!findFirstLeaveSlot()) if(!findFirstEmployee()) findFirstProject()
                }
                else {
                    for(let i = state.projects.indexOf(hostObject.hostProject) + 1; i < state.projects.length; i++) {
                        focus(state.projects[i].label)
                        return
                    }
                    if(!findFirstLeaveSlot()) if(!findFirstEmployee()) findFirstProject()
                }
            }
            else focus(hostObject.hostProject.employeeSlots[state.visibleType.type][hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject) + 1].label)
        }
    }
    function afterLeaveSlotLabel(hostObject) {
        if(leave.leaveSlots[state.visibleType.type].indexOf(hostObject) == leave.leaveSlots[state.visibleType.type].length - 1) {
            if(!findFirstEmployee()) if(!findFirstProject()) findFirstLeaveSlot()
        }
        else focus(leave.leaveSlots[state.visibleType.type][leave.leaveSlots[state.visibleType.type].indexOf(hostObject) + 1].label)
    }
    function beforeLeaveSlotLabel(hostObject) {
        if(leave.leaveSlots[state.visibleType.type].indexOf(hostObject) == 0) {
            if(!findLastProject()) if(!findLastEmployee()) findLastLeaveSlot()
        }
        else focus(leave.leaveSlots[state.visibleType.type][leave.leaveSlots[state.visibleType.type].indexOf(hostObject) - 1].label)
    }

    function afterEmployeeLabel(hostObject) {
        if(hostObject.hasOwnProperty('joiningDate')) {
            if(state.getVisibleEmployees().indexOf(hostObject) == state.getVisibleEmployees().length - 1) {
                if(!findFirstProject()) if(!findFirstLeaveSlot()) findFirstEmployee()
            }
            else focus(state.getVisibleEmployees()[state.getVisibleEmployees().indexOf(hostObject) + 1].label)
        }
        else if(!findFirstEmployee()) if(!findFirstProject()) findFirstLeaveSlot()
    }
    function beforeEmployeeLabel(hostObject) {
        if(hostObject.hasOwnProperty('joiningDate')) {
            if(state.getVisibleEmployees().indexOf(hostObject) == 0) {
                if(!findLastLeaveSlot()) if(!findLastProject()) findLastEmployee()
            }
            else focus(state.getVisibleEmployees()[state.getVisibleEmployees().indexOf(hostObject) - 1].label)
        }
        else if(!findLastEmployee()) if(!findLastProject()) findLastLeaveSlot()
    }

    return {
        up(focused, hostObject) {
            if(hostObject.hasOwnProperty('security')) {
                if(state.projects.indexOf(hostObject) > 0) {
                    focus(state.projects[state.projects.indexOf(hostObject) - 1].label)
                }
                else if(!findLastEmployee()) if(!findLastLeaveSlot()) findLastProjectLabel()
            }
            else if(hostObject.hasOwnProperty('hostProject')) {
                if(focused === hostObject.label) {
                    if(hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject) == 0) {
                        if(state.projects.indexOf(hostObject.hostProject) == 0) {
                            if(!findLastEmployee()) if(!findLastLeaveSlot()) findLastEmployeeSlot()
                        }
                        else {
                            for(let i = state.projects.indexOf(hostObject.hostProject) - 1; i >= 0; i--) {
                                if(state.projects[i].employeeSlots[state.visibleType.type].length > 0) {
                                    focus(state.projects[i].employeeSlots[state.visibleType.type][state.projects[i].employeeSlots[state.visibleType.type].length - 1].label)
                                    return
                                }
                            }
                        }
                    }
                    else focus(hostObject.hostProject.employeeSlots[state.visibleType.type][hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject) - 1].label)
                }
                else {
                    const id = sq.getNearestTimeBlock(focused.getBoundingClientRect().left)
                    if(hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject) == 0) {
                        for(let i = state.projects.indexOf(hostObject.hostProject) - 1; i >= 0; i--) {
                            console.log(
                                state.projects[i].employeeSlots[state.visibleType.type][state.projects[i].employeeSlots[state.visibleType.type].length - 1]
                            )
                            for(let j = state.projects[i].employeeSlots[state.visibleType.type].length - 1; j >= 0; j--) {
                                const employeeSlotWorkloadBlocks = Array.from(state.projects[i].employeeSlots[state.visibleType.type][j].display.childNodes)
                                if(employeeSlotWorkloadBlocks.some(workloadBlock => sq.getNearestTimeBlock(workloadBlock.getBoundingClientRect().left) == id)) {
                                    focus(employeeSlotWorkloadBlocks.find(workloadBlock => sq.getNearestTimeBlock(workloadBlock.getBoundingClientRect().left) == id))
                                    return
                                }
                                else {
                                    const previousChildNodesFirstID = sq.getNearestTimeBlock(employeeSlotWorkloadBlocks[0].getBoundingClientRect().left)
                                    const previousChildNodesLastID = sq.getNearestTimeBlock(employeeSlotWorkloadBlocks[employeeSlotWorkloadBlocks.length - 1].getBoundingClientRect().left)

                                    if(id > previousChildNodesLastID) {
                                        focus(employeeSlotWorkloadBlocks[employeeSlotWorkloadBlocks.length - 1])
                                    }
                                    else if(id < previousChildNodesFirstID) {
                                        focus(employeeSlotWorkloadBlocks[0])
                                    }
                                    return
                                }
                            }
                        }
                    }
                    else {
                        const previousChildNodes = Array.from(hostObject.hostProject.employeeSlots[state.visibleType.type][hostObject.hostProject.employeeSlots[state.visibleType.type].indexOf(hostObject) - 1].display.childNodes)
                        if(previousChildNodes.some(workloadBlock => sq.getNearestTimeBlock(workloadBlock.getBoundingClientRect().left) == id)) {
                            focus(previousChildNodes.find(workloadBlock => sq.getNearestTimeBlock(workloadBlock.getBoundingClientRect().left) == id))
                        }
                        else {
                            const previousChildNodesFirstID = sq.getNearestTimeBlock(previousChildNodes[0].getBoundingClientRect().left)
                            const previousChildNodesLastID = sq.getNearestTimeBlock(previousChildNodes[previousChildNodes.length - 1].getBoundingClientRect().left)

                            if(id > previousChildNodesLastID) {
                                focus(previousChildNodes[previousChildNodes.length - 1])
                            }
                            else if(id < previousChildNodesFirstID) {
                                focus(previousChildNodes[0])
                            }
                        }
                    }
                }
            }
            else if(hostObject.hasOwnProperty('joiningDate')) {
                if(state.getVisibleEmployees().indexOf(hostObject) == 0) {
                    if(!findLastLeaveSlot()) if(!findLastEmployeeSlot()) findLastEmployee() 
                }
                else focus(state.getVisibleEmployees()[state.getVisibleEmployees().indexOf(hostObject) - 1].label)
            }
            else {
                if(leave.leaveSlots[state.visibleType.type].indexOf(hostObject) == 0) {
                    if(!findLastEmployeeSlot()) if(!findLastEmployee()) findLastLeaveSlot()
                }
                else focus(leave.leaveSlots[state.visibleType.type][leave.leaveSlots[state.visibleType.type].indexOf(hostObject) - 1].label)
            }
        },
        down(focused, hostObject) {
            if(hostObject.hasOwnProperty('security')) {
                if(state.projects.indexOf(hostObject) == state.projects.length - 1) {
                    findFirstProject()
                }
                else focus(state.projects[state.projects.indexOf(hostObject) + 1].label)
            }
            else if(hostObject.hasOwnProperty('hostProject')) {

            }
            else if(hostObject.hasOwnProperty('joiningDate')) {
                if(state.getVisibleEmployees().indexOf(hostObject) == state.getVisibleEmployees().length - 1) {
                    if(!findFirstEmployeeSlot()) if(!findFirstLeaveSlot()) findFirstEmployee()
                }
                else focus(state.getVisibleEmployees()[state.getVisibleEmployees().length - 1].label)
            }
            else {

            }
        },
        right(focused, hostObject) {
            if(hostObject.hasOwnProperty('security')) {
                if(hostObject.employeeSlots[state.visibleType.type][0]) {
                    focus(hostObject.employeeSlots[state.visibleType.type][0].label)
                } else {
                    this.after(focused, hostObject)
                }
            }
            else if(hostObject.hasOwnProperty('hostProject')) {
                if(focused.className == 'employeeSlotLabel') {
                    focus(hostObject.display.firstChild)
                } else {
                    if(hostObject.display.lastChild === focused) {
                        this.after(focused, hostObject)
                    } else {
                        focus(hostObject.display.childNodes[Array.from(hostObject.display.childNodes).indexOf(focused) + 1])
                    }
                }
            }
        },
        left(focused, hostObject) {
            if(hostObject.hasOwnProperty('security')) {
                if(state.projects.indexOf(hostObject) == 0) {
                    if(!findLastEmployee()) if(!findLastLeaveSlot()) findLastProject()
                }
                else {
                    if(state.projects[state.projects.indexOf(hostObject) - 1].employeeSlots[state.visibleType.type].length > 0) {
                        focus(state.projects[state.projects.indexOf(hostObject) - 1].employeeSlots[state.visibleType.type][state.projects[state.projects.indexOf(hostObject) - 1].employeeSlots[state.visibleType.type].length - 1].display.lastChild)
                    }
                    else focus(state.projects[state.projects.indexOf(hostObject) - 1].label)
                }
            }
            else if(hostObject.hasOwnProperty('hostProject')) {
                if(focused.className == 'employeeSlotLabel') {
                    focus(hostObject.hostProject.label)
                } else {
                    if(hostObject.display.firstChild === focused) {
                        focus(hostObject.label)
                    } else {
                        focus(hostObject.display.childNodes[Array.from(hostObject.display.childNodes).indexOf(focused) - 1])
                    }
                }
            }
        },
        before(focused, hostObject) {
            if(hostObject.hasOwnProperty('employeeSlots')) beforeProjectLabel(hostObject)
            else if(hostObject.hasOwnProperty('hostProject')) beforeEmployeeSlotLabel(hostObject)
            else if(hostObject.hasOwnProperty('joiningDate')) beforeEmployeeLabel(hostObject)
            else beforeLeaveSlotLabel(hostObject)
        },
        after(focused, hostObject) {
            if(hostObject.hasOwnProperty('employeeSlots')) afterProjectLabel(hostObject)
            else if(hostObject.hasOwnProperty('hostProject')) afterEmployeeSlotLabel(hostObject)
            else if(hostObject.hasOwnProperty('joiningDate')) afterEmployeeLabel(hostObject)
            else afterLeaveSlotLabel(hostObject)
        }
    }
})()