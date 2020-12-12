
// 宏命令
const closeDoorCommand = {
    execute: function (){
        console.log('关门')
    }
}
const openPcCommand = {
    execute: function (){
        console.log('开电脑')
    }
}
const openQQCommand = {
    execute: function (){
        console.log('登录QQ')
    }
}
const MacroCommand = function (){
    return {
        commandsList: [],
        add: function (command){
            this.commandsList.push(command)
        },
        execute: function (){
            this.commandsList.forEach(command => command.execute())
        }
    }
}
let macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);
macroCommand.execute();