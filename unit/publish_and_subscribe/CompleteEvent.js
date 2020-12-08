/**
 * 事件可以有自己的命名空间
 * 事件可以先发布，然后有订阅再重新发布先前的事件
 */
const Event = (function (){
    let global = this,
        Event,
        _default = 'default' // 默认命名空间

    Event = function (){
        let _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {}, // 命名空间 存储对应的 Event
            _create, // 创建 命名空间
            find,
            each = function (ary,fn) {
                let ret;
                for (let i=0, l=ary.length; i < l; i++) {
                    let n = ary[i]
                    ret = fn.call(n,i,n)
                }
                return ret
            }

        _listen = function (key,fn,cache) {
            if (!cache[key]) cache[key] = []
            cache[key].push(fn)
        }
        _remove = function (key,fn,cache) {
            if (cache[key]) {
                if (fn) {
                    for (let i=cache[key].length; i>=0; i--) {
                        if (cache[key][i] === fn)
                            cache[key].splice(i,1)
                    }
                } else {
                    cache[key] = []
                }
            }
        }
        _trigger = function (){
            let cache = _shift.call(arguments),
                key = _shift.call(arguments),
                args = arguments,
                _self = this,
                ret,
                stack = cache[key]

            if (!stack || !stack.length) return

            return each(stack,function (){
                return this.apply(_self,args)
            })
        }

        /**
         * 创建命名空间
         * @param namespace 命名空间，默认值为 _default 默认命名空间
         * @returns {*|{one: ret.one, trigger: (function(): (number)), listen: (function(*=, *=, *): (undefined)), remove: ret.remove}}
         * @private
         */
        _create = function (namespace = _default) {
            let cache = {},
                offlineStack = [], // 离线事件
                ret = {
                    listen: function (key,fn,last) {
                        _listen(key,fn,cache)
                        if (offlineStack === null) return;
                        if (last === 'last') offlineStack.length && offlineStack.pop()()
                        else each(offlineStack,function (){
                            this()
                        })

                        offlineStack = null
                    },
                    one: function (key,fn,last) {
                        _remove(key,cache)
                        this.listen(key,fn,last)
                    },
                    remove: function (key,fn) {
                        _remove(key,cache,fn)
                    },
                    trigger: function (){
                        let fn,
                            args,
                            _self = this
                        _unshift.call(arguments,cache)
                        args = arguments;
                        fn = function (){
                            return _trigger.apply(_self,args)
                        }

                        if (offlineStack) {
                            return offlineStack.push(fn)
                        }
                        return fn()
                    }
                }

                return namespace ? (namespaceCache[namespace] ? (namespaceCache[namespace]) : namespaceCache[namespace] = ret) : ret
        }

        return {
            create: _create,
            one: function (key,fn,last) {
                const event = this.create()
                event.one(key,fn,last)
            },
            remove: function (key,fn) {
                const event = this.create()
                event.remote(key,fn)
            },
            listen: function (key,fn,last) {
                const event = this.create()
                event.listen(key,fn,last)
            },
            trigger: function (){
                const event = this.create()
                event.trigger.apply(this,arguments)
            }
        }
    }()


    return Event
})()

// 先发布后订阅
Event.trigger('click',1)
Event.listen('click',function (a){
    console.log('a',a)
})

// 命名空间
Event.create('namespace1').listen('click',function (b) {
    console.log('b',b)
})
Event.create('namespace1').trigger('click',1)

Event.create('namespace2').listen('click',function (c) {
    console.log('c',c)
})
Event.create('namespace2').trigger('click',2)