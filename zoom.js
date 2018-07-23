const zoom = (function() {
    let scale = 0.5
    function updateZoom() {
        sq.contentPane.scrollTop = 0
        sq.contentPane.scrollLeft = 0
        Array.from(document.querySelectorAll('.timeBlock')).forEach(timeBlock => timeBlock.style.width = 100 * scale + 'px')
        Array.from(document.querySelectorAll('.employeeWorkloadBlock')).forEach(workloadBlock => workloadBlock.style.width = 100 * scale + 'px')
        Array.from(document.querySelectorAll('.employeeSlotWorkloadBlock')).forEach(workloadBlock => workloadBlock.style.width = 100 * scale + 'px')
        Array.from(document.querySelectorAll('.employeeSlotWorkloadBlock:first-child')).forEach(workloadBlock => {
            workloadBlock.style.width = 60 * scale + 'px'
            workloadBlock.style.marginLeft = 20 * scale + 'px'
        })
        Array.from(document.querySelectorAll('.employeeSlotWorkloadBlock:last-child')).forEach(workloadBlock => {
            workloadBlock.style.width = 60 * scale + 'px'
            workloadBlock.style.marginRight = 20 * scale + 'px'
        })
        state.projects.forEach(project => project.updateZoom())
        state.employees.forEach(employee => employee.updateZoom())
        leave.updateZoom()
        sq.positioner.style.width = getXLocationFromID(state.latestDate + 1) + 'px'
        sm.updateDisplay()
        sm.updateVerticalDisplay()
        updateDisplay()
        sm.fixContentPaneHeight()
        sm.appendUntilFit()
        sm.refreshTimeBlocks()
    }
    function updateDisplay() {
        sq.zoomDisplay.textContent = Math.round(scale * 200) + '%'
    }
    function roundToNearest(scale) {
        return Math.round(scale * 10) / 10
    }
    return {
        initDisplay() {
            sq.zoomDisplay.addEventListener('dblclick', event => {
                let displayInput = document.createElement('input')
                displayInput.type = 'text';
                displayInput.className = 'employeeTypeInput'
                displayInput.value = Math.round(scale * 200) + '%'
    
                displayInput.addEventListener('blur', event => {
                    scale = parseInt(displayInput.value) / 200
                    if(scale < 0.1) scale = 0.1
                    else if(scale > 1) scale = 1
                    sq.zoomDisplay.removeChild(displayInput)
                    updateZoom()
                })
                sq.zoomDisplay.removeChild(sq.zoomDisplay.firstChild)
                sq.zoomDisplay.appendChild(displayInput)
                initInput(displayInput)
                displayInput.focus()
            })
        },
        setZoom(zoom) {
            scale = zoom
            updateZoom()
        },
        in() {
            scale = roundToNearest(scale)
            if(scale >= 0.9) scale = 1
            else scale += 0.1
            updateZoom()
        },
        out() {
            scale = roundToNearest(scale)
            if(scale <= 0.2) scale = 0.1
            else scale -= 0.1
            updateZoom()
        },
        updateDisplay,
        get scale() { return scale }
    }
})()