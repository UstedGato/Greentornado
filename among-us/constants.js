Skip to main content

    Playground
    TS Config
    Examples
    What's New 

    Browser Refresh Required
    Settings

    v4.0.2
    Run
    Export
    Share

    ⇥

26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
18
19
20
21
22
23
24
25
10
11
12
13
14
15
16
17
1
2
3
4
5
6
7
8
9

export declare const enum LobbyRegion {
    ASIA = "Asia",
    NORTH_AMERICA = "North America",
    EUROPE = "Europe"
}
export declare const enum SessionState {
    LOBBY = "lobby",
    PLAYING = "playing",
    DISCUSSING = "discussing"
}
export declare const SERVER_IPS: {
    Europe: string;
    "North America": string;
    Asia: string;
};
export declare const SHORT_REGION_NAMES: {
    Europe: string;
    "North America": string;
    Asia: string;
};
export declare const COLOR_EMOTES: {
    [key: number]: string;
};
export declare const DEAD_COLOR_EMOTES: {
    [key: number]: string;
};
export declare const BOT_INVITE_LINK = "https://discord.com/api/oauth2/authorize?client_id=755520374510321745&permissions=21261521&scope=bot";
export declare const COLOR_EMOTE_IDS: string[];
export declare const EMOTE_IDS_TO_COLOR: {
    [key: string]: number;
};
export declare const GROUPING_DISABLED_EMOJI = "<:impostor_grouping_disabled:761985590123954176>";
export declare const GROUPING_ENABLED_EMOJI = "<:impostor_grouping_enabled:761985589784215565>";
export declare const GROUPING_TOGGLE_EMOJI = "toggle_impostor_grouping:761987527493943326";
export declare const LEAVE_EMOJI = "leave_lobby:762751494495666207";