export module KVHelper {

    export function KVData() {
        return (GameUI.CustomUIConfig() as any).KVDATA as KvAllInterface
    }
    export function KVLang() {
        return KVData().lang_config;
    }
    export function KVAbilitys() {
        return (GameUI.CustomUIConfig() as any).KV_Abilitys as KV_AllAbilitys
    }

    export function KVItems() {
        return (GameUI.CustomUIConfig() as any).KV_Items as KV_AllItems
    }

    export function KVUnits() {
        return (GameUI.CustomUIConfig() as any).KV_Units as KV_AllUnits
    }

    export function GetAbilityOrItemData(abilityitemname: string) {
        let dataability = KVAbilitys()[abilityitemname as keyof KV_AllAbilitys];
        let dataitem = KVItems()[abilityitemname as keyof KV_AllItems];
        return [Boolean(dataitem), dataability || dataitem] as [boolean, any];
    }
    export function GetUnitDataForKey(unitname: string, key: string, tonumber = false): string | number {
        let data = KVUnits()[unitname as keyof KV_AllUnits];
        if (data) {
            if (tonumber) {
                return GToNumber(data[key]);
            }
            else {
                return data[key] as string;
            }
        }
        else {
            if (tonumber) {
                return 0;
            }
            else {
                return "";
            }
        }
    }
    export function GetAbilityOrItemDataForKey(abilityitemname: string, key: string, tonumber = false): string | number {
        let data: any = {};
        let dataability = KVAbilitys()[abilityitemname as keyof KV_AllAbilitys];
        if (dataability) {
            data = dataability;
        }
        else {
            let dataitem = KVItems()[abilityitemname as keyof KV_AllItems];
            if (dataitem) {
                data = dataitem;
            }
        }
        if (tonumber) {
            return GToNumber(data[key]);
        }
        else {
            return data[key];
        }
    }



    export function GetUnitSectLabels(unitname: string) {
        let r: string[] = [];
        let cardinfo = KVUnits()[unitname as keyof KV_AllUnits];
        if (cardinfo) {
            [1, 2, 3, 6].forEach((a, i) => {
                let abilityname = cardinfo["Ability" + a] as string;
                if (abilityname && abilityname != "ability_empty") {
                    let sectname = GJsonConfigHelper.GetAbilitySectLabel(abilityname)
                    if (sectname) {
                        r.push(sectname)
                    }
                }
            })
        }
        return r;
    }

    export function GetLocLang(lang: string) {
        return KVLang()[lang as any];
    }
    export function GetRarityNumber(rarity: string) {
        return GToNumber(GEEnum.ERarity[rarity as any]);
    }

    /**所有配方 */
    export const KvRecipes: { [k: string]: { to: string[], from: string[] } } = {};

    export function Init() {
        // 配方
        const imba_item_recipes = KVData().imba_item_recipes;
        if (imba_item_recipes) {
            for (let k in imba_item_recipes) {
                let v = imba_item_recipes[k]
                let ItemRequirements = v.ItemRequirements["01"] as string;
                if (v.ItemResult && ItemRequirements) {
                    KvRecipes[v.ItemResult] = KvRecipes[v.ItemResult] || {};
                    let from = ItemRequirements.split(";");
                    KvRecipes[v.ItemResult].from = from;
                    for (let i of from) {
                        KvRecipes[i] = KvRecipes[i] || {};
                        KvRecipes[i].to = KvRecipes[i].to || [];
                        if (!KvRecipes[i].to.includes(v.ItemResult)) {
                            KvRecipes[i].to.push(v.ItemResult);
                        }
                    }
                }
            }
        }
        GLogHelper.print("KVHelper Init")
    }
}