let mainDirectory

const projectFragment = document.createDocumentFragment()
const interiorsProjectFragment = document.createDocumentFragment()
const employeeFragment = document.createDocumentFragment()
const interiorsEmployeeFragment = document.createDocumentFragment()

function makeFileRequest(directory) {
    directory = directory || mainDirectory
    const http = new XMLHttpRequest()
    const url = window.location.href
    http.open('GET', url)
    http.setRequestHeader('request', directory)
    http.send()

    return new Promise(function(resolve) {
        http.onreadystatechange = function() {
            if(this.readyState == 4) resolve({status: this.status, data: http.responseText})
        }
    })
}

async function load(directory) {
    const res = await makeFileRequest(directory)
    if(res.status == 200) {
        const data = JSON.parse(res.data)
        const sheetsData = data[0]
        if(sheetsData) {
            sheetsData.forEach(sheetData => sheets.fromFile(sheetData))
            sheets.set(sheets.types[0])
        
            const employeeData = data[2]
            if(employeeData) {
                employeeData.forEach(employee => {
                    const newEmployee = createEmployee(employee)
                    const container = newEmployee.batchLoad()
                    if(newEmployee.interiors && newEmployee.type == sheets.visible) interiorsEmployeeFragment.appendChild(container)
                    else if(newEmployee.type == sheets.visible) employeeFragment.appendChild(container)

                    if(newEmployee.joining || newEmployee.leaving) {
                        newEmployee.colorCells(columns.baseID, columns.endID - 1)
                    }
                })
            }
        
            const projectData = data[1]
            if(projectData) {
                projectData.forEach(project => {
                    const newProject = createProject(project)
                    projects.list.push(newProject)
            
                    const container = newProject.batchLoad()
                    if(newProject.interiors) interiorsProjectFragment.appendChild(container)
                    else projectFragment.appendChild(container)
                })
            }
        
            insertAfter(projectFragment, projectAreaSeparator)
            insertAfter(interiorsProjectFragment, interiorsProjectAreaSeparator)
            insertAfter(employeeFragment, employeeAreaSeparator)
            insertAfter(interiorsEmployeeFragment, interiorsEmployeeAreaSeparator)
            rows.refreshCellsAll()
        }
        else {
            console.log('no sheets')
        }
    } else {
        console.log('didn\'t return 200')
    }
}

function unload() {
    projects.list.forEach(project => {
        document.body.removeChild(project.container)
    })
    employees.visibleList.forEach(employee => {
        document.body.removeChild(employee.container)
    })
    projects.list = []
    employees.list = []
    sheets.unload()
}

makeFileRequest('filelist').then(response => {
    const dir = JSON.parse(response.data)[0]
    mainDirectory = 'file/' + dir
    directorySelectButton.textContent = dir.replace(/_/g, ' ')
    
    load(mainDirectory)
    setSidebarWidth(getCookie('leftWidth'), getCookie('rightWidth'))
})
