
import { FuncHelper } from "./FuncHelper";

export module KVHelper {

    /**
     * 奖励描述 1000:100|1001:200 => 金币x1000 经验x1200
     * @param s
     */
    export function GetPrizeStr(s: string) {
        s = s.replace(/：/g, ':').replace(/ /g, '')
        let _s = s.split('|')
        let _r = '';
        _s.forEach((ss) => {
            let _item = ss.split(':');
            if (_item.length == 2) {
                // let info = KV_DATA.item_config.itemdata![_item[0] as '1000']
                // if (info) {
                //     _r += info.ItemName + 'x' + _item[1] + ' ';
                // }
            }
        })
        return _r
    }

    /**
     * 根据名称和位置查找NPC
     * @param unitname
     * @param v
     * @return npc_position_config表id
     */
    export function FindNpcByPositonAndName(unitname: string, v: [number, number, number]) {
        // for (let k in KV_DATA.npc_position_config.npcposition) {
        //     let info = KV_DATA.npc_position_config.npcposition[k as '1001']
        //     if (info?.unitname == unitname && FuncHelper.IsValidDiatance(v, [
        //         Number(info.position_x),
        //         Number(info.position_y),
        //         Number(info.position_z),
        //     ])) {
        //         return k
        //     }
        // }

    }

    /**
     * 找到距离点v最近的NPC位置点
     * @param unitname
     * @param v
     * @returns npc_position_config表id
     */
    export function FindNearestNpcByName(unitname: string, v: [number, number, number]) {
        let distance;
        let r_positionid;
        // for (let k in KV_DATA.npc_position_config.npcposition) {
        //     let info = KV_DATA.npc_position_config.npcposition[k as '1001']
        //     if (info?.unitname == unitname) {
        //         let v_distance = FuncHelper.Vector_distance(v, [
        //             Number(info.position_x),
        //             Number(info.position_y),
        //             Number(info.position_z),
        //         ])
        //         if (distance == null || v_distance <= distance) {
        //             distance = v_distance
        //             r_positionid = k
        //         }
        //     }
        // }
        return r_positionid
    }

    export function KVData() {
        return (GameUI.CustomUIConfig() as any).KVDATA as KvAllInterface
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



}