//Individual



let individualProto = {
    calculateWorkload() {
        this.assignedProjects.forEach(assignedProject => {

        })
    }
}

let projectProto = {

}

function createIndividual(state) {
    //pass employee name, employee type, and employee status as properties of state
    //name, type, status
    
    state.assignedProjects = []
    return Object.assign(
        Object.create(individualProto),
        state
    )
}

function addProject(individual, project, projectSlot) {
    if(projectSlot.employee != null) throw Error('Employee slot already occupied.')
    else {
        individual.assignedProjects.push(projectSlot)
    }
}

let george = createIndividual({
    name: 'george',
    type: 'qs',
    status: 'active'
})

let building = createProject({
    name: 'Sky Tower',
    startDate: '',
    endDate: '',
    security: 'secure'
}, {

})
/*
employees = 
{
    qs = [
        {employee, workload},
        {employee, workload}
    ]
    sm =
        {

        }
    pm =
        {

        }
}

*/

let employeeTypes = ['qs', 'pm', 'sm']
function createEmployeeState() {
    state = Object.create(null)
    employeeTypes.forEach(type => {
        state[type] = []
        Array.from(document.querySelector(`.${type}`)).forEach(employeeSlot => {
            //Psuedo code below
            state[type].push({employee: employeeSlot.employee, workload: employeeSlot.workload})
        })
    })

    return Object.assign(

    )
}

function createProject(state, employeeState) {
    //pass project name, project start date, project end date, and project security as properties of state
    //name, startDate, endDate, security


    return Object.assign(
        Object.create(projectProto),
        state,
        {employeeState}
    )
}

function openPopup() {

    let createProjectDialogue = document.createElement('div')
    createProjectDialogue.className = 'createProjectDialogue'
    let typeDialogues = []
    employeeTypes.forEach(type => {
        let element = document.createElement('div')
        element.className = `${type}Create test`
        typeDialogues.push(element)
    })
    typeDialogues.forEach(element => createProjectDialogue.appendChild(element))
    document.querySelector('.here').appendChild(createProjectDialogue)
}

openPopup()

//Employee data

//There can be many types of employee - not fixed
//Each project needs to be able to have all the types and set slots for them
//This needs to be reflected in the dialogues for projects and the tab menu for individuals

//Employee types array
//Project created 

//Pass employees array
/*
let employeeTypes = ['qs', 'sm', 'pm']

let employees = Object.create(null)
employeeTypes.forEach(type =>
    employees[type] = [
        
    ]
)
*/

//They will have a row of radios for each type - radios will have a class which corresponds to the employeeTypes array
//

/*

employees = 
{
    qs = [0.5, 1, 0.7]
    sm =
        {

        }
    pm =
        {

        }
}

employees = 
{
    qs = [
        {employee, workload},
        {employee, workload}
    ]
    sm =
        {

        }
    pm =
        {

        }
}

*/