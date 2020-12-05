// 对象方法的 this
const objThis = {
    message: 'Hello World',
    getMessage: function (){
        return this.message
    }
}
console.log(objThis.getMessage())

// 普通函数的调用
const getMessage = objThis.getMessage
console.log(getMessage()) // undefined ，这就是运行时的问题，这个时候调用的上下文是模块，而不是 objThis
// 这里由于是 node 环境，而不是 浏览器环境，我们直接往 global 塞全局变量
global.message = "Hello Message" // 这个是模块内的 message
console.log(getMessage()) // Hello Message

// 构造器调用
const MyClass = function () {
    this.name = 'lai'
}
const myClass = new MyClass();
console.log(myClass) // MyClass { name: 'lai' }

// call apply
const objCallApply = {
    name: 'lai',
    getName: function () {return this.name}
}
const objCallApplyTest = {
    name: 'test'
}
console.log(objCallApply.getName()) // lai
console.log(objCallApply.getName.apply(objCallApplyTest)) // test
console.log(objCallApply.getName.call(objCallApplyTest)) // test

Function.prototype.bind = function () {
    const self = this,
        context = [].shift.call(arguments),
        args = [].slice.call(arguments);
    return function () {
        return self.apply(context,[].concat.call(args,[].slice.call(arguments)))
    }
}
const user = {
    name: 'lai'
}
const func = function (a,b,c,d) {
    console.log('name: ',this.name) // name: lai
    console.log(a,b,c,d) // 1 2 3 4
}.bind(user,1,2)
func(3,4)

function Person(){
    this.name = 'lai'

    const func = function () {
        console.log(this.name)
    };
    // func() // undefined
    // func.apply(this) // lai
    // func.call(this) // lai
    // func.bind(this)() // lai
}
const person = new Person();

const obj = {}
Array.prototype.push.apply(obj,[1,2,3,4])
console.log(obj)
