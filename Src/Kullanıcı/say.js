const { MessageEmbed } = require('discord.js');
const raviwen = require('../Src/Settings/Cinax.json')



module.exports.config = { 
    name: 'say',
    aliases: ['sunucu-istatik']
}

module.exports.raviwen = async(client, message, args, config) => {

    const online = message.guild.members.cache.filter(r => r.presence.status != 'offline').size
    const toplam = message.guild.memberCount
    const ses = message.guild.channels.cache.filter(channel => channel.type == 'voice').map(channel => channel.members.size).reduce((a,b) => a + b)
    const booster = message.guild.roles.cache.get(raviwen.Roller.Booster).members.size

 message.channel.send(new MessageEmbed()
 .setColor('RANDOM')
 .setDescription(`
    \`˃\` Sunucumuz da toplam **${toplam}** üye bulunuyor. (**${online}** Aktif)
    \`˃\` Ses kanallarında **${ses}** üye sohbet ediyor.
    \`˃\` Boost basarak destek olan **${booster}** üye bulunuyor.
    `)
    
    )
};