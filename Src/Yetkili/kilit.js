const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
module.exports.config = { 
    name: 'kilitle',
    aliases: ['kanal-kilitle', 'kilit']
}

module.exports.raviwen = async(client, message, args, config) => {

    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Gerekli yetkilere sahip değilsin.')

    if(db.get(`kilitli`)){
        message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: true });
        message.channel.send(`Kanalın kilidi açıldı.`)
        db.delete(`kilitli`)
    } else {
        message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
        message.channel.send(`Kanal kilitlendi.`)
        db.set(`kilitli`, true)
    }
};