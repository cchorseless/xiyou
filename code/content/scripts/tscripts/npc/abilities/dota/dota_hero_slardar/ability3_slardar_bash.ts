

import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_slardar_bash = { "ID": "5116", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "AbilitySound": "Hero_Slardar.Bash", "AbilityModifierSupportBonus": "25", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_damage": "50 100 150 200", "LinkedSpecialBonus": "special_bonus_unique_slardar_2" }, "02": { "var_type": "FIELD_FLOAT", "duration": "1.0 1.1 1.2 1.3" }, "03": { "var_type": "FIELD_INTEGER", "attack_count": "3" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_slardar_bash extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slardar_bash";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slardar_bash = Data_slardar_bash;
    Init() {
        this.SetDefaultSpecialValue("max_speed", [50, 100, 150, 200, 250]);
        this.SetDefaultSpecialValue("bonus_speed", [100, 200, 300, 400, 500]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("max_speed", [50, 100, 150, 200, 250]);
        this.SetDefaultSpecialValue("bonus_speed", [100, 200, 300, 400, 500]);

    }


    GetIntrinsicModifierName() {
        return "modifier_slardar_3"
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_slardar_3// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slardar_3 extends BaseModifier_Plus {
    max_speed: number;
    bonus_speed: number;
    IsHidden() {
        return true
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
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.max_speed = this.GetSpecialValueFor("max_speed")
        this.bonus_speed = this.GetSpecialValueFor("bonus_speed")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        if (this.GetStackCount() == 1) {
            return this.bonus_speed
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    EOM_GetModifierMaximumAttackSpeedBonus(params: IModifierTable) {
        return this.max_speed
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    attackStart(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        let hTarget = params.target
        if (IsServer() && params.attacker == hParent && GameFunc.IsValid(hTarget) && hTarget.GetClassname() != "dota_item_drop") {
            if (hTarget.IsStunned() && !hParent.PassivesDisabled()) {
                this.SetStackCount(1)
            } else {
                this.SetStackCount(0)
            }
        }
    }
}
