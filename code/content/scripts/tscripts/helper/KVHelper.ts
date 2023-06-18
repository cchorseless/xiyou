import { KV_Abilitys, KV_Items, KV_Units, KvAllPath, KvClient, KvClientInterface, KvServer, KvServerInterface, allAbilitys, allItems, allUnits } from "../kvInterface/KvAllInterface";
import { LogHelper } from "./LogHelper";


interface IWearableInfo {
    "name": string,
    "prefab": string,
    "imageInventory": string,
    "itemDescription": string,
    "itemName": string,
    "modelPlayer": string,
    "usedByHeroes": string,
    "assetModifier": string,
    "controlPoint": string,
    "itemSlot": string,
    "itemTypeName": string,
    "skipModelCombine": string,
    "itemRarity": string,
    "skin": string,
    "bundle": string,
    "styles": string,
}

type IWearableConfig = { WearableConfig: { [k: string]: IWearableInfo } };
export module KVHelper {
    /**服務器KV配置 */
    export const KvServerConfig: Readonly<KvServerInterface & IWearableConfig> = {} as Readonly<KvServerInterface & IWearableConfig>;
    /**客戶端KV配置 */
    export const KvClientConfig: Readonly<KvClientInterface> = {} as Readonly<KvClientInterface>;
    /**所有技能 */
    export const KvAbilitys: Readonly<dota_abilities.OBJ_1_1 & KV_Abilitys> = {} as Readonly<dota_abilities.OBJ_1_1 & KV_Abilitys>;
    /**所有道具 */
    export const KvItems: Readonly<dota_items.OBJ_1_1 & KV_Items> = {} as Readonly<dota_items.OBJ_1_1 & KV_Items>;
    /**所有单位 */
    export const KvUnits: Readonly<npc_heroes_custom.OBJ_1_1 & KV_Units> = {} as Readonly<npc_heroes_custom.OBJ_1_1 & KV_Units>;
    /**所有配方 */
    export const KvRecipes: { [k: string]: { to?: string[], from?: string[] } } = {}

    export function KvConfig() {
        if (IsServer()) {
            return KvServerConfig;
        } else {
            return KvClientConfig;
        }

    }
    export function GetUnitData(unitname: string, k: string) {
        if (KvUnits[unitname]) {
            return KvUnits[unitname][k];
        }
        else {
            return null;
        }
    }
    export function GetAbilityData(abilityname: string, k: string, bnumber = false) {
        if (KvAbilitys[abilityname]) {
            if (bnumber) {
                return GToNumber(KvAbilitys[abilityname][k]);
            }
            return KvAbilitys[abilityname][k];
        }
        else {
            if (bnumber) {
                return 0;
            }
            return null;
        }
    }
    export function GetItemData(itemname: string, k: string, bnumber = false) {
        if (KvItems[itemname] != null) {
            if (bnumber) {
                return GToNumber(KvItems[itemname][k]);
            }
            return KvItems[itemname][k];
        }
        else {
            if (bnumber) {
                return 0;
            }
            return null;
        }
    }
    export function initKVFile() {
        // 服务器
        if (IsServer()) {
            let k: keyof KvServerInterface;
            if (Object.keys(KvServer).length == 0) {
                return;
            }
            (KvServer as any)["WearableConfig"] = "scripts/npc/kvConfig/shipin_config.kv";
            for (k in KvServer) {
                (KvServerConfig as any)[k] = LoadKeyValues(KvServer[k]);
                LogHelper.print("Server LoadKeyValues Finish:", k);
            }

        }
        // 客户端
        else {
            let k: keyof KvClientInterface;
            if (Object.keys(KvClient).length == 0) {
                return;
            }
            for (k as any in KvClient) {
                (KvClientConfig as any)[k] = LoadKeyValues(KvClient[k]);
                LogHelper.print("Client LoadKeyValues Finish:", k);
            }
        }
        // 配方
        const imba_item_recipes = KvConfig().imba_item_recipes;
        for (let k in imba_item_recipes) {
            let v = imba_item_recipes[k]
            let ItemRequirements = v.ItemRequirements["01"];
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
        // 合并
        allAbilitys.push("dota_abilities");
        allAbilitys.forEach((file: any) => {
            let data: { [k: string]: any } = (KvServerConfig as any)[file] || (KvClientConfig as any)[file] || LoadKeyValues((KvAllPath as any)[file]);
            (KvAbilitys as any) = Object.assign(KvAbilitys, data)
        });
        allItems.push("dota_items");
        allItems.forEach((file: any) => {
            let data: { [k: string]: any } = (KvServerConfig as any)[file] || (KvClientConfig as any)[file] || LoadKeyValues((KvAllPath as any)[file]);
            (KvItems as any) = Object.assign(KvItems, data)
        });

        /**英雄也加进去 */
        allUnits.push("npc_heroes_custom");
        allUnits.forEach((file: any) => {
            let data: { [k: string]: any } = (KvServerConfig as any)[file] || (KvClientConfig as any)[file] || LoadKeyValues((KvAllPath as any)[file]);
            (KvUnits as any) = Object.assign(KvUnits, data)
        });

    }

    /**
     * 根据名称和位置查找NPC
     * @param unitname
     * @param v
     * @return npc_position_config表id
     */
    export function FindNpcByPositonAndName(unitname: string, v?: [number, number, number]) {
        // for (let k in KvServerConfig.npc_position_config) {
        //     let info = KvServerConfig.npc_position_config[k as '1001']
        //     if (info.unitname == unitname) {
        //         let pos = Vector(
        //             tonumber(info.position_x),
        //             tonumber(info.position_y),
        //             tonumber(info.position_z)
        //         );
        //         if (v) {
        //             if (GFuncVector.IsValidDiatance(pos, Vector(v[0], v[1], v[2]))) {
        //                 return k
        //             }
        //         }
        //     }
        // }
    }

    /**
     * 找到道具价格
     * @param unitname
     * @returns 
     */
    export function GetItemCoinCost(cointype: ICoinType, itemname: string) {
        let r = 0;
        let config = KVHelper.KvItems[itemname];
        if (config) {
            if (cointype == GEEnum.EMoneyType.Gold) {
                r = GToNumber(config.ItemCost)
            }
            else if (cointype == GEEnum.EMoneyType.Wood) {
                r = GToNumber(config.WoodCost)
            }
            else if (cointype == GEEnum.EMoneyType.SoulCrystal) {
                r = GToNumber(config.SoulCrystalCost)
            }
        }
        return r;
    }
    /**
     * 道具品质
     * @param itemname 
     */
    export function GetItemRarity(itemname: string): IRarity {
        let config = KVHelper.KvItems[itemname];
        if (config) {
            return (config.Rarity || "B") as IRarity;
        }
        return "B";
    }



    /**
     * 处理奖励字符串，转化出
     * @param str
     * @return [[道具id,道具数量]，[道具id,道具数量]，]
     */
    export function DealItemPrizeStr(str: string) {
        let [s, n] = string.gsub(str, "：", ":");
        let list = s.split("|");
        let r: number[][] = [];
        list.forEach((ss) => {
            let _s_list = ss.split(":");
            r.push([tonumber(_s_list[0]), tonumber(_s_list[1])]);
        });
        return r;
    }
    /**
         * 随机道具池
         * @param itemPrizePoolConfigid 
         * @returns 
         */
    export function RandomItemPrizePoolConfigPrize(itemPrizePoolConfigid: number) {
        let config = GJSONConfig.ItemPrizePoolConfig.get(itemPrizePoolConfigid);
        if (config == null) { return }
        let count: IFItemInfo[] = [];
        let weight: number[] = [];
        for (let data of config.itempool) {
            if (data.ItemConfigId > 0 && data.ItemWeight > 0) {
                count.push({ ItemConfigId: data.ItemConfigId, ItemCount: data.ItemCount });
                weight.push(data.ItemWeight);
            }
        }
        return GFuncRandom.RandomArrayByWeight(count, weight)[0];
    }
    /**
     * 随机道具池组
     * @param itemPrizePoolGroupConfigid 
     * @returns 
     */
    export function RandomItemPrizePoolGroupPrize(itemPrizePoolGroupConfigid: number) {
        let config = GJSONConfig.ItemPrizePoolGroupConfig.get(itemPrizePoolGroupConfigid);
        if (config == null) { return }
        let count: number[] = [];
        let weight: number[] = [];
        let randomTimes = 1;
        if (config.RandomCountInfo.length == 1) {
            randomTimes = config.RandomCountInfo[0].RandomCount;
        }
        else if (config.RandomCountInfo.length > 1) {
            for (let data of config.RandomCountInfo) {
                if (data.RandomWeight > 0 && data.RandomCount > 0) {
                    count.push(data.RandomCount);
                    weight.push(data.RandomWeight);
                }
            }
            randomTimes = GFuncRandom.RandomArrayByWeight(count, weight)[0];
        }
        count = [];
        weight = [];
        for (let data of config.ItemPoolGroup) {
            if (data.ItemPoolConfigId > 0 && data.ItemPoolWeight > 0) {
                count.push(data.ItemPoolConfigId);
                weight.push(data.ItemPoolWeight);
            }
        }
        let r: { [itemconfigid: string]: number } = {};
        for (let i = 0; i < randomTimes; i++) {
            let poolConfigId = GFuncRandom.RandomArrayByWeight(count, weight)[0];
            let poolConfig = GJSONConfig.ItemPrizePoolConfig.get(poolConfigId);
            if (poolConfig != null) {
                let result = RandomItemPrizePoolConfigPrize(poolConfigId);
                if (result) {
                    r[result.ItemConfigId + ""] = r[result.ItemConfigId + ""] || 0;
                    r[result.ItemConfigId + ""] += result.ItemCount;
                }
            }
        }
        return r;
    }

    export function RandomPoolGroupConfig(str: string): string {
        let _config = GJSONConfig.PoolGroupConfig.get(str);;
        if (_config == null) {
            GLogHelper.error("cant find in pool group : key=> " + str);
            return;
        }
        let r_arr: string[] = [];
        let weight_arr: number[] = [];
        for (let k of _config.PoolGroup) {
            if (k.IsVaild) {
                r_arr.push(k.PoolConfigId);
                weight_arr.push(k.PoolWeight);
            }
        }
        let poolid = GFuncRandom.RandomArrayByWeight(r_arr, weight_arr)[0];
        return RandomPoolConfig(poolid);
    }
    export function RandomPoolConfig(str: string): string {
        let _config = GJSONConfig.PoolConfig.get(str);
        if (_config == null) {
            GLogHelper.error("cant find in pool  : key=> " + str);
            return;
        }
        let r_arr: string[] = [];
        let weight_arr: number[] = [];
        for (let k of _config.PoolInfo) {
            if (k.IsVaild) {
                r_arr.push(k.ItemConfigId);
                weight_arr.push(k.ItemWeight);
            }
        }
        return GFuncRandom.RandomArrayByWeight(r_arr, weight_arr)[0];
    }

    export namespace CourierUnits {
        export function GetRandomCourier() {
            return GFuncRandom.RandomOne(Object.keys(KvConfig().courier_units))
        }
        export function GetCourierAbility(sCourierName: string) {
            if (KvConfig().courier_units[sCourierName] == null) { return }
            return KvConfig().courier_units[sCourierName].Ability1
        }
        export function GetCourierModel(sCourierName: string) {
            if (KvConfig().courier_units[sCourierName] == null) { return "models/development/invisiblebox.vmdl" }
            return KvConfig().courier_units[sCourierName].Model || "models/development/invisiblebox.vmdl"
        }
        export function GetCourierModelScale(sCourierName: string) {
            if (KvConfig().courier_units[sCourierName] == null) { return 1 }
            return GToNumber(KvConfig().courier_units[sCourierName].ModelScale)
        }
        export function GetCourierSkin(sCourierName: string) {
            if (KvConfig().courier_units[sCourierName] == null) { return 0 }
            return GToNumber(KvConfig().courier_units[sCourierName].Skin);
        }
        export function GetCourierVisualZDelta(sCourierName: string) {
            if (KvConfig().courier_units[sCourierName] == null) { return 0 }
            return GToNumber(KvConfig().courier_units[sCourierName].VisualZDelta);
        }
        export function GetCourierAmbientEffect(sCourierName: string) {
            if (KvConfig().courier_units[sCourierName] == null) { return }
            return KvConfig().courier_units[sCourierName].AmbientModifiers
        }

    }
}
