import { KV_Abilitys, KV_Items, KV_Units, KvAllPath, KvClient, KvClientInterface, KvServer, KvServerInterface, allAbilitys, allItems, allUnits } from "../kvInterface/KvAllInterface";
import { LogHelper } from "./LogHelper";


export module KVHelper {
    /**服務器KV配置 */
    export const KvServerConfig: Readonly<KvServerInterface> = {} as Readonly<KvServerInterface>;
    /**客戶端KV配置 */
    export const KvClientConfig: Readonly<KvClientInterface> = {} as Readonly<KvClientInterface>;
    /**所有技能 */
    export const KvAbilitys: Readonly<dota_abilities.OBJ_1_1 & KV_Abilitys> = {} as Readonly<dota_abilities.OBJ_1_1 & KV_Abilitys>;
    /**所有道具 */
    export const KvItems: Readonly<dota_items.OBJ_1_1 & KV_Items> = {} as Readonly<dota_items.OBJ_1_1 & KV_Items>;
    /**所有单位 */
    export const KvUnits: Readonly<npc_heroes_custom.OBJ_1_1 & KV_Units> = {} as Readonly<npc_heroes_custom.OBJ_1_1 & KV_Units>;

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
     * 找到所有的单位
     * @param unitname
     * @returns K[]
     */
    export function FindAllNPCByName(unitname: string) {
        let r: string[] = [];
        // for (let k in KvServerConfig.npc_position_config) {
        //     let info = KvServerConfig.npc_position_config[k as '1001']
        //     if (info.unitname == unitname) {
        //         r.push(k)
        //     }
        // }
        return r;
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
        return GFuncRandom.RandomArrayByWeight(r_arr, weight_arr)[0];
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
