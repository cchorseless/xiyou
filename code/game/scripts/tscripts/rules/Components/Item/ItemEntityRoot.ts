import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { PlayerCreateUnitEntityRoot, PlayerCreateUnitType } from "../Player/PlayerCreateUnitEntityRoot";

export class ItemEntityRoot extends PlayerCreateUnitEntityRoot {

    onAwake() {
        let item = this.GetDomain<BaseItem_Plus>();
        // (this as any).Playerid = item.GetOwnerPlus().GetPlayerOwnerID();
        (this as any).ConfigID = item.GetAbilityName();
        (this as any).EntityId = item.GetEntityIndex();
    }
    onDestroy(): void {
        let ability = this.GetDomain<BaseItem_Plus>();
        ability.Destroy();
        UTIL_Remove(ability);
    }
    config() {
        return KVHelper.KvConfig().building_ability_tower["" + this.ConfigID];
    }
}
