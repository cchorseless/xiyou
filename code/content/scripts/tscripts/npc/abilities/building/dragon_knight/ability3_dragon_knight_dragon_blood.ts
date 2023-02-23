import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_dragon_knight_6_form } from "./ability6_dragon_knight_elder_dragon_form";

/** dota原技能数据 */
export const Data_dragon_knight_dragon_blood = { "ID": "5228", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_health_regen": "4 8 12 16", "LinkedSpecialBonus": "special_bonus_unique_dragon_knight" }, "02": { "var_type": "FIELD_INTEGER", "bonus_armor": "3 6 9 12", "LinkedSpecialBonus": "special_bonus_unique_dragon_knight" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_dragon_knight_dragon_blood extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dragon_knight_dragon_blood";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dragon_knight_dragon_blood = Data_dragon_knight_dragon_blood;
    Init() {
        this.SetDefaultSpecialValue("bonus_health_per_kill", 60);
        this.SetDefaultSpecialValue("bonus_health_percent", [4, 6, 8, 10, 12]);
        this.SetDefaultSpecialValue("dragon_bonus_health_percent", [8, 12, 16, 20, 24]);

    }


    // GetIntrinsicModifierName() {
    //     return "modifier_dragon_knight_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dragon_knight_3 extends BaseModifier_Plus {
    bonus_health_percent: number;
    dragon_bonus_health_percent: number;
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
        this.bonus_health_percent = this.GetSpecialValueFor("bonus_health_percent")
        this.dragon_bonus_health_percent = this.GetSpecialValueFor("dragon_bonus_health_percent")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
    CC_GetModifierHealthPercentage() {
        let hParent = this.GetParentPlus()
        let bIsDragon = modifier_dragon_knight_6_form.findIn(hParent)
        if (bIsDragon) {
            return this.dragon_bonus_health_percent
        }
        return this.bonus_health_percent
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: IModifierTable) {
        let hAttacker = params.attacker
        if (GameFunc.IsValid(hAttacker) && hAttacker.GetUnitLabel() != "builder") {
            if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
                return
            }
            hAttacker = hAttacker.GetSource()
            // if (GameFunc.IsValid(hAttacker) && hAttacker == this.GetParentPlus() && !hAttacker.IsIllusion() && !hAttacker.PassivesDisabled() && !Spawner.IsEndless()) {
            //     let factor = params.unit.IsConsideredHero() && 5 || 1
            //      modifier_dragon_knight_3_buff.apply( hAttacker , hAttacker, this.GetAbilityPlus(), { count = factor })
            // }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_3_buff extends BaseModifier_Plus {
    bonus_health_per_kill: number;
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
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.bonus_health_per_kill = this.GetSpecialValueFor("bonus_health_per_kill")
        let iStackCount = this.GetStackCount()
        if (IsServer()) {
            this.SetStackCount(0)
            this.ChangeStackCount((params.count || 0))
        }
    }


    OnStackCountChanged(iOldStackCount: number) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let iNewStackCount = this.GetStackCount()
            // if (hParent.CalculateStatBonus) {
            //     hParent.CalculateStatBonus(true)
            // }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus() {
        return this.GetStackCount() * this.bonus_health_per_kill
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetStackCount() * this.bonus_health_per_kill
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    CC_GetModifierSpellAmplifyBonus() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetStackCount() * this.GetCasterPlus().GetTalentValue("special_bonus_unique_dragon_knight_custom_8")
        }
        return 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    On_Tooltip2() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetStackCount() * this.GetCasterPlus().GetTalentValue("special_bonus_unique_dragon_knight_custom_8")
        }
        return 0
    }

}
