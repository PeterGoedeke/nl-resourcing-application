const sheets = (function() {
    let types = ['qa', 'pm', 'sm']
    let visible = 'qa'
    
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
        container.appendChild(cell)
    }
    return {
        set: setVisible,
        get visible() { return visible },
        types
    }
})()

