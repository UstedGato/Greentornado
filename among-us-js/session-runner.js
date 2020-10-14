var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const child_process = require("child_process");
const debounce = require("lodash.debounce");
const path = require("path");
const { SERVER_IPS, SHORT_REGIION_NAMES, COLOR_EMOTES, DEAD_COLOR_EMOTES, COLOR_EMOTE_IDS, EMOTE_IDS_TO_COLOR, GROUPING_TOGGLE_EMOJI, GROUPING_DISABLED_EMOJI, GROUPING_ENABLED_EMOJI, LobbyRegion, SessionState, LEAVE_EMOJI } = require('./constants')
const AU_CLIENT_DIR = '/app/among-us/Client/bin'
const WORKING_DIR = path.resolve(AU_CLIENT_DIR);
const CLIENT = path.join(WORKING_DIR, process.platform === "win32" ? "client.exe" : "client");
/**
 * Class that handles all communication with the AU client in C#, using
 * JSON messages passed over the standard out to receive data from the client.
 */
class SessionRunner {
    constructor(bot, session, msg) {
        this.bot = bot;
        this.msg = msg;
        this.session = session;
        this.session.links = {};
        this.playerData = [];
        this.deadPlayers = new Set(); // clientIds of dead players
        this.mutedPlayers = new Set(); // snowflakes of muted players
        this.isConnected = false;
        this.isDestroyed = false;
        /**
         * Version of {@link updateMessage} that will debounce to ensure that
         * updates are not pushed too frequently.
         */
        this.debouncedUpdateMessage = debounce(() => this.updateMessage(), 200);
        /**
         * Receives and handles output from the client, parsing the result into
         * a JSON message and then dispatching the result of that message.
         */
        this.handleClientStdout = async (msg) => {
            if (this.isDestroyed)
                return;
            msg = msg.trim();
            if (!msg.length)
                return;
            const _a = JSON.parse(msg), { type } = _a, rest = __rest(_a, ["type"]);
            if (type === "connect") {
                await this.handleConnect();
            }
            if (type === "gameEnd") {
                console.log(`[+] Session ${this.session.id}: game ended`);
                await this.setStateTo("lobby" /* LOBBY */);
                await this.unmutePlayers();
                //await movePlayersToTalkingChannel(this.bot, this.session);
            }
            // if (type === "talkingStart") {
            //     console.log(`[+] Session ${this.session.id}: talking started`);
            //     await this.setStateTo("discussing" /* DISCUSSING */);
            //     await movePlayersToTalkingChannel(this.bot, this.session);
            // }
            // if (type === "talkingEnd") {
            //     console.log(`[+] Session ${this.session.id}: talking ended`);
            //     if (this.session.state === "lobby" /* LOBBY */) {
            //         // Don't transition until we have all the impostor information.
            //         return;
            //     }
            //     await this.setStateTo("playing" /* PLAYING */);
            //     await movePlayersToSilenceChannel(this.bot, this.session);
            // }
            if (type === "disconnect") {
                await this.handleDisconnect();
            }
            if (type === "gameData") {
                await this.handlePlayerDataUpdate(rest.data);
            }
            // if (type === "error") {
            //     await this.handleError(rest.message);
            // }
            // console.log(rest, type)
            // this.msg.channel.send(JSON.stringify(rest, null, 2) + type)
        };
    }
    /**
     * Starts this session, launching the client and attempting to connect to
     * the relevant lobby, as configured in the session.
     */
    async start() {
        this.message = await this.msg.channel.send('react with your crewmate to link')
        const guild = await this.bot.guilds.fetch(process.env.EMOTE_GUILD)
        COLOR_EMOTE_IDS.forEach(async (e) => {
            this.message.react(await guild.emojis.cache.get(e))
        })
        this.collector = this.message.createReactionCollector((_, u) => u.id !== this.bot.user.id);
        this.collector.on('collect', (r, u) => {this.handleEmojiSelection(r.emoji.id, u.id)})
        this.process = child_process.spawn(CLIENT, [SERVER_IPS[this.session.region], this.session.lobbyCode], {
            cwd: WORKING_DIR,
        });
        // Kill the process if it doesn't do anything after 30 seconds.
        setTimeout(() => {
            console.log(this.isConnected)
            if (this.isConnected || this.isDestroyed)
                return;
            this.process.kill("SIGTERM");
            this.handleError("It took too long to connect to the Among Us services. This is likely due to server load issues. Try again in a bit.");
        }, 30 * 1000);
        let buffered = "";
        this.process.stdout.setEncoding("utf-8");
        this.process.stdout.on("data", data => {
            for (const c of data) {
                buffered += c;
                if (c === "\n") {
                    this.handleClientStdout(buffered.trim());
                    buffered = "";
                }
            }
        });
        this.process.stdout.on("close", () => this.handleDisconnect());
        this.process.stderr.setEncoding("utf-8");
        this.process.stderr.on("data", console.log);
    }
    /**
     * Invoked by listeners when the user reacts to the message with the specified
     * emoji id. It is already verified that emojiId is a valid color reaction.
     */
    async handleEmojiSelection(emojiId, userId) {
        console.log('handling', emojiId, userId)
        if (this.isDestroyed)
            return;
        if (emojiId === GROUPING_TOGGLE_EMOJI.split(":")[1]) {
            await this.toggleImpostorGrouping(userId);
            return;
        }
        if (emojiId === LEAVE_EMOJI.split(":")[1]) {
            await this.leaveLobby(userId);
            return;
        }
        const selectedColor = EMOTE_IDS_TO_COLOR[emojiId];
        console.log(selectedColor)
        if (selectedColor === undefined)
            return;
        // await this.session.links.init();
        const relevantPlayer = this.playerData.find(x => x.color === selectedColor);
        console.log(relevantPlayer)
        if (!relevantPlayer)
            return;
        // Check if they had a different color selected, and remove if that was the case.
        const oldMatching = (this.session.links[relevantPlayer.clientId]);
        if (oldMatching) {
            this.session.links[oldMatching.clientId] = undefined;
        }
        // if the old matching had the same client id, this is a re-react to remove the link.
        // if they don't match, add the link
        if (!oldMatching || oldMatching.clientId !== "" + relevantPlayer.clientId) {
            this.session.links[relevantPlayer.clientId] = userId;
        }
        console.log(this.session.links)
        // await orm.em.flush();
        //await this.updateMessage();
        // If this user already died, retroactively apply the mute.
        if (this.deadPlayers.has(relevantPlayer.clientId)) {
            this.mutePlayer(relevantPlayer.clientId).catch(() => { });
        }
    }
    /**
     * @returns whether the specified clientid is an impostor
     */
    isImpostor(clientId) {
        return this.playerData.some(x => "" + x.clientId === clientId && (x.statusBitField & 2 /* IMPOSTOR */) !== 0);
    }
    /**
     * Handles the usage of the leave react by any user.
     */
    async leaveLobby(userId) {
        if (!this.isConnected || userId !== this.session.creator)
            return;
        this.process.kill("SIGINT"); // will trigger a disconnect
    }
    /**
     * Handles the usage of the toggle impostor grouping react by any user.
     */
    async toggleImpostorGrouping(userId) {
        if (userId !== this.session.creator || this.session.state !== SessionState.LOBBY) {
            return;
        }
        this.session.groupImpostors = !this.session.groupImpostors;
        // await orm.em.persistAndFlush(this.session);
        await this.updateMessage();
        console.log(`[+] Set impostor grouping to ${this.session.groupImpostors} for session ${this.session.id}`);
        // Create the impostor channel if needed.
        if (this.session.groupImpostors) {
            // await this.session.channels.init();
            // if (this.session.channels.getItems().some(x => x.type === SessionChannelType.IMPOSTORS))
            //     return;
            // const categoryChannel = this.session.channels.getItems().find(x => x.type === SessionChannelType.CATEGORY);
            // const impostorChannel = await this.bot.createChannel(this.session.guild, "Impostors", 2, {
            //     parentID: categoryChannel.channelId,
            //     permissionOverwrites: [
            //         {
            //             type: "role",
            //             id: this.session.guild,
            //             deny: eris.Constants.Permissions.readMessages,
            //             allow: 0,
            //         },
            //     ],
            // });
            // this.session.channels.add(new SessionChannel(impostorChannel.id, SessionChannelType.IMPOSTORS));
           // // await orm .em.persistAndFlush(this.session);
        }
    }
    /**
     * Invoked when the client disconnects, such as when the lobby closes.
     * Should handle removal of the session and channels.
     */
    async handleDisconnect() {
        if (!this.isConnected)
            return;
        this.isConnected = false;
        await this.collector.stop()
        console.log(`[+] Session ${this.session.id} disconnected from Among Us`);
        // // await this.session.channels.init();
        // for (const channel of this.session.channels) {
        //     await this.bot.deleteChannel(channel.channelId, "Among Us: Session is over.").catch(() => { });
        // }
        // await updateMessageWithSessionOver(this.bot, this.session);
        // // // await orm.em.removeAndFlush(this.session);
        sessions.delete(this.session.id);
        this.isDestroyed = true;
    }
    /**
     * Invoked when the client encounters an error during startup. This
     * does not need to handle removal of channels, as they aren't created
     * yet.
     */
    async handleError(error) {
        if (this.isDestroyed)
            return;
        console.log(`[+] Session ${this.session.id} encountered an error: '${error}'`);
        // await updateMessageWithError(this.bot, this.session, error);
        // // // await orm.em.removeAndFlush(this.session);
        this.isDestroyed = true;
        sessions.delete(this.session.id);
    }
    /**
     * Invoked when the client successfully joins the lobby indicated in the
     * current session. Creates the relevant voice channels and updates the state.
     */
    async handleConnect() {
        if (this.isConnected || this.isDestroyed)
            return;
        console.log(`[+] Session ${this.session.id} connected to lobby.`);
        // const category = await this.bot.createChannel(this.session.guild, "Among Us - " + SHORT_REGION_NAMES[this.session.region] + " - " + this.session.lobbyCode, 4, "Among Us: Create category for voice channels.");
        // this.session.channels.add(new SessionChannel(category.id, SessionChannelType.CATEGORY));
        // const talkingChannel = await this.bot.createChannel(this.session.guild, "Discussion", 2, {
        //     parentID: category.id,
        // });
        // const talkingInvite = await talkingChannel.createInvite({
        //     unique: true,
        // });
        // this.session.channels.add(new SessionChannel(talkingChannel.id, SessionChannelType.TALKING, talkingInvite.code));
        // const mutedChannel = await this.bot.createChannel(this.session.guild, "Muted", 2, {
        //     parentID: category.id,
        //     permissionOverwrites: [
        //         {
        //             type: "role",
        //             id: this.session.guild,
        //             deny: eris.Constants.Permissions.voiceSpeak,
        //             allow: 0,
        //         },
        //     ],
        // });
        // this.session.channels.add(new SessionChannel(mutedChannel.id, SessionChannelType.SILENCE));
        this.isConnected = true;
        // // // await orm.em.persistAndFlush(this.session);
        //await Promise.all([this.setStateTo("lobby" /* LOBBY */), addMessageReactions(this.bot, this.session)])
        await this.setStateTo("lobby" /* LOBBY */);
    }
    /**
     * Simple method that changes the current state of the lobby to the specified
     * state, then ensures that the chat message is updated to reflect this state.
     */
    async setStateTo(state) {
        if (this.isDestroyed)
            return;
        this.session.state = state;
        // // await orm.em.flush();
        //await this.updateMessage();
    }
    /**
     * Processes a game data update from the client, updating the message where
     * appropriate.
     */
    async handlePlayerDataUpdate(newData) {
        const oldByClientId = new Map(this.playerData.map(x => [x.clientId, x]));
        const newByClientId = new Map(newData.map(x => [x.clientId, x]));
        let shouldUpdateMessage = oldByClientId.size !== newByClientId.size;
        for (const [oldId, oldData] of oldByClientId) {
            const newData = newByClientId.get(oldId);
            if (!newData || oldData.name !== newData.name || oldData.color !== newData.color)
                shouldUpdateMessage = true;
        }
        //this.msg.channel.send(JSON.stringify(newByClientId, null, false))
        for (const [newId, newData] of newByClientId) {
            if ((newData.statusBitField & 4 /* DEAD */) !== 0 && !this.deadPlayers.has(newId)) {
                this.deadPlayers.add(newId);
                // this.msg.channel.send(newData.name + ' has died')
                this.mutePlayer(newId);
            }
        }
        this.playerData = newData;
        // if (shouldUpdateMessage && this.isConnected) {
        //     await this.debouncedUpdateMessage();
        // }
        // if we're in lobby but everyone has tasks now, we've started
        if (this.session.state === SessionState.LOBBY && !this.playerData.some(x => !x.tasks || !x.tasks.length)) {
            await this.setStateTo(SessionState.PLAYING);
            // await movePlayersToSilenceChannel(this.bot, this.session);
        }
    }
    /**
     * Updates the message for the current state of the lobby.
     */
    async updateMessage() {
        await updateMessage(this.bot, this.session, this.playerData);
    }
    /**
     * Mutes the specified player in the talking channel because they died,
     * if they had linked their among us character with their discord.
     */
    async mutePlayer(clientId) {
        // await this.session.links.init();
        // await this.session.channels.init();
        const link = this.session.links[clientId]
        console.log(link)
        //for (const link of links) {
            this.mutedPlayers.add(link);
            const user = await this.msg.guild.members.fetch(link)
            await user.voice.setChannel(process.env.DEAD_AMONG_CHANNEL)
            //await mutePlayerInChannels(this.bot, this.session, link.snowflake);
        //}
    }
    /**
     * Unmutes all players in the main channel that were previously muted.
     */
    async unmutePlayers() {
        const moveFrom = await this.msg.guild.channels.resolve(process.env.DEAD_AMONG_CHANNEL)
        await Promise.all(moveFrom.members.map(x => {
            if (x.id != '754855423781109921') {
                x.voice.setChannel(process.env.ALIVE_AMONG_CHANNEL);
            }
        }))
        this.mutedPlayers.clear();
    }
}
const sessions = new Map();
/**
 * Returns the current session runner for the specified session, or null
 * if it does not exist.
 */
function getRunnerForSession(session) {
    return sessions.get(session.id) || null;
}
/**
 * Creates a new client instance for the specified AmongUsSession, causing
 * it to connect to the lobby and handle events. This method should never
 * directly throw.
 */
module.exports = async function startSession(bot, session, msg) {
    const runner = new SessionRunner(bot, session, msg);
    sessions.set(session.id, runner);
    await runner.start();
    return runner
}