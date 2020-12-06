/**
 * 维护单例
 * @param fn 函数只会执行一次
 * @returns {function(): *} fn 函数返回值，单例
 */
const getSingle = function (fn) {
    let result;
    return function (){ // strategies
        return result || (result = fn.apply(this,arguments))
    }
}
const createLogin = function () {
    console.log('开始创建登录')
    const div = {} // 这里假设是一个 DOM 结点
    div.innerHTML = '登录'
    return div
}
const login = getSingle(createLogin)
console.log(login() === login())

// 以前的开发是由于因为不存在模块，任何 js 都会嵌入到 html，然后任何js声明的var都是全局变量
// 这样的话每个 var 都是唯一的，但是会存在被覆盖，冲突等一系列的问题
// 如今的模块化编程实现的单例模式，我们仅仅需要导出 getSingle，并传入一个函数参数，返回的函数就是一个维护单例的函数