
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability2_bristleback_quill_spray } from "./ability2_bristleback_quill_spray";
import { ability6_bristleback_warpath } from "./ability6_bristleback_warpath";

/** dota原技能数据 */
export const Data_bristleback_bristleback = { "ID": "5550", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilitySound": "Hero_Bristleback.Bristleback", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "side_damage_reduction": "8 12 16 20" }, "02": { "var_type": "FIELD_INTEGER", "back_damage_reduction": "16 24 32 40" }, "03": { "var_type": "FIELD_INTEGER", "side_angle": "110" }, "04": { "var_type": "FIELD_INTEGER", "back_angle": "70" }, "05": { "var_type": "FIELD_INTEGER", "quill_release_threshold": "210" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_bristleback_bristleback extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bristleback_bristleback";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bristleback_bristleback = Data_bristleback_bristleback;
    Init() {
        this.SetDefaultSpecialValue("per_stacks_base_attack_pct", 60);
        this.SetDefaultSpecialValue("per_stacks_attack_speed", 20);
        this.SetDefaultSpecialValue("per_stacks_amplify_damage_pct", 5);
        this.SetDefaultSpecialValue("max_stacks", [6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("duration", 14);
        this.SetDefaultSpecialValue("inherit_pct", 30);

    }



    // GetIntrinsicModifierName() {
    //     return "modifier_bristleback_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bristleback_3 extends BaseModifier_Plus {
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

    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: ModifierAbilityEvent) {
        let hParent = this.GetParentPlus()
        let hCaster = params.unit
        if (hCaster != null && hCaster == hParent && !hCaster.IsIllusion() && hCaster.IsAlive()) {
            let hAbility = params.ability
            if (hAbility == null || hAbility.IsItem() || hAbility.IsToggle()) {
                return
            }
            let duration = this.GetSpecialValueFor("duration") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_bristleback_custom_3")
            let hModifier = modifier_bristleback_3_buff.apply(hParent, hParent, this.GetAbilityPlus(), { duration: duration })
            // 监听三技能施法，给2技能范围内的友方单位继承一定比例的战意效果
            let hAbility2 = ability2_bristleback_quill_spray.findIn(hParent)
            let hAbility3 = ability6_bristleback_warpath.findIn(hParent)
            if (GameFunc.IsValid(hAbility2) && hAbility2.GetLevel() >= 1 && GameFunc.IsValid(hAbility3) && hAbility == hAbility3 && GameFunc.IsValid(hModifier)) {
                let radius = hAbility2.GetSpecialValueFor("radius")
                let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                for (let hTarget of (tTarget)) {
                    if (hTarget != hParent) {
                        modifier_bristleback_3_buff.remove(hTarget);
                        let _hModifier = modifier_bristleback_3_buff.apply(hTarget, hParent, this.GetAbilityPlus(), { duration: duration })
                        _hModifier.SetStackCount(hModifier.GetStackCount())
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bristleback_3_buff extends BaseModifier_Plus {
    max_stacks: number;
    per_stacks_base_attack_pct: number;
    per_stacks_attack_speed: number;
    per_stacks_amplify_damage_pct: number;
    inherit_pct: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        this.max_stacks = this.GetSpecialValueFor("max_stacks") + hCaster.GetTalentValue("special_bonus_unique_bristleback_custom_5")
        this.per_stacks_base_attack_pct = this.GetSpecialValueFor("per_stacks_base_attack_pct")
        this.per_stacks_attack_speed = this.GetSpecialValueFor("per_stacks_attack_speed")
        this.per_stacks_amplify_damage_pct = this.GetSpecialValueFor("per_stacks_amplify_damage_pct")
        this.inherit_pct = this.GetSpecialValueFor("inherit_pct") + hCaster.GetTalentValue("special_bonus_unique_bristleback_custom_8")
        if (IsServer()) {
            if (this.GetStackCount() < this.max_stacks) {
                this.IncrementStackCount()
                this.addTimer(params.duration, () => {
                    this.DecrementStackCount()
                })
            }
        }
    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage() {
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            return this.per_stacks_base_attack_pct * this.GetStackCount()
        } else {
            return this.per_stacks_base_attack_pct * this.GetStackCount() * this.inherit_pct * 0.01
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            return this.per_stacks_attack_speed * this.GetStackCount()
        } else {
            return this.per_stacks_attack_speed * this.GetStackCount() * this.inherit_pct * 0.01
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    EOM_GetModifierSpellAmplifyBonus(params: ModifierTable) {
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            return this.per_stacks_amplify_damage_pct * this.GetStackCount()
        } else {
            return this.per_stacks_amplify_damage_pct * this.GetStackCount() * this.inherit_pct * 0.01
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            return this.per_stacks_amplify_damage_pct * this.GetStackCount()
        } else {
            return this.per_stacks_amplify_damage_pct * this.GetStackCount() * this.inherit_pct * 0.01
        }
    }
}
