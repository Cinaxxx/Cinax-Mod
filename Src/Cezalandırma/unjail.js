const { MessageEmbed } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')
const emoji = require('../Src/Settings/Emoji.json')
const db = require('quick.db')

module.exports.config = { 
    name: 'unjail',
    aliases: ['un-jail','cezakaldır']
}

module.exports.raviwen = async(client, message, args, config) => {

    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.jailYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send('Belirttiğiniz üyeyi bulamadım.')
    let sebep = args.splice(1).join(" ")
    if(!sebep) return message.channel.send('Bir sebep belirtmen gerekiyor.')
    if(uye.id === message.author.id) 
    return message.reply(`${emoji.Error} Kendi cezanı kaldıramazsın`)
    let cezalı = db.fetch(`cezalı.${uye.id}.${message.guild.id}`)
    if(cezalı == 'cezalı') {
    await db.delete(`cezalı.${uye.id}.${message.guild.id}`)
    await db.delete(`süre.${uye.id}.${message.guild.id}`)
    /*client.channels.cache.get(raviwen.Log.JailLog).send(`${uye} Kişisinin cezası ${message.author} Tarafından kaldırıldı.`)*/
    await uye.roles.remove(raviwen.Roller.Jailed)
    await uye.roles.add(raviwen.Roller.Member)

    const kaldırma = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor('RANDOM')
    .setDescription(`**${uye}** isimli üyenin jail cezası, ${message.author} tarafından kaldırıldı.`)

    message.channel.send(kaldırma)
    } else {
        message.channel.send('Kişinin jail cezası bulunmuyor.')
    }
};