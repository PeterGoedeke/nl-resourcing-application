const summationRowContents = (function() {
    const fragment = document.createDocumentFragment()
    for(let i = columns.baseID; i < columns.endID; i ++) fragment.appendChild(createCell(''))
    return fragment
})()


const rows = (function() {
    function getRowCells(query) {
        const row = document.querySelector(query)
        row.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'
        row.appendChild(summationRowContents.cloneNode(true))
        return Array.from(row.querySelectorAll('.slotCell'))
    }
    const emptyCells = getRowCells('.emptyRow')
    const workloadCells = getRowCells('.workloadRow')
    const employeeCells = getRowCells('.employeesRow')
    const summationCells = getRowCells('.summationRow')

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
        get employees() {
            let employeeCapability = {}
            employees.visibleList.forEach(employee => {
                for(let i = columns.baseID; i < columns.endID; i++) {
                    if(employee.joining && i <= employee.joining || employee.leaving && i >= employee.leaving) continue
                    employeeCapability[i] = employeeCapability[i] + Number(employee.fullTime) || Number(employee.fullTime)
                }
            })
            return [employeeCapability]
        },
        get summation() {
            let summation = {}
            const workload = this.totalWorkload(this.workload)
            const employees = this.employees[0]

            for(const key in workload) {
                summation[key] = (workload[key] || 0) - (employees[key] || 0)
            }
            return summation
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
            this.refreshCells(summationCells, this.summation)
        },
        refreshCellsEmployees() {
            this.refreshCells(employeeCells, this.totalWorkload(this.employees))
            this.refreshCells(summationCells, this.summation)
        },
        refreshCells(cells, list) {
            for(const key in list) {
                cells[key - columns.baseID].textContent = sanitiseForDisplay(list[key])
            }
        }
    }
})()