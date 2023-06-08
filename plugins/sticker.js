const { sticker1, sticker5 } = require('../lib/sticker')

let handler = async (m, { conn, command ,usedPrefix}) => {
    let stiker = false
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (/webp/.test(mime)) {
            let img = await q.download()
            if (!img) throw `reply sticker with command s`
            stiker = await sticker5(img, false, packname, author)
        } else if (/image/.test(mime)) {
            let img = await q.download()
            if (!img) throw `reply image with command s`
            stiker = await sticker5(img, false, packname, author)
        } else if (/video/.test(mime)) {
            if ((q.msg || q).seconds > 11) return m.reply('maksimal 10 detik!')
            let img = await q.download()
            if (!img) throw `reply video with command s`
            stiker = await sticker5(img, false, packname, author)
        } 
    } catch (e) {
        throw e
    }
    finally {
        if (stiker) {
            await conn.sendFile(m.chat, stiker, '', '', m)
        }
        else {

            m.reply(`Kirim/Reply gambar dengan caption *${usedPrefix+command}*`)
        }
    }
}
handler.help = ['sticker']
handler.tags = ['main']
handler.command = /^(stiker|s|sticker)$/i

module.exports = handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/, 'gi'))
}