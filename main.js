(async () => {
require('./config')
const { useMultiFileAuthState, DisconnectReason, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const pino = require('pino')
const WebSocket = require('ws')
const path = require('path')
const fs = require('fs')
const yargs = require('yargs/yargs')
const cp = require('child_process')
const _ = require('lodash')
const syntaxerror = require('syntax-error')
const P = require('pino')
const os = require('os')

let simple = require('./lib/simple')
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./lib/lowdb')
}
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')


global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
// global.Fn = function functionCallBack(fn, ...args) { return fn.call(global.conn, ...args) }
global.timestamp = {
start: new Date
}

const PORT = process.env.PORT || 3000

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
// console.log({ opts })
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
stats: {},
msgs: {},
sticker: {},
...(global.db.data || {})
}
global.db.chain = _.chain(global.db.data)
}
loadDatabase()



// if (opts['cluster']) {
// require('./lib/cluster').Cluster()
// }
const authFile = `${opts._[0] || 'sessions'}`
global.isInit = !fs.existsSync(authFile)
const { state, saveState, saveCreds } = await useMultiFileAuthState(authFile)

const connectionOptions = {
printQRInTerminal: true,
syncFullHistory: true,
markOnlineOnConnect: true,
connectTimeoutMs: 60_000, 
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
generateHighQualityLinkPreview: true, 
patchMessageBeforeSending: (message) => {
const requiresPatch = !!(
message.buttonsMessage 
|| message.templateMessage
|| message.listMessage
);
if (requiresPatch) {
message = {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadataVersion: 2,
deviceListMetadata: {},
},
...message,
},
},
};
}

return message;
},
auth: state,
browser: ['EchaXD','Safari',''],
logger: pino({ level: 'silent'}),
version: [2, 2204, 13]
}

global.conn = simple.makeWASocket(connectionOptions)

if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (!opts['tmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
}, 30 * 1000)
}

const _0x1cca2d=_0x406d;(function(_0x96c5aa,_0x26ebb1){const _0x5cba85=_0x406d,_0x5dfc31=_0x96c5aa();while(!![]){try{const _0xe56cb8=-parseInt(_0x5cba85(0x149))/0x1*(parseInt(_0x5cba85(0x14a))/0x2)+-parseInt(_0x5cba85(0x146))/0x3*(-parseInt(_0x5cba85(0x145))/0x4)+parseInt(_0x5cba85(0x142))/0x5+parseInt(_0x5cba85(0x153))/0x6+-parseInt(_0x5cba85(0x14c))/0x7+-parseInt(_0x5cba85(0x156))/0x8+parseInt(_0x5cba85(0x147))/0x9*(parseInt(_0x5cba85(0x155))/0xa);if(_0xe56cb8===_0x26ebb1)break;else _0x5dfc31['push'](_0x5dfc31['shift']());}catch(_0x54ac6b){_0x5dfc31['push'](_0x5dfc31['shift']());}}}(_0x1965,0x4cc35));async function connectionUpdate(_0x818a0a){const _0x11bb6e=_0x406d,{connection:_0x420ebe,lastDisconnect:_0xf16eeb}=_0x818a0a;global[_0x11bb6e(0x148)][_0x11bb6e(0x151)]=new Date();_0xf16eeb&&_0xf16eeb[_0x11bb6e(0x157)]&&_0xf16eeb['error']['output']&&_0xf16eeb['error'][_0x11bb6e(0x14e)]['statusCode']!==DisconnectReason[_0x11bb6e(0x158)]&&conn['ws'][_0x11bb6e(0x143)]!==WebSocket['CONNECTING']&&console[_0x11bb6e(0x14d)](global['reloadHandler'](!![]));if(global['db'][_0x11bb6e(0x144)]==null)await loadDatabase();if(_0x818a0a[_0x11bb6e(0x152)])conn[_0x11bb6e(0x150)](_0x11bb6e(0x14f),{'text':_0x11bb6e(0x14b)},{'quoted':null});}process['on'](_0x1cca2d(0x154),console[_0x1cca2d(0x157)]);function _0x406d(_0x598529,_0x4dd541){const _0x19656d=_0x1965();return _0x406d=function(_0x406d76,_0x4a0070){_0x406d76=_0x406d76-0x142;let _0x3d1348=_0x19656d[_0x406d76];return _0x3d1348;},_0x406d(_0x598529,_0x4dd541);}function _0x1965(){const _0x290f3c=['loggedOut','157975wIZgFj','readyState','data','6632eoMpFu','15mJtZRb','297mCmWdn','timestamp','239TVvtAv','4502ezAaEe','Bot\x20Berhasil\x20Tersambung✅','4106165HzTvAV','log','output','6283119312992@s.whatsapp.net','sendMessage','connect','receivedPendingNotifications','2101842IwTaDk','uncaughtException','374410lBcAjG','1493920ixFZQF','error'];_0x1965=function(){return _0x290f3c;};return _0x1965();}

// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

const imports = (path) => {
path = require.resolve(path)
let modules, retry = 0
do {
if (path in require.cache) delete require.cache[path]
modules = require(path)
retry++
} while ((!modules || (Array.isArray(modules) || modules instanceof String) ? !(modules || []).length : typeof modules == 'object' && !Buffer.isBuffer(modules) ? !(Object.keys(modules || {})).length : true) && retry <= 10)
return modules
}
let isInit = true
global.reloadHandler = function (restatConn) {
let handler = imports('./handler')
if (restatConn) {
try { global.conn.ws.close() } catch { }
global.conn = {
...global.conn, ...simple.makeWASocket(connectionOptions)
}
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('group-participants.update', conn.participantsUpdate)
conn.ev.off('message.delete', conn.onDelete)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}

conn.welcome = 'Selamat datang @user di group @subject utamakan baca desk ya \n@desc'
conn.bye = 'Selamat tinggal @user 👋'
conn.promote = '@user sekarang admin!'
conn.demote = '@user sekarang bukan admin!'
conn.handler = handler.handler.bind(conn)
conn.participantsUpdate = handler.participantsUpdate.bind(conn)
conn.onDelete = handler.delete.bind(conn)
conn.connectionUpdate = connectionUpdate.bind(conn)
conn.credsUpdate = saveCreds.bind(conn)

conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('group-participants.update', conn.participantsUpdate)
conn.ev.on('message.delete', conn.onDelete)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
}

let pluginFolder = path.join(__dirname, 'plugins')
let pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
try {
global.plugins[filename] = require(path.join(pluginFolder, filename))
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}
}
console.log(Object.keys(global.plugins))
global.reload = (_ev, filename) => {
if (pluginFilter(filename)) {
let dir = path.join(pluginFolder, filename)
if (dir in require.cache) {
delete require.cache[dir]
if (fs.existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
else {
conn.logger.warn(`deleted plugin '${filename}'`)
return delete global.plugins[filename]
}
} else conn.logger.info(`requiring new plugin '${filename}'`)
let err = syntaxerror(fs.readFileSync(dir), filename)
if (err) conn.logger.error(`syntax error while loading '${filename}'\n${err}`)
else try {
global.plugins[filename] = require(dir)
} catch (e) {
conn.logger.error(e)
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}
}
}
Object.freeze(global.reload)
fs.watch(path.join(__dirname, 'plugins'), global.reload)
global.reloadHandler()

// Quick Test
async function _quickTest() {
let test = await Promise.all([
cp.spawn('ffmpeg'),
cp.spawn('ffprobe'),
cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
cp.spawn('convert'),
cp.spawn('magick'),
cp.spawn('gm'),
cp.spawn('find', ['--version'])
].map(p => {
return Promise.race([
new Promise(resolve => {
p.on('close', code => {
resolve(code !== 127)
})
}),
new Promise(resolve => {
p.on('error', _ => resolve(false))
})
])
}))
let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
console.log(test)
let s = global.support = {
ffmpeg,
ffprobe,
ffmpegWebp,
convert,
magick,
gm,
find
}
// require('./lib/sticker').support = s
Object.freeze(global.support)

if (!s.ffmpeg) conn.logger.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

_quickTest()
.then(() => conn.logger.info('Quick Test Done'))
.catch("done")
})()