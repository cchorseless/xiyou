
export module JsonConfigHelper {
    export function GetRecordItemConfig(itemid: string | number) {
        itemid = Number(itemid);
        return GJSONConfig.ItemConfig.get(itemid);
    }

}