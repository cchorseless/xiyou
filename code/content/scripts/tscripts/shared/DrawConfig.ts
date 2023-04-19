export module DrawConfig {
    /**心愿清单 */
    export const iWashCardMax = 5;


    /**抽卡类型 对应poolgroupid */
    export enum EDrawCardType {
        RoundStart,
        DrawCardV1 = 10000,
        DrawCardV2 = 10001,
        DrawCardV3 = 10002,
    }

    export enum EProtocol {
        DrawCardResult = "DrawCardResult",
        LockSelectedCard = "LockSelectedCard",
        CardSelected = "CardSelected",
        RedrawStartCard = "RedrawStartCard",
        StartCardSelected = "StartCardSelected",
        SelectCard2Public = "SelectCard2Public",
        Add2WishList = "Add2WishList",
    }
}


declare global {
    namespace IDrawConfig {
        interface ICardSelected {
            index: number;
            itemName: string;
            b2Public: 0 | 1;
        }
        interface ICardLocked {
            index: number;
            itemName: string;
            block: 0 | 1;
        }
        interface ICardWanted {
            itemName: string;
            isadd: 0 | 1;
        }
    }
}
