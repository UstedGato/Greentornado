const GuildSettings = require('./guild')
const pages = []
pages.push(GuildSettings)

module.exports = {
    getPages: function() {
        return pages
    }
};
