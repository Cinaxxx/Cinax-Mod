const { MessageEmbed } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')
const db = require('quick.db')


module.exports.config = { 
    name: 'stat',
    aliases: ['yetkili']
}

module.exports.raviwen = async(client, message, args, config) => {
    if(![raviwen.Yetkili.AbilityYT,raviwen.Yetkili.BanYT,raviwen.Yetkili.jailYT,raviwen.Yetkili.muteYT,raviwen.Yetkili.vmuteYT].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')

    let uye = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let toplam = db.get(`toplam.${message.author.id}`)
    let banlar = db.get(`banlar.${message.author.id}`)
    let jailler = db.get(`jail.${message.author.id}`)
    let cmuteler = db.get(`cmute.${message.author.id}`)
    let vmuteler = db.get(`vmute.${message.author.id}`)
    let vban = db.get(`vban.${message.author.id}`)
    let kick = db.get(`kick.${message.author.id}`)

    message.channel.send(new MessageEmbed()
    .setColor(`RANDOM`)
    .setDescription(`
    \`˃\` ${uye} Yetkilisi toplam **${toplam || 0}** ceza komudu kullanmış.

    \`˃\` Bunlardan **${banlar || 0}** tanesi Ban, **${kick || 0}** tanesi Kick,
    \`˃\` Bunlardan **${cmuteler || 0}** tanesi Chat Mute, **${vmuteler || 0}** tanesi Voice Mute.
    \`˃\` Bunlardan **${jailler || 0}** tanesi Jail.
    `))
};
