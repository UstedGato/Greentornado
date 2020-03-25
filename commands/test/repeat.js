const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'repeat',
            group: 'test',
            memberName: 'repeat',
            description: 'Repeats the same command over and over.',
            examples: ['repeat']
        });
    }

    run(msg) {
        return msg.say('g! repeat');
    }
};
