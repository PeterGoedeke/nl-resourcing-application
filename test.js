let dog = {
    woof: 'woof',
    bark() {
        console.log(dog.woof)
    }
}

let cat = Object.create(dog)
cat.woof = 'meow'
cat.bark()