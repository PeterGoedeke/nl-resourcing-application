let projectProto = {
    initDisplay() {
        document.querySelector('.contentPane').appendChild(this.projectDisplay)
        this.updateDisplay()
    },
    updateDisplay() {
        console.log(this.startDate, this.endDate)
        this.projectDisplay.style.left = getXLocationFromID(this.startDate) + 'px'
        this.projectDisplay.style.width = getXLocationFromID(this.endDate) - getXLocationFromID(this.startDate) + 'px'
        console.log(this.projectDisplay.style.left, getXLocationFromID(this.endDate))
    }
}

function createProject(name, group, security) {
    let [startDate, endDate] = screenQuery.getVisibleTimeBlockRange()
    let projectDisplay = document.createElement('div')
    projectDisplay.className = 'project'

    let project = Object.assign(
        Object.create(projectProto),
        {name, group, security, startDate, endDate, projectDisplay}
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