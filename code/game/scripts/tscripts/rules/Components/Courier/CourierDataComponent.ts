import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { ET, registerET, serializeETProps } from "../../Entity/Entity";

/**玩家组件 */
@registerET()
export class CourierDataComponent extends ET.Component {
    /**出生点 */
    firstSpawnPoint: Vector;
    /**玩家物品信息 */
    itemSlotData: EntityIndex[] = [];

    onAwake() {
        let hero = this.GetDomain<BaseNpc_Hero_Plus>();
        this.firstSpawnPoint = hero.GetAbsOrigin();
        modifier_wait_portal.applyOnly(hero, hero);
        modifier_jiaoxie_wudi.applyOnly(hero, hero);
    }

    /**
     * 检查位置是否变动
     * @returns 改变的slot [number[],0 | 1 | 2]
     */
    CheckItemSlotChange() {
        let hero = this.GetDomain<BaseNpc_Hero_Plus>();
        let data: EntityIndex[] = [];
        for (let i = 0; i < DOTAScriptInventorySlot_t.DOTA_ITEM_TRANSIENT_ITEM; i++) {
            let itemEnity = hero.GetItemInSlot(i);
            if (itemEnity != null) {
                data.push(itemEnity.entindex());
            } else {
                data.push(-1 as EntityIndex);
            }
        }
        let r = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] != this.itemSlotData[i]) {
                r.push(i);
            }
        }
        this.itemSlotData = data;
        if (r.length > 0) {
            /**获取|丢失|位置更换 */
            let state: 0 | 1 | 2 = 0;
            if (r.length == 1) {
                if (data[r[0]] > 0) {
                    state = 0;
                } else {
                    state = 1;
                }
            } else if (r.length == 2) {
                state = 2;
            }
            return [r, state];
        }
    }
    /**
     * 查找道具数量
     * @param playerid
     * @param itemname
     * @returns
     */
    GetItemCount(itemname: string): number {
        let hero = this.GetDomain<BaseNpc_Hero_Plus>();
        let r = 0;
        for (let i = 0; i < DOTAScriptInventorySlot_t.DOTA_ITEM_TRANSIENT_ITEM; i++) {
            let item = hero.GetItemInSlot(i);
            if (item && item.GetAbilityName() == itemname) {
                r += 1;
            }
        }
        return r;
    }
}
