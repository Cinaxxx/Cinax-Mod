const { MessageEmbed } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')
const emoji = require('../Src/Settings/Emoji.json')
const moment = require('moment')
const ms = require('ms')
const db = require('quick.db')

module.exports.config = { 
    name: 'vmute',
    aliases: ['v-mute','voicemute']
}

module.exports.raviwen = async(client, message, args, config) => {
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.vmuteYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')
    const uye =message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send('Belirttiğiniz üyeyi bulamadım.')
    let zaman = args[1]
    let zaman1 = zaman.replace(/y/, ' Yıl').replace(/d/, ' Gün').replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat')
    if(!zaman) return message.channel.send(`Bir zaman belirtmen gerekiyor.`)
    let sebep = args.splice(2).join(" ")
    if(!sebep) return message.channel.send('Bir sebep belirtmen gerekiyor.')
    if (message.guild.members.cache.has(uye.id) && message.member.roles.highest.position <= message.guild.members.cache.get(uye.id).roles.highest.position) return message.channel.send("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
    if(uye.id === message.author.id) 
    return message.reply(`${emoji.Error} Kendi muteleyemezsin!`)
    if(uye.roles.cache.has(raviwen.Roller.VMuted)) {
        return message.channel.send(`Belirlediğin kullanıcı zaten ceza almış.`)
    }
    
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
    let voiceatılma = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    let voicebitiş = `\`${bitişgün} ${bitişay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${bitişsaat}\``
    moment.locale("tr")

    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezapuan.${uye.id}.${message.guild.id}`, +20);
    let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`);
    db.add(`cezaid.${message.guild.id}`, +1);
    db.push(`moderasyon.${uye.id}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID, Komut: 'Voice Mute',Puan: '+20', Tarih: voiceatılma, Sebep: sebep, Süre: time})
    db.set(`moderasyon.${cezaID}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID, Komut: 'Voice Mute',Puan: '+20', Tarih: voiceatılma, Sebep: sebep, Süre: time})

    db.set(`vmuteli.${uye.id}.${message.guild.id}`, 'vmuteli')
    db.set(`süre.${uye.id}.${message.guild.id}`, zaman)
    db.add(`vmute.${message.author.id}`, +1)
    db.add(`toplam.${message.author.id}`, +1)

    let vmute = new MessageEmbed()
    .setColor(`RANDOM`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`${emoji.muted} ${uye} Adlı üye ses kanallarında ${message.author} tarafından susturuldu.`)

    let cpuanlog = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(`${uye}: Aldığınız **Voice Mute** cezası ile **${cpuan || 0}** (\`+20\`) ceza puanına ulaştınız. (\`#${cezaID}\`)`)


    uye.voice.setMute(true);
    uye.roles.add(raviwen.Roller.VMuted)
    message.channel.send(vmute)
    client.channels.cache.get(raviwen.Log.CezaPuanLog).send(cpuanlog)

    setTimeout(async() => {
        let vmuteli = db.fetch(`vmuteli.${uye.id}.${message.guild.id}`)
        if(!vmuteli) return;
        if(vmuteli == 'vmuteli') {
            message.channel.send(`${emoji.unmuted} ${uye} Sesli kanallardan susturulması sona erdi. Üye tekrardan sohbete devam edebilir.`)
            await db.delete(`vmuteli.${uye.id}.${message.guild.id}`)
            await db.delete(`süre.${uye.id}.${message.author.id}`)
            await uye.roles.remove(raviwen.Roller.VMuted)
            if(cpuan > 250)return await uye.roles.set(raviwen.Roller.Jailed)
        }
    }, ms(zaman));
};
