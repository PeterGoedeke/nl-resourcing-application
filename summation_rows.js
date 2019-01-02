const summationRowContents = (function() {
    const fragment = document.createDocumentFragment()
    for(let i = columns.baseID; i < columns.endID; i ++) fragment.appendChild(createCell(''))
    return fragment
})()


const rows = (function() {
    let emptyList = []

    const emptyRow = document.querySelector('.emptyRow')
    emptyRow.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'
    emptyRow.appendChild(summationRowContents.cloneNode(true))
    const emptyCells = Array.from(emptyRow.querySelectorAll('.slotCell'))

    return {
        get empty() { return emptyList },
        totalWorkload(list) {
            console.log(list)
            let totalWorkload = {}
            list.filter(slot => slot.type == projects.visibleType).map(slot => slot.workload).forEach(workload => {
                for(const key in workload) totalWorkload[key] = totalWorkload[key] + Number(workload[key]) || Number(workload[key])
            })
            for(let i = columns.baseID; i < columns.endID; i++) {
                if(totalWorkload[i]) continue
                totalWorkload[i] = 0
            }
            return totalWorkload
        },
        register(slot, list) {
            const preChange = this.collectPreChange(list)
            list.push(slot)
            this.refreshCells(preChange, list)
        },
        remove(slot, list) {
            const preChange = this.collectPreChange(list)
            list.splice(list.indexOf(slot), 1)
            this.refreshCells(preChange, list)
        },
        collectPreChange(list) {
            console.log(list)
            return JSON.parse(JSON.stringify(this.totalWorkload(list)))
        },
        refreshCells(preChange, list) {
            console.log(list)
            const postChange = this.totalWorkload(list)
            for(const key in postChange) {
                if(Number(postChange[key]) != Number(preChange[key])) {
                    emptyCells[key - columns.baseID].textContent = sanitiseForDisplay(postChange[key])
                }
            }
        },
    }
})()