const { MessageEmbed } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')
const emoji = require('../Src/Settings/Emoji.json')
const moment = require('moment')
const db = require('quick.db')


module.exports.config = { 
    name: 'ban',
    aliases: ['yasakla', 'ultramegasüperdüberban', 'amınakorum', 'yargı', 'force', 'sg']
}

module.exports.raviwen = async(client, message, args, config) => {
    
    
    //
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.BanYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send('Belirttilen üyeyi bulamadım.')
    let sebep = args.splice(1).join(" ")
    if(!sebep) return message.channel.send('Bir sebep belirtmen gerekiyor.')
    if (message.guild.members.cache.has(uye.id) && message.member.roles.highest.position <= message.guild.members.cache.get(uye.id).roles.highest.position) return message.channel.send("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
    if(uye.id === message.author.id) 
    return message.reply(`${emoji.Error} Kendini banlayamazsın`)

    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let banatılma = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    moment.locale("tr")

    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezapuan.${uye.id}.${message.guild.id}`, +300);
    let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`);
    db.add(`cezaid.${message.guild.id}`, +1);
    db.push(`moderasyon.${uye.id}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID,Komut: 'Ban',Puan: '+300', Tarih: banatılma, Sebep: sebep, Süre: 'BAN'})
    db.set(`moderasyon.${cezaID}.${message.guild.id}`, { Yetkili: message.author.id,Cezalı: uye.id ,ID: cezaID,Komut: 'Ban',Puan: '+300', Tarih: banatılma, Sebep: sebep, Süre: 'BAN'})

    db.add(`banlar.${message.author.id}`, +1)
    db.add(`toplam.${message.author.id}`, +1)

    const ban = new MessageEmbed()
    .setColor('RANDOM')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`${emoji.banhammer} ${uye} Adlı üye sunucudan ${message.author} tarafından yasaklandı.`)

    const cpuanlog = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(`${uye}: Aldığınız **Ban** cezası ile **${cpuan || 0}** (\`+300\`) ceza puanına ulaştınız. (\`#${cezaID}\`)`)
    message.channel.send(ban)
    client.channels.cache.get(raviwen.Log.CezaPuanLog).send(cpuanlog)
    uye.ban({ reason: `Sebep: ${sebep || Belirtilmedi} (#${cezaID})`})
    
};
