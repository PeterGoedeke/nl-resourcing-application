let dog = {
    a: 'b',
    c: 'd',
    move(newIndex) {
        array.splice(array.indexOf(this), 1)
        array.splice(newIndex, 0, this)
    }
}

let array = [0, dog, 5, 7, 9]

dog.move(2)
dog.move(50)

console.log(array)
