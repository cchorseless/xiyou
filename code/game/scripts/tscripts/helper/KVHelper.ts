/*
 * @Author: Jaxh
 * @Date: 2021-05-06 18:12:59
 * @LastEditors: your name
 * @LastEditTime: 2021-05-20 16:51:13
 * @Description: file content
 */

import { GameFunc } from "../GameFunc";
import { KvClient, KvClientInterface, KvServer, KvServerInterface } from "../kvInterface/KvAllInterface";
import { LogHelper } from "./LogHelper";

export module KVHelper {
    /**服務器KV配置 */
    export const KvServerConfig: Readonly<KvServerInterface> = {} as Readonly<KvServerInterface>;
    /**客戶端KV配置 */
    export const KvClientConfig: Readonly<KvClientInterface> = {} as Readonly<KvClientInterface>;

    export function initKVFile() {
        // 服务器
        if (IsServer()) {
            let k: keyof KvServerInterface;
            if (Object.keys(KvServer).length == 0) {
                return;
            }
            for (k as any in KvServer) {
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
        //             if (GameFunc.VectorFunctions.IsValidDiatance(pos, Vector(v[0], v[1], v[2]))) {
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
        let _config = KvServerConfig.pool_group_config[str as "10001"];
        if (_config == null) {
            LogHelper.error("cant find in pool group : key=> " + str);
            return;
        }
        let r_arr = [];
        let weight_arr = [];
        for (let k in _config) {
            r_arr.push(k);
            weight_arr.push(_config[k as "1001"].PoolWeight);
        }
        return GameFunc.ArrayFunc.RandomArrayByWeight(r_arr, weight_arr)[0];
    }


    export function RandomPoolConfig(str: string): string {
        let _config = KvServerConfig.pool_config[str as "1001"];
        if (_config == null) {
            LogHelper.error("cant find in pool  : key=> " + str);
            return;
        }
        let r_arr = [];
        let weight_arr = [];
        for (let k in _config) {
            r_arr.push(k);
            weight_arr.push(_config[k as "building_hero_axe"].ItemWeight);
        }
        return GameFunc.ArrayFunc.RandomArrayByWeight(r_arr, weight_arr)[0];
    }
}
