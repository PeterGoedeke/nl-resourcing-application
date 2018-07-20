const zoom = (function() {
    let scale = 0.5
    function updateZoom() {
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
    }
    return {
        setZoom(zoom) {
            scale = zoom
            updateZoom()
        },
        in() {
            if(scale >= 0.9) scale = 1
            else scale += 0.1
            updateZoom()
        },
        out() {
            if(scale <= 0.2) scale = 0.1
            else scale -= 0.1
            updateZoom()
            sm.appendUntilFit()
        },
        get scale() { return scale }
    }
})()