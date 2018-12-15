let elements = []
let count = 0
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
            count ++
        }
        element.appendChild(child)
        count ++
    }
    elements.push(element)
    document.querySelector('.frame').appendChild(element)
    count ++
}
for(let i = 0; i < 100; i++) addElement()

const frame = document.querySelector('.frame')
setTimeout(() => {
    document.querySelector('.frame').innerHTML = ''
    console.log('removed')
    console.log('added')
}, 4000)
function test() {
    elements.forEach(element => {
        element.style.backgroundColor = random.color()
        frame.appendChild(element)
    })
}
function test2() {
    frame.innerHTML = ''
}
function test3() {
    test2()
    test()
}

function test4() {
    elements.forEach(element => element.style.backgroundColor = random.color())
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