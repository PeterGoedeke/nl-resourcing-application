

const projectFragment = document.createDocumentFragment()
const interiorsProjectFragment = document.createDocumentFragment()
const employeeFragment = document.createDocumentFragment()
const interiorsEmployeeFragment = document.createDocumentFragment()

function makeFileRequest() {
    const http = new XMLHttpRequest()
    const url = window.location.href + '/main'
    http.open('GET', url)
    http.send()

    return new Promise(function(resolve) {
        http.onreadystatechange = function() {
            if(this.readyState == 4) resolve({status: this.status, data: http.responseText})
        }
    })
}

async function load() {
    const res = await makeFileRequest()

    if(res.status == 200) {
        const data = JSON.parse(res.data)
        const sheetsData = data[0]
        sheetsData.forEach((type, i) => sheets.create(type, i == 0 ? true : false))
        sheets.visible = sheetsData[0]
    
        const employeeData = data[2]
        employeeData.forEach(employee => {
            const newEmployee = createEmployee(employee)
            const container = newEmployee.batchLoad()
            if(newEmployee.interiors && newEmployee.type == sheets.visible) interiorsEmployeeFragment.appendChild(container)
            else if(newEmployee.type == sheets.visible) employeeFragment.appendChild(container)
        })
    
        const projectData = data[1]
        projectData.forEach(project => {
            const newProject = createProject(project)
            newProject.init()
    
            const container = newProject.batchLoad()
            if(newProject.interiors) interiorsProjectFragment.appendChild(container)
            else projectFragment.appendChild(container)
        })
    
        insertAfter(projectFragment, projectAreaSeparator)
        insertAfter(interiorsProjectFragment, interiorsProjectAreaSeparator)
        insertAfter(employeeFragment, employeeAreaSeparator)
        insertAfter(interiorsEmployeeFragment, interiorsEmployeeAreaSeparator)
    } else {
        console.log('hmm')
    }
}

load()