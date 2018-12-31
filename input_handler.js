function inputify(element, cb, width) {
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