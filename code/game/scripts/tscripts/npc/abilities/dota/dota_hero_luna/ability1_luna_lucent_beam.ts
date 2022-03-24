
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_luna_lucent_beam = { "ID": "5222", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Luna.LucentBeam.Target", "HasShardUpgrade": "1", "AbilityCastRange": "800", "AbilityCastPoint": "0.4", "AbilityCooldown": "6.0 6.0 6.0 6.0", "AbilityManaCost": "90 100 110 120", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "stun_duration": "0.8" }, "02": { "var_type": "FIELD_INTEGER", "beam_damage": "75 150 225 300", "LinkedSpecialBonus": "special_bonus_unique_luna_1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_luna_lucent_beam extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "luna_lucent_beam";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_luna_lucent_beam = Data_luna_lucent_beam;
    Init() {
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("stun_duration", 0.8);
        this.SetDefaultSpecialValue("beam_damage", [600, 800, 1000, 1200, 1600, 2000]);
        this.SetDefaultSpecialValue("beam_damage_per_agi", [1, 2, 3, 4, 5, 6]);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_luna/luna_lucent_beam_precast.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID)
        return true
    }
    LucentBeam(hTarget: BaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let beam_damage = this.GetSpecialValueFor("beam_damage")
        let beam_damage_per_agi = this.GetSpecialValueFor("beam_damage_per_agi") + hCaster.GetTalentValue("special_bonus_unique_luna_custom_3")
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Luna.LucentBeam.Target", hCaster), hCaster)
        let iAgi = hCaster.GetAgility != null && hCaster.GetAgility() || 0
        let fDamage = beam_damage + beam_damage_per_agi * iAgi
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {
            BattleHelper.GoApplyDamage({
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            })
        }

        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_luna/luna_lucent_beam.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 5, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 6, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID)
        modifier_stunned.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        this.LucentBeam(hTarget)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Luna.LucentBeam.Cast", hCaster))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_luna_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_luna_1 extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }
            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }
            if (!ability.IsAbilityReady()) {
                return
            }
            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let target = AoiHelper.GetAOEMostTargetsSpellTarget(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
