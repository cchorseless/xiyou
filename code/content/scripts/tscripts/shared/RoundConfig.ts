export module RoundConfig {
    export enum EERoundType {
        board = "board",
        basic = "basic",
        gold = "gold",
        boss = "boss",
        candy_boss = "candy_boss",
        endless = "endless",
        challenge = "challenge",
        challenge_star_card = "challenge_star_card",
        challenge_wood = "_wood",
        challenge_gold = "_gold",
        challenge_equip = "_equip",
        challenge_artifact = "_artifact",
    }

    export enum ERoundBoardState {
        start,
        battle,
        prize,
        waiting_next,
        end,

    }
    export enum Event {
        roundboard_onstart = "roundboard_onstart",
        roundboard_onbattle = "roundboard_onbattle",
        roundboard_onprize = "roundboard_onprize",
        roundboard_onwaitingend = "roundboard_onwaitingend",
        roundboard_challenge_onstart = "roundboard_challenge_onstart",

    }
}
