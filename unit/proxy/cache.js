const mult = function () {
    let a = 1;
    let i = 0, len = arguments.length;
    for (; i < len; i++) {
        a *= arguments[i]
    }
    return a
}

const plus = function () {
    let a = 0;
    let i = 0, len = arguments.length;
    for (; i < len; i++) {
        a += arguments[i]
    }
    return a
}

const createProxyFactory = function (fn) {
    const cache = []
    return function () {
        var args = Array.prototype.join.call(arguments,',')
        if (args in cache) {
            return cache[args]
        }
        return cache[args] = fn.apply(this,arguments)
    }
}

let proxyMult = createProxyFactory(mult)
let proxyPlus = createProxyFactory(plus)

proxyMult(1,2,3,4)
proxyMult(1,2,3,4)
proxyPlus(1,2,3,4)
proxyPlus(1,2,3,4)
