import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { ItemEntityRoot } from "./ItemEntityRoot";

@registerET()
export class ItemManagerComponent extends ET.Component {
    public allItemRoot: string[] = [];
    onAwake(...args: any[]): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let len = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9;
        for (let i = 0; i <= len; i++) {
            let ability = npc.GetItemInSlot(i) as BaseItem_Plus;
            if (ability && ability.ETRoot) {
                this.addItemRoot(ability.ETRoot as ItemEntityRoot);
            }
        }
    }
    getItemRoot(childid: string) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        return battleunit.GetDomainChild<ItemEntityRoot>(childid);
    }

    addItemRoot(root: ItemEntityRoot) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (root.DomainParent == battleunit) {
            return;
        }
        battleunit.AddDomainChild(root);
        this.allItemRoot.push(root.Id);
        if (battleunit.CombinationComp()) {
            battleunit.CombinationComp().addItemRoot(root);
        }
    }

    removeItemRoot(root: ItemEntityRoot) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (root.DomainParent != battleunit) {
            return;
        }
        battleunit.RemoveDomainChild(root);
        let index = this.allItemRoot.indexOf(root.Id);
        this.allItemRoot.splice(index, 1);
        if (battleunit.CombinationComp()) {
            battleunit.CombinationComp().removeItemRoot(root);
        }
    }
}
