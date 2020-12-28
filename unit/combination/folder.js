
// 这里额外做一下文件夹优先遍历、然后就是添加一些前缀稍微分辨得出谁是谁的文件

const Folder = function (name) {
    this.name = name;
    this.parent = null; // 父节点
    this.files = []
}
Folder.prototype.add = function (file) {
    file.parent = this
    if (file instanceof Folder) {
        this.files.unshift(file)
    } else if (file instanceof File)
        this.files.push(file)
}
Folder.prototype.scan = function(){
    console.log(`${'--- '.repeat(this.getParentIndex())} 文件夹 ${this.name}`)
    this.files.forEach(file => file.scan())
}
// 这里额外添加一些前缀来分辨一下谁是谁的文件
Folder.prototype.getParentIndex = function(){
    let index = 0;
    let parent = this.parent
    while (parent) {
        index++
        parent = parent.parent
    }
    return index
}

const File = function(name) {
    this.name = name;
    this.parent = null;
}
File.prototype.add = function (){
    throw new Error('文件不能再添加文件')
}
File.prototype.scan = function(){

    console.log(`${'--- '.repeat(this.getParentIndex())} 文件 ${this.name}`)
}
File.prototype.remove = function () {
    if (!this.parent)
        return
    this.parent.files = this.parent.files.filter(file => file !== this)
}
File.prototype.getParentIndex = function(){
    let index = 0;
    let parent = this.parent
    while (parent) {
        index++
        parent = parent.parent
    }
    return index
}
let folder = new Folder('学习资料');
let folder1 = new Folder('JavaScript')
let folder2 = new Folder('JQuery')

let file1 = new File('JavaScript设计模式与开发实战')
let file2 = new File('精通 JQuery')
let file3 = new File('重构与模式')

folder1.add(file1)
folder2.add(file2)

folder.add(folder1)
folder.add(folder2)
folder.add(file3)

let folder3 = new Folder('Nodejs')
let file4 = new File('深入浅出Node.js')
folder3.add(file4)
folder.add(folder3)

let file5 = new File('JavaScript语言精髓与编程实践')
folder.add(file5)

let folder4 = new Folder('Java')
let folder5 = new Folder('JavaEE')
let file6 = new File('Java 核心技术一卷')
let file7 = new File('Java 核心技术二卷')
folder4.add(file6)
folder4.add(file7)
folder4.add(folder5)
folder5.add(new File('JavaEE SSM 框架开发'))
folder5.add(new File('Spring Boot'))
folder.add(folder4)

folder.scan()