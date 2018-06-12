let employeeTypes = ['qs', 'pm', 'sm']

let employeeProto = {

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

function createEmployee(employeeState, state = {
    name: 'Empty',
    type: null,
    status: null
}) {
    return Object.assign(
        Object.create(employeeProto),
        employeeState,
        state
    )
}

let createProjectFrame = () => {
    state = {}
    employeeTypes.forEach(type => state[type] = [])
    return state
}
//let createProjectFrame = () => employeeTypes.reduce((type) => state[type] = [], {})

function openProjectCreationDialogue() {
    let projectToCreate = {}
    projectToCreate.employeeData = createProjectFrame()
    let projectCreationDialogue = document.createElement('div')
    projectCreationDialogue.className = 'projectCreation dialogue'
    employeeTypes.forEach(type => {
        let element = document.createElement('div')
        element.className = `${type} create`
        
        element.addEventListener('mouseup', (event) => {
            if(event.which == 1) {
                projectToCreate.employeeData[type].push({employee: createEmployee(type), workload: 0})
                let child = document.createElement('div')
                child.className = `${type} slot`
                let employeeIndex = projectToCreate.employeeData[type].length - 1
                
                child.addEventListener('mouseup', (event) => {
                    event.stopPropagation()
                    if(event.which == 1) {
                        projectToCreate.employeeData[type][employeeIndex].workload ++
                    }
                    else if(event.which == 3) {
                        child.remove()
                        projectToCreate.employeeData[type].splice(employeeIndex, 1)
                    }
                })

                element.appendChild(child)
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
        console.log(newProject)
    })

    projectCreationDialogue.appendChild(projectCreationButton)
    document.querySelector('.here').appendChild(projectCreationDialogue)
}

function openEmployeeCreationDialogue() {
    let employeeCreationDialogue = document.createElement('div')
    employeeCreationDialogue.className = 'employeeCreation dialogue'
    employeeTypes.forEach((type) => {
        let typeRadio = document.createElement('input')
        typeRadio.type = 'radio'
        typeRadio.name = 'employeeTypeSelect'
        employeeCreationDialogue.appendChild(typeRadio)
        employeeCreationDialogue.appendChild(document.createTextNode(type))
    })
    document.querySelector('.here').appendChild(employeeCreationDialogue)
}

openProjectCreationDialogue()
document.querySelector('.here').appendChild(document.createElement('br'))
openEmployeeCreationDialogue()