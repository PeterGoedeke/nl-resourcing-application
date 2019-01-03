const summationRowContents = (function() {
    const fragment = document.createDocumentFragment()
    for(let i = columns.baseID; i < columns.endID; i ++) fragment.appendChild(createCell(''))
    return fragment
})()


const rows = (function() {
    const emptyRow = document.querySelector('.emptyRow')
    emptyRow.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'
    emptyRow.appendChild(summationRowContents.cloneNode(true))
    const emptyCells = Array.from(emptyRow.querySelectorAll('.slotCell'))

    const workloadRow = document.querySelector('.workloadRow')
    workloadRow.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'
    workloadRow.appendChild(summationRowContents.cloneNode(true))
    const workloadCells = Array.from(workloadRow.querySelectorAll('.slotCell'))

    return {
        get empty() {
            let empty = []
            projects.list.forEach(project => project.visibleSlots.filter(slot => !slot.employee).map(slot => slot.workload).forEach(workload => {
                empty.push(workload)
            }))
            return empty
        },
        get workload() {
            let totalWorkload = []
            projects.list.forEach(project => project.visibleSlots.map(slot => slot.workload).forEach(workload => {
                totalWorkload.push(workload)
            }))
            return totalWorkload
        },
        get summation() {
            let summation = []
            
        },
        totalWorkload(list) {
            let totalWorkload = {}
            list.forEach(workload => {
                for(const key in workload) totalWorkload[key] = totalWorkload[key] + Number(workload[key]) || Number(workload[key])
            })
            for(let i = columns.baseID; i < columns.endID; i++) {
                if(totalWorkload[i]) continue
                totalWorkload[i] = 0
            }
            return totalWorkload
        },
        refreshCellsSlots() {
            this.refreshCells(emptyCells, this.totalWorkload(this.empty))
            this.refreshCells(workloadCells, this.totalWorkload(this.workload))
            // refreshCells()
        },
        refreshCells(cells, list) {
            for(const key in list) {
                cells[key - columns.baseID].textContent = sanitiseForDisplay(list[key])
            }
            console.log('PUT IT IN ME')
        },
    }
})()