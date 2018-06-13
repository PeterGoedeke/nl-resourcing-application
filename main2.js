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
    let employee = Object.assign(
        Object.create(employeeProto),
        state
    )
    stateHandler.addEmployee(employee)
    return employee
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
    projectCreationDialogue.className = 'projectCreation dialogue clearfix'
    stateHandler.employeeTypes.forEach(type => {
        //Add employee of category
        let element = document.createElement('div')
        element.className = `${type} create`
        element.addEventListener('mouseup', (event) => {
            if(event.which == 1) {
                projectToCreate.employeeData[type].push({employee: createEmployee(type), workload: 0})
                let employeeToAssignDialogue = document.createElement('div')
                employeeToAssignDialogue.className = `${type} slot clearfix`
                
                let employeeIndex = projectToCreate.employeeData[type].length - 1
                
                //Create employee search selection box
                let selectEmployeeDisplay = document.createElement('div')
                selectEmployeeDisplay.className = 'selectEmployeeDisplay'
                let selectEmployeeSearchBar = document.createElement('input')
                selectEmployeeSearchBar.type = 'search'
                selectEmployeeSearchBar.placeholder = 'Select Employee...'
                selectEmployeeSearchBar.className = 'selectEmployeeSearchBar'
                selectEmployeeSearchBar.addEventListener('keyup', () => {
                    let filteredEmployees = stateHandler.employees.filter(employee => employee.type == type)
                    .filter(employee => new RegExp(selectEmployeeSearchBar.value.toLowerCase(), 'g').exec(employee.name.toLowerCase()))
                    if(filteredEmployees.length > 0) {
                        selectEmployeeDisplay.innerHTML = ''
                        filteredEmployees.forEach(employee => {
                            let selectElement = document.createElement('div')
                            selectElement.className = 'selectEmployeeForAssignment'
                            selectElement.textContent = employee.name
                            selectElement.addEventListener('mouseup', () => {
                                Array.from(document.querySelectorAll('.selectEmployeeForAssignment')).forEach(element => element.style.backgroundColor = 'blue')
                                selectElement.style.backgroundColor = 'red'
                                projectToCreate.employeeData[type][employeeIndex].employee = employee.name
                                //Select the employee
                                //Set the name property of the slot to the employee
                            })
                            selectEmployeeDisplay.appendChild(selectElement)
                        })
                    }
                })
                employeeToAssignDialogue.appendChild(selectEmployeeSearchBar)
                stateHandler.employees.filter(employee => employee.type == type).forEach(employee => {
                    let selectElement = document.createElement('div')
                    selectElement.className = 'selectEmployeeForAssignment'
                    selectElement.textContent = employee.name
                    selectElement.addEventListener('mouseup', () => {
                        Array.from(document.querySelectorAll('.selectEmployeeForAssignment')).forEach(element => element.style.backgroundColor = 'blue')
                        selectElement.style.backgroundColor = 'red'
                        projectToCreate.employeeData[type][employeeIndex].employee = employee.name
                        //WEGFJERKGLRLGKHRGKJREGKLHWLERKJRWKLGJREHKLHRELGHERKGLERHKLGHEKLGHREKLG          
                    })
                    selectEmployeeDisplay.appendChild(selectElement)
                })
                employeeToAssignDialogue.appendChild(selectEmployeeDisplay)
                
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

let dave = createEmployee({
    name: 'dave',
    type: 'qs',
    status: 'active'
})

let david = createEmployee({
    name: 'david',
    type: 'qs',
    status: 'active'
})

let harry = createEmployee({
    name: 'harry',
    type: 'qs',
    status: 'active'
})

for(let i = 0; i < 200; i++) temp()

function temp() {
    createEmployee({
        name: random.name(),
        type: stateHandler.employeeTypes[(Math.floor(Math.random() * 3))],
        status: 'active'
    })
}

openProjectCreationDialogue()
document.querySelector('.here').appendChild(document.createElement('br'))
openEmployeeCreationDialogue()

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