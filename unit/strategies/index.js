var strategies = {
    "S" : function (salary) {
        return salary * 4
    },
    "A": function (salary) {
        return salary * 3
    },
    "B": function (salary) {
        return salary * 2
    }
}

var calculateBonus = function (level,salary) {
    return strategies[level] ? strategies[level](salary) : salary
}
console.log(calculateBonus('S',200))
console.log(calculateBonus('A',200))
console.log(calculateBonus('B',200))
console.log(calculateBonus('C',200))