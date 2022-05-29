import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { ET, registerET, serializeETProps } from "../../Entity/Entity";
import { PlayerConfig } from "../../System/Player/PlayerConfig";
import { PlayerDataComponent } from "./PlayerDataComponent";

/**玩家组件 */
@registerET()
export class PlayerComponent extends ET.Component {
    /**出生点 */
    firstSpawnPoint: Vector;
    /**玩家物品信息 */
    itemSlotData: EntityIndex[] = [];
    readonly playerColor: Vector;

    onAwake() {
        let domain = this.GetDomain<BaseNpc_Hero_Plus>();
        (this as any).playerColor = PlayerConfig.playerColor[domain.ETRoot.AsPlayer().Playerid];
        this.firstSpawnPoint = domain.GetAbsOrigin();
        domain.ETRoot.AddComponent(PlayerDataComponent);
        modifier_wait_portal.applyOnly(domain, domain);
    }

    /**
     * 检查位置是否变动
     * @param playerid
     * @param data
     * @returns 改变的slot [number[],0 | 1 | 2]
     */
    CheckItemSlotChange(data: EntityIndex[]) {
        let r = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] != this.itemSlotData[i]) {
                r.push(i);
            }
        }
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
