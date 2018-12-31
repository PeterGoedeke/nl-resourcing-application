const projectProto = {
    batchLoad() {
        this.container = projectContainer.cloneNode(true)
        this.body = this.container.querySelector('.projectBody')
        this.slotLabelContainer = this.container.querySelector('.projectSlotLabelContainer')
        // console.time(3)
        // this.slots.forEach(slot => this.body.appendChild(slot.batchLoad()))
        this.body.style.left = getLeftFromID(this.start)
        console.log(getLeftFromID(this.start), this.start)
        this.body.style.width = getWidthFromID(this.start, this.end)
        this.slots.forEach(slot => slot.batchLoad())
        this.visibleSlots.forEach(slot => {
            this.body.appendChild(slot.body)
            this.slotLabelContainer.appendChild(slot.label)
        })
        // console.timeEnd(3)
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
            this.body.style.left = getLeftFromID(start)
            this.start = start
        }
        if(this.end != end) {
            this.slots.forEach(slot => slot.alterSpan(0, end - this.end))
            this.end = end
        }
        this.body.style.width = getWidthFromID(start, end)
    },
    get visibleSlots() {
        return this.slots.filter(slot => slot.type == main.visibleType)
    }
}

function showVisible() {
    main.visibleType = 2
    for(let i = 0; i < projects.length; i++) projects[i].showVisible()
}
const main = {
    visibleType: 1
}

const employeeSlotProto = {
    batchLoad() {
        this.body = slotBody.cloneNode()
        this.body.style.left = getLeftFromID(this.start - (this.host.start - columns.baseID))
        this.body.style.width = Object.keys(this.workload).length * columns.columnWidth + 'px'
        this.label = slotLabel.cloneNode()
        // console.time(1)
        for(const key in this.workload) {
            // console.time('clone cell')
            let cell = slotCell.cloneNode()
            // console.timeEnd('clone cell')
            // console.time('inner html')
            cell.textContent = this.workload[key]
            // console.timeEnd('inner html')
            // console.time('append child')
            this.body.appendChild(cell)
            // console.timeEnd('append child')
        }
        // console.timeEnd(1)
        // return this.body
    },
    get start() {
        return Math.min(...Object.keys(this.workload))
    },
    get end() {
        return Math.max(...Object.keys(this.workload))
    }
}

let projects = []
function slotsBase(host) {
    let slotsBase = []
    for(let i = 0; i < 200; i++) {
        slotsBase.push(Object.create(employeeSlotProto))
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
        projects.push(Object.create(projectProto))
        projects[i].slots = slotsBase(projects[i])
        projects[i].id = i
        projects[i].start = Math.floor(Math.random() * 20) + columns.baseID
        projects[i].end = Math.floor(Math.random() * 20) + columns.baseID + projects[i].start
    }
    console.time('test')
    for(let i = 0; i < 10; i++) {
        fragment.appendChild(projects[i].batchLoad())
    }
    console.timeEnd('test')
    // let element = document.createElement('div')
    // element.appendChild(fragment)
    // console.log(element.getElementsByTagName('*').length)
    document.body.appendChild(fragment)
}
load()