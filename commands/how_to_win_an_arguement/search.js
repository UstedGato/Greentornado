const commando = require('discord.js-commando');

module.exports = class DankCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'search',
			group: 'how_to_win_an_arguement',
			memberName: 'search',
			description: 'Checks whether you are right.',

			args: [
				{
					key: 'search',
					label: 'dank',
					prompt: 'Say dank.',
					type: 'string'
				},
				{
					key: 'searcch',
					label: 'dank',
					prompt: 'Say dank.',
					type: 'string'
				}
			]
		});
	}

	run(msg, { search, searcch }) {
		msg.reply(search);
		return msg.reply(searcch);
	}
};
