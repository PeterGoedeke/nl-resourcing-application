const projectProto = {
    batchLoad() {
        this.container = projectContainer.cloneNode(true)
        this.body = this.container.querySelector('.projectBody')
        this.label = this.container.querySelector('.projectLabel')
        this.startHandle = this.container.querySelector('.start')
        this.endHandle = this.container.querySelector('.end')
        addDragging(this.startHandle, () => columns.getLeftFromID(this.start), id => {
            this.setSpan(id, this.end)
            this.startHandle.style.left = '0px'
        })
        addDragging(this.endHandle, () => columns.getLeftFromID(this.start), id => {
            this.setSpan(this.start, id)
            this.endHandle.style.right = '0px'
            this.endHandle.style.left = 'initial'
        })
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
        this.body.appendChild(this.endHandle)
        this.visibleSlots.forEach(slot => {
            this.body.appendChild(slot.body)
            this.slotLabelContainer.appendChild(slot.label)
        })
    },
    setSpan(start, end) {
        if(this.start != start) {
            this.slots.forEach(slot => slot.alterSpan(start - this.start, 0))
            this.body.style.left = columns.getLeftFromID(start)
            this.start = start
        }
        if(this.end != end) {
            this.slots.forEach(slot => slot.alterSpan(0, end - this.end))
            this.end = end
        }
        this.body.style.width = columns.getWidthFromID(start, end)
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