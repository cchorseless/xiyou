import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";


@registerAbility()
export class t9_blasphemy extends BaseAbility_Plus {

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnAbilityPhaseStart() {
        this.GetCasterPlus().EmitSound("n_creep_Spawnlord.Stomp")
        return true
    }
    OnAbilityPhaseInterrupted() {
        this.GetCasterPlus().StopSound("n_creep_Spawnlord.Stomp")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let damage_pct = this.GetSpecialValueFor("damage_pct")
        let duration = this.GetSpecialValueFor("duration")
        modifier_t9_blasphemy_particle_neutral_prowler_shaman_stomp.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        // let combination_t09_enhanced_petrify = combination_t09_enhanced_petrify.findIn(hCaster)
        // let has_combination_t09_enhanced_petrify = false
        // if (GameFunc.IsValid(combination_t09_enhanced_petrify) && combination_t09_enhanced_petrify.IsActivated()) {
        //     has_combination_t09_enhanced_petrify = true
        // }

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {


            // if ((has_combination_t09_enhanced_petrify)) {
            //     combination_t09_enhanced_petrify.EnhancedPetrify(hTarget)
            // }

            modifier_t9_blasphemy_debuff.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })

            let fDamage = hCaster.GetAverageTrueAttackDamage(hTarget) * damage_pct * 0.01

            let tDamageTable = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_t9_blasphemy"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t9_blasphemy extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME)
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

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState() || !ability.IsActivated()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t9_blasphemy_debuff extends BaseModifier_Plus {
    armor_reduce_pct: number;
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
    ShouldUseOverheadOffset() {
        return true
    }
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/neutral_fx/neutral_prowler_shaman_stomp_debuff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            })
            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }
    Init(params: IModifierTable) {
        this.armor_reduce_pct = this.GetSpecialValueFor("armor_reduce_pct")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE)
    CC_GetModifierPhysicalArmorBasePercentage(params: IModifierTable) {
        return -this.armor_reduce_pct
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return -this.armor_reduce_pct
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t9_blasphemy_particle_neutral_prowler_shaman_stomp extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/neutral_fx/neutral_prowler_shaman_stomp.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            })
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}