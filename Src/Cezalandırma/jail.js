const { MessageEmbed, Emoji } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')
const emoji = require('../Src/Settings/Emoji.json')
const moment = require('moment')
const ms = require('ms')
const db = require('quick.db')


module.exports.config = { 
    name: 'jail',
    aliases: ['cezalandır']
}

module.exports.raviwen = async(client, message, args, config) => {

    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.jailYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send('Belirttiğiniz üyeyi bulamadım.')
    let zaman = args[1]
    let zaman1 = zaman.replace(/y/, ' Yıl').replace(/d/, ' Gün').replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat')
    if(!zaman) return message.channel.send(`Bir zaman belirtmen gerekiyor.`)
    let sebep = args.splice(2).join(" ")
    if(!sebep) return message.channel.send('Bir sebep belirtmen gerekiyor.')
    if (message.guild.members.cache.has(uye.id) && message.member.roles.highest.position <= message.guild.members.cache.get(uye.id).roles.highest.position) return message.channel.send("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
    if(uye.id === message.author.id) 
    return message.reply(`${emoji.Error} Kendini cezalıya atamazsın!`)

    let timereplace = args[1];
    let time = timereplace.replace(/y/, ' Yıl').replace(/d/, ' Gün').replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat')
    var tarih = new Date(Date.now())
    var tarih2 = ms(timereplace)
    var tarih3 = Date.now() + tarih2
    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let bitişay = moment(tarih3).format("MM")
    let bitişgün = moment(tarih3).format("DD")
    let bitişsaat = moment(tarih3).format("HH:mm:ss")
    let jailatılma = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    let jailbitiş = `\`${bitişgün} ${bitişay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${bitişsaat}\``
    moment.locale("tr")

    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezapuan.${uye.id}.${message.guild.id}`, +50);
    let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`);
    db.add(`cezaid.${message.guild.id}`, +1);
    db.push(`moderasyon.${uye.id}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID, Komut: 'Jail',Puan: '+50', Tarih: jailatılma, Sebep: sebep, Süre: time})
    db.set(`moderasyon.${cezaID}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID, Komut: 'Jail',Puan: '+50', Tarih: jailatılma, Sebep: sebep, Süre: time})

    db.set(`cezalı.${uye.id}.${message.guild.id}`, 'cezalı')
    db.set(`süre.${uye.id}.${message.guild.id}`, zaman)
    db.add(`jail.${message.author.id}`, +1)
    db.add(`toplam.${message.author.id}`, +1)

    let jail = new MessageEmbed()
    .setColor(`RANDOM`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`${emoji.hapishane} Başarıyla ${uye} Adlı üye ${message.author} tarafından cezalıya gönderildi. `)

    let cpuanlog = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(`${uye}: Aldığınız **Jail** cezası ile **${cpuan || 0}** (\`+50\`) ceza puanına ulaştınız. (\`#${cezaID}\`)`)

    uye.roles.cache.has(raviwen.Roller.Booster) ? uye.roles.set([raviwen.Roller.Booster, raviwen.Roller.Jailed]) : uye.roles.set([raviwen.Roller.Jailed])
    message.channel.send(jail)
    client.channels.cache.get(raviwen.Log.CezaPuanLog).send(cpuanlog)
    
    setTimeout(async() => {
        let cezalı = db.fetch(`cezalı.${uye.id}.${message.guild.id}`)
        if(!cezalı) return;
        if(cezalı == 'cezalı') {
            message.channel.send(`${uye} Kişinin jail cezası sona erdi. Tekrardan kayıt olup ailemize kayıt olabilir.`)
            await db.delete(`cezalı.${uye.id}.${message.guild.id}`)
            await db.delete(`süre.${uye.id}.${message.author.id}`)
            await uye.roles.remove(raviwen.Roller.Jailed)
            await uye.roles.add(raviwen.Roller.Member)
            if(cpuan > 250)return await uye.roles.set(raviwen.Roller.Jailed)
        }
    }, ms(zaman));
};
