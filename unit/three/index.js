
const multi = function () {
    const cache = {} // 缓存，减少不必要的计算
    const calculate = function () {
        let a = 1;
        let i = 0, len = arguments.length;
        for (; i < len; i++) {
            a = a * arguments[i]
        }
        return a
    }


    return function () {
        const args = Array.prototype.join.call(arguments,'')
        if (args in cache) {
            return cache[args]
        }
        return cache[args] = calculate.apply(null,arguments)
    }
}();
multi(1,2,3)
multi(1,2,3)

const TV = {
    open(){
        console.log('open')
    },
    close(){
        console.log('close')
    }
}
// 闭包
const createCommand = function (receiver) {
    return {
        execute: () => receiver.open(),
        undo: () => receiver.close()
    }
}
const setCommand = function (command) {
    command.execute()
    command.undo()
}
setCommand( createCommand(TV) )

// 类
const OpenTvCommand = function (receiver) {
    this.reveiver = receiver
}
OpenTvCommand.prototype.execute = function () {this.reveiver.open()}
OpenTvCommand.prototype.undo = function () {this.reveiver.close()}
setCommand(new OpenTvCommand(TV))

// 柯里化
const currying  = function (fn) {
    const args = [];
    return function () {
        if (arguments.length === 0) {
            return fn.apply(this,args)
        } else {
            [].push.apply(args,arguments)
            return arguments.callee
        }
    }
}
const cost = (function (){
    let money = 0;
    return function (){
        for (let i=0,len=arguments.length; i<len; i++)
            money += arguments[i]
        return money;
    }
})()
const curryingCost = currying(cost)
curryingCost(100)
curryingCost(200)
curryingCost(300)
console.log(curryingCost())

// uncurrying 泛型this
Function.prototype.uncurring = function () {
    const self = this;
    return function () {
        const obj = Array.prototype.shift.call(arguments)
        return self.apply(obj,arguments)
    }
}
for (let i=0, fn,ary=['push','shift','forEach']; fn = ary[i++];) {
    Array[fn] = Array.prototype[fn].uncurring()
}
const obj = {
    length: 3,
    0: 0,
    1: 1,
    2: 2
}
Array.push(obj,3)
console.log(obj)

const first = Array.shift(obj)
console.log(obj)
Array.forEach(obj, (i,n) => {
    console.log(i,n)
})