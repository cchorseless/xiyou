import { JSONConfig } from "./JsonConfig";

export module JsonConfigHelper {
    export function GetRecordItemConfig(itemid: string | number) {
        itemid = Number(itemid);
        return JSONConfig.ItemConfig.get(itemid);
    }

}