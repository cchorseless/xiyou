

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

}