let draggingInterface = (function() {
    let currentlyDragging = null
    addEventListener('mouseup', (event) => {
        if(currentlyDragging) {
            currentlyDragging.dragging = false
            currentlyDragging = null
        }
    })
    addEventListener('mousemove', (event) => {
        if(currentlyDragging) {
            
        }
    })
    return {
        registerDragging(draggedObject) {
            currentlyDragging = draggedObject
            currentlyDragging.dragging = true
        }
    }
})()


let projectProto = {
    initDisplay() {
        this.projectDisplay.addEventListener('mousedown', (event) => draggingInterface.registerDragging(this))
        document.querySelector('.contentPane').appendChild(this.projectDisplay)
        document.querySelector('.leftSidebar').insertBefore(this.projectLabel, document.querySelector('.createProject'))
        this.updateDisplay()
        setInterval(() => console.log(this.dragging), 100)
    },
    updateDisplay() {
        console.log(this.startDate, this.endDate)
        this.projectDisplay.style.left = getXLocationFromID(this.startDate) + 'px'
        this.projectDisplay.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
        console.log(this.projectDisplay.style.left, getXLocationFromID(this.endDate))
    },
    rename(newName) {
        this.name = newName
        this.projectLabel.textContent = this.name
    }
}

function createProject(name, group, security) {
    let [startDate, endDate] = screenQuery.getVisibleTimeBlockRange(true)
    let projectDisplay = document.createElement('div')
    projectDisplay.className = 'project'
    let projectLabel = document.createElement('div')
    projectLabel.className = 'projectLabel'
    projectLabel.textContent = name
    let dragging = false

    let project = Object.assign(
        Object.create(projectProto),
        {projectDisplay, projectLabel, dragging},
        {name, group, security, startDate, endDate}
    )
    project.initDisplay()
    return project
}
function createEmployeeSlot(hostProject, employeeType) {
    let workloadInformation = Symbol('workload information')
    let workload = Object.create(null)
    for(let i = hostProject.startDate; i < hostProject.endDate; i++) workload[i] = 5

    let assignedEmployee = 'Empty'

    return {
        hostProject, employeeType, startDate: hostProject.startDate, endDate: hostProject.endDate, assignedEmployee,
        [workloadInformation]: workload,
        assignEmployee(employee) {
            this.assignedEmployee = employee
            this.assignedEmployee.workload[workloadInformation] = this[workloadInformation]
        },
        removeEmployee() {
            if(this.employee.name) {
                delete this.employee.workload[workloadInformation]
                this.employee = null
            }
        },
        reallocateWorkload(newWorkload) {
            this[workloadInformation].length = 0
            this[workloadInformation].push(...newWorkload)
        }
    }
}

function createEmployee() {

}