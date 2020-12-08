
// 售票楼 发布订阅 对象
const salesOffices = {}
salesOffices.clientList =  {}
salesOffices.listen = function (key,fn) {
    if (!this.clientList[key]) {
        this.clientList[key] = []
    }
    this.clientList[key].push(fn)
}

salesOffices.trigger = function () {
    const key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key]

    if (!fns || fns.length === 0) return false

    for (let i=0, fn; fn = fns[i++];) {
        fn.apply(this,arguments)
    }
}

salesOffices.remove = function (key,fn) {
    const fns = this.clientList[key]
    if (!fns) return false
    if (!fn) fns && (fns.length = 0)
    else {
        for (let len = fns.length-1; len >= 0; len--){
            let _fn = fns[len]
            if (_fn === fn) {
                fns.splice(len,1)
            }
        }
    }
}

let fn1;
salesOffices.listen('squareMeter88',fn1 = function (price) {
    console.log(`价格=${price}`)
})
salesOffices.listen('squareMeter120',function (price){
    console.log(`价格=${price}`)
})

salesOffices.trigger('squareMeter88',2000000)
salesOffices.trigger('squareMeter120',3000000)
salesOffices.trigger('squareMeter88',2000000)

salesOffices.remove('squareMeter88',fn1)
salesOffices.trigger('squareMeter88',2000000)