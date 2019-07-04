const errors = Object.freeze({
    UNKNOWN_ERROR: 'Unknown Error',
    MISSING_EMPLOYEE: 'Missing Employee',
    DUPLICATE_EMPLOYEE: 'Duplicate Employee',
    PARSE_ISSUE: 'Parse Issue',
    DISCONNECTED: 'Disconnected'
})

const errorHandler = (function() {
    let erroring = false
    
    const errorWindow = document.createElement('div')
    errorWindow.className = 'window errorWindow'

    const windowHeader = document.createElement('p')
    windowHeader.textContent = 'Application Error'
    windowHeader.className = 'error'
    errorWindow.appendChild(windowHeader)

    const textSpace = document.createElement('div')
    textSpace.className = 'textSpace'
    errorWindow.appendChild(textSpace)

    const confirmationButton = document.createElement('div')
    confirmationButton.className = 'windowButton'
    confirmationButton.textContent = String.fromCharCode(10003)
    errorWindow.appendChild(confirmationButton)

    confirmationButton.addEventListener('click', event => {
        errorQueue.shift()
        if(errorQueue.length >= 1) resolveError(errorQueue[0])
        else {
            document.body.removeChild(errorWindow)
            screen.enable()
            erroring = false
        }
    })

    function wrapper(func) {
        function onClick() {
            func()
            confirmationButton.removeEventListener('click', onClick)
        }
        confirmationButton.addEventListener('click', onClick)
    }

    function resolveError(error) {
        erroring = true
        // document.body.removeChild(errorWindow)

        let message = 'Unknown Error'
        if(error.type === errors.MISSING_EMPLOYEE) {
            message = `During loading, the project '${error.details.host.name}' requested the employee '${error.details.slot.employeeName}' (${error.details.slot.type}). This employee does not exist in the application.
            References to employee '${error.details.slot.employeeName}' will be removed from the application to fix conflicts. This can be reverted manually by re-adding the employee.
            Press the button below to confirm.`
            wrapper(() => save.all())
        }
        else if(error.type === errors.DUPLICATE_EMPLOYEE) {
            message = `During loading, the application detected duplicate copies of employee ${error.employee}; e.g. employees with the same name, in the same sheet, with the same job & details. Duplicate employees will be removed from the application to fix conflicts (Note: it is not possible to manually add duplicate employees and therefore this error-cleanup should not result in the loss of legitimate information).
            Press the button below to confirm.`

        }
        else if(error.type === errors.PARSE_ISSUE) {
            message = `During loading, a parsing issue was encountered.`
            wrapper(() => {
                openDirectorySelect()
            })
        }
        else if(error.type === errors.DISCONNECTED) {
            message = `Disconnected from server. This could be due to a server crash, or because of an unstable internet connection. Ensure that you have a stable internet connection. Be aware that continuing without a stable connection may lead to data loss. Press the button below to continue.`
        }
        else if(error.type === errors.UNKNOWN_ERROR) {
            message = `An unknown error has occurred. Restarting the application is most likely to avoid further issue. Press the button below to continue.`
        }
        windowHeader.textContent = `Error: ${error.type} (1 of ${errorQueue.length})`
        textSpace.textContent = message

        if(errorWindow.parentNode !== document.body) document.body.appendChild(errorWindow)
        screen.disable(false)
    }

    const errorQueue = []
    function registerError(error) {
        if(errorQueue.length < 1) resolveError(error)
        errorQueue.push(error)

        const errorHeading = document.querySelector('.error')
        if(errorHeading) {
            errorHeading.textContent = errorHeading.textContent.slice(0, -2) + errorQueue.length + ')'
        }
    }

    window.onerror = function(message, url, lineNumber) {
        console.log('error')
        // makeSaveRequest(JSON.stringify({data: {message, url, lineNumber}, type: 'log'}))
    }
    
    return {
        register: registerError, get erroring() { return erroring }
    }
})()

