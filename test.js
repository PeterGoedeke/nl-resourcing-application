let dog = {
    a: 'b',
    c: 'd'
}

let array = [0, dog, 5, 7, 9]

array.push(dog)
array.splice(array.indexOf(dog), 1)

console.log(array)