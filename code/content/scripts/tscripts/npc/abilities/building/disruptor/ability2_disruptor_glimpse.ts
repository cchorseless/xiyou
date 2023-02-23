import { BattleHelper } from "../../../../helper/BattleHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_disruptor_glimpse = { "ID": "5459", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Disruptor.Glimpse.Target", "AbilityCastPoint": "0.05 0.05 0.05 0.05", "AbilityCooldown": "48 38 28 18", "AbilityManaCost": "100", "AbilityCastRange": "600 1000 1400 1800", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "backtrack_time": "4.0 4.0 4.0 4.0" }, "02": { "var_type": "FIELD_INTEGER", "cast_range": "600 1000 1400 1800" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_disruptor_glimpse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "disruptor_glimpse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_disruptor_glimpse = Data_disruptor_glimpse;
    Init() {
        this.SetDefaultSpecialValue("duration", 3);
        this.SetDefaultSpecialValue("shock_count_increase", [4, 5, 6, 8, 10]);
        this.SetDefaultSpecialValue("scepter_proc_pct", 20);

    }



    // GetIntrinsicModifierName() {
    //     return "modifier_disruptor_3"
    // }
}

//  Modifiers
@registerModifier()
export class modifier_disruptor_3 extends BaseModifier_Plus {

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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    GetTotalDamageOutgoing_Percentage(params: IModifierTable) {
        if (params.attacker == this.GetParentPlus()) {
            let hCaster = params.attacker
            let hTarget = params.target
            let hAbility = this.GetAbilityPlus()
            let chance = hAbility.GetSpecialValueFor("scepter_proc_chance")
            if (hCaster.HasScepter() && RandomInt(1, 100) <= chance && !BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_SHOCK)) {
                let iShockCount = params.original_damage * (hAbility.GetSpecialValueFor("scepter_proc_pct") * 0.01)
                hTarget.Shock(hCaster, hAbility, iShockCount)
            }
        }
    }
    Process(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetParentPlus()
        let duration = this.GetSpecialValueFor("duration")
        modifier_disruptor_3_debuff.apply(hTarget, hCaster, this.GetAbilityPlus(), {
            duration: duration * (100 - hTarget.GetStatusResistance()) * 0.01
        })
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_SHOCK_APPLIED)
    OnShockApplied(params: IModifierTable) {
        this.Process(params.unit)
    }
}

//  Modifiers
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_disruptor_3_debuff extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetEffectName() {
        return "particles/units/heroes/hero_disruptor/disruptor_glimpse_anticipate_position.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_CENTER_FOLLOW
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.IncrementStackCount()
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.DecrementStackCount()
            }))
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return this.GetStackCount() * -this.GetSpecialValueFor("slow_pct")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SHOCK_COUNT_PERCENTAGE)
    CC_GetModifierIncomingShockCountPercentage() {
        return this.GetStackCount() * (this.GetSpecialValueFor("shock_count_increase") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_disruptor_custom_8"))
    }
    //  减速
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.GetStackCount() * this.GetSpecialValueFor("slow_pct")
    }
    //  叠加层数
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    Tooltip2() {
        return this.GetStackCount() * (this.GetSpecialValueFor("shock_count_increase") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_disruptor_custom_8"))
    }

}
