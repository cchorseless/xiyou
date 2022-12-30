
import { GameFunc } from "../../../../GameFunc";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_pudge_flesh_heap = { "ID": "5074", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "magic_resistance": "12 14 16 18" }, "02": { "var_type": "FIELD_FLOAT", "flesh_heap_strength_buff_amount": "1.5 2 2.5 3.0", "LinkedSpecialBonus": "special_bonus_unique_pudge_1" }, "03": { "var_type": "FIELD_INTEGER", "flesh_heap_range": "450" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_pudge_flesh_heap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pudge_flesh_heap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pudge_flesh_heap = Data_pudge_flesh_heap;
    Init() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("bonus_health", [10, 20, 30, 40, 50]);
        this.SetDefaultSpecialValue("bonus_str", [0.2, 0.5, 0.8, 1.1, 1.5]);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    GetIntrinsicModifierName() {
        return "modifier_pudge_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pudge_3 extends BaseModifier_Plus {
    bonus_health: number;
    IsHidden() {
        return this.GetStackCount() == 0
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
    Init(params: ModifierTable) {
        this.bonus_health = this.GetSpecialValueFor("bonus_health")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    Death(params: ModifierTable) {
        let hAttacker = params.attacker
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (GameFunc.IsValid(hAttacker) && hAttacker.GetUnitLabel() != "builder") {
            if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
                return
            }
            hAttacker = hAttacker.GetSource()
            if (GameFunc.IsValid(hAttacker) && !hAttacker.IsIllusion() && !hAttacker.PassivesDisabled()
                // && !Spawner.IsEndless()
            ) {
                // 非击杀
                let factor = params.unit.IsConsideredHero() && 5 || 1
                this.SetStackCount(this.GetStackCount() + factor)
                if (hAttacker == hParent) {
                    // 击杀
                    modifier_pudge_3_bonus_str.apply(hParent, hParent, hAbility, { factor: factor })
                }
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_BONUS)
    EOM_GetModifierHealthBonus() {
        return this.GetStackCount() * this.bonus_health * (1 + this.GetCasterPlus().GetTalentValue("special_bonus_unique_pudge_custom_8") * 0.01)
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.GetStackCount() * this.bonus_health * (1 + this.GetCasterPlus().GetTalentValue("special_bonus_unique_pudge_custom_8") * 0.01)
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pudge_3_bonus_str extends BaseModifier_Plus {
    bonus_str: number;
    IsHidden() {
        return this.GetStackCount() == 0
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
    Init(params: ModifierTable) {
        this.bonus_str = this.GetSpecialValueFor("bonus_str")
        if (IsServer()) {
            this.SetStackCount(this.GetStackCount() + (params.factor || 0))
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    EOM_GetModifierBonusStats_Strength() {
        return this.GetStackCount() * this.bonus_str * (1 + this.GetCasterPlus().GetTalentValue("special_bonus_unique_pudge_custom_8") * 0.01)
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.GetStackCount() * this.bonus_str * (1 + this.GetCasterPlus().GetTalentValue("special_bonus_unique_pudge_custom_8") * 0.01)
    }
}
