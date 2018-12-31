const slotProto = {
    initDisplay() {
        this.body = slotBody.cloneNode()
        this.body.style.left = columns.getLeftFromID(this.start - (this.host.start - columns.baseID))
        this.body.style.width = Object.keys(this.workload).length * columns.columnWidth + 'px'
        this.label = slotLabel.cloneNode()
        for(const key in this.workload) {
            let cell = slotCell.cloneNode()
            cell.textContent = this.workload[key]
            this.body.appendChild(cell)
        }
    },
    initData() {

    },
    alterSpan(dStart, dEnd) {
        console.log(dStart, dEnd)
        if(dStart > 0) {

        }
        else if(dStart < 0) {

        }
        if(dEnd > 0) {

        }
        else if(dEnd < 0) {

        }
    },
    get start() {
        return Math.min(...Object.keys(this.workload))
    },
    get end() {
        return Math.max(...Object.keys(this.workload))
    }
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