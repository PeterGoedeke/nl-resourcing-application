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
            let firstTimeBlockOnScreen = Math.floor(contentPane.scrollLeft / this.getTimeBlockWidth()) + state.baseDate
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
            return Math.round(xPosition / this.getTimeBlockWidth()) + state.baseDate
        },
        getElementTop(element) {
            return element.getBoundingClientRect().top + contentPane.scrollTop
        },
        getElementBottom(element) {
            return element.getBoundingClientRect().bottom + contentPane.scrollTop
        }
    }
})();

const sm = {
    initTimeFrame() {
        for(let i = state.baseDate; i <= state.latestDate; i++) sm.appendTimeBlock(i)
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
        sq.positioner.style.top = sq.getElementTop(sq.createEmployeeButton) + 'px'
    },
    appendTimeBlock(dateID, firstChild = false) {
        let timeBlock = document.createElement('div')
        timeBlock.className = 'timeBlock marginElement'
        timeBlock.textContent = dateID
        if(firstChild) sq.topAxisContainer.insertBefore(timeBlock, sq.topAxisContainer.firstChild)
        else sq.topAxisContainer.appendChild(timeBlock)
    }
}

const state = (function() {
    let scale = 50
    let baseDate = 29
    let earliestDate = 29
    let latestDate = 35
    let projects = []
    let employeeTypes = ['qs', 'pm', 'sm']
    let visibleType = 'qs'
    return {
        projects, scale, baseDate, earliestDate, latestDate, employeeTypes, visibleType,
        registerProject(project) {
            projects.push(project)
        }
    }
})();

(function() {
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
        //if(sq.getVisibleTimeBlockRange()[1].textContent + 1 < )
    })
})()

function convertIDToDate(id) {
    let year = 2000
    if(id / 12 > 0) year += Math.floor(id / 12)
    let month = Math.floor((id % 12) / 2) + 1
    let timeOfMonth = id % 2 == 0 ? 0 : 1 //0 = early, 1 = late
    return (timeOfMonth == 0 ? 'Early ' : 'Late ') + month + "/" + year
}
function getXLocationFromID(id) {
    return (id - state.baseDate) * state.scale 
}