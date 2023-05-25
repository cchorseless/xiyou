import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, EventDataType, modifier_event } from "../../propertystat/modifier_event";

@registerModifier()
export class modifier_generic_illusion extends BaseModifier_Plus {
    IsHidden() { return true }
    IsDebuff() { return false }
    IsPurgable() { return false }
    IsPurgeException() { return false }
    IsStunDebuff() { return false }
    AllowIllusionDuplicate() { return false }

    IllusionSet: any;


    public BeCreated(params?: IModifierTable & CreateIllusionsModifierKeys): void {
        this.IllusionSet = { totalOutGoingPect: -50, incomingDamgePect: 100 };
        if (IsServer()) {
            NetTablesHelper.SetDotaEntityData(this.GetParentPlus().GetEntityIndex(), {
                totalOutGoingPect: params.outgoing_damage || this.IllusionSet.totalOutGoingPect,
                incomingDamgePect: params.incoming_damage || this.IllusionSet.incomingDamgePect
            }, "_illusion_");
            modifier_event.FireEvent({
                attacker: this.GetCasterPlus(),
                unit: this.GetParentPlus(),
                eventType: EventDataType.attackerIsSelf + EventDataType.OtherCanBeAnyOne,
            }, Enum_MODIFIER_EVENT.ON_SPAWN_ILLUSION)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_TOTALDAMAGEOUTGOING_PERCENTAGE() {
        let data = NetTablesHelper.GetDotaEntityData(this.GetParentPlus().GetEntityIndex(), "_illusion_") || this.IllusionSet;
        return data.totalOutGoingPect;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_INCOMING_DAMAGE_PERCENTAGE() {
        let data = NetTablesHelper.GetDotaEntityData(this.GetParentPlus().GetEntityIndex(), "_illusion_") || this.IllusionSet;
        return data.incomingDamgePect
    }


    public BeRemoved(): void {
        if (IsServer()) {
            modifier_event.FireEvent({
                attacker: this.GetCasterPlus(),
                unit: this.GetParentPlus(),
                eventType: EventDataType.attackerIsSelf + EventDataType.OtherCanBeAnyOne,
            }, Enum_MODIFIER_EVENT.ON_DEATH_ILLUSION)
        }

    }
}

