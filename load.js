const fs = require('fs')

const projectFragment = document.createDocumentFragment()
const interiorsProjectFragment = document.createDocumentFragment()
const employeeFragment = document.createDocumentFragment()
const interiorsEmployeeFragment = document.createDocumentFragment()

function checkFiles() {
    return Promise.all([
        new Promise(resolve => fs.exists('./data/projects.json', exists => resolve(exists))),
        new Promise(resolve => fs.exists('./data/employees.json', exists => resolve(exists))),
        new Promise(resolve => fs.exists('./data/sheets.json', exists => resolve(exists))),
    ])
}
function loadFiles() {
    return Promise.all([
        new Promise((resolve, reject) => fs.readFile('./data/sheets.json', 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(JSON.parse(data))
        })),
        new Promise((resolve, reject) => fs.readFile('./data/projects.json', 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(JSON.parse(data))
        })),
        new Promise((resolve, reject) => fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            if(err) reject(err)
            resolve(JSON.parse(data))
        }))
    ])
}

async function load() {
    const exists = await checkFiles()
    if(exists.every(value => value)) {
        const data = await loadFiles()

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
    }
}