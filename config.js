global.userID = 'OK***'
global.pinTRX = '****'
global.password = '****'
//--
global.owner = ['6281214307663']  

global.nameowner = 'Rival.fly'
global.numberowner = '6281214307663' 

global.dana = '085722881931'
global.ovo = '088239314241'
global.pulsa = '081226448082'
global.linkQris = `https://telegra.ph/file/e1396f0114a30e71e9a3c.jpg`
global.gopay = '081226448082'
global.namebot = 'STORE ID'
global.packname = 'Sticker By'
global.author = 'Echa Bot Whatsapp'
global.APIs = { 
  tio: 'https://api.botcahx.live',
}
global.APIKeys = { 
  'https://api.botcahx.live': 'EchaXD' //ga usah diganti
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})