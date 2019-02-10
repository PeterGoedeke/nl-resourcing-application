function inputify(element, cb, setText = true) {
    let input = document.createElement('input')
    if(setText) input.value = element.textContent
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
    input.addEventListener('click', event => event.stopImmediatePropagation())

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
    hintInput.value = element.textContent
    hintInput.disabled = true
    element.textContent = ''
    element.appendChild(hintInput)
    element.appendChild(input)

    function callCb() {
        element.classList.remove('autocompleteInput')
        input.removeEventListener('keypress', callCbEnter)
        cb(hintInput.value)
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
    input.addEventListener('click', event => event.stopImmediatePropagation())

    setTimeout(() => {
        input.focus()
        input.select()
    }, 0)
}