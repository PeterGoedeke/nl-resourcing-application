const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const columns = (function() {
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

    return {
        
    }
})()
function convertIDToDate(id) {
    console.log(id)
    let year = 1970
    id = Math.floor(id / 2)
    if(id >= 12) year += Math.floor(id / 12)
    let value = months[id % 12]
    return year + ' ' + value
}

function temp(year, month, day) {
    return (year - 1970) * 24 + month * 2 + (day > 15 ? 1 : 0)
}

// function convertIDToDate(id) {
//     let year = 2000
//     id = Math.floor(id / 2)
//     if(Math.abs(id) >= 12) year += Math.floor(id / 12)
//     if(id < 0) year --
//     let value = months[id < 0 ? 12 + id % 12 : id % 12]
//     if(zoom.scale >= 0.3) value += ' ' + String(year).substring(2)
//     return value
// }