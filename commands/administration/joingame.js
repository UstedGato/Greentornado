const { Command } = require('discord.js-commando');
module.exports = class ReplyCommand extends Command {
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
};
