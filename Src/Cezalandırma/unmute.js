const { MessageEmbed } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')
const emoji = require('../Src/Settings/Emoji.json')
const db = require('quick.db')

module.exports.config = { 
    name: 'unmute',
    aliases: ['umute','mute-kaldır']
}

module.exports.raviwen = async(client, message, args, config) => {

    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.muteYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send('Belirttiğiniz üyeyi bulamadım.')
    let sebep = args.splice(1).join(" ")
    if(!sebep) return message.channel.send('Bir sebep belirtmen gerekiyor.')
    if(uye.id === message.author.id) 
    return message.reply(`${emoji.Error} Kendi cezanı kaldıramazsın!`)
    let muteli = db.fetch(`muteli.${uye.id}.${message.guild.id}`)
    if(muteli == 'muteli'){
    await db.delete(`muteli.${uye.id}.${message.guild.id}`)
    await db.delete(`süre.${uye.id}.${message.author.id}`)
    await uye.roles.remove(raviwen.Roller.Muted)

    const kaldırma = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor('RANDOM')
    .setDescription(`${emoji.unmuted} **${uye}** isimli üyenin susturulması, ${message.author} tarafından kaldırıldı.`)

    message.channel.send(kaldırma)
     } else {
        message.channel.send('Kişinin chat mutesi bulunmuyor.')
     }
};