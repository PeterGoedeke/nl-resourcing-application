const save = {
    all() {
        this.projects()
        this.employees()
        this.sheets()
    },
    projects() {
        fs.writeFile('./data/projects.json', JSON.stringify(projects.list, null, 4), 'utf8', function(err) {
            if(err) throw err
        })
    },
    employees() {
        fs.writeFile('./data/employees.json', JSON.stringify(employees.list, null, 4), 'utf8', function(err) {
            if(err) throw err
        })
    },
    sheets() {
        fs.writeFile('./data/sheets.json', JSON.stringify(sheets.types, null, 4), 'utf8', function(err) {
            if(err) throw err
        })
    }
}