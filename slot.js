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
    get start() {
        return Math.min(...Object.keys(this.workload))
    },
    get end() {
        return Math.max(...Object.keys(this.workload))
    }
}

