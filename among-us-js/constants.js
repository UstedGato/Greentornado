module.exports.LobbyRegion = {
    ASIA : "Asia",
    NORTH_AMERICA: "North America",
    EUROPE: "Europe",
}
module.exports.SessionState = {
    LOBBY: "lobby",
    PLAYING: "playing",
    DISCUSSING: "discussing",
}
module.exports.REGIONS = {
    ["EU" /* EUROPE */]: "Europe",
    ["NA" /* NORTH_AMERICA */]: "North America",
    ["AS" /* ASIA */]: "Asia",
};
module.exports.SERVER_IPS = {
    ["Europe" /* EUROPE */]: "172.105.251.170",
    ["North America" /* NORTH_AMERICA */]: "198.58.99.71",
    ["Asia" /* ASIA */]: "139.162.111.196",
};
module.exports.SHORT_REGION_NAMES = {
    ["Europe" /* EUROPE */]: "EU",
    ["North America" /* NORTH_AMERICA */]: "NA",
    ["Asia" /* ASIA */]: "AS",
};
module.exports.COLOR_EMOTES = {
    [0]: "crewmate_red:765312683222237204",
    [1]: "crewmate_blue:765312683212800100",
    [2]: "crewmate_green:765312683267457024",
    [3]: "crewmate_pink:765312683213193266",
    [4]: "crewmate_orange:765312683237965824",
    [5]: "crewmate_yellow:765312683175051336",
    [6]: "crewmate_black:765312683276107806",
    [7]: "crewmate_white:765312683293278299",
    [8]: "crewmate_purple:765312682819190807",
    [9]: "crewmate_brown:765312683405737984",
    [10]: "crewmate_cyan:765312682919985204",
    [11]: "crewmate_lime:765312683339415602",
};
module.exports.DEAD_COLOR_EMOTES = {
    [0]: "crewmate_red_dead:761987905370980372",
    [1]: "crewmate_blue_dead:761987905375174676",
    [2]: "crewmate_green_dead:761987905358397470",
    [3]: "crewmate_pink_dead:761987905363116052",
    [4]: "crewmate_orange_dead:761987905392345098",
    [5]: "crewmate_yellow_dead:761987905391951923",
    [6]: "crewmate_black_dead:761987905362984970",
    [7]: "crewmate_white_dead:761987905082097705",
    [8]: "crewmate_purple_dead:761987905244889119",
    [9]: "crewmate_brown_dead:761987905500610628",
    [10]: "crewmate_cyan_dead:761987905459322901",
    [11]: "crewmate_lime_dead:761987905064402985",
};
module.exports.BOT_INVITE_LINK = "https://discord.com/api/oauth2/authorize?client_id=755520374510321745&permissions=21261521&scope=bot";
module.exports.COLOR_EMOTE_IDS = Object.values(module.exports.COLOR_EMOTES).map(x => x.split(":")[1]);
module.exports.EMOTE_IDS_TO_COLOR = {};
Object.entries(module.exports.COLOR_EMOTES).forEach(x => (module.exports.EMOTE_IDS_TO_COLOR[x[1].split(":")[1]] = +x[0]));
module.exports.GROUPING_DISABLED_EMOJI = "<:impostor_grouping_disabled:761985590123954176>";
module.exports.GROUPING_ENABLED_EMOJI = "<:impostor_grouping_enabled:761985589784215565>";
module.exports.GROUPING_TOGGLE_EMOJI = "toggle_impostor_grouping:761987527493943326";
module.exports.LEAVE_EMOJI = "leave_lobby:762751494495666207";
