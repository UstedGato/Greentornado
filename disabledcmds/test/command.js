import discord from "discord.js-commando";
const { Command } = discord;
export default (class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ree',
            group: 'test',
            memberName: 'rep',
            description: 'Replies with a Message.',
            examples: ['reply']
        });
    }
    run(msg) {
        var arrivederci = 'reeeee';
        msg.say('Goodbye');
        msg.say(arrivederci);
        return msg.say('no one loves you');
    }
});
