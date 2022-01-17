const { MessageEmbed } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')
const emoji = require('../Src/Settings/Emoji.json')
const moment = require('moment')

module.exports.config = { 
    name: 'unban',
    aliases: ['bankaldır','ban-kaldır']
}

module.exports.raviwen = async(client, message, args, config) => {

    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.BanYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')

    let uye = args[0]
    let sebep = args.splice(1).join(' ');
    if(!uye) return message.channel.send(`Yanlış veya sunucumuzda banlı olmayan bir üye belirttiniz. (Sadece ID)`)
    if(!sebep) return message.channel.send(`Bir sebep belirtmen gerekiyor.`)
   message.guild.fetchBans().then(yasaklar => {
    if(yasaklar.size == 0) return message.channel.send(`Sunucuda banlı üye bulunmuyor.`)
    let yasakliuye = yasaklar.find(yasakli => yasakli.user.id == uye)
    if(!yasakliuye) return message.channel.send(`Üye sunucuda yasaklı değil.`)
})
    
    let atılmaay = moment(Date.now()).format("MM")
    let atılmagün = moment(Date.now()).format("DD")
    let atılmasaat = moment(Date.now()).format("HH:mm:ss")
    let banatılma = `\`${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}\``
    moment.locale("tr")

    const kaldırma = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor('RANDOM')
    .setDescription(`**${uye.username}** isimli üyenin yasağı, ${message.author} tarafından kaldırıldı.`)

    message.channel.send(kaldırma)
    message.guild.members.unban(uye)

};