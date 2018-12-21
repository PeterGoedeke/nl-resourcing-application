const projectProto = {
    batchLoad() {
        this.container = projectContainer.cloneNode(true)
        this.body = this.container.querySelector('.projectBody')
        this.slotLabelContainer = this.container.querySelector('.projectSlotLabelContainer')
        // console.time(3)
        // this.slots.forEach(slot => this.body.appendChild(slot.batchLoad()))
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
        this.body.style.width = Object.keys(this.workload).length * 5 + 'vw'
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
    }
}

let projects = []
function slotsBase() {
    let slotsBase = []
    for(let i = 0; i < 200; i++) {
        slotsBase.push(Object.create(employeeSlotProto))
        slotsBase[slotsBase.length - 1].workload = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 5,
            7: 5,
            8: 5,
            9: 5,
            0: 5,
            a: 5,
            b: 5,
            c: 5,
            d: 5,
            e: 5,
            f: 5,
            g: 5,
            h: 5,
            i: 5,
            j: 5,
            k: 5,
            l: 5,
            m: 5,
            n: 5,
            o: 5,
            p: 5,
            q: 5,
            r: 5,
            s: 5,
            t: 5,
            u: 5,
            v: 5,
            w: 5,
            x: 5,
            y: 5,
            z: 5,
            11: 5,
            12: 5,
            13: 5,
            14: 5,
            15: 5,
            16: 5,
            17: 5,
            18: 5,
            19: 5,
        }
        slotsBase[i].type = i > 50 ? 1 : 2
    }
    return slotsBase
}
function load() {
    const fragment = document.createDocumentFragment()
    for(let i = 0; i < 10; i++) {
        projects.push(Object.create(projectProto))
        projects[projects.length - 1].slots = slotsBase()
        projects[i].id = i
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