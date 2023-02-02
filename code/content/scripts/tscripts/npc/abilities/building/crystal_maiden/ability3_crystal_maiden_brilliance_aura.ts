import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_crystal_maiden_brilliance_aura = { "ID": "5128", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "AbilityCastPoint": "0.2", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "mana_regen": "0.5 1 1.5 2" }, "02": { "var_type": "FIELD_FLOAT", "self_factor": "3.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_crystal_maiden_brilliance_aura extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "crystal_maiden_brilliance_aura";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_crystal_maiden_brilliance_aura = Data_crystal_maiden_brilliance_aura;
    Init() {
        this.SetDefaultSpecialValue("mana_regen", [6, 8, 10, 12, 14]);
        this.SetDefaultSpecialValue("mana_regen_self", [12, 16, 20, 24, 28]);
        this.SetDefaultSpecialValue("mana_regen_percent", 1);
        this.SetDefaultSpecialValue("mana_regen_percent_self", 2);
        this.SetDefaultSpecialValue("radius", 1200);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("extra_mana_cost_perent", [4, 6, 8, 10, 12]);
        this.SetDefaultSpecialValue("bonus_spell_amp", [20, 25, 30, 35, 40]);

    }





    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_crystal_maiden_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_crystal_maiden_3 extends BaseModifier_Plus {
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
        return !this.GetParentPlus().IsIllusion() && !this.GetParentPlus().PassivesDisabled()
    }
    GetAura() {
        return "modifier_crystal_maiden_3_aura"
    }
    GetAuraRadius() {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
    }
    GetAuraEntityReject(hEntity: IBaseNpc_Plus) {
        return hEntity.GetUnitLabel() == "builder"
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MANA_ONLY + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_crystal_maiden_3_aura extends BaseModifier_Plus {
    mana_regen: number;
    mana_regen_self: number;
    mana_regen_percent: number;
    mana_regen_percent_self: number;
    duration: number;
    extra_mana_cost_perent: number;
    bonus_spell_amp: number;
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
        let hParent = this.GetParentPlus()
        this.mana_regen = this.GetSpecialValueFor("mana_regen")
        this.mana_regen_self = this.GetSpecialValueFor("mana_regen_self")
        this.mana_regen_percent = this.GetSpecialValueFor("mana_regen_percent")
        this.mana_regen_percent_self = this.GetSpecialValueFor("mana_regen_percent_self")
        this.duration = this.GetSpecialValueFor("duration")
        this.extra_mana_cost_perent = this.GetSpecialValueFor("extra_mana_cost_perent")
        this.bonus_spell_amp = this.GetSpecialValueFor("bonus_spell_amp")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE)
    EOM_GetModifierConstantManaRegen(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return 0
        }
        return (this.GetParentPlus() == hCaster && this.mana_regen_self || this.mana_regen) + hCaster.GetTalentValue("special_bonus_unique_crystal_maiden_custom_2")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    On_Tooltip2() {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return 0
        }
        return (this.GetParentPlus() == hCaster && this.mana_regen_self || this.mana_regen) + hCaster.GetTalentValue("special_bonus_unique_crystal_maiden_custom_2")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    GetTotalPercentageManaRegen(params: IModifierTable) {
        return (this.GetParentPlus() == this.GetCasterPlus()) && this.mana_regen_percent_self || this.mana_regen_percent
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    AbilityExecuted(params: ModifierAbilityEvent) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params.unit == hParent) {
            if (!GameFunc.IsValid(hCaster)) { return }
            if (!GameFunc.IsValid(params.ability) || params.ability.IsItem() || !params.ability.ProcsMagicStick() || !hParent.IsAlive()) { return }
            if (hParent == hCaster || hCaster.HasTalent("special_bonus_unique_crystal_maiden_custom_5")) {
                let fMaxMana = hParent.GetMaxMana()
                let fCurMana = hParent.GetMana()
                let fCurManaCost = params.ability.GetManaCost(-1)
                let fExtraManaCost = this.extra_mana_cost_perent * fMaxMana * 0.01
                if (fCurMana >= fCurManaCost + fExtraManaCost) {
                    hParent.SpendMana(fExtraManaCost, params.ability)
                    modifier_crystal_maiden_3_spell_damage.apply(hParent, hParent, hAbility, { duration: this.duration })
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    EOM_GetModifierPercentageCooldown(params: IModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_unique_crystal_maiden_custom_8")
        }
        return 0
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_crystal_maiden_3_spell_damage extends BaseModifier_Plus {
    bonus_spell_amp: number;
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
        let hParent = this.GetParentPlus()
        this.bonus_spell_amp = this.GetSpecialValueFor("bonus_spell_amp")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    g_SPELL_AMPLIFY_BONUS() {
        return this.bonus_spell_amp
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.bonus_spell_amp
    }

}
