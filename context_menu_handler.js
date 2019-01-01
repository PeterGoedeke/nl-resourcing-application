const contextMenus = (function() {
    const contextPane = document.createElement('div')
    contextPane.className = 'contextPane'

    const contextMenus = [
        createContextMenu([['./assets/lock.png', 'Toggle Security'], 'item2', 'item3'])
    ]

    function openContextMenu(index, cbs, event) {
        const menu = contextMenus[index].cloneNode(true)
        const links = Array.from(menu.querySelectorAll('.partialWidth, .fullWidth'))
        links.forEach((link, i) => {
            link.addEventListener('click', cbs[i])
        })
        contextPane.appendChild(menu)

        contextPane.style.left = event.pageX + 'px'
        contextPane.style.top = event.pageY + 'px'
        document.body.appendChild(contextPane)
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
        open: openContextMenu
    }
})()
