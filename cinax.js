const Discord = require('discord.js')
const client = new Discord.Client({ fetchAllMembers: true })
const fs = require('fs')
const Main = require('./Src/Settings/Main.json')
const raviwen = require('./Src/Settings/Cinax.json')
const ms = require('ms')
const db = require('quick.db')

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Set();

client.on('ready', async () => {
    client.user.setActivity(`${Main.Status}`, { type: 'PLAYING'})
    .then(console.log(`${client.user.tag}`))
    .catch(() => console.log(`Bir hata oluştu`))
})

//--------------------------------------------------------------------------------------//

fs.readdir('./Src/Cezalandırma', (err, files) => { 
  files.forEach(fs => { 
  let command = require(`./Commands/Cezalandırma/${fs}`); 
  client.commands.set(command.config.name, command);
  if(command.config.aliases) command.config.aliases.forEach(Aliases => client.aliases.set(Aliases, command.config.name));
  });
});

fs.readdir('./Src/Yetkili', (err, files) => { 
  files.forEach(fs => { 
  let command = require(`./Commands/Yetkili/${fs}`); 
  client.commands.set(command.config.name, command);
  if(command.config.aliases) command.config.aliases.forEach(Aliases => client.aliases.set(Aliases, command.config.name));
  });
});

fs.readdir('./Src/Kullanıcı', (err, files) => { 
  files.forEach(fs => { 
  let command = require(`./Commands/Kullanıcı/${fs}`); 
  client.commands.set(command.config.name, command);
  if(command.config.aliases) command.config.aliases.forEach(Aliases => client.aliases.set(Aliases, command.config.name));
  });
});

//--------------------------------------------------------------------------------------//

client.on('message', async message => {
    if (!message.guild || message.author.bot || message.channel.type === 'dm') return;
    let prefix = Main.Prefix.filter(p => message.content.startsWith(p))[0]; 
    if (!prefix) return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(prefix.length); 
    let load = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    
    if (load){
     if (!message.member.hasPermission(8) && client.cooldown.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription('**1** Saniyede bir komut kullanabilirsin.').setFooter(Main.Footer).setColor('RANDOM').setTimestamp());
      client.cooldown.add(message.author.id);
      setTimeout(() => client.cooldown.delete(message.author.id), 1000);
      load.raviwen(client, message, args);
    };
  });

//--------------------------------------------------------------------------------------//


// Mute
client.on('guildMemberAdd', async (member) => {
  let muteli = db.fetch(`muteli.${member.id}.${member.guild.id}`)
  let zaman =  db.fetch(`süre.${member.id}.${member.guild.id}`)
  if(!muteli) return;
  if(muteli == 'muteli'){
    member.roles.add(raviwen.Roller.Muted)
    client.channels.cache.get(raviwen.Kanallar.YeniÜye).send(`${member} Sunucumuza giriş yaptı. Cezalıyken çıkış yaptığı için tekrardan cezasını verdim.`)
 
    setTimeout(async () => {
      client.channels.cache.get(raviwen.Kanallar.ChatChannel).send(`${member} Sunucuda ki **Chat Mute**  cezası bitti.`)
      await db.delete(`muteli.${member.id}.${member.guild.id}`)
      await db.delete(`süre.${member.id}.${message.author.id}`)
      await member.roles.remove(raviwen.Roller.Muted)
    }, ms(zaman));
}})
// Jail
client.on('guildMemberAdd', async (member) => {
  let cezali = db.fetch(`cezalı.${member.id}.${member.guild.id}`)
  let zaman = db.fetch(`süre.${member.id}.${member.guild.id}`)
  if(!cezali) return;
  if(cezali == 'cezalı'){
    member.roles.cache.has(raviwen.Roller.Booster) ? member.roles.set([raviwen.Roller.Booster, raviwen.Roller.Jailed]) : member.roles.set([raviwen.Roller.Jailed])
    client.channels.cache.get(raviwen.Kanallar.CezaUyarı).send(`${member} Sunucumuza giriş yaptı. Cezalıyken çıkış yaptığı için tekrardan cezasını verdim.`)
    await member.roles.remove(raviwen.Roller.Member)

    setTimeout(async () => {
      client.channels.cache.get(raviwen.Kanallar.ChatChannel).send(`${member} Sunucuda ki **Jail** cezası bitti.`)
      await db.delete(`cezalı.${member.id}.${message.guild.id}`)
      await db.delete(`süre.${member.id}.${message.author.id}`)
      await member.roles.remove(raviwen.Roller.Jailed)
      await member.roles.add(raviwen.Roller.Member)
    }, ms(zaman));
}})
// VMute
client.on('guildMemberAdd', async (member) => {
  let vmuteli = db.fetch(`vmuteli.${member.id}.${member.guild.id}`)
  let zaman = db.fetch(`süre.${member.id}.${member.guild.id}`)
  if(!vmuteli) return;
  if(vmuteli == 'vmuteli'){
    client.channels.cache.get(raviwen.Kanallar.CezaUyarı).send(`${member} Sunucumuza giriş yaptı. Datasında kayıtlı ceza bulunduğu için bulunan cezayı tekrardan işledim.`)
    await member.roles.add(raviwen.Roller.VMuted)

    setTimeout(async () => {
      client.channels.cache.get(raviwen.Kanallar.ChatChannel).send(`${member} Sunucuda ki **Voice Mute** cezası bitti.`)
      await db.delete(`vmuteli.${member.id}.${member.guild.id}`)
      await db.delete(`süre.${member.id}.${member.author.id}`)
      await member.voice.setMute(true);
    }, ms(zaman));
}})

//--------------------------------------------------------------------------------------//

client.login(Main.Token).catch(() => console.log('Discord APİ bağlantasını kuramadım. Tokeni kontrol ediniz.'))

//--------------------------------------------------------------------------------------//

client.on("guildMemberAdd", member => {  
  require("moment-duration-format");

const moment = require("moment")
moment.locale("tr")

moment().format("LLL")

  const kanal = member.guild.channels.cache.get(raviwen.Kanallar.YeniÜye)
  const embed = new Discord.MessageEmbed()
.setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic:true}))
.setThumbnail(message.guild.displayAvatarURL({dynamic:true}))
.setDescription(`Seni aramızda görmekten mutluluk duyuyoruz! Başlangıç için birkaç tavsiye:

<#${raviwen.Kanallar.Kurallar}> Kanalından kurallarımızı öğrenebilirsiniz,
<#${raviwen.Kanallar.ChatChannel}> Kanalımızda diyer insanlar ile sohbet edebilirsiniz.`)
.setColor("RANDOM")
.setFooter(`Oluşturulma: ${moment().format("LLL")}`);
kanal.send(`Sunucumuza Hoşgeldin ${member}!`)
kanal.send(embed)
})

//--------------------------------------------------------------------------------------//
