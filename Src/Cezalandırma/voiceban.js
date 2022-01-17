const { MessageEmbed } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')
const emoji = require('../Src/Settings/Emoji.json')
const moment = require('moment')
const db = require('quick.db')

module.exports.config = { 
    name: 'voiceban',
    aliases: ['vban']
}

module.exports.raviwen = async(client, message, args, config) => {
    
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.muteYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send('Belirttiğiniz üyeyi bulamadım.')
    let sebep = args.splice(1).join(" ")
    if(!sebep) return message.channel.send('Bir sebep belirtmen gerekiyor.')
    if (message.guild.members.cache.has(uye.id) && message.member.roles.highest.position <= message.guild.members.cache.get(uye.id).roles.highest.position) return message.channel.send("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
    if(uye.id === message.author.id) 
    return message.reply(`${emoji.Error} Kendini susturamazsın!`)
    if(uye.roles.cache.has(raviwen.Roller.Muted)) {
        return message.channel.send(`Belirlediğin kullanıcı zaten ceza almış.`)
    }
    
    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let vbanatılma = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    moment.locale("tr")

    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezapuan.${uye.id}.${message.guild.id}`, +30);
    let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`);
    db.add(`cezaid.${message.guild.id}`, +1);
    db.push(`moderasyon.${uye.id}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID, Komut: 'Voice Ban',Puan: '+30', Tarih: vbanatılma, Sebep: sebep})
    db.set(`moderasyon.${cezaID}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID, Komut: 'Voice Ban',Puan: '+30', Tarih: vbanatılma, Sebep: sebep})
    db.set(`vbanlı.${uye.id}.${message.guild.id}`, 'vbanlı')
    db.add(`vban.${message.author.id}`, +1)
    db.add(`toplam.${message.author.id}`, +1)

    let vban = new MessageEmbed()
    .setColor(`RANDOM`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`${emoji.fmute} ${uye} Adlı üye ses kanallarında ${message.author} tarafından yasaklandı.`)

    let cpuanlog = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(`${uye}: Aldığınız **Ban** cezası ile **${cpuan || 0}** (\`+30\`) ceza puanına ulaştınız. (\`#${cezaID}\`)`)

    uye.roles.add(raviwen.Roller.VoiceBan)
    message.guild.members.cache.get(uye.id).voice.setChannel(null)
    message.channel.send(vban)
    client.channels.cache.get(raviwen.Log.CezaPuanLog).send(cpuanlog)
};
