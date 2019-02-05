const sheetTabsContainer = document.querySelector('.sheetTabsContainer')

const sheetProto = {
    init() {
        this.cell = typeCell.cloneNode()
        this.cell.addEventListener('click', event => {
            sheets.set(this.name)
        })

        this.cell.addEventListener('contextmenu', event => {
            contextMenus.open(3, [
                () => {
                    if(sheets.types.length > 1) {
                        this.delete()
                        contextMenus.close()
                    }
                }], event, pane => {
                    if(sheets.types.length <= 1) pane.querySelector('.e0').style.color = 'grey'
                })
        })

        this.cell.textContent = this.name
        sheetTabsContainer.insertBefore(this.cell, sheetTabsContainer.lastChild)
    },
    delete() {
        sheets.remove(this.name)
        sheetTabsContainer.removeChild(this.cell)
        save.all()
    }
}

function createSheet(details) {
    let sheet = Object.create(sheetProto)
    if(details) {
        Object.assign(sheet, details)
    }
    else {
        // default settings
    }
    return sheet
}


const sheets = (function() {
    let types = []
    let visible

    function setVisible(name) {
        console.log(':)')
        visible = name
        projects.showVisible()
        employees.showVisible()
        rows.refreshCellsAll()
        types.forEach(type => {
            if(type.name == name) type.cell.classList.add('activeSheet')
            else type.cell.classList.remove('activeSheet')
        })
    }
    const addSheet = document.querySelector('.addSheet')
    addSheet.addEventListener('click', event => {
        inputify(addSheet, value => {
            const newType = value.toLowerCase().trim()
            if(!types.map(type => type.name).includes(newType) && newType) {
                add(newType)
                save.projects()
                save.sheets()
            }
            addSheet.innerHTML = '+'
        }, false)
    })

    function add(type) {
        const newSheet = createSheet()
        newSheet.name = type
        newSheet.init()
        types.push(newSheet)
        setVisible(type)
    }

    return {
        set: setVisible,
        get visible() { return visible },
        set visible(value) { visible = value },
        get types() { return types.map(type => type.name) },
        remove(type) {
            types.splice(types.indexOf(type), 1)
            employees.byType(type).forEach(employee => employee.delete())
            projects.list.forEach(project => {
                project.slotsByType(type).forEach(slot => slot.delete())
            })
            setVisible(types[0].name)
        },
        add
    }
})()

