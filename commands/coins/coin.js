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
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
				{
					key: 'user',
					label: 'user',
					prompt: 'No user was specified, defaulting to self',
                    type: 'string',
                    default: ''
				}
			]
        });
    }

    async run(msg, { user }) {
        const doc = new GoogleSpreadsheet(process.env.SHEET);
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
          });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        var rows = await sheet.getRows();
        console.log(user);
        //var userid = user.substring("<",">");
        //console.log(userid);
        user = userid.replace(/[\\<>@#&!]/g, "");
        console.log(userid);
        user = userid.replace(/\D/g,'');
        console.log(userid);
        var i;
        if (user === "") {
            user = msg.author.id;
        }
        for (i = 0; i < rows.length; i++) {
            if (rows[i].id === userid) {
                //var rownum = i;
                var rowy = 1;
                break;
            }
        }
        if (rowy === 1) {
            rows[i].coins = parseInt(rows[i].coins) + 1;
            await rows[i].save();
        } else {
            await sheet.addRow({ id: userid, coins: 1 });
        }
        rows = await sheet.getRows();
        //msg.reply(rows[i].id);
        return msg.reply("You now have " + rows[i].coins + " coin(s).");
        
    }
};
