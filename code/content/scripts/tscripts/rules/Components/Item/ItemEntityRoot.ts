
import { KVHelper } from "../../../helper/KVHelper";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";

@GReloadable
export class ItemEntityRoot extends BaseEntityRoot {

    public readonly CombinationLabels: string[] = [];
    public ItemType: number = PublicBagConfig.EBagItemType.COMMON;
    onAwake() {
        let item = this.GetDomain<IBaseItem_Plus>();
        (this.ConfigID as any) = item.GetAbilityName();
        (this.EntityId as any) = item.GetEntityIndex();
        let hPurchaser = item.GetPurchaser();
        if (hPurchaser) {
            (this.BelongPlayerid as any) = hPurchaser.GetPlayerOwnerID();
        }
        this.regSelfToInventory();
    }

    private regSelfToInventory() {
        let config = this.config();
        if (config) {
            let CombinationLabel = config.CombinationLabel as string;
            if (CombinationLabel && CombinationLabel.length > 0) {
                config.CombinationLabel.split("|").forEach((labels) => {
                    if (labels && labels.length > 0 && !this.CombinationLabels.includes(labels)) {
                        this.CombinationLabels.push(labels);
                    }
                });
            }
            let item = this.GetDomain<IBaseItem_Plus>();
            let owner = item.GetOwnerPlus();
            if (this.isPickUped() && owner != null && owner.ETRoot &&
                owner.ETRoot.As<IBattleUnitEntityRoot>().InventoryComp()
            ) {
                owner.ETRoot.As<IBattleUnitEntityRoot>().InventoryComp().addItemRoot(this)
            }
        }
    }


    isPickUped() {
        let item = this.GetDomain<IBaseItem_Plus>();
        return item.GetItemSlot() > -1;
    }

    clearSceneContainer() {
        let item = this.GetDomain<IBaseItem_Plus>();
        let cotain = item.GetContainer();
        if (cotain && cotain.GetModelName() != null) {
            cotain.Destroy();
        }
    }

    changeItemOwner(owner: IBattleUnitEntityRoot | null) {
        let item = this.GetDomain<IBaseItem_Plus>();
        if (owner) {
            let npc = owner.GetDomain<IBaseNpc_Plus>();
            item.SetOwner(npc);
            (this.BelongPlayerid as any) = owner.BelongPlayerid;
        }
        else {
            item.SetOwner(null);
            (this.BelongPlayerid as any) = -1;
        }
    }

    onDestroy(): void {
        let item = this.GetDomain<IBaseItem_Plus>();
        if (GFuncEntity.IsValid(item)) {
            item.GetContainer()?.Destroy();
            this.clearSceneContainer();
            GFuncEntity.SafeDestroyItem(item);
        }
    }
    config() {
        return KVHelper.KvItems["" + this.ConfigID];
    }

    canGiveToNpc(unitroot: IBattleUnitEntityRoot) {
        if (this.BelongPlayerid != -1 && this.BelongPlayerid != unitroot.BelongPlayerid) {
            return false;
        }
        if (unitroot.InventoryComp() == null) {
            return false;
        }
        let item = this.GetDomain<IBaseItem_Plus>();
        let npc = unitroot.GetDomain<IBaseNpc_Plus>();
        if (GFuncEntity.IsValid(item) &&
            GFuncEntity.IsValid(npc) &&
            item.IsDroppable() &&
            item.CanUnitPickUp(npc) &&
            npc.IsAlive() &&
            npc.IsRealUnit() &&
            npc.HasInventory()
        ) {
            return true;
        }
        return false;
    }
}
declare global {
    type IItemEntityRoot = ItemEntityRoot;
    var GItemEntityRoot: typeof ItemEntityRoot;
}

if (_G.GItemEntityRoot == undefined) {
    _G.GItemEntityRoot = ItemEntityRoot;
}