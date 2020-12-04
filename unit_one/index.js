// 原型模式
const Plane = function () {
    this.blood = 100;
    this.attackLevel = 1;
    this.defenseLevel = 1;
};
const plain = new Plane();
plain.blood = 500;
plain.attackLevel = 10;
plain.defenseLevel = 7;

console.log(plain) // {...}
var clonePlane = Object.create(plain)
console.log(clonePlane)  // {Empty} 自身是空的，但是原型链上指向 plain 的
console.log(Object.getPrototypeOf(clonePlane)) // {...} 原型连

console.log(clonePlane === plain) // false
console.log(Object.getPrototypeOf(clonePlane) === plain) // true

function Person(name) {
    this.name = name;
    // return {
    //     name
    // }
}
Person.prototype.getName = () => this.name;

const objectFactory = function () {
    const obj = new Object(),
        Constructor = [].shift.call(arguments);
    Object.setPrototypeOf(obj,Constructor.prototype)
    // 如果它是一个正常会返回一个对象的函数，而不是一个构造函数的时候，我们要确保总能返回一个对象
    const result = Constructor.apply(obj,arguments)
    return typeof result === 'object' ? result : obj
}
const person1 = objectFactory(Person, 'lai');
const person2 = new Person('lai');
console.log(person1)
console.log(person2)
console.log(Object.getPrototypeOf(person1) === Object.getPrototypeOf(person2)) // true
