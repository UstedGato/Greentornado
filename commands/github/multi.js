const { Command } = require('discord.js-commando');
const embed = new Discord.MessageEmbed()
	.setTitle('Some Title')
	.setColor('#0099ff');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'multi',
            group: 'github',
            memberName: 'multi',
            description: 'Check your coins.',
            examples: ['repeat'],
        });
    }

    async run(msg, { user }){
        msg.channel.createWebhook('GreenTornado', {
            avatar: 'https://cdn.discordapp.com/avatars/692143848176222360/a94c732b92ef1dcc206216a1d08cae7b.png?size=2048',
        }).then(webhook => console.log(`Created webhook ${webhook}`));
        console.log(webhook)
        await webhook.send('Webhook test', {
            embeds: [embed],
        });
        webhook.delete("AutoHook");
    }
};