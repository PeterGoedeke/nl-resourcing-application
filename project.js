const projectProto = {
    batchLoad() {
        this.container = projectContainer.cloneNode(true)
        this.body = this.container.querySelector('.projectBody')
        this.label = this.container.querySelector('.projectLabel')
        this.createSlotButton = this.container.querySelector('.projectCreateSlotButton')
        this.startHandle = this.container.querySelector('.start')
        this.endHandle = this.container.querySelector('.end')
        this.container.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'

        addDragging(this.startHandle, () => columns.getLeftFromID(this.start), id => {
            this.setSpan(id, this.end)
            this.startHandle.style.left = '-5px'
        })
        addDragging(this.endHandle, () => columns.getLeftFromID(this.start), id => {
            this.setSpan(this.start, id)
            this.endHandle.style.right = '-5px'
            this.endHandle.style.left = 'initial'
        })
        this.label.addEventListener('click', event => {
            this.label.style.height = columns.rowHeight * this.visibleSlots.length + 'px'
            inputify(this.label, newLabel => {
                this.label.innerHTML = newLabel || 'Unnamed'
                this.name = newLabel
                this.label.style.height = 'initial'
            })
        })
        this.container.addEventListener('contextmenu', event => {
            contextMenus.open(0, [
                () => {
                    let image = document.querySelector('img')
                    image.src = `./assets/${this.secured ? 'un' : ''}lock.png`
                    this.secured = !this.secured
                    this.setColor(this.color)
                },
                () => {
                    this.toggleInteriors()
                },
                () => {
                    //this.setColor()
                },
                () => {
                    this.moveUp()
                },
                () => {
                    this.moveDown()
                },
                () => {
                    this.delete()
                    contextMenus.close()
                }
            ], event, pane => {
                pane.querySelector('img').src = `./assets/${this.secured ? '' : 'un'}lock.png`
                let input = document.createElement('input')
                input.type = 'color'
                input.style.cursor = 'pointer'
                input.addEventListener('change', event => {
                    this.setColor(input.value)
                    save.projects()
                })
                pane.querySelector('.e2').appendChild(input)
                pane.querySelector('.e2').style.cursor = 'initial'
            })
        })
        this.createSlotButton.addEventListener('click', event => {
            this.createNewSlot()
            rows.refreshCellsSlots()
        })

        this.slotLabelContainer = this.container.querySelector('.projectSlotLabelContainer')
        this.body.style.left = columns.getLeftFromID(this.start)
        this.body.style.width = columns.getWidthFromID(this.start, this.end)
        this.slots.forEach(slot => {
            slot.initDisplay()
        })
        this.visibleSlots.forEach(slot => {
            this.body.appendChild(slot.body)
            this.slotLabelContainer.appendChild(slot.label)
        })
        this.label.textContent = this.name || 'Unnamed'
        this.setColor(this.color)
        return this.container
    },
    init() {
        if(this.interiors) {
            const index = projects.list.findIndex(project => project.interiors == true)
            if(index == -1) projects.list.push(this)
            else projects.list.splice(index, 0, this)
        } else {
            projects.list.unshift(this)
        }
    },
    toggleInteriors() {
        if(this.interiors) {
            this.interiors = false
            insertAfter(this.container, projectAreaSeparator)
            projects.list.move(projects.list.indexOf(this), 0)
        } else {
            projects.list.move(projects.list.indexOf(this), projects.list.findIndex(project => project.interiors == true))
            this.interiors = true
            insertAfter(this.container, interiorsProjectAreaSeparator)
        }
        save.projects()
    },
    moveUp() {
        if(this.container.previousSibling.className == 'projectContainer') {
            this.container.parentNode.insertBefore(this.container, this.container.previousSibling)
            projects.list.move(projects.list.indexOf(this), projects.list.indexOf(this) - 1)
        }
        save.projects()
    },
    moveDown() {
        if(this.container.nextSibling.className == 'projectContainer') {
            insertAfter(this.container, this.container.nextSibling)
            projects.list.move(projects.list.indexOf(this), projects.list.indexOf(this) + 1)
        }
        save.projects()
    },
    showVisible() {
        this.body.innerHTML = ''
        this.slotLabelContainer.innerHTML = ''
        this.body.appendChild(this.startHandle)
        this.startHandle.style.left = '-5px'
        this.body.appendChild(this.endHandle)
        this.endHandle.style.right = '-5px'
        this.slotLabelContainer.appendChild(this.createSlotButton)
        this.visibleSlots.forEach(slot => {
            this.body.appendChild(slot.body)
            this.slotLabelContainer.appendChild(slot.label)
        })
    },
    setColor(color) {
        this.slotLabelContainer.style.background = color
        this.label.style.background = color
        if(this.secured) this.container.style.background = color
        else this.container.style.background = `repeating-linear-gradient(-45deg, ${color}, ${shadeColor(color, 0.5)} 5px, ${color} 5px, ${shadeColor(color, 0.5)} 5px)`
        this.color = color
    },
    setSpan(start, end) {
        if(start >= this.end) start = this.end - 1
        if(end <= this.start) end = this.start + 1
        if(start <= columns.baseID) start = columns.baseID + 1
        if(this.start != start) {
            this.slots.forEach(slot => slot.alterSpan(start - this.start, 0, start))
            this.body.style.left = columns.getLeftFromID(start)
            this.start = start
        }
        if(this.end != end) {
            this.slots.forEach(slot => slot.alterSpan(0, end - this.end))
            this.end = end
        }
        this.body.style.width = columns.getWidthFromID(this.start, this.end)
        save.projects()
        //clash
    },
    createNewSlot() {
        let newSlot = createSlot(null, this)
        this.slots.push(newSlot)
        newSlot.initDisplay()
        newSlot.type = sheets.visible
        this.body.appendChild(newSlot.body)
        this.slotLabelContainer.appendChild(newSlot.label)
        save.projects()
        //clash
    },
    delete() {
        projects.list.splice(projects.list.indexOf(this), 1)
        document.body.removeChild(this.container)
        this.slots.forEach(slot => slot.decouple())
        save.projects()
        //clash
    },
    get visibleSlots() {
        return this.slotsByType(sheets.visible)
    },
    slotsByType(type) {
        return this.slots.filter(slot => slot.type == type)
    },
    toJSON() {
        const slots = this.slots.map(slot => {
            return {
                employeeName: slot.employee && slot.employee.name || null,
                type: slot.type,
                workload: slot.workload
            }
        })
        return {
            color: this.color,
            interiors: this.interiors,
            start: this.start,
            end: this.end,
            name: this.name,
            secured: this.secured,
            slots: slots
        }
    }
}

function createProject(details) {
    let project = Object.create(projectProto)
    project.slots = []
    if(details) {
        Object.assign(project, details)
        project.slots = project.slots.map(slot => createSlot(slot, project))
    }
    else {
        project.start = columns.leftmostVisibleColumn + 2
        project.end = columns.rightmostVisibleColumn - 2
        project.name = 'Unnamed'
        project.secured = true
        project.color = random.color()
        
        sheets.types.forEach(type => {
            project.slots.push(createSlot(null, project))
            project.slots[project.slots.length - 1].type = type
        })
    }
    return project
}

const projects = {
    visibleType: 'qa',
    list: [],
    showVisible() {
        this.list.forEach(project => project.showVisible())
    }
}

const projectAreaSeparator = document.querySelector('.projectAreaSeparator')
const newProjectButton = document.querySelector('.newProject')
newProjectButton.addEventListener('mousedown', event => {
    const newProject = createProject()
    const container = newProject.batchLoad()
    newProject.showVisible()
    newProject.init()
    rows.refreshCellsSlots()
    insertAfter(container, projectAreaSeparator)
    save.projects()
})

const interiorsProjectAreaSeparator = document.querySelector('.interiorsProjectAreaSeparator')
const newInteriorsProjectButton = document.querySelector('.newInteriorsProject')
newInteriorsProjectButton.addEventListener('mousedown', event => {
    const newProject = createProject()
    const container = newProject.batchLoad()
    newProject.interiors = true
    newProject.showVisible()
    newProject.init()
    rows.refreshCellsSlots()
    insertAfter(container, interiorsProjectAreaSeparator)
    save.projects()
})