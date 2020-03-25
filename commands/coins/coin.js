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
        user = this.client.member;
        user = user.toString();
        id = this.client.users.get(user).id;
        return msg.reply(id);
        
        
    }
};
