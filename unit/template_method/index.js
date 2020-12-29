const Beverage = function (param) {
    const boilWater = function () {
        console.log('把水煮沸')
    };
    const brew = param.brew || function(){
        throw new Error('必须传递 brew 方法')
    }

    const pourInCup = param.pourInCup || function(){
        throw new Error('必须传递 pourInCup 方法')
    }

    const addCondiments = param.addCondiments || function(){
        throw new Error('必须传递 addCondiments 方法')
    }
    let f = function (){}
    f.prototype.init = function() {
        boilWater()
        brew()
        pourInCup()
        addCondiments()
    }
    return f

}

const Coffee = Beverage({
    brew: () => console.log('用沸水冲泡咖啡'),
    pourInCup: () => console.log('把咖啡倒进被子'),
    addCondiments: () => console.log('加糖和牛奶')
})
const Tea = Beverage({
    brew: () => console.log('用沸水侵泡茶叶'),
    pourInCup: () => console.log('把茶倒进被子'),
    addCondiments: () => console.log('加柠檬')
})


let coffee = new Coffee()
coffee.init()

let tea = new Tea()
tea.init()