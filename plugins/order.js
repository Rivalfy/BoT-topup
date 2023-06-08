var fetch = require("node-fetch")
const ref = Math.floor(Math.random() * 10000);
var handler = async (m, {args, conn }) => {
if(!args[0]) throw `*Contoh :*\n.order FF5|123456788`
let produk = args[0].split("|")[0]
let tujuan = args[0].split("|")[1]
let echa = await fetch(`https://h2h.okeconnect.com/trx?product=${produk}&dest=${tujuan}&refID=${ref}&memberID=${global.userID}&pin=${global.pinTRX}&password=${global.password}`)
let res = await echa.text()
if(res.includes("kurang")){
let alasan = res.split("GAGAL.")[1]
let alas = alasan.split(". Saldo")[0]
let jam = alasan.split("@")[1]
let sisa = alasan.split("@")[0]
let gagal = `*Transaksi Gagal‼️*

*📝Alasan :*
*_S${alas.split("Sisa s")[1]}_*
*⏰ Jam :* ${jam}`
m.reply(gagal)
}
if(res.includes("gangguan")){
let gagal = `*Transaksi Gagal‼️*

*📝Alasan :*
*_Produk Sedang Gangguan !!_*`
m.reply(gagal)
}
if(res.includes("proses")){
let sukses = `*Transaksi Sedang Di Proses, Mohon Bersabar*

*_Silahkan tunggu produk masuk ke tujuan_*`
m.reply(sukses)
setTimeout(function(){
m.reply(`Hai Kak @${m.sender.split("@")[0]}\n*Transaksi Anda Berjalan Dengan Sukses,Silahkan Cek ID Tujuan Dan Terima Kasih Sudah Order Di STOREID*`)
}, 10000)
}
m.reply(res)
}
handler.tags = ['topup']
handler.help = handler.command = ['order']
handler.owner = true
module.exports = handler