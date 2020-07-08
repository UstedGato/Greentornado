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
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
          });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        var rows = await sheet.getRows();
        console.log(user);
        //var user = user.substring("<",">");
        //console.log(user);
        var mention = user;
        user = user.replace(/[\\<>@#&!]/g, "");
        console.log(user);
        user = user.replace(/\D/g,'');
        console.log(user);
        var i;
        nouser = false;
        if (user === "") {
            user = msg.author.id;
            nouser = true;
        }
        var rowy = 0;
        for (i = 0; i < rows.length; i++) {
            if (rows[i].id === user) {
                //var rownum = i;
                rowy = 1;
                break;
            }
        }
        if (rowy === 1) {
            rows[i].coins = parseInt(rows[i].coins) + 1;
            await rows[i].save();
        } else {
            await sheet.addRow({ id: user, coins: 1 });
        }
        rows = await sheet.getRows();
        //msg.reply(rows[i].id);
        if (nouser === true) {
            return msg.reply("you now now have " + rows[i].coins + " coin(s).");
        }
        else {
            return msg.reply(mention + " now has " + rows[i].coins + " coin(s).");
        }

        
    }
};
