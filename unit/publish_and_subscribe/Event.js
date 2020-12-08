

const Event = (function (){
    let clientList = {},
        listen,
        trigger,
        remove

    listen = function (key, fn) {
        if (!clientList[key]) {
            clientList[key] = []
        }
        clientList[key].push(fn)
    }

    trigger = function () {
        const key = Array.prototype.shift.call(arguments),
            fns = clientList[key];

        if (!fns || fns.length === 0) return false

        for (let i=0, fn; fn = fns[i++];) {
            fn.apply(this,arguments)
        }
    }

    remove = function (key,fn) {
        const fns = clientList[key]
        if (!fns) return false
        if (!fn) fns && (fns.length = 0)
        else {
            for (let len = fns.length-1; len >= 0; len--) {
                const _fn = fns[len]
                if (_fn === fn) {
                    fns.splice(len,1)
                }
            }
        }
    }

    return {
        listen,
        trigger,
        remove
    }
})()

// 实现上来看，我们就 仅仅 改名为 Event
// 意思上就是说，它是一个 事件 的发布和订阅，而不是 具体的售票楼 的发布和订阅
// 任何的订阅事件都将由 Event 管理
// 任何的发布事件都将由 Event 管理