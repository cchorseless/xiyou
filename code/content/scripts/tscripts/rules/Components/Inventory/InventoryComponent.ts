
import { ActiveRootItem } from "../../../npc/items/ActiveRootItem";
import { ET } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class InventoryComponent extends ET.Component {
    public allItemRoot: string[] = [];
    onAwake(...args: any[]): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.SetHasInventory(true);
        let len = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9;
        for (let i = 0; i <= len; i++) {
            let item = npc.GetItemInSlot(i) as IBaseItem_Plus;
            if (item && item.ETRoot) {
                this.addItemRoot(item.ETRoot as IItemEntityRoot);
            }
        }
    }
    // 战吼
    OnBoardRound_Battle() {
        let allItem = this.getAllBaseItem();
        allItem.forEach(item => {
            if (item.OnRoundStartBattle) {
                item.OnRoundStartBattle()
            }
        })
    }

    OnBoardRound_Prize(round: ERoundBoard) {
        let allItem = this.getAllBaseItem();
        allItem.forEach(item => {
            if (item.OnRoundStartPrize) {
                item.OnRoundStartPrize(round)
            }
        })
    }

    cloneItem(source: InventoryComponent) {
        let allItem = source.getAllBaseItem();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        allItem.forEach(item => {
            let hItem = ActiveRootItem.CreateOneToUnit(npc, item.GetAbilityName());
            if (item.IsStackable()) {
                hItem.SetCurrentCharges(item.GetCurrentCharges())
            }
        });
    }

    getItemRoot(childid: string) {
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        return battleunit.GetDomainChild<IItemEntityRoot>(childid);
    }


    getItemRootBySlot(slot: number) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let item = npc.GetItemInSlot(slot) as IBaseItem_Plus;
        if (item && item.ETRoot) {
            return item.ETRoot as IItemEntityRoot
        }
    }

    getItemRootByName(itemname: string) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let item = npc.FindItemInInventory(itemname) as IBaseItem_Plus;
        if (item && item.ETRoot) {
            return item.ETRoot as IItemEntityRoot
        }
    }


    getAllBaseItem() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let len = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9;
        let r: ActiveRootItem[] = []
        for (let i = 0; i <= len; i++) {
            let item = npc.GetItemInSlot(i) as ActiveRootItem;
            if (item) {
                r.push(item)
            }
        }
        return r;
    }




    addItemRoot(root: IItemEntityRoot) {
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        if (root.DomainParent == battleunit) {
            return;
        }
        if (root.DomainParent) {
            root.DomainParent.As<IBattleUnitEntityRoot>().InventoryComp().removeItemRoot(root, false);
        }
        let item = root.GetDomain<IBaseItem_Plus>();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (item.IsStackable()) {
            let olditem = npc.FindItemInInventory(item.GetAbilityName()) as IBaseItem_Plus;
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

    removeItemRoot(root: IItemEntityRoot, bDeleteEntity: boolean = true) {
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        if (root.DomainParent != battleunit) {
            return;
        }
        battleunit.RemoveDomainChild(root);
        let index = this.allItemRoot.indexOf(root.Id);
        this.allItemRoot.splice(index, 1);
        if (battleunit.CombinationComp()) {
            battleunit.CombinationComp().removeItemRoot(root);
        }
        let item = root.GetDomain<IBaseItem_Plus>();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.TakeItem(item);
        if (bDeleteEntity) {
            root.Dispose();
            return;
        }
    }

    dropItemRoot(root: IItemEntityRoot, vector: Vector) {
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        if (root.DomainParent != battleunit) {
            return;
        }
        let item = root.GetDomain<IBaseItem_Plus>();
        this.removeItemRoot(root, false);
        CreateItemOnPositionForLaunch(vector, item);
    }


    getAllCanCastItem() {
        let r: IBaseItem_Plus[] = [];
        let caster = this.GetDomain<IBaseNpc_Plus>();
        if (caster.IsTempestDouble() || caster.IsIllusion()) {
            return r;
        }
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        this.allItemRoot.forEach(str => {
            let itemroot = battleunit.GetDomainChild<IItemEntityRoot>(str);
            if (itemroot) {
                let item = itemroot.GetDomain<IBaseItem_Plus>()
                if (item.IsItemReady()) {
                    r.push(item)
                }
            }
        });
        return r;
    }

    //  从背包移出物品
    removeItemRootBySlot(iSlot: number, bDeleteEntity: boolean = true) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let item = npc.GetItemInSlot(iSlot) as IBaseItem_Plus;
        if (item && item.ETRoot) {
            this.removeItemRoot(item.ETRoot as IItemEntityRoot, bDeleteEntity)
        }
    }



}
