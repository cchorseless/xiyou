import { JSONConfig } from "./JsonConfig";
import { EEnum } from "./Types";

export module JsonConfigHelper {
    export function GetRecordItemConfig(itemid: string | number) {
        itemid = Number(itemid);
        return JSONConfig.ItemConfig.get(itemid);
    }
    export function ToRarityNumber(rarity: EEnum.ERarity) {
        return Number(EEnum.ERarity[rarity]) || -1;
    }


}