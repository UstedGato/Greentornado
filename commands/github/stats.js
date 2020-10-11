import discord from "discord.js-commando";
const { Command } = discord;
export default (class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            group: 'github',
            memberName: 'stats',
            description: 'Get GitHub stats (broken)',
            examples: ['repeat'],
            userPermissions: ['MANAGE_MESSAGES'],
        });
    }
    async run(msg, { user }) {
        return msg.reply("This command will be fixed soon.");
        const embed = {
            "color": 1638182,
            "image": {
                "url": "https://github-readme-stats-umber.vercel.app/api?username=adoesgit&show_icons=true"
            }
        };
        return msg.reply({ embed });
    }
});
