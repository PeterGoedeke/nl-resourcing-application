const errors = Object.freeze({
    MISSINGEMPLOYEE: "Missing Employee"
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
        save.all()
        errorQueue.shift()
        if(errorQueue.length >= 1) resolveError(errorQueue[0])
        else {
            document.body.removeChild(errorWindow)
            screen.enable()
        }
    })

    function resolveError(error) {
        erroring = true
        // document.body.removeChild(errorWindow)

        let message = 'Unknown Error'
        if(error.type === errors.MISSINGEMPLOYEE) {
        }
        else {
            
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

