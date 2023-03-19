import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, EventDataType, modifier_event } from "../../propertystat/modifier_event";

@registerModifier()
export class modifier_summon extends BaseModifier_Plus {
    IsHidden() { return true }
    IsDebuff() { return false }
    IsPurgable() { return false }
    IsPurgeException() { return false }
    IsStunDebuff() { return false }
    AllowIllusionDuplicate() { return false }

    public BeCreated(params?: IModifierTable): void {
        modifier_event.FireEvent({
            attacker: this.GetCasterPlus(),
            summon: this.GetParentPlus(),
            eventType: EventDataType.attackerIsSelf + EventDataType.OtherCanBeAnyOne,
        }, Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    }
}

