const { MessageEmbed } = require('discord.js');
const db = require('quick.db')

module.exports.config = { 
    name: 'c-info',
    aliases: ['ceza','info']
}

module.exports.raviwen = async(client, message, args, config) => {
    let cezaID = db.get(`cezaid.${message.guild.id}`)
    let embed = new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic:true})).setColor('RANDOM').setTimestamp()
    let ID = Number(args[0])
    if(!ID) return message.channel.send(embed.setDescription('Geçerli bir numara belirtmen gerekiyor.'))
    let cezainfo = db.fetch(`moderasyon.${cezaID}.${message.guild.id}`)
    if(!cezainfo) return message.channel.send(embed.setDescription(`Belirtilen ID ile ceza bulunmuyor. \`!#${ID}\``))
    
    let ceza = new MessageEmbed()
    .setColor('RANDOM')
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setDescription(`
    **#${ID}** ID'li ceza numarasının bilgileri;

    **» Ceza Numarası:** \`#${ID}\`
    **» Ceza Tipi:** \`${cezainfo.Komut}\`
    **» Ceza Uygulayan:** <@${cezainfo.Yetkili}> (\`${cezainfo.Yetkili}\`)
    **» Ceza Alan:** <@${cezainfo.Cezalı}> (\`${cezainfo.Cezalı}\`)
    **» Ceza Sebebi:** \`${cezainfo.Sebep}\`
    **» Ceza Zamanı:** \`${cezainfo.Sebep}\`
    **» Ceza Puanı:** \`${cezainfo.Puan}\`
    **» Ceza Süresi:** \`${cezainfo.Süre}\`
    `)
    message.channel.send(ceza)
};