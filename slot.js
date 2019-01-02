const slotProto = {
    initDisplay() {
        this.body = slotBody.cloneNode(true)
        this.startHandle = this.body.querySelector('.start')
        this.endHandle = this.body.querySelector('.end')
        this.label = slotLabel.cloneNode()
        this.refreshLabel()

        addDragging(this.startHandle, () => columns.getLeftFromID(this.start), id => {
            this.alterSpan(id - this.start, 0)
            this.startHandle.style.left = '0px'
        })
        addDragging(this.endHandle, () => columns.getLeftFromID(this.start), id => {
            this.alterSpan(0, id - this.end)
            this.endHandle.style.right = '0px'
            this.endHandle.style.left = 'initial'
        })

        this.body.addEventListener('click', event => {
            if(this.getCellsAsArray().includes(event.target)) {
                event.target.style.width = columns.columnWidth + 'px'
                const preChange = this.collectEmployeePreChange()
                inputify(event.target, newWorkload => {
                    let id
                    for(const key in this.cells) if(this.cells[key] == event.target) {
                        id = key
                        break
                    }
                    this.workload[id] = Number(newWorkload)
                    event.target.innerHTML = sanitiseForDisplay(newWorkload)
                    event.target.style.width = 'initial'
                    this.notifyEmployee(preChange)
                })
            }
        })
        this.body.addEventListener('contextmenu', event => {
            contextMenus.open(1, [
                () => {
                    this.delete()
                    contextMenus.close()
                }], event)
        })
        
        this.label.addEventListener('click', event => {
            inputifyAutocomplete(this.label, attemptedAssignment => {
                if(attemptedAssignment) {
                    this.assignEmployee(attemptedAssignment)
                } else {
                    this.removeEmployee()
                }
                this.label.innerHTML = attemptedAssignment || 'Empty'
            }, employees.visibleNames)

        })

        this.body.style.left = columns.getLeftFromID(this.start - (this.host.start - columns.baseID))
        this.setWidth()
        this.cells = {}
        for(const key in this.workload) {
            const cell = createCell(this.workload[key])
            this.body.appendChild(cell)
            this.cells[key] = cell
        }
    },
    getCellsAsArray() {
        let arr = []
        for(const key in this.cells) arr.push(this.cells[key])
        return arr
    },
    assignEmployee(name) {
        if(this.employee) this.employee.removeSlot(this)
        this.employee = employees.getEmployee(name)
        this.employee.assignSlot(this)
    },
    removeEmployee() {
        if(this.employee) this.employee.removeSlot(this)
        this.employee = undefined
    },
    notifyEmployee(preChange) {
        if(this.employee) this.employee.refreshCells(preChange)
    },
    collectEmployeePreChange() {
        if(this.employee) return JSON.parse(JSON.stringify(this.employee.totalWorkload))
    },
    refreshLabel() {
        this.label.textContent = this.employee && this.employee.name || 'Empty'
    },
    setWidth() {
        this.body.style.width = Object.keys(this.workload).length * columns.columnWidth + 'px'
    },
    delete() {
        this.host.slots.splice(this.host.slots.indexOf(this), 1)
        this.host.body.removeChild(this.body)
        this.label.parentElement.removeChild(this.label)
        this.decouple()
    },
    decouple() {
        if(!this.employee) rows.remove(this, rows.empty)
        else {
            this.employee.removeSlot(this)
        }
    },
    alterSpan(dStart, dEnd, hostStart = this.host.start) {
        let workloadKeys = Object.keys(this.workload).sort()

        if(this.start + dStart >= this.end) {
            dStart = this.end - this.start
        }
        else if(this.end + dEnd <= this.start) {
            dEnd = this.start - this.end
        }
        if(this.start + dStart <= columns.baseID) dStart = columns.baseID - this.start + 1

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
        this.body.style.left = columns.getLeftFromID(this.start - (hostStart - columns.baseID))
        this.setWidth()
        if(this.employee) this.notifyEmployee(employeePreChange)
    },
    get start() {
        return Math.min(...Object.keys(this.workload))
    },
    get end() {
        return Math.max(...Object.keys(this.workload))
    }
}
function createCell(workload) {
    let cell = slotCell.cloneNode()
    cell.textContent = sanitiseForDisplay(workload)
    return cell
}

function createSlot(details, host) {
    if(!host) throw "No host provided"
    let slot = Object.create(slotProto)
    slot.host = host
    if(details) Object.assign(slot, details)
    else {
        slot.workload = {}
        for(let i = host.start; i < host.end; i++) slot.workload[i] = 5
    }
    return slot
}