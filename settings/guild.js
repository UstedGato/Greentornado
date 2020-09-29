const isURL = require('is-url')
const faunadb = require('faunadb'),
  q = faunadb.query
// https://stackoverflow.com/a/36025616
function update (targetObject, obj) {
  Object.keys(obj).forEach(function (key) {

    // delete property if set to undefined or null
    if ( undefined === obj[key] || null === obj[key] ) {
      delete targetObject[key]
    }

    // property value is object, so recurse
    else if ( 
        'object' === typeof obj[key] 
        && !Array.isArray(obj[key]) 
    ) {

      // target property not object, overwrite with empty object
      if ( 
        !('object' === typeof targetObject[key] 
        && !Array.isArray(targetObject[key])) 
      ) {
        targetObject[key] = {}
      }

      // recurse
      update(targetObject[key], obj[key])
    }

    // set target property to update property
    else {
      targetObject[key] = obj[key]
    }
  })
}
async function getSettings(id, client) {
  let settings;
  try {
      settings = await client.query(
          q.Get(
              q.Match(
                  q.Index("guildIndex"),
                  id
              )
          )
      ) 
      } catch (error) {
          const settings = await client.query(
              q.Create(
                  q.Collection('guildSettings'),
                  { data: { id: id, background: "https://discordjs.guide/assets/img/8CQvVRV.cced9193.png", welcomeChannel: 0 } },
              )
              )
          return settings
      }
  return settings
}
async function writeSettings(ref, obj, client) {
  await client.query(
      q.Update(
        q.Ref(ref),
        { data: obj },
      )
    )
    return true
}
async function patchSettings(obj, fauna, guildId) {
  const {data, ref} = await getSettings(guildId, fauna)
  await update(data, obj)
  await writeSettings(ref, data, fauna)
  this.settings = data
  return true
}
module.exports = class GuildSettings {
  constructor(parent) {
    this.parent = parent;
  }
  async reload() {
    const {data} = await getSettings(this.parent.guildId, this.parent.fauna)
    this.settings = data
    let channel;
    try {
    const channelobj = await this.parent.client.channels.fetch(this.settings.welcomeChannel)
    channel = await channelobj.toString()
    } catch(e) {
      channel = 'None'
      console.log(e)
    }
    const embed = {
    "title": `${this.parent.message.guild.name}`,
    "description": "React with one of theese reactions to change its setting",
    "color": 9174784,
    "thumbnail": {
      "url": `${this.parent.message.guild.iconURL()}`
    },
    "image": {
      "url": `${this.settings.background}`
    },
    "author": {
      "name": "Guild Settings",
      "icon_url": "https://materialui.co/materialIcons/action/settings_black_192x192.png"
    },
    "fields": [
      {
        "name": "#⃣ - Welcome channel:",
        "value": `${channel}`
      },
      {
        "name": "🌃 - Welcome background:",
        "value": "\u200b" //zero width space, because discord
      }
    ]
  }

  await this.parent.message.edit(null, { embed: embed })
  }
  async init() {
  await this.reload()
  const filter = (reaction, user) => {
    return user.id === this.parent.triggerMessage.author.id;
  };
  this.reactions = []
  this.reactions.push(await this.parent.message.react('#⃣'))
  this.reactions.push(await this.parent.message.react('🌃'))
  this.collector = this.parent.message.createReactionCollector(filter);
  this.collector.on('collect', r => {
    if (r.emoji.name === '#⃣') {
        this.setWelcomeChannel()
    }
    if (r.emoji.name === '🌃') {
      this.setWelcomeImage()
    }
  });
  this.collector.on('end', collected => console.log(`Collected ${collected.size} items`));
  }
  async setWelcomeImage () {
    const filter = m => isURL(m.content);
    const collector = this.parent.message.channel.createMessageCollector(filter, { limit: 1 });
    const queryMessage = await this.parent.message.channel.send('Send the url to the image.')
    collector.on('collect', m => {
      console.log(`Collected ${m.content}`);
      this.parent.message.edit('<a:botloader:750419652256989331>', { embed: null })
      m.delete()
      queryMessage.delete()
      patchSettings({ background: m.content }, this.parent.fauna, this.parent.guildId)
      setTimeout(() => {
        this.reload()
      }, 2000);
    });
  }
  async setWelcomeChannel () {
    const filter = m => m.content.includes('<#');
    const collector = this.parent.message.channel.createMessageCollector(filter, { limit: 1 });
    const queryMessage = await this.parent.message.channel.send('Tag a channel.')
    collector.on('collect', m => {
      console.log(`Collected ${m.content}`);
      this.parent.message.edit('<a:botloader:750419652256989331>', { embed: null })
      m.delete()
      queryMessage.delete()
      const channel = m.content.substring(
        m.content.lastIndexOf("<#") + 2, 
        m.content.lastIndexOf(">")
      );
      console.log(channel)
      patchSettings({ welcomeChannel: channel }, this.parent.fauna, this.parent.guildId)
      setTimeout(() => {
        this.reload()
      }, 2000);
    });
  }
  async destroy() {
    await this.collector.stop()
    this.reactions.forEach(async(e) => await e.remove())
  }
};
