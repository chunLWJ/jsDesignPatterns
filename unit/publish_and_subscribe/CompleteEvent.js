/**
 * 事件可以有自己的命名空间
 * 事件可以先发布，然后有订阅再重新发布先前的事件
 */
const Event = (function (){
    let global = this,
        Event,
        _default = 'default' // 默认命名空间

    Event = function (){
        let _listen, // 一个简单的订阅
            _trigger, // 一个简单的发布
            _remove, // 一个简单的移除
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {}, // 命名空间 存储 { default: Event }
            _create, // 创建 命名空间
            each = function (ary,fn) {
                let ret;
                for (let i=0, l=ary.length; i < l; i++) {
                    let n = ary[i]
                    ret = fn.call(n,i,n)
                }
                return ret
            }

        /**
         *
         * @param key 监听的 键
         * @param fn 监听的 函数
         * @param cache 监听列表 { key: [fn11,fn2...], key2: [fn1,fn2...] }
         * @private
         */
        _listen = function (key,fn,cache) {
            if (!cache[key]) cache[key] = []
            cache[key].push(fn)
        }

        /**
         *
         * fn 可以 穿 空，穿空该键对应的数组全部清光
         * @param key 监听的 键
         * @param fn 监听的 函数
         * @param cache 监听列表 { key: [fn11,fn2...], key2: [fn1,fn2...] }
         * @private
         */
        _remove = function (key,cache,fn) {
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

        /**
         * 发布事件
         * argument: 缓存列表、键、...参数
         * @returns {*}
         * @private
         */
        _trigger = function (){
            let cache = _shift.call(arguments),
                key = _shift.call(arguments),
                args = arguments,
                _self = this,
                stack = cache[key] // 函数栈

            if (!stack || !stack.length) return

            return each(stack,function (){
                return this.apply(_self,args)
            })
        }

        /**
         * 创建命名空间
         * 这里面，比如 先发布后订阅都是再这里进行扩展的
         * @param namespace 命名空间，默认值为 _default 默认命名空间
         * @returns {*|{one: ret.one, trigger: (function(): (number)), listen: (function(*=, *=, *): (undefined)), remove: ret.remove}}
         * @private
         */
        _create = function (namespace = _default) {
            let cache = {}, // 监听列表 { key: [fn11,fn2...], key2: [fn1,fn2...] }
                offlineStack = [], // 离线事件
                ret = {
                    listen: function (key,fn,last) {
                        _listen(key,fn,cache)
                        if (offlineStack === null) return;

                        // 离线事件可以只实现最后一个 last 参数
                        // 也可以全部离线执行
                        // 执行任何一次，offlineStack 就会被关闭
                        if (last === 'last') offlineStack.length && offlineStack.pop()()
                        else each(offlineStack,function (){
                            this()
                        })

                        offlineStack = null
                    },
                    /**
                     * 单订阅
                     * 移除全部订阅，然后重新订阅一次
                     * @param key
                     * @param fn
                     * @param last
                     */
                    one: function (key,fn,last) {
                        _remove(key,cache)
                        this.listen(key,fn,last)
                    },

                    /**
                     * 移除订阅
                     * @param key
                     * @param fn
                     */
                    remove: function (key,fn) {
                        _remove(key,cache,fn)
                    },

                    /**
                     * 发布订阅
                     * @returns {number|*}
                     */
                    trigger: function (){
                        let fn,
                            args,
                            _self = this
                        _unshift.call(arguments,cache)
                        args = arguments;
                        fn = function (){
                            return _trigger.apply(_self,args)
                        }

                        // 如果 offlineStack 不是 null，即 还没订阅的情况下，则插入该离离线函数
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
                event.remove(key,fn)
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
Event.trigger('click',2)
Event.listen('click',function (b) {
    console.log('b',b)
})
Event.listen('click',function (c){
    console.log('c',c)
})
Event.trigger('click',3)

// one 标识单订阅，会移除前面的所有订阅
Event.one('click',function (a) {
    console.log('a',a)
},'last')
Event.trigger('click',4)
Event.listen('click',function (d){
    console.log('d',d)
})
Event.trigger('click',5)

// 命名空间
Event.create('namespace2').trigger('click2',1)
Event.create('namespace2').listen('click2',function (aa) {
    console.log('aa',aa)
})
// 移除 aa 监听
Event.create('namespace2').remove('click2')

Event.create('namespace2').listen('click2',function click2(bb) {
    console.log('bb',bb)
})
Event.create('namespace2').trigger('click2',2) // 触发 bb 监听，aa被移除了
