const { Command } = require('discord.js-commando');
module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'guildsettings',
            group: 'settings',
            memberName: 'npm',
            description: 'opens guild settings.',
            examples: ['g!guildsettings']
        });
    }

    async run(msg){
        return msg.reply('<@373833473091436546> fix ur stupid settings already');
    }
};