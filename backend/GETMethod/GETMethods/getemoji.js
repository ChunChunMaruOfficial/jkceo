const emoji = require("emoji-api");

 function GetAllEmoji() {
    let result = emoji.all().filter(v => v.group != 'Flags' && v.subGroup != 'family') //тупа фильтр ненужных эмодзи
    result = result.map(v => ({ emoji: v.emoji, name: v.name })) //отправка только их названий и значений
    return result
}
    

module.exports = GetAllEmoji