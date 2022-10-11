import { reloadable } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { PlayerCreateUnitEntityRoot, PlayerCreateUnitType } from "../Player/PlayerCreateUnitEntityRoot";

@reloadable
export class ItemEntityRoot extends PlayerCreateUnitEntityRoot {

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
        this.regSelfToM();
    }

    private regSelfToM() {
        let item = this.GetDomain<BaseItem_Plus>();
        let owner = item.GetOwnerPlus();
        if (this.isPickUped() && owner != null && owner.ETRoot &&
            owner.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().ItemManagerComp()
        ) {
            owner.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().ItemManagerComp().addItemRoot(this)
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

    changeItemOwner(owner: PlayerCreateBattleUnitEntityRoot | null) {
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
        item.GetContainer()?.Destroy();
        this.clearSceneContainer();
        UTIL_Remove(item);
    }
    config() {
        return KVHelper.KvConfig().building_ability_tower["" + this.ConfigID];
    }

    canGiveToNpc(unitroot: PlayerCreateBattleUnitEntityRoot) {
        if (this.Playerid != -1 && this.Playerid != unitroot.Playerid) {
            return false;
        }
        if (unitroot.ItemManagerComp() == null) {
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
