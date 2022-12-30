
import { GameEnum } from "../../../shared/GameEnum";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerModifier()
export class modifier_many_hp_bar extends BaseModifier_Plus {

    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    RemoveOnDeath() {
        return false
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA
    }
    GetTexture() {
        return "alchemist_goblins_greed"
    }
    GetStatusEffectName() {
        return "particles/econ/items/effigies/status_fx_effigies/status_effect_effigy_gold.vpcf"
    }
    StatusEffectPriority() {
        return 99
    }

    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.StartIntervalThink(this.GetDuration())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            this.GetParentPlus().ForceKill(false)
            this.StartIntervalThink(-1)
            this.Destroy()
        }
    }
    CheckState() {
        return {
            //  [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR] : true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(params: ModifierTable) {
        return 1
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(params: ModifierTable) {
        if (params.unit == this.GetParentPlus()) {
            let hParent = this.GetParentPlus()
            if (hParent.GetHealth() >= 1 && hParent.GetHealth() <= params.damage) {
                this.IncrementStackCount()
                hParent.ModifyHealth(hParent.GetMaxHealth(), null, false, 0)
            }
        }
    }
}

