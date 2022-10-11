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
            let item = npc.GetItemInSlot(i) as BaseItem_Plus;
            if (item && item.ETRoot) {
                this.addItemRoot(item.ETRoot as ItemEntityRoot);
            }
        }
    }

    getItemRoot(childid: string) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        return battleunit.GetDomainChild<ItemEntityRoot>(childid);
    }


    getItemRootBySlot(slot: number) {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let item = npc.GetItemInSlot(slot) as BaseItem_Plus;
        if (item && item.ETRoot) {
            return item.ETRoot as ItemEntityRoot
        }
    }

    getItemRootByName(itemname: string) {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let item = npc.FindItemInInventory(itemname) as BaseItem_Plus;
        if (item && item.ETRoot) {
            return item.ETRoot as ItemEntityRoot
        }
    }


    getAllBaseItem() {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let len = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9;
        let r: BaseItem_Plus[] = []
        for (let i = 0; i <= len; i++) {
            let item = npc.GetItemInSlot(i) as BaseItem_Plus;
            if (item) {
                r.push(item)
            }
        }
        return r;
    }

    addItemRoot(root: ItemEntityRoot) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (root.DomainParent == battleunit) {
            return;
        }
        if (root.DomainParent) {
            root.DomainParent.As<PlayerCreateBattleUnitEntityRoot>().ItemManagerComp().removeItemRoot(root, false);
        }
        let item = root.GetDomain<BaseItem_Plus>();
        let npc = this.GetDomain<BaseNpc_Plus>();
        if (item.IsStackable()) {
            let olditem = npc.FindItemInInventory(item.GetAbilityName()) as BaseItem_Plus;
            if (olditem) {
                olditem.SetCurrentCharges(item.GetCurrentCharges() + olditem.GetCurrentCharges());
                root.Dispose();
                return;
            }
        }
        battleunit.AddDomainChild(root);
        this.allItemRoot.push(root.Id);
        if (battleunit.CombinationComp()) {
            battleunit.CombinationComp().addItemRoot(root);
        }
        if (!root.isPickUped() || item.GetOwnerPlus() == null || item.GetOwnerPlus().entindex() != npc.entindex()) {
            npc.AddItem(item);
            root.clearSceneContainer();
        }
    }

    removeItemRoot(root: ItemEntityRoot, bDeleteEntity: boolean = true) {
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
        let item = root.GetDomain<BaseItem_Plus>();
        let npc = this.GetDomain<BaseNpc_Plus>();
        npc.TakeItem(item);
        if (bDeleteEntity) {
            root.Dispose();
            return;
        }
    }

    dropItemRoot(root: ItemEntityRoot, vector: Vector) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (root.DomainParent != battleunit) {
            return;
        }
        let item = root.GetDomain<BaseItem_Plus>();
        this.removeItemRoot(root, false);
        CreateItemOnPositionForLaunch(vector, item);
    }


    getAllCanCastItem() {
        let r: BaseItem_Plus[] = [];
        let caster = this.GetDomain<BaseNpc_Plus>();
        if (caster.IsTempestDouble() || caster.IsIllusion()) {
            return r;
        }
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        this.allItemRoot.forEach(str => {
            let itemroot = battleunit.GetDomainChild<ItemEntityRoot>(str);
            if (itemroot) {
                let item = itemroot.GetDomain<BaseItem_Plus>()
                if (item.IsItemReady()) {
                    r.push(item)
                }
            }
        });
        return r;
    }

    //  从背包移出物品
    removeItemRootBySlot(iSlot: number, bDeleteEntity: boolean = true) {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let item = npc.GetItemInSlot(iSlot) as BaseItem_Plus;
        if (item && item.ETRoot) {
            this.removeItemRoot(item.ETRoot as ItemEntityRoot, bDeleteEntity)
        }
    }



}
