const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ree',
            group: 'test',
            memberName: 'reply',
            description: 'Replies with a Message.',
            examples: ['reply']
        });
    }

    run(msg) {
        var arrivederci='reeeee';
        msg.say('Goodbye');
        msg.say(arrivederci);
        return msg.say('no one loves you');
    }
};