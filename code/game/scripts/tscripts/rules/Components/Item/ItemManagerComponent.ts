import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
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
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        return building.GetDomainChild<ItemEntityRoot>(childid);
    }

    addItemRoot(root: ItemEntityRoot) {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        if (root.DomainParent == building) {
            return;
        }
        building.AddDomainChild(root);
        this.allItemRoot.push(root.Id);
        if (building.CombinationComp()) {
            building.CombinationComp().addItemRoot(root);
        }
    }

    removeItemRoot(root: ItemEntityRoot) {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        if (root.DomainParent != building) {
            return;
        }
        building.RemoveDomainChild(root);
        let index = this.allItemRoot.indexOf(root.Id);
        this.allItemRoot.splice(index, 1);
        if (building.CombinationComp()) {
            building.CombinationComp().removeItemRoot(root);
        }
    }
}
