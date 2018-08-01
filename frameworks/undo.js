const undo = (function() {
    let ignore = false
    let availableUndos = []

    function renameEmployee() {

    }

    return {
        undo() {
            availableUndos.pop()()
        },
        registerEmployeeChange(changeType, changeDetails) {
            if(!ignore) {
                if(changeType == 'rename') {
                    availableUndos.push(() => {
                        ignore = true
                        changeDetails[0].rename(changeDetails[1])
                        ignore = false
                        save.employees()
                    })
                }
            }
        }
    }
})()