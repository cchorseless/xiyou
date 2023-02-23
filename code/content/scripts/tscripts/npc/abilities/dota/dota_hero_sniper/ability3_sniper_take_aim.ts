import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_sniper_take_aim = { "ID": "5156", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "35 30 25 20", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_attack_range": "100 200 300 400", "LinkedSpecialBonus": "special_bonus_unique_sniper_6" }, "02": { "var_type": "FIELD_FLOAT", "duration": "4" }, "03": { "var_type": "FIELD_INTEGER", "slow": "25" }, "04": { "var_type": "FIELD_INTEGER", "headshot_chance": "40" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_sniper_take_aim extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sniper_take_aim";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sniper_take_aim = Data_sniper_take_aim;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_range", [100, 200, 300, 400, 500]);
        this.SetDefaultSpecialValue("damage_percent", [1.5, 2, 2.5, 3.5, 5]);
        this.SetDefaultSpecialValue("range_factor", 100);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_attack_range", [100, 200, 300, 400, 500]);
        this.SetDefaultSpecialValue("damage_percent", [0.5, 1.0, 1.5, 2.0, 2.5]);
        this.SetDefaultSpecialValue("range_factor", 100);

    }



    GetIntrinsicModifierName() {
        return "modifier_sniper_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sniper_3 extends BaseModifier_Plus {
    bonus_attack_range: number;
    damage_percent: number;
    range_factor: number;
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
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        this.range_factor = this.GetSpecialValueFor("range_factor")
        this.damage_percent = this.GetSpecialValueFor("damage_percent")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    GetAttackRangeBonus(params: IModifierTable) {
        if (!this.GetParentPlus().PassivesDisabled()) {
            return this.bonus_attack_range
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    GetCastRangeBonusStacking(params: ModifierAbilityEvent) {
        if (this.GetParentPlus().PassivesDisabled()) {
            return 0
        }
        let inarr = GameFunc.IncludeArgs((params.ability.GetBehaviorInt()), DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_RUNE_TARGET,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING,
        )
        if (GameFunc.IsValid(params.ability) && !inarr[0] && inarr[1] || inarr[2] || inarr[3] || inarr[4] || inarr[5] || inarr[6]) {
            return this.bonus_attack_range
        }
        else if (!GameFunc.IsValid(params.ability)) {
            return this.bonus_attack_range
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_GetModifierOutgoingDamagePercentage(params: IModifierTable) {
        if (IsServer() && params != null) {
            let hParent = this.GetParentPlus()
            if (params.attacker == hParent && !hParent.PassivesDisabled()) {
                let fDistance = ((params.target.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Length2D()
                let fDamagePercent = math.floor(fDistance / this.range_factor) * this.damage_percent
                if (fDamagePercent > 0) {
                    return fDamagePercent
                }
            }
        }
    }
}
