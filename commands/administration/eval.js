const { Command } = require('discord.js-commando');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            group: 'administration',
            memberName: 'eval',
            description: 'eval (owners only)',
            examples: ['g!purge 20', 'g!purge 20 @GreenTornado']
        });
        this.client = client
    }

    async run(msg) {
        if (!this.client.owner.includes(msg.member.id)) return msg.channel.send("\`\`\`js\nnice try.\n\`\`\`");
        const cmd = msg.content.substring(
            msg.content.lastIndexOf("\`\`\`js") + 1, 
            msg.content.lastIndexOf("\`\`\`")
        );
        await msg.channel.send(`\`\`\`js\n${eval(cmd)}\n\`\`\``)
    }
};
