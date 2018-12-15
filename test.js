const frame = document.querySelector('.frame')
let elements = []
let allElements = []
let count = 0
const frag = document.createDocumentFragment()
function addElement() {
    let element = document.createElement('div')
    element.className = 'element'
    for(let i = 0; i < 100; i++) {
        let child = document.createElement('div')
        child.className = 'child'
        const width = Math.floor(Math.random() * 20) * 5
        child.style.width = width + '%'
        child.style.left = (100 - width) / 2 + '%'
        for(let j = 0; j < width / 5; j ++) {
            let childBlock = document.createElement('div')
            childBlock.className = 'childBlock'
            child.appendChild(childBlock)
            allElements.push(childBlock)
            count ++
        }
        element.appendChild(child)
        allElements.push(child)
        count ++
    }
    elements.push(element)
    allElements.push(element)
    frag.appendChild(element)
    count ++
}
for(let i = 0; i < 100; i++) addElement()
frame.appendChild(frag)

function test() {
    elements[0].style.backgroundColor = random.color()
    const fragment = document.createDocumentFragment()
    elements.forEach(element => {
        fragment.appendChild(element)
    })
    frame.appendChild(fragment)
    // elements.forEach(element => {
    //     frame.appendChild(element)
    // })
}
function test2() {
    frame.innerHTML = ''
}
function test3() {
    test2()
    test()
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