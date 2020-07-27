exports.welcomeAUser = function (member) {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === 'bot-spam');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  const embed = {
    "color": 1817448,
    "timestamp": `${Date.now()}`,
    "thumbnail": {
      "url": "https://f000.backblazeb2.com/file/AAGaming-Public/ShareX/2020/07/1f389.png"
    },
    "image": {
      "url": `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`
    },
    "fields" : [
        {
            "name": `** **`,
            "value": `**Welcome to the server, ${member} !**`
        }
    ]
  };
  console.log(member.id + "and" + member.user.avatar);
  channel.send({ embed });
}; 