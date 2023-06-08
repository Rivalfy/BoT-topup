var handler = async (m, { conn }) => {
let echa = `*📮 Cara Melakukan Topup/Order Pada Bot*

1. Silahkan lihat listprice/harga terlebih dahulu
2. Ingat Kode Produk yang ada pada list harga tadi
3. Silahkan pastikan bahwa kode produk benar
4. Jika sudah,ketik seperti ini :
#order FF5|189714904

*Keterangan :*
- FF5 : Kode produk sesuai produk yang mau dibeli
- 123456789 : ID Tujuan
_Jika ada id server,silahkan gabungkan dengan id game, contoh : 12345678912345_

*Jika Tidak Paham Silahkan Tanya Ke Owner.*`
m.reply(echa)
}
handler.tags = ['topup']
handler.help = handler.command = ['caratopup']

module.exports = handler