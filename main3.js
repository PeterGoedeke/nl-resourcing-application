function createEmployeeSlot(workload) {
    let workloadInformation = Symbol('workload information')
    let employeeSlot = {
        employee: {},
        [workloadInformation]: workload,
        addEmployee(employee) {
            this.employee = employee
            this.employee.workload[workloadInformation] = this[workloadInformation]
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
    return employeeSlot
}

let testSlot = createEmployeeSlot(['test', 'workload'])
let testSlot2 = createEmployeeSlot(['test', 'workload', '2'])
let employee = {
    name: 'dave',
    workload: {}
}

// console.log('-----------------')

// testSlot.removeEmployee()
// testSlot.addEmployee(employee)
// testSlot.reallocateWorkload(['testtehgkhg'])

// console.log(testSlot)
// console.log(employee)
// console.log('-----------------')

/*

employee =
{
    workloadInformation = 
    [
        {},
        {},
        {}
    ]
}

employeeSlot = {
    key: 

}

employeeSlot.setEmployee(dave)
employeeSlot.changeWorkload({test: test})
employeeSlot.setEmployee(steve)
employeeSlot.emptyEmployee()

setEmployee = function(employee) {
    this.employee = employee
    employee.workloadInformation.push(this.workloadInformation)
}
changeWorkload = function(newWorkload) {
    this.workload = newWorkload
    employee.workloadInformation
}

employeeslot.employee = dave


*/
