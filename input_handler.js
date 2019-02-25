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

const DIRECTIONS = Object.freeze({
    left: 37, up: 38, right: 39, down: 40
})


function inputifyNav(element, cb, navigate, database = undefined) {
    if(element.querySelector('input')) return
    function testNavigation(event) {
        switch(event.which) {
            case DIRECTIONS.left:
            if(event.target.selectionStart != 0) break
            case DIRECTIONS.right:
            if(event.which == DIRECTIONS.right && event.target.selectionStart != event.target.value.length && !(event.target.selectionStart == 0 && event.target.selectionEnd == event.target.value.length)) break
            case DIRECTIONS.up:
            case DIRECTIONS.down:
            navigate(event.which)
        }
    }

    if(database) inputifyAutocomplete(element, cb, database)
    else inputify(element, cb)
    element.querySelector('input:not(:disabled)').addEventListener('keydown', testNavigation)
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
                hintInput.value = input.value + name.toLowerCase().split(input.value.toLowerCase())[1]
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