const sheetTabsContainer = document.querySelector('.sheetTabsContainer')

const sheetProto = {
    init() {
        this.cell = typeCell.cloneNode()
        this.cell.addEventListener('click', event => {
            sheets.set(this.name)
            rows.refreshCellsAll()
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

                    for(let i = 0; i < 2; i++) {
                        let input = document.createElement('input')
                        input.style.cursor = 'pointer'
                        input.value = (i == 0 ? this.minimum : this.maximum) * 100 + '%'
                        input.addEventListener('blur', event => {
                            const value = Number(parseInt(input.value))
                            if(value) {
                                if(i == 0) this.minimum = value / 100
                                else this.maximum = value / 100

                                rows.refreshSummation()
                                save.sheets()
                            }
                        })
                        input.addEventListener('focus', event => input.select())
                        pane.querySelector((i == 0 ? '.e1' : '.e2')).appendChild(input)
                        pane.querySelector((i == 0 ? '.e1' : '.e2')).style.cursor = 'initial'
                    }
                    let input = document.createElement('input')
                    input.style.cursor = 'pointer'
                    input.value = this.name
                    input.addEventListener('blur', event => {
                        const newValue = input.value.trim()
                        if(newValue && !sheets.types.map(type => type.toLowerCase()).includes(newValue.toLowerCase())) {
                            projects.list.forEach(project => {
                                project.slotsByType(this.name).forEach(slot => slot.type = newValue)
                            })
                            employees.byType(this.name).forEach(employee => employee.type = newValue)
                            this.name = newValue

                            save.all()
                            this.cell.textContent = newValue
                        }
                    })
                    input.addEventListener('focus', event => input.select())
                    pane.querySelector('.e3').appendChild(input)
                    pane.querySelector('.e3').style.cursor = 'initial'
                })
        })

        this.cell.textContent = this.name
        sheetTabsContainer.insertBefore(this.cell, sheetTabsContainer.lastChild)
    },
    delete() {
        sheetTabsContainer.removeChild(this.cell)
        sheets.remove(this.name)
        save.all()
    }
}

function createSheet(details) {
    let sheet = Object.create(sheetProto)
    if(details) {
        Object.assign(sheet, details)
    }
    else {
        sheet.minimum = 0.85
        sheet.maximum = 0.95
    }
    return sheet
}


const sheets = (function() {
    let types = []
    let visible

    function setVisible(name) {
        visible = name
        projects.showVisible()
        employees.showVisible()
        types.forEach(type => {
            if(type.name == name) type.cell.classList.add('activeSheet')
            else type.cell.classList.remove('activeSheet')
        })
    }
    const addSheet = document.querySelector('.addSheet')
    addSheet.addEventListener('click', event => {
        inputify(addSheet, value => {
            const newType = value.trim()
            if(newType && !types.map(type => type.name.toLowerCase()).includes(newType.toLowerCase())) {
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
        get active() { return types.find(type => type.name == this.visible) },
        get types() { return types.map(type => type.name) },
        unload() {
            types.forEach(type => sheetTabsContainer.removeChild(type.cell))
            types = []
        },
        remove(type) {
            employees.byType(type).forEach(employee => employee.delete())
            projects.list.forEach(project => {
                project.slotsByType(type).forEach(slot => slot.delete())
            })
            setVisible(types[0].name)
            types.splice(types.indexOf(type), 1)
        },
        add, fromFile(data) {
            const newSheet = createSheet(data)
            newSheet.init()
            types.push(newSheet)
        },
        toJSON() {
            return types
        }
    }
})()

