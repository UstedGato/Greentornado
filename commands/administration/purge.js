const { Command } = require('discord.js-commando');
const { GoogleSpreadsheet } = require('google-spreadsheet');
async function unmute(msg, member, role) {
    await member.roles.remove(role.id);
    await msg.channel.send(`${member.user}` + ' has now been unmuted.')
}
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'administration',
            memberName: 'purge',
            description: 'Mute a user(in minutes).',
            examples: ['g!mute @bad 5'],
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
					key: 'user',
					label: 'user',
					prompt: 'No user was specified, defaulting to all',
                    type: 'string',
                    default: false
				},
				{
					key: 'time',
					label: 'time',
					prompt: 'Specify how many minutes.',
                    type: 'integer'
                }
			]
        });
    }

    async run(msg, { amount, user }) {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("You need to have the ``Manage Messages`` permission to use this command.");
        let role = msg.guild.roles.cache.find(role => role.name === "Muted");
        var member  = msg.guild.member(msg.mentions.users.first() || msg.guild.members.cache.get(args[1]));
        await member.roles.add(role.id);
        await msg.reply('muted');
        setTimeout(unmute, amount * 60 * 1000, member, role, msg);
    }
};
