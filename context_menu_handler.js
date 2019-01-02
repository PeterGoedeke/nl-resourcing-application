const contextMenus = (function() {
    const contextPane = document.createElement('div')
    contextPane.className = 'contextPane'

    const contextMenus = [
        createContextMenu([['./assets/lock.png', 'Toggle Security'], 'item2', 'Delete'])
    ]
    let active = false
    function openContextMenu(index, cbs, event, beforeOpen) {
        if(!active) {
            active = true
            const menu = contextMenus[index].cloneNode(true)
            const links = Array.from(menu.querySelectorAll('.partialWidth, .fullWidth'))
            links.forEach((link, i) => {
                link.addEventListener('click', cbs[i])
            })
            contextPane.appendChild(menu)
    
            contextPane.style.left = event.pageX + 'px'
            contextPane.style.top = event.pageY + 'px'
            if(beforeOpen) beforeOpen(contextPane)
            document.body.appendChild(contextPane)
    
            setTimeout(() => addEventListener('mousedown', removeContextPane), 0)
        }
    }
    function removeContextPane(event) {
        if(!(event.target == contextPane || contextPane.contains(event.target))) {
            closeContextMenu()
        }
    }
    function closeContextMenu() {
        removeEventListener('mousedown', removeContextPane)
        document.body.removeChild(contextPane)
        contextPane.innerHTML = ''
        active = false
    }

    function createContextMenu(details) {
        const fragment = document.createDocumentFragment()
        details.forEach((item, i) => {
            let text = document.createElement('div')
            if(item.constructor === Array) {
                let image = document.createElement('img')
                let wrapper = document.createElement('div')
                wrapper.className = 'wrapper'
                text.className = 'partialWidth'
                image.src = item[0]
                text.textContent = item[1]
                wrapper.appendChild(image)
                fragment.appendChild(wrapper)
            }
            else {
                text.className = 'fullWidth'
                text.textContent = item
            }
            fragment.appendChild(text)
        })
        return fragment
    }
    return {
        open: openContextMenu, close: closeContextMenu
    }
})()

document.addEventListener('contextmenu', event => {
    event.preventDefault()
})