const simple = require('./lib/simple')
const util = require('util')

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
async handler(chatUpdate) {
if (global.db.data == null) await loadDatabase()
this.msgqueque = this.msgqueque || []
// console.log(chatUpdate)
if (!chatUpdate) return
// if (chatUpdate.messages.length > 2 || !chatUpdate.messages.length) return
if (chatUpdate.messages.length > 1) console.log(chatUpdate.messages)
let m = chatUpdate.messages[chatUpdate.messages.length - 1]
if (!m) return
try {
m = simple.smsg(this, m) || m
if (!m) return
// console.log(m)
m.limit = false
try {
let user = global.db.data.users[m.sender]
if (typeof user !== 'object') global.db.data.users[m.sender] = {}
if (user) {
if (!isNumber(user.limit)) user.limit = 20
if (!isNumber(user.saldo)) user.saldo = 0
if (!isNumber(user.nama)) user.nama = ""
if (!isNumber(user.harga)) user.harga = 0
if (!isNumber(user.tujuan)) user.tujuan = ""
if (!isNumber(user.produk)) user.produk = ""
if (!isNumber(user.totaltransaksi)) user.totaltransaksi = 0

} else global.db.data.users[m.sender] = {
limit: 20,
saldo: 0,
nama: "",
harga: 0,
tujuan: "",
produk: "",
totaltransaksi: 0,
}
let chat = global.db.data.chats[m.chat]
if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
if (chat) {
if (!('isBanned' in chat)) chat.isBanned = false
if (!('welcome' in chat)) chat.welcome = true
if (!('detect' in chat)) chat.detect = false
if (!('sWelcome' in chat)) chat.sWelcome = ''
if (!('sBye' in chat)) chat.sBye = ''
if (!('sPromote' in chat)) chat.sPromote = ''
if (!('sDemote' in chat)) chat.sDemote = ''
if (!('delete' in chat)) chat.delete = true
if (!('antiLink' in chat)) chat.antiLink = true
if (!('viewonce' in chat)) chat.viewonce = false
if (!('antiToxic' in chat)) chat.antiToxic = false
} else global.db.data.chats[m.chat] = {
isBanned: false,
welcome: true,
detect: false,
sWelcome: '',
sBye: '',
sPromote: '',
sDemote: '',
delete: true,
antiLink: false,
viewonce: false,
antiToxic: true,
}
} catch (e) {
console.error(e)
}
if (opts['nyimak']) return
if (!m.fromMe && opts['self']) return
if (opts['pconly'] && m.chat.endsWith('g.us')) return
if (opts['gconly'] && !m.chat.endsWith('g.us')) return
if (opts['swonly'] && m.chat !== 'status@broadcast') return
if (typeof m.text !== 'string') m.text = ''
if (opts['queque'] && m.text) {
this.msgqueque.push(m.id || m.key.id)
await delay(this.msgqueque.length * 1000)
}
for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin) continue
if (plugin.disabled) continue
if (!plugin.all) continue
if (typeof plugin.all !== 'function') continue
try {
await plugin.all.call(this, m, chatUpdate)
} catch (e) {
if (typeof e === 'string') continue
console.error(e)
}
}
if (m.isBaileys) return

let usedPrefix
let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

let isROwner = [global.conn.user.jid, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
let isOwner = isROwner || m.fromMe
let isMods = isOwner || global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
let isPrems = isROwner || global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
let groupMetadata = (m.isGroup ? (conn.chats[m.chat] || {}).metadata : {}) || {}
let participants = (m.isGroup ? groupMetadata.participants : []) || []
let user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {} // User Data
let bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
let isAdmin = user && user.admin || false // Is User Admin?
let isBotAdmin = bot && bot.admin || false // Are you Admin?
for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin) continue
if (plugin.disabled) continue
if (!opts['restrict']) if (plugin.tags && plugin.tags.includes('admin')) {
// global.dfail('restrict', m, this)
continue
}
const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
let match = (_prefix instanceof RegExp ? // RegExp Mode?
[[_prefix.exec(m.text), _prefix]] :
Array.isArray(_prefix) ? // Array?
_prefix.map(p => {
let re = p instanceof RegExp ? // RegExp in Array?
p :
new RegExp(str2Regex(p))
return [re.exec(m.text), re]
}) :
typeof _prefix === 'string' ? // String?
[[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
[[[], new RegExp]]
).find(p => p[1])
if (typeof plugin.before === 'function') if (await plugin.before.call(this, m, {
match,
conn: this,
participants,
groupMetadata,
user,
bot,
isROwner,
isOwner,
isAdmin,
isBotAdmin,
isPrems,
chatUpdate,
})) continue
if (typeof plugin !== 'function') continue
if ((usedPrefix = (match[0] || '')[0])) {
let noPrefix = m.text.replace(usedPrefix, '')
let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
args = args || []
let _args = noPrefix.trim().split` `.slice(1)
let text = _args.join` `
command = (command || '').toLowerCase()
let fail = plugin.fail || global.dfail // When failed
let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
plugin.command.test(command) :
Array.isArray(plugin.command) ? // Array?
plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
cmd.test(command) :
cmd === command
) :
typeof plugin.command === 'string' ? // String?
plugin.command === command : 
false

if (!isAccept) continue
m.plugin = name
if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
if (name != 'unbanchat.js' && chat && chat.isBanned) return // Except this
if (name != 'unbanuser.js' && user && user.banned) return
}
if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
fail('owner', m, this)
continue
}
if (plugin.rowner && !isROwner) { // Real Owner
fail('rowner', m, this)
continue
}
if (plugin.owner && !isOwner) { // Number Owner
fail('owner', m, this)
continue
}
if (plugin.mods && !isMods) { // Moderator
fail('mods', m, this)
continue
}
if (plugin.premium && !isPrems) { // Premium
fail('premium', m, this)
continue
}
if (plugin.group && !m.isGroup) { // Group Only
fail('group', m, this)
continue
} else if (plugin.botAdmin && !isBotAdmin) { // You Admin
fail('botAdmin', m, this)
continue
} else if (plugin.admin && !isAdmin) { // User Admin
fail('admin', m, this)
continue
}
if (plugin.private && m.isGroup) { // Private Chat Only
fail('private', m, this)
continue
}
if (plugin.register == true && _user.registered == false) { // Butuh daftar?
fail('unreg', m, this)
continue
}
m.isCommand = true
if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
this.reply(m.chat, `Limit anda habis, silahkan beli melalui *${usedPrefix}buy*`, m)
continue // Limit habis
}
let extra = {
match,
usedPrefix,
noPrefix,
_args,
args,
command,
text,
conn: this,
participants,
groupMetadata,
user,
bot,
isROwner,
isOwner,
isAdmin,
isBotAdmin,
isPrems,
chatUpdate,
}
try {
await plugin.call(this, m, extra)
if (!isPrems) m.limit = m.limit || plugin.limit || false
} catch (e) {
// Error occured
m.error = e
console.error(e)
if (e) {
let text = util.format(e)
for (let key of Object.values(APIKeys))
text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
if (e.name)
for (let jid of owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != this.user.jid)) {
let data = (await this.onWhatsApp(jid))[0] || {}
if (data.exists)
m.reply(`*🚥Plugin:* ${m.plugin}\n*🙎‍♂️Sender:* @${m.sender.split`@`[0]}\n*✉️Chat:* ${m.chat}\n*📞Chat Name:* ${await this.getName(m.chat)}\n*🤖Command:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), data.jid, { mentions: [m.sender] })
}
m.reply(text)
}
} finally {
// m.reply(util.format(_user))
if (typeof plugin.after === 'function') {
try {
await plugin.after.call(this, m, extra)
} catch (e) {
console.error(e)
}
}
if (m.limit) m.reply(+ m.limit + ' Limit terpakai')
 }
break
}
}
} catch (e) {
console.error(e)
} finally {
 //conn.sendPresenceUpdate('composing', m.chat) // kalo pengen auto vn hapus // di baris dekat conn
//console.log(global.db.data.users[m.sender])
let user, stats = global.db.data.stats
if (m) {
if (m.sender && (user = global.db.data.users[m.sender])) {
user.limit -= m.limit * 1
}

let stat
if (m.plugin) {
let now = + new Date
if (m.plugin in stats) {
stat = stats[m.plugin]
if (!isNumber(stat.total)) stat.total = 1
if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
if (!isNumber(stat.last)) stat.last = now
if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
} else stat = stats[m.plugin] = {
total: 1,
success: m.error != null ? 0 : 1,
last: now,
lastSuccess: m.error != null ? 0 : now
}
stat.total += 1
stat.last = now
if (m.error == null) {
stat.success += 1
stat.lastSuccess = now
}
}
}
if (opts['autoread']) await this.readMessages([m.key]) //this.chatRead(m.chat, m.isGroup ? m.sender : undefined, m.id || m.key.id).catch(() => { })
}
},
 async participantsUpdate({ id, participants, action }) {
if (opts['self']) return
// if (id in conn.chats) return // First login will spam
if (global.isInit) return
let chat = global.db.data.chats[id] || {}
let text = ''
switch (action) {
case 'add':
case 'remove':
if (chat.welcome) {
let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
for (let user of participants) {
let pp = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9mFzSckd12spppS8gAJ2KB2ER-ccZd4pBbw&usqp=CAU'
try {
pp = await this.profilePictureUrl(user, 'image')
} catch (e) {
} finally {
text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc ? String.fromCharCode(8206).repeat(4001) + groupMetadata.desc : '') :
(chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', await this.getName(user))
let wel = API('alpis', '/api/maker/welcome1', {
name: await this.getName(user),
gpname: await this.getName(id),
member: groupMetadata.participants.length, 
pp: pp, 
bg: 'https://i.ibb.co/8B6Q84n/LTqHsfYS.jpg',
apikey: alpiskey
})
let lea = API('alpis', '/api/maker/goodbye1', {
name: await this.getName(user),
gpname: await this.getName(id),
member: groupMetadata.participants.length, 
pp: pp,
bg: 'https://i.ibb.co/8B6Q84n/LTqHsfYS.jpg',
apikey: alpiskey
})
 /*this.sendFile(id, action === 'add' ? wel : lea, 'pp.jpg', text, null, false, { mentions: [user] })
}
}
}
break*/

 this.sendFile(id, pp, 'pp.jpg', text, null, false, { mentions: [user] })
}
}
}
break 
case 'promote':
text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
case 'demote':
if (!text) text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
text = text.replace('@user', '@' + participants[0].split('@')[0])
if (chat.detect) this.sendMessage(id, text, {
contextInfo: {
mentionedJid: this.parseMention(text)
}
})
break
}
},
async delete({ remoteJid, fromMe, id, participant }) {
if (fromMe) return
let chats = Object.entries(conn.chats).find(([user, data]) => data.messages && data.messages[id])
if (!chats) return
let msg = JSON.parse(chats[1].messages[id])
let chat = global.db.data.chats[msg.key.remoteJid] || {}
if (chat.delete) return
await this.reply(msg.key.remoteJid, `
Terdeteksi @${participant.split`@`[0]} telah menghapus pesan
Untuk mematikan fitur ini, ketik
*.enable delete*
`.trim(), msg, {
mentions: [participant]
})
this.copyNForward(msg.key.remoteJid, msg).catch(e => console.log(e, msg))
}
}

global.dfail = (type, m, conn) => {
let msg = {
rowner: 'Perintah ini hanya dapat digunakan oleh _*OWWNER!1!1!*_',
owner: 'Perintah ini hanya dapat digunakan oleh _*Owner Bot*_!',
mods: 'Perintah ini hanya dapat digunakan oleh _*Moderator*_ !',
premium: 'Perintah ini hanya untuk member _*Premium*_ !',
group: 'Perintah ini hanya dapat digunakan di grup!',
private: 'Perintah ini hanya dapat digunakan di Chat Pribadi!',
admin: 'Perintah ini hanya untuk *Admin* grup!',
botAdmin: 'Jadikan bot sebagai *Admin* untuk menggunakan perintah ini!',
unreg: 'Silahkan daftar untuk menggunakan fitur ini dengan cara mengetik:\n\n*#daftar nama.umur*\n\nContoh: *#daftar Mansur.16*',
restrict: 'Fitur ini di *disable*!'
}[type]
if (msg) return m.reply(msg)
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright("Update 'handler.js'"))
delete require.cache[file]
if (global.reloadHandler) console.log(global.reloadHandler())
})
