export module DrawConfig {
    /**抽卡类型 对应poolgroupid */
    export enum EDrawCardType {
        RoundStart,
        DrawCardV1 = 10001,
        DrawCardV2 = 10002,
        DrawCardV3 = 10003,
    }

    export enum EProtocol {
        DrawCardResult = "DrawCardResult",
        CardSelected = "CardSelected",
        RedrawStartCard = "RedrawStartCard",
        StartCardSelected = "StartCardSelected",
        SelectCard2Public = "SelectCard2Public",
        Add2WishList = "Add2WishList",
        RemoveWishList = "RemoveWishList",
        ToggleWishList = "ToggleWishList",
    }
    export namespace I {
        export interface ICardSelected {
            index: number;
            itemName: string;
            b2Public: number;
        }
    }
}
