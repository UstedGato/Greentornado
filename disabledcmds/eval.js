const { Command } = require('discord.js-commando');
function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { return eval(js); }.call(context);
}
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            group: 'administration',
            memberName: 'eval',
            description: 'eval (owners only)',
            examples: ['g!purge 20', 'g!purge 20 @GreenTornado']
        });
    }

    async run(msg) {
        if (!this.client.options.owner.includes(msg.member.id)) return msg.channel.send("\`\`\`js\nnice try.\n\`\`\`");
        const cmd = msg.content.substring(
            msg.content.lastIndexOf("\`\`\`js") + 5, 
            msg.content.lastIndexOf("\`\`\`")
        );
        try{
        let thing = await evalInContext(cmd, this)
        try {
            const thingjson = JSON.stringify(this)
            thing = thingjson
        } catch(e) {
            thing = thing
        }
        return await msg.channel.send(`\`\`\`js
${thing.toString()}
\`\`\``)
        } catch(error) {
            await msg.channel.send(`Error in \`\`eval\`\`:\`\`\`js
${error}
\`\`\``)

    };
    }
};
