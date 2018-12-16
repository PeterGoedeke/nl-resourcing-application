const frame = document.querySelector('.frame')
let elements = []
let allElements = []
let count = 0
const frag = document.createDocumentFragment()

const protoElement = (function() {
    let element = document.createElement('div')
    element.className = 'element'
    for(let i = 0; i < 100; i++) {
        let child = document.createElement('div')
        child.className = 'child'
        //const width = Math.floor(Math.random() * 20) * 5
        const width = 85
        child.style.width = width + '%'
        child.style.left = (100 - width) / 2 + '%'
        for(let j = 0; j < width / 5; j ++) {
            let childBlock = document.createElement('div')
            childBlock.className = 'childBlock'
            child.appendChild(childBlock)
        }
        element.appendChild(child)
    }
    return element
})()
function addElement() {
    const element = protoElement.cloneNode(true)
    elements.push(element)
    // Array.from(element.getElementsByTagName('*')).forEach(child => allElements.push(child))
    frag.appendChild(element)
}
for(let i = 0; i < 100; i++) addElement()
frame.appendChild(frag)
// Array.from(frame.getElementsByTagName('*')).forEach(child => allElements.push(child))

const fragment = document.createDocumentFragment()
function test() {
    // elements[0].style.backgroundColor = random.color()
    elements.forEach(element => {
        fragment.appendChild(element)
    })
    frame.appendChild(fragment)
    // elements.forEach(element => {
    //     frame.appendChild(element)
    // })

    
    // frame.innerHTML = stringElements.join('')
}
function test2() {
    frame.innerHTML = ''
}
function test3() {
    test2()
    test()
}

function testString() {
    let stringElements = []
    for(let i = 0; i < 100; i++) {
        let elementString = `<div class="element">`
        for(let j = 0; j < 100; j++) {
            let childString = `<div class="child" `
            const width = 85
            childString += `style="width:${width}%; left:${(100 - width) / 2}%">`
            for(let k = 0; k < width / 5; k ++) childString += `<div class="childBlock"></div>`
            childString += `</div>`
            elementString += childString
        }
        elementString += `</div>`
        stringElements.push(elementString)
    }
    return stringElements.join('')
}

function test4() {
    allElements[random.number(0, allElements.length - 1)].style.backgroundColor = random.color()
}

const random = {
    color() {
        const characters = '0123456789ABCDEF'
        let color = '#'
        for(let i = 0; i < 6; i++) color += characters[Math.floor(Math.random() * 16)]
        return color
    },
    number(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1) + lower)
    },
    flip() {
        return Math.random() > 0.5
    }
}

function add() {
    allElements.forEach(element => element.addEventListener('click', event => console.log(element.className)))
}

// let initialLeft
// let initialWidth
// addEventListener('dragstart', event => {

//     console.log(event.target.getBoundingClientRect().right)
// })
// addEventListener('drag', event => {

// })

// let draggingInterval
// addEventListener('mousedown', event => {
//     if(event.target.className.split(' ').includes('child')) {
//         draggingInterval = setInterval(() => {
//             event.target
//         }, 10)
//     }
// })
// addEventListener('mouseup', event => {
//     clearInterval(draggingInterval)
// })



function appendGridBox(x, y) {
    let element = document.createElement('div')
    element.className = 'gridBox'
    element.style.gridArea = `${x} / ${y}`
    frame.appendChild(element)
}
for(let i = 0; i < 20; i++) for(let j = 0; j < 20; j++) appendGridBox(i + 1, j + 1)

function addGridRow() {
    frame.style.setProperty('--rows', Number(getComputedStyle(frame).getPropertyValue('--rows')) + 1)
    for(let i = 0; i < 20; i++) {
        //appendGridBox(i + 1, getComputedStyle(frame).getPropertyValue('--rows'))
        appendGridBox(getComputedStyle(frame).getPropertyValue('--rows'), i + 1)
    }
}

const protoGridBox = (function() {
    let element = document.createElement('div')
    element.className = 'gridBox'
    return element
})()

function addGridRows(rows) {
    const fragment = document.createDocumentFragment()
    const initialRows = Number(getComputedStyle(frame).getPropertyValue('--rows'))
    frame.style.setProperty('--rows', initialRows + rows)
    for(let i = 0; i < rows * 20; i++) {
        let element = protoGridBox.cloneNode()
        //element.style.gridArea = `${i + 1} / ${Math.floor((i + 1) / 20) + initialRows}`
        element.style.gridArea = `${Math.floor(i / 20) + initialRows + 1} / ${(i % 20) + 1}`
        fragment.appendChild(element)
    }
    frame.appendChild(fragment)
}

function testExpand() {
    setTimeout(() => {
        for(let i = 0; i < 100; i++) addGridRow()
    }, 1000)
}

function changeLocation() {
    frame.removeChild(elements[5])
    frame.insertBefore(elements[5], elements[0])
}