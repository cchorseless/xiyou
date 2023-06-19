import { EBATTLE_ATTACK_STATE } from "../../../rules/System/BattleSystemComponent";
import { PropertyConfig } from "../../../shared/PropertyConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class kingkong_5 extends BaseAbility_Plus {
    GetIntrinsicModifierName() {
        return "modifier_kingkong_5"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_kingkong_5 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    trigger_pct: number;
    start_width: number;
    end_width: number;
    attackspeed: number;
    knockback_duration: number;
    knockback_distance: number;
    cleave_damage: number;
    // cleave_starting_width: number;
    // cleave_ending_width: number;
    // cleave_distance: number;
    // bonus_damage_pct: number;
    Init(params: IModifierTable) {
        this.trigger_pct = this.GetSpecialValueFor("trigger_pct")
        this.start_width = this.GetSpecialValueFor("start_width")
        this.end_width = this.GetSpecialValueFor("end_width")
        this.attackspeed = this.GetSpecialValueFor("attackspeed")
        this.knockback_duration = this.GetSpecialValueFor("knockback_duration")
        this.knockback_distance = this.GetSpecialValueFor("knockback_distance")
        this.cleave_damage = this.GetSpecialValueFor("cleave_damage")
        // this.cleave_starting_width = this.GetSpecialValueFor("cleave_starting_width")
        // this.cleave_ending_width = this.GetSpecialValueFor("cleave_ending_width")
        // this.cleave_distance = this.GetSpecialValueFor("cleave_distance")
        this.cleave_damage = this.GetSpecialValueFor("cleave_damage")
        // this.bonus_damage_pct = this.GetSpecialValueFor("bonus_damage_pct")
    }
    iParticleID: ParticleID;
    @registerProp(PropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant() {
        if (this.GetParentPlus().GetHealthPercent() <= this.trigger_pct) {
            return this.attackspeed
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_DAMAGE)
    CC_OnAttackDamage(params: ModifierAttackEvent) {
        if (!IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && params.attacker.GetHealthPercent() <= this.trigger_pct) {
            if (!params.attacker.PassivesDisabled()
                && !GBattleSystem.AttackFilter(params.record, EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE)
                && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                if (this.iParticleID == null) {
                    this.iParticleID = ParticleManager.CreateParticle("particles/units/boss/kingkong/kingkong_5_bloodlust.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
                    this.AddParticle(this.iParticleID, false, false, -1, false, false)
                }
                let sParticlePath = "particles/units/heroes/hero_sven/sven_spell_great_cleave.vpcf"
                let iParticleID = ParticleManager.CreateParticle(sParticlePath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, params.attacker)
                let n = 0
                GBattleSystem.DoCleaveAction(params.attacker, params.target, this.start_width, this.end_width, params.attacker.Script_GetAttackRange() + params.attacker.GetHullRadius(), (hTarget) => {
                    if (IsValid(hTarget)) {
                        //  击退
                        hTarget.ApplyKnockBack(this.GetAbilityPlus(), params.attacker, {
                            distance: this.knockback_distance,
                            duration: this.knockback_duration,
                            IsStun: true
                        });
                        ApplyDamage({
                            ability: this.GetAbilityPlus(),
                            attacker: params.attacker,
                            victim: hTarget,
                            damage: params.damage * this.cleave_damage * 0.01,
                            damage_type: params.damage_type,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL,
                        })
                        n = n + 1
                        ParticleManager.SetParticleControlEnt(iParticleID, n + 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                    }
                })
                ParticleManager.SetParticleControl(iParticleID, 1, Vector(2, 17, n))
                ParticleManager.ReleaseParticleIndex(iParticleID)
                //  击退
                params.target.ApplyKnockBack(this.GetAbilityPlus(), params.attacker, {
                    distance: this.knockback_distance,
                    duration: this.knockback_duration,
                    IsStun: true
                })
                params.attacker.EmitSound("Hero_Sven.GreatCleave")
            }
        }
    }
}