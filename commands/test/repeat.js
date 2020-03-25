const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'repeat',
            group: 'test',
            memberName: 'repeat',
            description: 'Test it to find out.',
            examples: ['repeat']
        });
    }

    run(msg) {
        return msg.say('!g repeat');
    }
};
