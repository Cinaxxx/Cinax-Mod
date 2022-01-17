const raviwen = require('../Src/Settings/Cinax.json')
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

module.exports.config = { 
    name: 'kes',
    aliases: ['bağlantı-kes']
}

module.exports.raviwen = async(client, message, args, config) => {
        if(!message.member.roles.cache.has(raviwen.Yetkili.transportYT) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!member) return this.client.yolla("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)
        if (!member.voice.channel) return this.client.yolla("Bağlantısını kesmek istediğin kişi bir ses kanalına bağlı değil.", message.author, message.channel)
        if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) return this.client.yolla("Rolleri senden yüksek birinin bağlantısını kesemezsin.", message.author, message.channel)
        await this.client.yolla(" <@" + member.id + "> başarıyla " + member.voice.channel.name + " kanalından çıkarıldı.", message.author, message.channel)
        member.voice.kick()
    }