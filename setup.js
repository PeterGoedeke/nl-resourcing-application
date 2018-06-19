let scale = 100
let earliestDate = 29
let latestDate = 35

function initTimeframe() {
    for(let i = earliestDate; i <= latestDate; i++) appendTimeBlock(i)
    appendUntilFit()
}
function appendUntilFit() {
    let timeBlockWidth = document.querySelector('.timeBlock').offsetWidth
    let timeBlocks = document.querySelector('.topAxisContainer').childNodes.length
    let contentWidth = document.querySelector('.contentPane').offsetWidth
    console.log(timeBlockWidth, timeBlocks, contentWidth)
    while((timeBlockWidth * timeBlocks) < contentWidth) {
        appendTimeBlock(Number(document.querySelector('.topAxisContainer').lastChild.textContent) + 1)
        timeBlocks ++
    }
}
addEventListener('load', initTimeframe)
addEventListener('resize', appendUntilFit)


// read the JSON and stuff

function convertIDToDate(id) {
    let year = 2000
    if(id / 12 > 0) year += Math.floor(id / 12)
    let month = Math.floor((id % 12) / 2) + 1
    let timeOfMonth = id % 2 == 0 ? 0 : 1 //0 = early, 1 = late
    return (timeOfMonth == 0 ? 'Early ' : 'Late ') + month + "/" + year
}

console.log(convertIDToDate(50))

function appendTimeBlock(dateID) {
    let timeBlock = document.createElement('div')
    timeBlock.className = 'timeBlock marginElement'
    timeBlock.textContent = dateID
    document.querySelector('.topAxisContainer').appendChild(timeBlock)
}

let earliestAssignedDate = 10;

setInterval(() => {
    let width = document.querySelector('.topAxisContainer').offsetWidth
    
    
}, 100)