
const Iterator = function (obj) {
    let current = 0;
    const next = () => current += 1;
    const isDone = () => current >= obj.length;
    const getCurrItem = () => obj[current]

    return {
        next,
        isDone,
        getCurrItem
    }
}

const compare = function (iterator1,iterator2) {
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem())
            throw new Error('iterator1 和 iterator2 不相等')
        iterator1.next()
        iterator2.next()
    }
}

let iterator1 = Iterator([1,2,3])
let iterator2 = Iterator([1,2,3])

compare(iterator1,iterator2)
compare([],[])