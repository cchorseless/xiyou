
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



    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START, false, true)
    CC_ON_ATTACK_START(param: ModifierInstanceEvent & { extra_flags: number }) {
        GLogHelper.print("ON_ATTACK_START ", param.record, param.extra_flags == null, this.GetParentPlus().GetHealth());
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED, false, true)
    CC_ON_ATTACK_LANDED(param: ModifierInstanceEvent & { extra_flags: number }) {
        GLogHelper.print("ON_ATTACK_LANDED ", param.record, param.extra_flags == null, this.GetParentPlus().GetHealth());
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_ON_ATTACK_RECORD(param: ModifierInstanceEvent) {
        GLogHelper.print("ON_ATTACK_RECORD ", param.record, this.GetParentPlus().GetHealth());
    }

}

