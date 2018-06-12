let stateHandler = (function() {
    let employeeTypes = ['qs', 'pm', 'sm']
    let employees = []
    let projects = []
    return {
        get employeeTypes() {
            return employeeTypes
        },
        get employees() {
            return employees
        },
        addEmployee(employee) {
            employees.push(employee)
        },
        addProject(project) {
            projects.push(project)
        }
    }
})()

let employeeProto = {
    calculateWorkload() {

    }

}
let projectProto = {
}
function createProject(employeeState, state = {
    name: 'Default',
    startDate: null,
    endDate: null,
    security: null
}) {
    return Object.assign(
        Object.create(projectProto),
        employeeState,
        state
    )
}

function createEmployee(state = {
    name: 'Empty',
    type: null,
    status: null
}) {
    return Object.assign(
        Object.create(employeeProto),
        state
    )
}

let createProjectFrame = () => {
    state = {}
    stateHandler.employeeTypes.forEach(type => state[type] = [])
    return state
}
//let createProjectFrame = () => stateHandler.employeeTypes.reduce((type) => state[type] = [], {})

function openProjectCreationDialogue() {
    let projectToCreate = {}
    projectToCreate.employeeData = createProjectFrame()
    let projectCreationDialogue = document.createElement('div')
    projectCreationDialogue.className = 'projectCreation dialogue'
    stateHandler.employeeTypes.forEach(type => {
        //Add employee of category
        let element = document.createElement('div')
        element.className = `${type} create`
        element.addEventListener('mouseup', (event) => {
            if(event.which == 1) {
                projectToCreate.employeeData[type].push({employee: createEmployee(type), workload: 0})
                let employeeToAssignDialogue = document.createElement('div')
                employeeToAssignDialogue.className = `${type} slot`
                
                let employeeIndex = projectToCreate.employeeData[type].length - 1
                
                let selectEmployeeDisplay = docuemnt.createElement('div')
                selectEmployeeDisplay.className = 'selectEmployeeDisplay'
                let selectEmployeeSearchBar = document.createElement('input')
                selectEmployeeSearchBar.type = 'search'
                selectEmployeeSearchBar.placeholder = 'Select Employee...'
                stateHandler.employees.forEach(employee => {
                    
                })

                
                //Create workload radios
                let radioDisplay = document.createElement('div')
                radioDisplay.className = 'assignEmployeeWorkload'
                for(let i = 1; i <= 5; i ++) {
                    let radio = document.createElement('input')
                    radio.type = 'radio'
                    radio.name = `${type}${employeeIndex}`
                    radio.className = 'assignEmployeeWorkloadRadio'
                    radioDisplay.appendChild(document.createTextNode(i))
                    radioDisplay.appendChild(radio)
                }
                employeeToAssignDialogue.appendChild(radioDisplay)
                //Edit employee information
                employeeToAssignDialogue.addEventListener('mouseup', (event) => {
                    event.stopPropagation()
                    if(event.which == 1) {
                        projectToCreate.employeeData[type][employeeIndex].workload ++
                    }
                    else if(event.which == 3) {
                        employeeToAssignDialogue.remove()
                        projectToCreate.employeeData[type].splice(employeeIndex, 1)
                    }
                })

                element.appendChild(employeeToAssignDialogue)
            }
            else if(event.which == 3) {
                while(element.firstChild) element.removeChild(element.firstChild)
                projectToCreate.employeeData[type] = []
            }
        })
        projectCreationDialogue.appendChild(element)
    })
    let projectCreationButton = document.createElement('div')
    projectCreationButton.className = 'projectCreation button'

    projectCreationButton.addEventListener('mouseup', (event) => {
        //validate project addition
        let newProject = createProject(projectToCreate)
        newProject.employeeData.qs[0].employee == 'dave'
        workloadHandler.registerProject(newProject)
        console.log(newProject)
    })

    projectCreationDialogue.appendChild(projectCreationButton)
    document.querySelector('.here').appendChild(projectCreationDialogue)
}

function openEmployeeCreationDialogue() {
    let employeeCreationDialogue = document.createElement('div')
    employeeCreationDialogue.className = 'employeeCreation dialogue'
    stateHandler.employeeTypes.forEach((type) => {
        let typeRadio = document.createElement('input')
        typeRadio.type = 'radio'
        typeRadio.name = 'stateHandler.employeeTypeSelect'
        employeeCreationDialogue.appendChild(typeRadio)
        employeeCreationDialogue.appendChild(document.createTextNode(type))
    })
    document.querySelector('.here').appendChild(employeeCreationDialogue)
}

openProjectCreationDialogue()
document.querySelector('.here').appendChild(document.createElement('br'))
openEmployeeCreationDialogue()

let dave = createEmployee({
    name: 'dave',
    type: 'qs',
    status: 'active'
})

let harry = createEmployee({
    name: 'harry',
    type: 'qs',
    status: 'active'
})

let workloadHandler = (function() {
    let projectList = []
    function calculateSpecific(employee) {
        /*
        let test = projectList.reduce((total, currentValue) => {
            if(currentValue.employeeData[employee.type].find(slot => slot.employee == employee.name))
                total + currentValue.employeeData[employee.type].find(slot => slot.workload)
        }, 0)
        let test = projectList.forEach(project => {
            project.employeeData[employee.type].find(slot => slot.employee == employee)
        })

        let test = projectList.forEach(project => project.employeeData[employee.type].find(slot => slot.employee == employee))
        */
        //console.log(test)
    }
    return {
        calculateSpecific, projectList,
        registerProject(project) {
            projectList.push(project)
        }
    }
})()

document.querySelector('.test').addEventListener('mouseup', (event) => {
    console.log(workloadHandler.projectList)
    workloadHandler.calculateSpecific(dave)
})