const { MessageEmbed } = require("discord.js")
const ravi = require('../Src/Settings/Cinax.json')

module.exports.config = { 
    name: 'sil',
    aliases: ['sil','temizle', 'clear']
};

module.exports.raviwen = async(client, message, args, config) => {

    if(![ravi.Yetkili.AbilityYT, ravi.Yetkili.Owner].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Gerekli yetkilere sahip değilsin.`)

    const embed = new MessageEmbed()

    if(!args[0] || (args[0] && isNaN(args[0]))) { return message.channel.send(embed.setDescription(`Hatalı , değer belirtmeyi unuttun. \`!sil <Sayı>\``)) }
    if(Number(args[0] > 100)) { return message.channel.send(embed.setDescription(`Hatalı , girdiğin değer 100'den büyük. \`!sil <Sayı>\``)) }
    if(Number(args[0] <= 1)) { return message.channel.send(embed.setDescription(`Hatalı , girdiğin değer 1'den küçük yada eşit. \`!sil <Sayı>\``)) }
        await message.delete().catch();
        message.channel.bulkDelete(Number(args[0])).then(mesaj => 
        message.channel.send(`${message.author} **${mesaj.size}** kadar mesaj sildi.`)).catch
}