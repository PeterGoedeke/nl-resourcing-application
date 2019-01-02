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
                this.label.innerHTML = newLabel
                this.name = newLabel
                this.label.style.height = 'initial'
            })
        })
        this.body.addEventListener('mousedown', event => {
            if(event.which == 3) {
                contextMenus.open(0, [
                    () => {
                        let image = document.querySelector('img')
                        image.src = `./assets/${this.secured ? 'un' : ''}lock.png`
                        this.secured = !this.secured
                    },
                    () => {
                        console.log('item2')
                    },
                    () => {
                        this.delete()
                        contextMenus.close()
                    }
                ], event, pane => {
                    pane.querySelector('img').src = `./assets/${this.secured ? '' : 'un'}lock.png`
                })
            }
        })
        this.createSlotButton.addEventListener('click', event => this.createNewSlot())

        this.slotLabelContainer = this.container.querySelector('.projectSlotLabelContainer')
        this.body.style.left = columns.getLeftFromID(this.start)
        this.body.style.width = columns.getWidthFromID(this.start, this.end)
        this.slots.forEach(slot => slot.initDisplay())
        this.visibleSlots.forEach(slot => {
            this.body.appendChild(slot.body)
            this.slotLabelContainer.appendChild(slot.label)
        })
        this.label.textContent = this.name
        return this.container
    },
    init() {
        projects.list.push(this)
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
    setSpan(start, end) {
        if(this.start != start) {
            this.slots.forEach(slot => slot.alterSpan(start - this.start, 0, start))
            this.body.style.left = columns.getLeftFromID(start)
            this.start = start
        }
        if(this.end != end) {
            this.slots.forEach(slot => slot.alterSpan(0, end - this.end))
            this.end = end
        }
        this.body.style.width = columns.getWidthFromID(start, end)
    },
    createNewSlot() {
        let newSlot = createSlot(null, this)
        this.slots.push(newSlot)
        newSlot.initDisplay()
        newSlot.type = projects.visibleType
        this.body.appendChild(newSlot.body)
        this.slotLabelContainer.appendChild(newSlot.label)
    },
    delete() {
        projects.list.splice(projects.list.indexOf(this), 1)
        document.body.removeChild(this.container)
    },
    get visibleSlots() {
        return this.slots.filter(slot => slot.type == projects.visibleType)
    }
}

function createProject(details) {
    let project = Object.create(projectProto)
    if(details) Object.assign(project, details)
    else {
        project.start = columns.leftmostVisibleColumn + 2
        project.end = columns.rightmostVisibleColumn - 2
        project.name = 'Unnamed'
        project.secured = true
        
        project.slots = []
        projects.types.forEach(type => {
            project.slots.push(createSlot(null, project))
            project.slots[project.slots.length - 1].initDisplay()
            project.slots[project.slots.length - 1].type = type
        })
    }
    return project
}

const projects = {
    types: ['qa', 'pm', 'sm'],
    visibleType: 'qa',
    list: [],
    showVisible() {
        list.forEach(project => project.showVisible())
    }
}

const projectAreaSeparator = document.querySelector('.projectAreaSeparator')
const newProjectButton = document.querySelector('.newProject')
newProjectButton.addEventListener('mousedown', event => {
    const newProject = createProject()
    const container = newProject.batchLoad()
    newProject.showVisible()
    newProject.init()
    document.body.insertBefore(container, projectAreaSeparator)
})

const interiorsProjectAreaSeparator = document.querySelector('.interiorsProjectAreaSeparator')
const newInteriorsProjectButton = document.querySelector('.newInteriorsProject')
newInteriorsProjectButton.addEventListener('mousedown', event => {
    const newProject = createProject()
    const container = newProject.batchLoad()
    newProject.interiors = true
    newProject.showVisible()
    newProject.init()
    document.body.insertBefore(container, interiorsProjectAreaSeparator)
})


/*
function load() {
    const fragment = document.createDocumentFragment()
    for(let i = 0; i < 10; i++) {
        projects.list.push(Object.create(projectProto))
        projects.list[i].slots = slotsBase(projects.list[i])
        projects.list[i].id = i
        projects.list[i].start = Math.floor(Math.random() * 20) + columns.baseID
        projects.list[i].end = Math.floor(Math.random() * 20) + columns.baseID + projects.list[i].start
    }
    for(let i = 0; i < 10; i++) {
        fragment.appendChild(projects.list[i].batchLoad())
    }
    document.body.appendChild(fragment)
}
load()
*/