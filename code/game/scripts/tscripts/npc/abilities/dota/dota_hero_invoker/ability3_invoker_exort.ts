import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability6_invoker_invoke } from "./ability6_invoker_invoke";

/** dota原技能数据 */
export const Data_invoker_exort = { "ID": "5372", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "MaxLevel": "7", "AbilityCooldown": "0", "AbilityManaCost": "0", "AbilityCastAnimation": "ACT_INVALID", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_damage_per_instance": "2 4 6 8 10 12 14" } } };

@registerAbility()
export class ability3_invoker_exort extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_exort";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_exort = Data_invoker_exort;


    OnSpellStart() {
        if (RandomInt(0, 1) == 0) {
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1)
        } else {
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2)
        }
        let hAbility = this.GetCasterPlus().FindAbilityByName('ability6_invoker_invoke') as ability6_invoker_invoke
        if (hAbility) {
            hAbility.Invoke("exort")
        }
    }
    ProcsMagicStick() {
        return false
    }
    GetMaxLevel() {
        return super.GetMaxLevel() + this.GetCasterPlus().GetTalentValue("special_bonus_unique_invoker_custom_5")
    }

    GetLevel() {
        return super.GetLevel() + this.GetCasterPlus().GetTalentValue("special_bonus_unique_invoker_custom_5")
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers

@registerModifier()
export class modifier_invoker_exort_custom extends BaseModifier_Plus {
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingMagicalDamagePercentage() {
        return this.GetAbilityPlus().GetLevelSpecialValueFor("magic_damage_bonus", this.GetAbilityPlus().GetLevel())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.EOM_GetModifierOutgoingMagicalDamagePercentage()
    }
}
