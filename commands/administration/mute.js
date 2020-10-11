import discord from "discord.js-commando";
const { Command } = discord;
async function unmute(member, role, msg) {
    await member.roles.remove(role.id);
}
export default (class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'administration',
            memberName: 'mute',
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
        if (!msg.member.hasPermission("MANAGE_MESSAGES"))
            return msg.reply("You need to have the ``Manage Messages`` permission to use this command.");
        let role = msg.guild.roles.cache.find(role => role.name === "Muted");
        var member = msg.guild.member(msg.mentions.users.first() || msg.guild.members.cache.get(args[1]));
        await member.roles.add(role.id);
        const embed = {
            "color": 15350333,
            "author": {
                "name": "Mute",
                "icon_url": "https://raw.githubusercontent.com/thiagodroz/javascript30/master/02%20-%20JS%20and%20CSS%20Clock/images/baseline-volume_off-white-18/2x/baseline_volume_off_white_18dp.png"
            },
            "fields": [
                {
                    "name": "⠀",
                    "value": "Muted ${member.user} for ${amount} minutes."
                }
            ]
        };
        await msg.reply({ embed });
        setTimeout(unmute, amount * 60 * 1000, member, role, msg);
    }
});
