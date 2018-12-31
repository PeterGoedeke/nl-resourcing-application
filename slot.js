const slotProto = {
    initDisplay() {
        this.body = slotBody.cloneNode()
        this.body.style.left = columns.getLeftFromID(this.start - (this.host.start - columns.baseID))
        this.setWidth()
        this.label = slotLabel.cloneNode()
        this.cells = {}
        for(const key in this.workload) {
            const cell = createCell(this.workload[key])
            this.body.appendChild(cell)
            this.cells[key] = cell
        }
    },
    initData() {

    },
    setWidth() {
        this.body.style.width = Object.keys(this.workload).length * columns.columnWidth + 'px'
    },
    alterSpan(dStart, dEnd) {
        let workloadKeys = Object.keys(this.workload).sort()
        if(dStart > 0) {
            for(let i = 0; i < dStart; i++) {
                this.body.removeChild(this.cells[workloadKeys[i]])
                delete this.workload[workloadKeys[i]]
                delete this.cells[workloadKeys[i]]
            }
        }
        else if(dStart < 0) {
            const fragment = document.createDocumentFragment()
            const snapshotStart = this.start
            const workloadOfCell = this.workload[workloadKeys[0]]
            for(let i = this.start + dStart; i < snapshotStart; i++) {
                const cell = createCell(workloadOfCell)
                this.cells[i] = cell
                this.workload[i] = workloadOfCell
                fragment.appendChild(cell)
            }
            this.body.insertBefore(fragment, this.body.firstChild)
        }
        if(dEnd > 0) {
            const fragment = document.createDocumentFragment()
            const snapshotEnd = this.end
            const workloadOfCell = this.workload[workloadKeys[workloadKeys.length - 1]]
            for(let i = this.end + 1; i <= snapshotEnd + dEnd; i++) {
                const cell = createCell(workloadOfCell)
                this.cells[i] = cell
                this.workload[i] = workloadOfCell
                fragment.appendChild(cell)
            }
            this.body.appendChild(fragment)
        }
        else if(dEnd < 0) {
            for(let i = workloadKeys.length - 1; i >= workloadKeys.length + dEnd; i--) {
                this.body.removeChild(this.cells[workloadKeys[i]])
                delete this.workload[workloadKeys[i]]
                delete this.cells[workloadKeys[i]]
            }
        }
        this.setWidth()
    },
    get start() {
        return Math.min(...Object.keys(this.workload))
    },
    get end() {
        return Math.max(...Object.keys(this.workload))
    }
}
function createCell(text) {
    let cell = slotCell.cloneNode()
    cell.textContent = text
    return cell
}

function createSlot(details, host) {
    if(!host) throw "No host provided"
    let slot = Object.create(slotProto)
    slot.host = host
    if(details) Object.assign(slot, details)
    else {
        slot.workload = {}
        for(let i = host.start; i < host.end; i++) slot.workload[i] = '5'
    }
    return slot
}