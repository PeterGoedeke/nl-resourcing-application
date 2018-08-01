const undo = (function() {
    let ignore = false
    let availableUndos = []

    function renameEmployee() {

    }

    function undoWrapper(func) {
        return () => {
            ignore = true
            func()
            ignore = false
        }
    }

    return {
        undo() {
            availableUndos.pop()()
        },
        registerEmployeeChange(changeType, changeDetails) {
            if(!ignore) {
                if(changeType == 'rename') {
                    availableUndos.push(undoWrapper(() => {
                        changeDetails[0].rename(changeDetails[1])
                        save.employees()
                    }))
                }
                else if(changeType == 'delete') {
                    availableUndos.push(undoWrapper(() => {
                        
                    }))
                }
                else if(changeType == 'setJoinDate') {

                }
                else if(changeType == 'setLeaveDate') {

                }
                else if(changeType == 'changeDaysAWeek') {

                }
            }
        }
    }
})()