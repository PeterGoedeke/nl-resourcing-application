let dog = {
    a: 'b',
    c: 'd',
    move(newIndex) {
        array[array.indexOf(this)] = 0
        array.splice(newIndex, 0, this)
        array.splice(array.indexOf(0), 1)
    }
}

let array = [3, dog, 5, 7, 9]

dog.move(2)

console.log(array)
