import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_feared } from "../../../modifier/effect/modifier_feared";

/** dota原技能数据 */
export const Data_nevermore_dark_lord = { "ID": "5063", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_AURA", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "OnCastbar": "0", "HasShardUpgrade": "1", "AbilityCastRange": "900", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "presence_armor_reduction": "-4 -5 -6 -7", "LinkedSpecialBonus": "special_bonus_unique_nevermore_5" }, "02": { "var_type": "FIELD_INTEGER", "presence_radius": "1200" } } };

@registerAbility()
export class ability5_nevermore_dark_lord extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nevermore_dark_lord";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nevermore_dark_lord = Data_nevermore_dark_lord;


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("presence_radius")
    }
    GetIntrinsicModifierName() {
        return "modifier_nevermore_4"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_nevermore_4 extends BaseModifier_Plus {
    presence_radius: any;
    max_damage_percent: number;
    min_range: number;
    range_decay_damage: number;
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
    IsAura() {
        return !this.GetParentPlus().IsIllusion() && !this.GetCasterPlus().PassivesDisabled()
    }
    GetAuraRadius() {
        return this.presence_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
    }
    GetAura() {
        return "modifier_nevermore_4_presence"
    }
    Init(params: IModifierTable) {
        this.presence_radius = this.GetSpecialValueFor("presence_radius")
        this.max_damage_percent = this.GetSpecialValueFor("max_damage_percent")
        this.min_range = this.GetSpecialValueFor("min_range")
        this.range_decay_damage = this.GetSpecialValueFor("range_decay_damage")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingDamagePercentage(params: IModifierTable) {
        if (IsServer() && params != null) {
            let hParent = this.GetParentPlus()
            if (params.attacker == hParent && !hParent.PassivesDisabled()) {
                let fDistance = ((params.target.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Length2D()
                let fDamagePercent = this.max_damage_percent
                if (fDistance > this.min_range) {
                    fDamagePercent = fDamagePercent - math.floor((fDistance - this.min_range) / 100) * this.range_decay_damage
                }
                if (fDamagePercent > 0) {
                    return fDamagePercent
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_nevermore_4_presence extends BaseModifier_Plus {
    presence_incoming_damage_ptg: number;
    fear_incoming_damage_ptg: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
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
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_LOW
    }
    Init(params: IModifierTable) {
        this.presence_incoming_damage_ptg = this.GetSpecialValueFor("presence_incoming_damage_ptg")
        this.fear_incoming_damage_ptg = this.GetSpecialValueFor("fear_incoming_damage_ptg")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    GetIncomingPhysicalDamage_Percentage(params: IModifierTable) {
        if (!GameFunc.IsValid(this.GetCasterPlus()) || this.GetCasterPlus().PassivesDisabled()) {
            return 0
        }
        return this.presence_incoming_damage_ptg
    }
    // 恐惧加深所有伤害
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingDamagePercentage(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (params.target == hParent && modifier_feared.exist(hParent) && GameFunc.IsValid(hCaster) && !hCaster.PassivesDisabled()) {
            return this.fear_incoming_damage_ptg
        }
    }
}
