let earliestDate = 29
let latestDate = 35

const sq = (function() {
    let numberOfTimeBlocks = document.querySelector('.topAxisContainer').childNodes.length
    const contentPane = document.querySelector('.contentPane')
    const sidebar = document.querySelector('.sidebar')
    const topAxisContainer = document.querySelector('.topAxisContainer')
    const positioner = document.querySelector('.positioner')
    const createEmployeeButton = document.querySelector('.createEmployee')
    const createProjectButton = document.querySelector('.createProject')
    const leftSidebar = document.querySelector('.leftSidebar')

    function getTimeBlockWidth() {
        return document.querySelector('.timeBlock').offsetWidth
    }
    function getContentPaneWidth() {
        return contentPane.offsetWidth
    }
    return {
        getTimeBlockWidth, getContentPaneWidth,
        getVisibleTimeBlockRange(border) {
            //potential latent bug with earliestDate
            let firstTimeBlockOnScreen = Math.floor(contentPane.scrollLeft / getTimeBlockWidth()) + earliestDate
            let timeBlocksOnScreen = Math.floor((document.querySelector('.mainWindow').offsetWidth - 175) / getTimeBlockWidth())
            let lastTimeBlockOnScreen = firstTimeBlockOnScreen + timeBlocksOnScreen
            
            if(border == 'inset') {
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
            return Math.round(xPosition / screenQuery.getTimeBlockWidth()) + earliestDate
        },
        contentPane, numberOfTimeBlocks, sidebar, topAxisContainer, positioner, createEmployeeButton, createProjectButton, leftSidebar
    }
})();

const sm = {
    initTimeframe() {
        console.log(this)
        for(let i = earliestDate; i <= latestDate; i++) this.appendTimeBlock(i)
        this.appendUntilFit()
    },
    appendUntilFit() {
        while((sq.getTimeBlockWidth() * sq.numberOfTimeBlocks) < sq.contentPane.offsetWidth) {
            sm.appendTimeBlock(Number(sq.topAxisContainer.lastChild.textContent) + 1)
            sq.numberOfTimeBlocks ++
        }
    },
    fixContentPaneHeight() {
        sq.positioner.style.top = sq.createEmployeeButton.getBoundingClientRect().top + sq.contentPane.scrollTop + 'px'
    },
    appendTimeBlock(dateID, firstElement = false) {
        //see if making this a const works
        let timeBlock = document.createElement('div')
        timeBlock.className = 'timeBlock marginElement'
        timeBlock.textContent = dateID
        if(firstElement) {
            timeAxis.insertBefore(timeBlock, timeAxis.firstChild)
            timeAxis.style.left = parseInt(timeAxis.style.left) - screenQuery.getTimeBlockWidth() + 'px'
        }
        else sq.topAxisContainer.appendChild(timeBlock)
    }
};

(function() {
    addEventListener('load', sm.initTimeframe.call(sm))
    
    addEventListener('resize', sm.appendUntilFit.call(sm))

    sq.createProjectButton.addEventListener('mouseup', () => {
        data.projects.push(createProject('Default', null, 'Secure'))
        sm.fixContentPaneHeight()
    })

    sq.contentPane.addEventListener('scroll', (event) => {
        sq.sidebar.scrollTop = sq.contentPane.scrollTop
        sq.timeAxis.scrollLeft = sq.contentPane.scrollLeft
        sq.timeAxis.style.width = sq.contentPane.offsetWidth + 'px'
    }) 
})();

const data = (function() {
    let projects = []
    let scale = 100
    return {
        //test setting it
        get projects() {
            return projects
        },
        registerProject(project) {
            projects.push(project)
        }
    }
})();

const logic = (function() {
    return {
        //deprecated
        convertIDToDate(id) {
            const year = 2000
            if(id / 12 > 0) year += Math.floor(id / 12)
            let month = Math.floor((id % 12) / 2) + 1
            let timeOfMonth = id % 2 == 0 ? 0 : 1 //0 = early, 1 = late
            return (timeOfMonth == 0 ? 'Early ' : 'Late ') + month + "/" + year
        },
        getXLocationFromID(id) {
            //latent bug with earliestDate
            return (id - earliestDate) * data.scale
        }
    }
})();

// read the JSON and stuff