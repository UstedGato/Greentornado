const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coin',
            group: 'coins',
            memberName: 'coin',
            description: 'Get virtual coins',
            examples: ['repeat'],
            userPermissions: ['MANAGE_MESSAGES']
        });
    }

    run(msg) {
        id = msg.author;
        return msg.reply(id);
        
        
    }
};
