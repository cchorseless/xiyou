export module DrawConfig {
    /**玩家颜色 */
    export enum EDrawCardType {
        RoundStart,
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
        }
    }
}
