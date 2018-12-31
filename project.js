const projectProto = {
    batchLoad() {
        this.container = projectContainer.cloneNode(true)
        this.body = this.container.querySelector('.projectBody')
        this.slotLabelContainer = this.container.querySelector('.projectSlotLabelContainer')
        this.body.style.left = columns.getLeftFromID(this.start)
        this.body.style.width = columns.getWidthFromID(this.start, this.end)
        this.slots.forEach(slot => slot.initDisplay())
        this.visibleSlots.forEach(slot => {
            this.body.appendChild(slot.body)
            this.slotLabelContainer.appendChild(slot.label)
        })
        return this.container
    },
    showVisible() {
        this.body.innerHTML = ''
        this.slotLabelContainer.innerHTML = ''
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

const projects = {
    visibleType: 1,
    list: [],
    showVisible() {
        list.forEach(project => project.showVisible())
    }
}

function slotsBase(host) {
    let slotsBase = []
    for(let i = 0; i < 200; i++) {
        slotsBase.push(Object.create(slotProto))
        slotsBase[slotsBase.length - 1].workload = {
            1173: 4
        }
        slotsBase[i].host = host
        slotsBase[i].type = i > 50 ? 1 : 2
    }
    return slotsBase
}
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