const commando = require('discord.js-commando');
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
module.exports = class SplitCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'split',
      group: 'util',
      memberName: 'split',
      description: 'Sends split messages with a specific total length.',
      details: 'This command is for testing split messages. The length must be at least 1.',
      examples: ['split 3000'],

      args: [
        {
          key: 'length',
          prompt: 'How many characters long would you like the message to be?',
          type: 'integer',
          //validate: val => parseInt(val) >= 1
        }
      ]
    });
  }

  run(msg, { length }) {
    let content = '';
    var i;
    for (i = 1; i < length; i++);{
    msg.reply("hi");
    sleep(1000);
  }
  return msg.reply('hi');
}
};
