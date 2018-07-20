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
        sm.updateDisplay()
        sm.updateVerticalDisplay()
        sq.positioner.style.width = getXLocationFromID(state.latestDate + 1) + 'px'
    }
    return {
        setZoom(zoom) {
            scale = zoom
            updateZoom()
        },
        in() {
            if(scale >= 0.9) scale = 1
            else scale += 0.1
            console.log(scale)
            updateZoom()
        },
        out() {
            if(scale <= 0.2) scale = 0.1
            else scale -= 0.1
            console.log(scale)
            updateZoom()
        },
        get scale() { return scale }
    }
})()