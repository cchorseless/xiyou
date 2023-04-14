
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_shock } from "../../../modifier/effect/modifier_generic_shock";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_razor_unstable_current = { "ID": "5084", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "HasShardUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "self_movement_speed_pct": "12 16 20 24", "LinkedSpecialBonus": "special_bonus_unique_razor_5" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_razor_unstable_current extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "razor_unstable_current";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_razor_unstable_current = Data_razor_unstable_current;
    Init() {
        this.SetDefaultSpecialValue("attack_damage_shock_pct", 8);
        this.SetDefaultSpecialValue("attack_shock_damage_pct", [130, 170, 220, 280, 350]);
        this.SetDefaultSpecialValue("count", 1);

    }


    GetIntrinsicModifierName() {
        return "modifier_razor_3"
    }
}

//  Modifiers
@registerModifier()
export class modifier_razor_3 extends BaseModifier_Plus {

    IsHidden() {
        return true
    }
    GetTexture() {
        return this.GetAbilityPlus().GetAbilityTextureName()
    }
    Isbuff() {
        return true
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    ATtackLanded(params: ModifierAttackEvent) {
        let hAttacker = params.attacker as IBaseNpc_Plus
        let hTarget = params.target as IBaseNpc_Plus
        if (IsValid(hAttacker) && IsValid(hTarget)) {
            let iAttackDamage = hAttacker.GetAverageTrueAttackDamage(null)
            let iShockCount = this.GetSpecialValueFor("attack_damage_shock_pct")
            let iShockDamagePct = this.GetSpecialValueFor("attack_shock_damage_pct")
            let sTalentName = "special_bonus_unique_razor_custom_7"
            let iShockTimes = hAttacker.HasTalent(sTalentName) && this.GetSpecialValueFor("count") + hAttacker.GetTalentValue(sTalentName) || this.GetSpecialValueFor("count")
            modifier_generic_shock.Shock(hTarget, hAttacker, this.GetAbilityPlus(), iAttackDamage * (iShockCount * 0.01))
            for (let i = 1; i <= iShockTimes; i++) {
                modifier_generic_shock.ShockActive(hTarget, hAttacker, this.GetAbilityPlus(), iShockDamagePct, true)
            }
        }
    }
}
