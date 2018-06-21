let scale = 50
let earliestDate = 29
let latestDate = 35

let screenQuery = (function() {
    function getTimeBlockWidth() {
        return document.querySelector('.timeBlock').offsetWidth
    }
    function getContentPaneWidth() {
        return document.querySelector('.contentPane').offsetWidth
    }
    return {
        getTimeBlockWidth, getContentPaneWidth,
        getVisibleTimeBlockRange(border = false) {
            let contentPane = document.querySelector('.contentPane')
            //potential latent bug with earliestDate
            let firstTimeBlockOnScreen = Math.floor(contentPane.scrollLeft / getTimeBlockWidth()) + earliestDate
            let timeBlocksOnScreen = Math.floor(contentPane.offsetWidth / getTimeBlockWidth())
            let lastTimeBlockOnScreen = firstTimeBlockOnScreen + timeBlocksOnScreen
            
            if(border) {
                firstTimeBlockOnScreen ++
                lastTimeBlockOnScreen --
            }
            while(firstTimeBlockOnScreen >= lastTimeBlockOnScreen) {
                firstTimeBlockOnScreen --
                lastTimeBlockOnScreen ++
            }
            return [firstTimeBlockOnScreen, lastTimeBlockOnScreen]
        }
    }
})()

function initTimeframe() {
    for(let i = earliestDate; i <= latestDate; i++) appendTimeBlock(i)
    appendUntilFit()
}
function appendUntilFit() {
    let timeBlocks = document.querySelector('.topAxisContainer').childNodes.length
    let contentWidth = document.querySelector('.contentPane').offsetWidth
    while((screenQuery.getTimeBlockWidth() * timeBlocks) < contentWidth) {
        appendTimeBlock(Number(document.querySelector('.topAxisContainer').lastChild.textContent) + 1)
        timeBlocks ++
    }
}
addEventListener('load', initTimeframe)
addEventListener('resize', appendUntilFit)

document.querySelector('.createProject').addEventListener('mouseup', () => {
    createProject('Default', null, 'Secure')
})

// read the JSON and stuff

function convertIDToDate(id) {
    let year = 2000
    if(id / 12 > 0) year += Math.floor(id / 12)
    let month = Math.floor((id % 12) / 2) + 1
    let timeOfMonth = id % 2 == 0 ? 0 : 1 //0 = early, 1 = late
    return (timeOfMonth == 0 ? 'Early ' : 'Late ') + month + "/" + year
}
function getXLocationFromID(id) {
    //latent bug with earliestDate
    return (id - earliestDate) * scale 
}
function getCursorXLocation(absoluteCursorPosition) {
    return absoluteCursorPosition + document.querySelector('.contentPane').scrollLeft - document.querySelector('.contentPane').getBoundingClientRect().left
}
function getNearestTimeBlock(xPosition) {
    return Math.floor(xPosition / screenQuery.getTimeBlockWidth()) + earliestDate
}

function appendTimeBlock(dateID) {
    let timeBlock = document.createElement('div')
    timeBlock.className = 'timeBlock marginElement'
    timeBlock.textContent = dateID
    document.querySelector('.topAxisContainer').appendChild(timeBlock)
}