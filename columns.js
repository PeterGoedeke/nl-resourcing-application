const columns = (function() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const columnWidth = 25
    const sidebarWidth = 100
    const rowHeight = 10
    const currentID = (function() {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const currentDay = currentDate.getDay()
        return (currentYear - 1970) * 24 + currentMonth * 2 + (currentDay > 15 ? 1 : 0)
    })()
    const baseID = currentID - 2
    const endID = currentID + 36 * 2
    let applicationWidth = (endID - baseID) * columnWidth

    const header = document.querySelector('.header')
    const fragment = document.createDocumentFragment()
    for(let i = baseID; i < endID; i += 2) {
        let element = headerCell.cloneNode()
        element.textContent = convertIDToDate(i)
        header.appendChild(element)
        let line = columnLine.cloneNode()
        line.style.left = `calc(${(i - baseID) * columnWidth}px + var(--total-sidebar-width))`
        fragment.appendChild(line)
    }
    header.style.width = applicationWidth + 'px'
    document.body.appendChild(fragment)

    function convertIDToDate(id) {
        let year = 1970
        id = Math.floor(id / 2)
        if(id >= 12) year += Math.floor(id / 12)
        let value = months[id % 12]
        return year + ' ' + value
    }
    function getLeftFromID(id) {
        return (id - columns.baseID) * columns.columnWidth + 'px'
    }
    function getWidthFromID(start, end) {
        return (end - start) * columns.columnWidth + 'px'
    }

    return {
        baseID, endID, columnWidth, rowHeight, sidebarWidth, applicationWidth,
        convertIDToDate, getLeftFromID, getWidthFromID,
        get visibleColumns() {
            let columns = []
            for(let i = 0; i <= this.rightmostVisibleColumn - this.leftmostVisibleColumn; i++) columns[i] = i + this.leftmostVisibleColumn
            return columns
        },
        get leftmostVisibleColumn() {
            return baseID + Math.floor(window.pageXOffset / columnWidth)
        },
        get rightmostVisibleColumn() {
            return baseID + Math.floor((window.pageXOffset + window.innerWidth - sidebarWidth) / columnWidth)
        }
    }
})()

;(function() {
    const separators = Array.from(document.querySelectorAll('.separator'))
    separators.forEach(separator => separator.style.width = columns.applicationWidth + columns.sidebarWidth + 'px')
})()

function sanitiseForDisplay(number) {
    number = Number(number)
    number = parseFloat(Math.round(number * 10) / 10).toFixed(1)
    if(String(number).length > 3) number = String(number).slice(0, - (String(number).length - 3))
    return number
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

const random = {
    color() {
        const characters = '0123456789ABCDEF'
        let color = '#'
        for(let i = 0; i < 6; i++) {
            color += characters[Math.floor(Math.random() * 16)]
        }
        return color
    }
}
function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

const html = document.getElementsByTagName('html')[0]

function setSidebarWidth(leftWidth, rightWidth) {
    leftWidth = leftWidth || parseInt(getComputedStyle(document.body).getPropertyValue('--left-sidebar-width'))
    rightWidth = rightWidth || parseInt(getComputedStyle(document.body).getPropertyValue('--right-sidebar-width'))

    html.style.setProperty("--total-sidebar-width", leftWidth + rightWidth + 'px')
    html.style.setProperty("--left-sidebar-width", leftWidth + 'px')
    html.style.setProperty("--right-sidebar-width", rightWidth + 'px')
    columns.sidebarWidth = leftWidth + rightWidth
    employees.list.forEach(employee => {
        employee.container.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'
    })
    projects.list.forEach(project => {
        project.container.style.width = columns.applicationWidth + columns.sidebarWidth + 'px'
    })
    Array.from(document.querySelectorAll('.row')).concat(Array.from(document.querySelectorAll('.separator'))).forEach(row => row.style.width = columns.applicationWidth + columns.sidebarWidth + 'px')    
}