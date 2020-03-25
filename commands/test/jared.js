const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'jared ',
            group: 'test',
            memberName: 'jared',
            description: 'Replies with a Message.',
            examples: ['jared 5m', 'jared 2sec'],
            args: [
                {
                    key: 'min',
                    prompt:"How would you like to puish jared, because we don't bully people here, so I am going to need the amount of time for the punishment.",
                    type: 'string'
                }
            ]
        });
    }

    run(msg, { min }) {
        return msg.say('!tempmute @TheDailyNightGuy#4005' + str(min));
    }
};
