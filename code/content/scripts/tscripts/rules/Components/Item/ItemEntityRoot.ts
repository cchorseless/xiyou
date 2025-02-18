
import { KVHelper } from "../../../helper/KVHelper";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";

@GReloadable
export class ItemEntityRoot extends BaseEntityRoot {
    public readonly SectLabels: string[] = [];
    public ItemType = PublicBagConfig.EBagItemType.COMMON;
    onAwake() {
        let item = this.GetDomain<IBaseItem_Plus>();
        (this.ConfigID as any) = item.GetAbilityName();
        (this.EntityId as any) = item.GetEntityIndex();
        let hPurchaser = item.GetPurchaser();
        if (hPurchaser) {
            (this.BelongPlayerid as any) = hPurchaser.GetPlayerID();
        }
        let sectname = GJsonConfigHelper.GetAbilitySectLabel(this.ConfigID);
        if (sectname && sectname.length > 0) {
            if (!this.SectLabels.includes(sectname)) {
                this.SectLabels.push(sectname);
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
        if (IsValid(item)) {
            item.GetContainer()?.Destroy();
            this.clearSceneContainer();
            SafeDestroyItem(item);
        }
    }
    config() {
        return KVHelper.KvItems["" + this.ConfigID];
    }


}
declare global {
    type IItemEntityRoot = ItemEntityRoot;
    var GItemEntityRoot: typeof ItemEntityRoot;
}

if (_G.GItemEntityRoot == undefined) {
    _G.GItemEntityRoot = ItemEntityRoot;
}