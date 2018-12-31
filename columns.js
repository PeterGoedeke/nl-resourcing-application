const columns = (function() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const columnWidth = 25
    const currentID = (function() {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const currentDay = currentDate.getDay()
        return (currentYear - 1970) * 24 + currentMonth * 2 + (currentDay > 15 ? 1 : 0)
    })()
    const baseID = currentID - 2

    for(let i = 0; i < 50; i += 2) {
        let element = headerCell.cloneNode()
        element.textContent = convertIDToDate(baseID + i)
        document.querySelector('.header').appendChild(element)
        document.querySelector('.header').style.width = 50 * 25 + 'px'
    }

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

    const sidebarWidth = 100
    return {
        baseID, columnWidth, sidebarWidth,
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