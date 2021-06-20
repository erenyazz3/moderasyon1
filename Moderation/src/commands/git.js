const { MessageEmbed } = require('discord.js')
const config = require("../settings/config.json");
module.exports = {
conf: {
aliases: ["cek","gel","getir"],
name: "çek",
},
run: async (client, message, args) => {
const embed = new MessageEmbed().setFooter(`${config.embed.footer}`)
let jyros = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!jyros) return message.channel.send(embed.setColor(`${config.embed.color.red}`).setDescription("Ses odasına gidilecek üyeyi belirtmelisin!")).then(x => x.delete({timeout: 5000}));
if (!message.member.voice.channel || !jyros.voice.channel || message.member.voice.channelID == jyros.voice.channelID) return message.channel.send(embed.setColor(`${config.embed.color.red}`).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setDescription("Belirtilen üyenin ve kendinin ses kanalında olduğundan emin ol!")).then(x => x.delete({timeout: 5000}));
const reactionFilter = (reaction, jyros) => {
return ['✅'].includes(reaction.emoji.name) && jyros.id === jyros.id;
};
message.channel.send(`${jyros}`, {embed: embed.setColor(`${config.embed.color.white}`).setAuthor(jyros.displayName, jyros.user.avatarURL({dynamic: true, size: 2048})).setDescription(`${message.author} senin bulunduğun ses odasına girmek için izin istiyor, eğerki onaylamıyorsan bişey yapmana gerek yok.`)}).then(async msj => { await msj.react('✅');
msj.awaitReactions(reactionFilter, {max: 1, time: 15000, error: ['time']}).then(c => {
let cevap = c.first();
if (cevap) {
message.member.voice.setChannel(jyros.voice.channelID);
msj.delete();
return message.channel.send("İşlem onaylandı.")
}})});
}}