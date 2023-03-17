import { BattleHelper } from "../../../../helper/BattleHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_bleeding } from "../../../modifier/effect/modifier_generic_bleeding";
import { modifier_generic_poison } from "../../../modifier/effect/modifier_generic_poison";

/** dota原技能数据 */
export const Data_queenofpain_scream_of_pain = { "ID": "5175", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_QueenOfPain.ScreamOfPain", "AbilityCastRange": "0", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "7", "AbilityDamage": "75 150 225 300", "AbilityManaCost": "85 100 115 130", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "area_of_effect": "550" }, "02": { "var_type": "FIELD_INTEGER", "projectile_speed": "900" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT" };

@registerAbility()
export class ability3_queenofpain_scream_of_pain extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "queenofpain_scream_of_pain";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_queenofpain_scream_of_pain = Data_queenofpain_scream_of_pain;
    Init() {
        this.SetDefaultSpecialValue("loss_health_percent", 10);
        this.SetDefaultSpecialValue("extra_damage_percent", [7, 8, 9, 10, 11]);
        this.SetDefaultSpecialValue("poisons", [100, 500, 1300, 2500, 4100]);
        this.SetDefaultSpecialValue("poisons_per_int", 4);
        this.SetDefaultSpecialValue("bleeding_duration", 5);
        this.SetDefaultSpecialValue("bleeding_damage_int_factor", [2, 4, 6, 8, 10]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("loss_health_percent", 20);
        this.SetDefaultSpecialValue("extra_damage_percent", [7, 8, 9, 10, 11]);

    }



    Trigger(hTarget?: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let poisons = this.GetSpecialValueFor("poisons")
        let poisons_per_int = this.GetSpecialValueFor("poisons_per_int")
        let bleeding_duration = this.GetSpecialValueFor("bleeding_duration")
        let bleeding_damage_int_factor = this.GetSpecialValueFor("bleeding_damage_int_factor") + hCaster.GetTalentValue("special_bonus_unique_queenofpain_custom_6")

        modifier_generic_bleeding.Bleeding(hTarget, hCaster, this, bleeding_duration, (tDamageTable) => {
            tDamageTable.eom_flags = tDamageTable.eom_flags + BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_NO_DAMAGE_AMPLIFY
            return hCaster.GetIntellect() * bleeding_damage_int_factor * 0.01
        }, true)

        modifier_generic_poison.Poison(hTarget, hCaster, this, poisons + hCaster.GetIntellect() * poisons_per_int)
    }
    GetIntrinsicModifierName() {
        return "modifier_queenofpain_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_queenofpain_3 extends BaseModifier_Plus {
    loss_health_percent: number;
    extra_damage_percent: number;
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
        this.loss_health_percent = this.GetSpecialValueFor("loss_health_percent")
        this.extra_damage_percent = this.GetSpecialValueFor("extra_damage_percent")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    GetTotalDamageOutgoing_Percentage(params: IModifierTable) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (params.attacker == hParent && !hParent.PassivesDisabled()) {
                if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_AFTER_TRANSFORMED_DAMAGE)) {
                    return
                }

                let hAbility = params.inflictor
                if (GFuncEntity.IsValid(hAbility) && hAbility != this.GetAbilityPlus() && !hAbility.IsItem() && !hAbility.IsToggle()) {
                    (this.GetAbilityPlus() as ability3_queenofpain_scream_of_pain).Trigger(params.target as IBaseNpc_Plus)
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_GetModifierOutgoingDamagePercentage(params: IModifierTable) {
        if (!IsServer() || params == null) {
            return
        }

        let hParent = this.GetParentPlus()
        if (hParent.PassivesDisabled()) {
            return
        }
        if (params.attacker == hParent) {
            let fLossHealthPercent = 100 - params.target.GetHealthPercent()
            let fDamagePercent = math.floor(fLossHealthPercent / this.loss_health_percent) * this.extra_damage_percent
            return fDamagePercent
        }
    }
}
