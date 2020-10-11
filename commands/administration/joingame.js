import discord from "discord.js-commando";
const { Command } = discord;
export default (class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'joingame',
            group: 'administration',
            memberName: 'joingame',
            description: 'Bridge the 2 among us channels.',
            examples: ['g!joingame'],
            userPermissions: ['ADMINISTRATOR']
        });
    }
    async run(msg, { amount, user }) {
    }
});
