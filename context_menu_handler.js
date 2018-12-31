const contextMenus = (function() {
    const contextPane = document.createElement('div')
    contextPane.className = 'contextPane'

    const contextMenus = [
        createContextMenu(['item1', 'item2', 'item3'])
    ]

    function openContextMenu(index, cbs) {
        const menu = contextMenus[index].cloneNode(true)
        console.log(menu)
        const links = Array.from(menu.querySelectorAll('div'))
        links.forEach((link, i) => {
            link.addEventListener('click', cbs[i])
        })
        contextPane.appendChild(menu)
        document.body.appendChild(contextPane)
    }
    function createContextMenu(details) {
        const fragment = document.createDocumentFragment()
        details.forEach((item, i) => {
            let text = document.createElement('div')
            fragment.appendChild(text)
            if(item.constructor === Array) {
                let image = document.createElement('img')
                text.className = 'partialWidth'
                image.src = item[0]
                text.textContent = item[1]
                fragment.appendChild(image)
            }
            else {
                text.className = 'fullWidth'
                text.textContent = item
            }
        })
        return fragment
    }
    return {
        open: openContextMenu
    }
})()
