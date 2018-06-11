let employeeTypes = ['qs', 'pm', 'sm']

let employeeProto = {

}
let projectProto = {

}
function createProject(state = {
    name: 'Default',
    startDate: null,
    endDate: null,
    security: null
}) {
    return Object.assign(
        Object.create(projectProto),
        state
    )
}
function createProjectSlots() {
    let state = {}
    
}

function createEmployee(state = {
    name: 'Default',
    type: null,
    status: null
}) {
    return Object.assign(
        Object.create(employeeProto),
        state
    )
}

