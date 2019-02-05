const contextMenus = (function() {
    const contextPane = document.createElement('div')
    contextPane.className = 'contextPane'

    const contextMenus = [
        createContextMenu([['./assets/lock.png', 'Toggle Security'], 'Toggle Interiors', 'Set Colour:', 'Move up', 'Move down', 'Delete']),
        createContextMenu(['Delete']),
        createContextMenu(['Set Joining Date', 'Set Leaving Date', 'Clear Join & Leave', 'Toggle Interiors', 'Full-time:', 'Delete'])
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
    
            if(event.pageX + 125 < window.innerWidth + window.pageXOffset) {
                contextPane.style.left = event.pageX + 'px'
            } else contextPane.style.left = event.pageX - 125 + 'px'
            if(event.pageY + 150 < window.innerHeight + window.pageYOffset) {
                contextPane.style.top = event.pageY + 'px'
            } else contextPane.style.top = event.pageY - 150 + 'px'
            
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
                text.className = 'partialWidth e' + i
                image.src = item[0]
                text.textContent = item[1]
                wrapper.appendChild(image)
                fragment.appendChild(wrapper)
            }
            else {
                text.className = 'fullWidth e' + i
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