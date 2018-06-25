let scale = 50
let earliestDate = 29
let latestDate = 35

const sq = (function() {
    const contentPane = document.querySelector('.contentPane')
    const mainWindow = document.querySelector('.mainWindow')

    const sidebar = document.querySelector('.sidebar')
    const topAxisContainer = document.querySelector('.topAxisContainer')
    const positioner = document.querySelector('.positioner')
    const createEmployeeButton = document.querySelector('.createEmployee')
    const createProjectButton = document.querySelector('.createProject')
    return {
        contentPane,
        sidebar, topAxisContainer, positioner, createEmployeeButton, createProjectButton,
        getTimeBlockWidth() {
            //exists becuase timeBlocks are subject to change
            return document.querySelector('.timeBlock').offsetWidth
        },  
        getVisibleTimeBlockRange(border = false) {
            //potential latent bug with earliestDate
            let firstTimeBlockOnScreen = Math.floor(contentPane.scrollLeft / this.getTimeBlockWidth()) + earliestDate
            let timeBlocksOnScreen = Math.floor((mainWindow.offsetWidth - 175) / this.getTimeBlockWidth())
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
        },
        getCursorXLocation(absoluteCursorPosition) {
            return absoluteCursorPosition + contentPane.scrollLeft - contentPane.getBoundingClientRect().left
        },
        getNearestTimeBlock(xPosition) {
            return Math.round(xPosition / this.getTimeBlockWidth()) + earliestDate
        }
    }
})();

const sm = {
    initTimeFrame() {
        for(let i = earliestDate; i <= latestDate; i++) sm.appendTimeBlock(i)
        sm.appendUntilFit()
    },
    appendUntilFit() {
        let timeBlocks = sq.topAxisContainer.childNodes.length
        const contentWidth = sq.contentPane.offsetWidth
        while((sq.getTimeBlockWidth() * timeBlocks) < contentWidth) {
            sm.appendTimeBlock(Number(sq.topAxisContainer.lastChild.textContent) + 1)
            timeBlocks ++
        }
    },
    fixContentPaneHeight() {
        sq.positioner.style.top = sq.createEmployeeButton.getBoundingClientRect().top + sq.contentPane.scrollTop + 'px'
    },
    appendTimeBlock(dateID) {
        let timeBlock = document.createElement('div')
        timeBlock.className = 'timeBlock marginElement'
        timeBlock.textContent = dateID
        sq.topAxisContainer.appendChild(timeBlock)
    }
}

addEventListener('load', sm.initTimeFrame)
addEventListener('resize', sm.appendUntilFit)

sq.createProjectButton.addEventListener('mouseup', () => {
    createProject('Default', null, 'Secure')
    sm.fixContentPaneHeight()
})

sq.contentPane.addEventListener('scroll', (event) => {
    sq.sidebar.scrollTop = sq.contentPane.scrollTop
    sq.topAxisContainer.scrollLeft = sq.contentPane.scrollLeft
    sq.topAxisContainer.style.width = sq.contentPane.offsetWidth + 'px'
    console.log(sq.topAxisContainer.offsetWidth, sq.contentPane.offsetWidth)
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