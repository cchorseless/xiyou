import { EEnum } from "./Types";

export module JsonConfigHelper {
    export function GetRecordItemConfig(itemid: string | number) {
        itemid = Number(itemid);
        return GJSONConfig.ItemConfig.get(itemid);
    }
    export function ToRarityNumber(rarity: EEnum.ERarity) {
        return Number(EEnum.ERarity[rarity]) || -1;
    }


}