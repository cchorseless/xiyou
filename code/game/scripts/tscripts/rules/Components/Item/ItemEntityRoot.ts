import { reloadable } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";

@reloadable
export class ItemEntityRoot extends BaseEntityRoot {

    public readonly CombinationLabels: string[] = [];
    public ItemType: number = PublicBagConfig.EBagItemType.COMMON;
    onAwake() {
        let item = this.GetDomain<BaseItem_Plus>();
        (this as any).ConfigID = item.GetAbilityName();
        (this as any).EntityId = item.GetEntityIndex();
        let hPurchaser = item.GetPurchaser();
        if (hPurchaser) {
            (this as any).Playerid = hPurchaser.GetPlayerOwnerID();
        }
        else {
            (this as any).Playerid = -1;
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
            let item = this.GetDomain<BaseItem_Plus>();
            let owner = item.GetOwnerPlus();
            if (this.isPickUped() && owner != null && owner.ETRoot &&
                owner.ETRoot.As<BattleUnitEntityRoot>().InventoryComp()
            ) {
                owner.ETRoot.As<BattleUnitEntityRoot>().InventoryComp().addItemRoot(this)
            }
        }
    }


    isPickUped() {
        let item = this.GetDomain<BaseItem_Plus>();
        return item.GetItemSlot() > -1;
    }

    clearSceneContainer() {
        let item = this.GetDomain<BaseItem_Plus>();
        let cotain = item.GetContainer();
        if (cotain && cotain.GetModelName() != null) {
            cotain.Destroy();
        }
    }

    changeItemOwner(owner: BattleUnitEntityRoot | null) {
        let item = this.GetDomain<BaseItem_Plus>();
        if (owner) {
            let npc = owner.GetDomain<BaseNpc_Plus>();
            item.SetOwner(npc);
            (this as any).Playerid = owner.Playerid;
        }
        else {
            item.SetOwner(null);
            (this as any).Playerid = -1;
        }
    }

    onDestroy(): void {
        let item = this.GetDomain<BaseItem_Plus>();
        if (GameFunc.IsValid(item)) {
            item.GetContainer()?.Destroy();
            this.clearSceneContainer();
            item.SafeDestroy();
        }
    }
    config() {
        return KVHelper.KvItems["" + this.ConfigID];
    }

    canGiveToNpc(unitroot: BattleUnitEntityRoot) {
        if (this.Playerid != -1 && this.Playerid != unitroot.Playerid) {
            return false;
        }
        if (unitroot.InventoryComp() == null) {
            return false;
        }
        let item = this.GetDomain<BaseItem_Plus>();
        let npc = unitroot.GetDomain<BaseNpc_Plus>();
        if (GameFunc.IsValid(item) &&
            GameFunc.IsValid(npc) &&
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
