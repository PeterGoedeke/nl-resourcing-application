const zoom = (function() {
    let scale = 100
    return {
        setZoom(zoom) {
            scale = zoom
        },
        zoomIn() {
            if(scale >= 90) scale = 100
            else scale += 10
        },
        zoomOut() {
            if(scale <= 20) scale = 10
            else scale -= 10
        },
        get scale() { return scale }
    }
})()