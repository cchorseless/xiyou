import { CCShare } from "./lib/CCShare";

export module GameServiceConfig {
    export const GAME_Name = "xiyou";
    export const GAME_MAX_PLAYER = 5;
    /**网表存数据是否是存字符串的形式 */
    export const NetTableSaveDataAsSring = true;
    /**lua服务器特殊处理一些数据类型 todo 循环嵌套的结构没有处理*/
    export function TryEncodeData(d: any) {
        if (NetTableSaveDataAsSring) { return d }
        if (typeof d == "boolean") {
            if (d) {
                return "true"
            }
            else {
                return "false"
            }
        }
        return d;
    }

    export function TryDecodeData(d: any) {
        if (NetTableSaveDataAsSring) { return d }
        if (d == "true") { return true }
        if (d == "false") { return false }
        if (!_CODE_IN_LUA_) {
            d = CCShare.TryTransArrayLikeObject(d);
        }
        return d;
    }


    export enum EDifficultyChapter {
        n1 = 1,
        n2 = 2,
        n3 = 3,
        n4 = 4,
        n5 = 5,
        n6 = 6,
        n7 = 7,
        n8 = 8,
        n9 = 9,
        n10 = 10,
        /**无尽关卡 */
        endless = 999
    }
    /**无尽最大层数 */
    export const iMaxEndless = 999;
    /**普通最大难度 */
    export const DIFFICULTY_LAST = EDifficultyChapter.n6;
    export const ENDLESS_ENEMEY_fHPMult = {
        "1": 0.15,
        "10": 0.2,
        "21": 0.3,
        "31": 0.15,
        "41": 0.15,
        "51": 0.15,
        "61": 0.15,
        "300": 0.15,
        "501": 0.15,
        "601": 0.15,
    }
    export const ENDLESS_ENEMEY_fArmorPhyMult = {
        "1": 0.15,
        "10": 0.2,
        "21": 0.3,
        "31": 0.15,
        "41": 0.15,
        "51": 0.15,
        "61": 0.15,
        "300": 0.15,
        "501": 0.15,
        "601": 0.15,
    }

    export const ENDLESS_ENEMEY_fArmorMagMult = {
        "1": 0.15,
        "10": 0.2,
        "21": 0.3,
        "31": 0.15,
        "41": 0.15,
        "51": 0.15,
        "61": 0.15,
        "300": 0.15,
        "501": 0.15,
        "601": 0.15,
    }

    export const ENDLESS_ENEMEY_fHPAdd = {
        "1": 0.15,
        "10": 0.2,
        "21": 0.3,
        "31": 0.15,
        "41": 0.15,
        "51": 0.15,
        "61": 0.15,
        "300": 0.15,
        "501": 0.15,
        "601": 0.15,
    }

    export const ENDLESS_ENEMEY_fArmorPhyAdd = {
        "1": 0.15,
        "10": 0.2,
        "21": 0.3,
        "31": 0.15,
        "41": 0.15,
        "51": 0.15,
        "61": 0.15,
        "300": 0.15,
        "501": 0.15,
        "601": 0.15,
    }

    export const ENDLESS_ENEMEY_fArmorMagAdd = {
        "1": 0.15,
        "10": 0.2,
        "21": 0.3,
        "31": 0.15,
        "41": 0.15,
        "51": 0.15,
        "61": 0.15,
        "300": 0.15,
        "501": 0.15,
        "601": 0.15,
    }

    /**默认信使 */
    export const DefaultCourier = "courier_1";
    /**网表名称 */
    export enum ENetTables {
        common = "common",
        etentity = "etentity",
        etentity0 = "etentity0",
        etentity1 = "etentity1",
        etentity2 = "etentity2",
        etentity3 = "etentity3",
        etentity4 = "etentity4",
        etentity5 = "etentity5",
    }
}