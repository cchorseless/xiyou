import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, EventDataType, modifier_event } from "../../propertystat/modifier_event";

@registerModifier()
export class modifier_summon extends BaseModifier_Plus {
    IsHidden() { return false }
    IsDebuff() { return true }
    IsPurgable() { return false }
    IsPurgeException() { return true }
    IsStunDebuff() { return true }
    AllowIllusionDuplicate() { return false }

    public BeCreated(params?: IModifierTable): void {
        modifier_event.FireEvent({
            attacker: this.GetCasterPlus(),
            summon: this.GetParentPlus(),
            eventType: EventDataType.attackerIsSelf + EventDataType.OtherCanBeAnyOne,
        }, Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    }
}

