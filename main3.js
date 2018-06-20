function createProject(name, group, security) {
    let project = {name, group, security}
    //calculate where the project should be positioned
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