import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_dummy } from "../../../modifier/modifier_dummy";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { unit_dummy } from "../../../units/common/unit_dummy";


@registerAbility()
export class t28_toss_stone extends BaseAbility_Plus {

    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        let aoe_radius_inner = this.GetSpecialValueFor("aoe_radius_inner")
        let aoe_radius_outer = this.GetSpecialValueFor("aoe_radius_outer")
        let aoe_damage_percent_inner = this.GetSpecialValueFor("aoe_damage_percent_inner")
        let aoe_damage_percent_outer = this.GetSpecialValueFor("aoe_damage_percent_outer")
        let slow_duration = this.GetSpecialValueFor("slow_duration")

        let duration = 0
        // let combination_t28_bonus_damage = combination_t28_bonus_damage.findIn(hCaster)
        // let bValid = GameFunc.IsValid(combination_t28_bonus_damage) && combination_t28_bonus_damage.IsActivated()
        // if (bValid) {
        //     duration = combination_t28_bonus_damage.GetSpecialValueFor("duration")
        // }

        if (GameFunc.IsValid(hTarget)) {
            vLocation = hTarget.GetAbsOrigin()
        }
        modifier_t28_toss_stone_particle_t28_toss_stone.applyThinker(vLocation, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vLocation, aoe_radius_outer, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)

        let fAttackDamage = hCaster.GetAverageTrueAttackDamage(hTarget)

        for (let hUnit of (tTargets)) {

            let fDamagePercent = aoe_damage_percent_outer
            // if (bValid) {
            // modifier_combination_t28_bonus_damage.apply(hCaster, hCaster, combination_t28_bonus_damage, { duration: duration })
            // }
            if (hUnit.IsPositionInRange(vLocation, aoe_radius_inner)) {
                fDamagePercent = aoe_damage_percent_inner

                modifier_t28_toss_stone_slow.apply(hUnit, hCaster, this, { duration: slow_duration * hUnit.GetStatusResistanceFactor(hCaster) })
            }
            let tDamageTable = {
                victim: hUnit,
                attacker: hCaster,
                damage: fAttackDamage * fDamagePercent * 0.01,
                damage_type: this.GetAbilityDamageType(),
                ability: this
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Brewmaster_Earth.Boulder.Target", hCaster)

        let hThinker = EntIndexToHScript(ExtraData.thinker_index || -1)
        if (GameFunc.IsValid(hThinker)) {
            UTIL_Remove(hThinker)
        }
    }
    TossStone(vPosition: Vector) {
        let hCaster = this.GetCasterPlus()

        let speed = this.GetSpecialValueFor("speed")

        let hThinker = unit_dummy.CreateOne(vPosition, hCaster.GetTeamNumber(), false, hCaster, hCaster)
        modifier_dummy.apply(hThinker, hCaster, this, { duration: 10 })

        let info: CreateTrackingProjectileOptions = {
            EffectName: "particles/units/heroes/hero_brewmaster/brewmaster_hurl_boulder.vpcf",
            Ability: this,
            iMoveSpeed: speed,
            Source: hCaster,
            Target: hThinker,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
            vSourceLoc: hCaster.GetAbsOrigin(),
            ExtraData: {
                thinker_index: hThinker.entindex()
            }
        }
        ProjectileManager.CreateTrackingProjectile(info)

        hCaster.EmitSound("Brewmaster_Earth.Boulder.Cast")
    }

    GetIntrinsicModifierName() {
        return "modifier_t28_toss_stone"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t28_toss_stone extends BaseModifier_Plus {
    records: any[];
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
            this.records = []
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (this.records.indexOf(params.record) != null) {
            return -1000
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            params.attacker.RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2)
            if ((this.GetParentPlus().GetCurrentActiveAbility() == this.GetAbilityPlus() || this.GetAbilityPlus().GetAutoCastState()) && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && !this.GetParentPlus().IsSilenced() && this.GetAbilityPlus().IsCooldownReady() && this.GetAbilityPlus().IsOwnersManaEnough() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
                params.attacker.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_2, params.attacker.GetAttackSpeed())
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (!params.attacker.PassivesDisabled() && params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != null) {
                let hAbility = this.GetAbilityPlus() as t28_toss_stone
                hAbility.UseResources(true, true, true)

                let hCaster = params.attacker
                let hTarget = params.target

                let vPosition = hTarget.GetAbsOrigin()

                hAbility.TossStone(vPosition)

                // let combination_t28_multi_toss  = combination_t28_multi_toss.findIn(  hCaster )
                // let has_combination_t28_multi_toss = GameFunc.IsValid(combination_t28_multi_toss) && combination_t28_multi_toss.IsActivated()

                // if (has_combination_t28_multi_toss) {
                //     let extra_target_count = combination_t28_multi_toss.GetSpecialValueFor("extra_target_count")
                //     let iCount = 0
                //     let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), hCaster.Script_GetAttackRange() + hCaster.GetHullRadius(), null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
                //     for (let _hTarget of (tTargets)) {

                //         if (_hTarget != hTarget) {
                //             let vPosition = _hTarget.GetAbsOrigin()

                //             hAbility.TossStone(vPosition)

                //             iCount = iCount + 1

                //             if (iCount >= extra_target_count) {
                //                 break
                //             }
                //         }
                //     }
                // }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t28_toss_stone_slow extends BaseModifier_Plus {
    slow_movespeed: number;
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
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_earth_spirit_boulderslow.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.slow_movespeed = this.GetSpecialValueFor("slow_movespeed")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.slow_movespeed
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t28_toss_stone_particle_t28_toss_stone extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let aoe_radius_outer = this.GetSpecialValueFor("aoe_radius_outer")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t28_toss_stone.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(aoe_radius_outer, aoe_radius_outer, aoe_radius_outer))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }

}