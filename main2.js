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
    employeeTypes.forEach(type => state[type] = [])
    return state
}
//let createProjectFrame = () => employeeTypes.reduce((type) => state[type] = [], {})

function openProjectCreationDialogue() {
    let projectToCreate = createProjectFrame()
    console.log(projectToCreate)
    let projectCreationDialogue = document.createElement('div')
    projectCreationDialogue.className = 'projectCreationDialogue'
    let typeDialogues = []
    employeeTypes.forEach(type => {
        let element = document.createElement('div')
        element.className = `${type} create`
        
        element.addEventListener('mouseup', (event) => {
            if(event.which == 1) {
                projectToCreate[type].push({employee: createEmployee(type), workload: 0})
                let child = document.createElement('div')
                child.className = `${type} slot`
                let employeeIndex = projectToCreate[type].length - 1
                
                child.addEventListener('mouseup', (event) => {
                    event.stopPropagation()
                    if(event.which == 1) {
                        projectToCreate[type][employeeIndex].workload ++
                        console.log(projectToCreate[type][employeeIndex])
                    }
                    else if(event.which == 3) {
                        child.remove()
                        projectToCreate[type].splice(employeeIndex, 1)
                    }
                })

                element.appendChild(child)
            }
            else if(event.which == 3) {
                while(element.firstChild) element.removeChild(element.firstChild)
                projectToCreate[type] = []
            }
            console.log(projectToCreate)
        })

        typeDialogues.push(element)
    })
    typeDialogues.forEach(element => projectCreationDialogue.appendChild(element))
    document.querySelector('.here').appendChild(projectCreationDialogue)
    return projectToCreate
}
openProjectCreationDialogue()