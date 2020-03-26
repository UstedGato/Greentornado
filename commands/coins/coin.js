const { Command } = require('discord.js-commando');
const { GoogleSpreadsheet } = require('google-spreadsheet');
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

    async run(msg) {
        const doc = new GoogleSpreadsheet(process.env.SHEET);
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
          });
        await doc.loadInfo();
        //const sheet = doc.sheetsByIndex[0];
        const sheet = await doc.addSheet({ headerValues: ['id', 'coins'] });

        var userid = msg.author.id;
        return msg.reply(userid);
        
        
    }
};
