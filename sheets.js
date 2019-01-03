const sheets = (function() {
    let types = ['sm', 'pm', 'qs']
    let visible = 'qs'
    
    const typeCell = (function() {
        let typeCell = document.createElement('div')
        typeCell.className = 'typeCell'
        return typeCell
    })()

    function setVisible(type) {
        visible = type
        projects.showVisible()
        employees.showVisible()
        rows.refreshCellsAll()
    }
    const container = document.querySelector('.sheetTabsContainer')
    types.forEach((type) => {
        createType(type)
    })

    function createType(type) {
        const cell = typeCell.cloneNode()
        cell.addEventListener('click', event => {
            setVisible(type)
        })
        cell.textContent = type.toUpperCase()
        container.insertBefore(cell, container.firstChild)
    }

    const addSheet = document.querySelector('.addSheet')
    addSheet.addEventListener('click', event => {
        inputify(addSheet, value => {
            const newType = value.toLowerCase().trim()
            if(!types.includes(newType) && newType) {
                createType(newType)
                types.push(newType)
            }
            addSheet.innerHTML = '+'
        }, false)
    })

    return {
        set: setVisible,
        get visible() { return visible },
        types
    }
})()

