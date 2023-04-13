
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerModifier()
export class modifier_dummy_damage extends BaseModifier_Plus {

    IsHidden() {
        return true;
    }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    // CC_GetMinHealth() {
    //     return 1;
    // }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    // CC_GetModifierConstantHealthRegen() {
    //     return 1000;
    // }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(param: ModifierInstanceEvent) {
        let hParent = this.GetParent();
        GLogHelper.print("ON_TAKEDAMAGE ", param.record, this.GetParentPlus().GetHealth());
        GLogHelper.print("damage", param.damage);
        GLogHelper.print("original_damage", param.original_damage);
        SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, hParent, param.damage, hParent.GetPlayerOwner());
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DAMAGE_CALCULATED, false, true)
    CC_ON_ATTACK(param: ModifierInstanceEvent) {
        GLogHelper.print("ON_DAMAGE_CALCULATED ", param.record, this.GetParentPlus().GetHealth());
        GLogHelper.print("ON_DAMAGE_CALCULATED ", param.record, param.original_damage, param.damage);
        param.damage = param.original_damage;
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START, false, true)
    CC_ON_ATTACK_START(param: ModifierInstanceEvent) {
        GLogHelper.print("ON_ATTACK_START ", param.record, this.GetParentPlus().GetHealth());
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED, false, true)
    CC_ON_ATTACK_LANDED(param: ModifierInstanceEvent) {
        GLogHelper.print("ON_ATTACK_LANDED ", param.record, this.GetParentPlus().GetHealth());
        GLogHelper.print("ON_ATTACK_LANDED ", param.record, param.original_damage, param.damage);
        param.damage = param.original_damage;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD, false, true)
    CC_ON_ATTACK_RECORD(param: ModifierInstanceEvent) {
        GLogHelper.print("ON_ATTACK_RECORD ", param.record, this.GetParentPlus().GetHealth());
    }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    // CC_GetModifierIncomingPhysicalDamage_Percentage(keys: ModifierAttackEvent): number {
    //     return -50
    // }
}

