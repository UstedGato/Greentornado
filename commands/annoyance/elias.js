const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'elias',
            group: 'annoyance',
            memberName: 'elias',
            description: 'Punish Elias.',
            examples: ['reply'],
            args: [
				{
					key: 'length',
                    label: 'length',
                    prompt: 'ghjfghg',
                    type: 'string',
                    //default: ''
				}
			]
        });
    }

    run(msg, { length }) {
        var i;
        for (i = 0; i < length; i++) {
            msg.say("@SilvershotsHQ#9454");
            //msg.say("@SilvershotsHQ#9454");
        }
        return msg.say('SilvershotsHQ#9454');
    }
};
