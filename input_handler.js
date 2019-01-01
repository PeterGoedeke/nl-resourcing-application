function inputify(element, cb) {
    let input = document.createElement('input')
    input.value = element.textContent
    element.textContent = ''
    element.classList.add('activeInput')
    element.appendChild(input)
    
    function callCb() {
        element.classList.remove('activeInput')
        input.removeEventListener('keypress', callCbEnter)
        cb(input.value)
    }
    function callCbEnter() {
        if(event.which == 13) {
            element.classList.remove('activeInput')
            input.removeEventListener('blur', callCb)
            cb(input.value)
        }
    }

    input.addEventListener('blur', callCb)
    input.addEventListener('keypress', callCbEnter)

    setTimeout(() => {
        input.focus()
        input.select()
    }, 0)
}

function inputifyAutocomplete(element, cb, database) {
    database = database.sort()
    let input = document.createElement('input')
    input.style.background = 'transparent'
    let hintInput = document.createElement('input')
    element.classList.add('autocompleteInput')
    input.value = element.textContent
    hintInput.disabled = true
    element.textContent = ''
    element.appendChild(hintInput)
    element.appendChild(input)

    function callCb() {
        element.classList.remove('autocompleteInput')
        input.removeEventListener('keypress', callCbEnter)
        cb(input.value)
    }
    function callCbEnter() {
        if(event.which == 13) {
            element.classList.remove('autocompleteInput')
            input.removeEventListener('blur', callCb)
            cb(hintInput.value)
        }
        else autoComplete()
    }
    function autoComplete() {
        for(const name of database) {
            if(input.value && name.toLowerCase().startsWith(input.value.toLowerCase())) {
                hintInput.value = name
                return
            }
        }
        hintInput.value = ''
    }

    input.addEventListener('blur', callCb)
    input.addEventListener('keyup', callCbEnter)

    setTimeout(() => {
        input.focus()
        input.select()
    }, 0)
}