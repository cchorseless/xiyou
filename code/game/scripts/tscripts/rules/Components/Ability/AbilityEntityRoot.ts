import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { PlayerCreateUnitEntityRoot, PlayerCreateUnitType } from "../Player/PlayerCreateUnitEntityRoot";

export class AbilityEntityRoot extends PlayerCreateUnitEntityRoot {
    public readonly IsSerializeEntity: boolean = true;

    onAwake() {
        let ability = this.GetDomain<BaseAbility_Plus>();
        (this as any).Playerid = ability.GetOwnerPlus().GetPlayerOwnerID();
        (this as any).ConfigID = ability.GetAbilityName();
        (this as any).EntityId = ability.GetEntityIndex();
        LogHelper.print("AbilityEntityRoot", this.ConfigID)
    }
    onDestroy(): void {
        let ability = this.GetDomain<BaseAbility_Plus>();
        ability.Destroy();
        UTIL_Remove(ability);
    }

    config() {
        return KVHelper.KvConfig().building_ability_tower["" + this.ConfigID];
    }
}
