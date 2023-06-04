export module DrawConfig {
    /**心愿清单 */
    export const iWashCardMax = 5;
    /**选卡只能选一次 */
    export const BOnlySelectOnce = true;
    /**选择敌人最大时间 */
    export const DrawEnemyWaitingTime = 20;
    /**抽卡类型 对应poolgroupid */
    export enum EDrawType {
        RoundStart,
        DrawCardV1 = 10000,
        DrawCardV2 = 10001,
        DrawCardV3 = 10002,

        DrawEquipV1 = 10010,
        DrawEquipV2 = 10011,
        DrawEquipV3 = 10012,
        DrawEquipV4 = 10013,
        DrawArtifact = 10014,
    }

    export enum EProtocol {
        DrawCardNotice = "DrawCardNotice",
        LockSelectedCard = "LockSelectedCard",
        CardSelected = "CardSelected",
        RedrawStartCard = "RedrawStartCard",
        SelectCard2Public = "SelectCard2Public",
        Add2WishList = "Add2WishList",
        DrawEquipNotice = "DrawEquipNotice",
        DrawEquipSelected = "DrawEquipSelected",
        DrawArtifactNotice = "DrawArtifactNotice",
        DrawArtifactSelected = "DrawArtifactSelected",
        DrawSectNotice = "DrawSectNotice",
        DrawSectSelected = "DrawSectSelected",
        DrawEnemyNotice = "DrawEnemyNotice",
        DrawEnemySelected = "DrawEnemySelected",
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
        /**敌人相关 */
        interface IDrawEnemyInfo {
            unitname: string;
            level: number;
            star: number;
            equip: string[];
            score: number;
            buffs?: { [buff: string]: number };
        }
        /**抽敌人通知 */
        interface IDrawEnemyNotice {
            accountid?: string;
            sectInfo?: { [k: string]: number };
            heroInfo?: IDrawEnemyInfo[];
        }
    }
}
