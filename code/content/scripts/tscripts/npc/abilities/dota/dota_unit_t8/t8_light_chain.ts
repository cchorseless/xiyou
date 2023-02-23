import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t8_light_chain extends BaseAbility_Plus {

    GetBehavior() {
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        let hCaster = this.GetCasterPlus()
        // if (GameFunc.IsValid(hCaster) && modifier_combination_t08_forked_lightning.exist(  hCaster ) && hCaster.GetStackCount("modifier_combination_t08_forked_lightning", hCaster) > 0) {;
        //     return iBehavior + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE
        // }
        return iBehavior
    }
    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        // if (GameFunc.IsValid(hCaster) && modifier_combination_t08_forked_lightning.exist(  hCaster ) && hCaster.GetStackCount("modifier_combination_t08_forked_lightning", hCaster) > 0) {;
        //     return hCaster.GetStackCount("modifier_combination_t08_forked_lightning", hCaster)
        // }
        return 500
    }
    Jump(target: IBaseNpc_Plus, units: IBaseNpc_Plus[], count: number) {
        // let caster = this.GetCasterPlus()
        // let chain_damage = this.GetSpecialValueFor("chain_damage") + this.GetSpecialValueFor("intellect_damage_factor") * caster.GetIntellect()
        // let chain_radius = this.GetSpecialValueFor("chain_radius")
        // let chain_strikes = this.GetSpecialValueFor("chain_strikes")
        // let chain_delay = this.GetSpecialValueFor("chain_delay")
        // this.addTimer(chain_delay, () => {
        //     if (!GameFunc.IsValid(caster)) {
        //         return
        //     }
        //     if (!GameFunc.IsValid(target)) {
        //         return
        //     }
        //     let new_target = AoiHelper.GetBounceTarget(units, caster.GetTeamNumber(), chain_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, target.GetAbsOrigin(), FindOrder.FIND_CLOSEST)
        //     if (new_target != null) {
        //         let iParticleID = ResHelper.CreateParticle({
        //     resPath: "particles/items_fx/chain_lightning.vpcf",
        //         resNpc: caster,
        //             iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
        //                 owner: null
        // });

        //         ParticleManager.SetParticleControlEnt(iParticleID, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true)
        //         ParticleManager.SetParticleControlEnt(iParticleID, 1, new_target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", new_target.GetAbsOrigin(), true)
        //         ParticleManager.ReleaseParticleIndex(iParticleID)

        //         let combination_t08_lightning_shackles  = combination_t08_lightning_shackles.findIn(  caster )
        //         if (GameFunc.IsValid(combination_t08_lightning_shackles) && combination_t08_lightning_shackles.IsActivated()) {
        //             combination_t08_lightning_shackles.LightningShackles(new_target)
        //         }
        //         let iDamage = chain_damage
        //         let hChainAbility = null
        //         let iPlayerID = caster.GetPlayerOwnerID()
        //         BuildSystem.EachHeroBuilding(
        //             iPlayerID,
        //             (hBuilding) => {
        //                 let hHero = hBuilding.GetUnitEntity()
        //                 for (let i = 0; i <= hHero.GetAbilityCount() - 1; i++) {
        //                     let hAbility = hHero.GetAbilityByIndex(i)
        //                     if (GameFunc.IsValid(hAbility)) {
        //                         if (hAbility.GetAbilityName() == "qualification_build_t08") {
        //                             hChainAbility = hAbility
        //                         }
        //                     }
        //                 }
        //             }
        //         )
        //         let hModifier  = modifier_qualification_build_t08_chain.findIn(  new_target )
        //         if (GameFunc.IsValid(hModifier) && GameFunc.IsValid(hChainAbility)) {
        //             let damage_superposition = hChainAbility.GetSpecialValueFor("damage_superposition")
        //             iDamage = iDamage + iDamage * hModifier.GetStackCount() * damage_superposition * 0.01
        //         }
        //         let damage_table = {
        //             ability: this,
        //             attacker: caster,
        //             victim: new_target,
        //             damage: iDamage,
        //             damage_type: this.GetAbilityDamageType()
        //         }
        //         BattleHelper.GoApplyDamage(damage_table)
        //         if (GameFunc.IsValid(hChainAbility)) {
        //              modifier_qualification_build_t08_chain.apply( new_target , caster, hChainAbility, { duration: hChainAbility.GetSpecialValueFor("duration") })
        //         }
        //         EmitSoundOnLocationWithCaster(new_target.GetAbsOrigin(), "n_creep_HarpyStorm.ChainLighting", caster)

        //         if (count < chain_strikes) {
        //             table.insert(units, new_target)
        //             this.Jump(new_target, units, count + 1)
        //         }
        //     }
        // }
        // )
    }
    OnSpellStart() {
        // let caster = this.GetCasterPlus()
        // let target = this.GetCursorTarget() as IBaseNpc_Plus;
        // if (!GameFunc.IsValid(target) || !target.IsAlive()) {
        //     return
        // }
        // let chain_damage = this.GetSpecialValueFor("chain_damage") + this.GetSpecialValueFor("intellect_damage_factor") * caster.GetIntellect()
        // let chain_strikes = this.GetSpecialValueFor("chain_strikes")
        // let chain_delay = this.GetSpecialValueFor("chain_delay")
        // let iParticleID = ResHelper.CreateParticle({
        //     resPath: "particles/items_fx/chain_lightning.vpcf",
        //     resNpc:   caster,
        //     iAttachment:   ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
        //     owner:  null
        // });

        // ParticleManager.SetParticleControlEnt(iParticleID, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true)
        // ParticleManager.SetParticleControlEnt(iParticleID, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true)
        // ParticleManager.ReleaseParticleIndex(iParticleID)
        // let combination_t08_lightning_shackles  = combination_t08_lightning_shackles.findIn(  caster )
        // if (GameFunc.IsValid(combination_t08_lightning_shackles) && combination_t08_lightning_shackles.IsActivated()) {
        //     combination_t08_lightning_shackles.LightningShackles(target)
        // }

        // let iDamage = chain_damage
        // let hChainAbility = null
        // let iPlayerID = caster.GetPlayerOwnerID()
        // BuildSystem.EachHeroBuilding(
        //     iPlayerID,
        //     (hBuilding) => {
        //         let hHero = hBuilding.GetUnitEntity()
        //         for (let i = 0; i <= hHero.GetAbilityCount() - 1; i++) {
        //             let hAbility = hHero.GetAbilityByIndex(i)
        //             if (GameFunc.IsValid(hAbility)) {
        //                 if (hAbility.GetAbilityName() == "qualification_build_t08") {
        //                     hChainAbility = hAbility
        //                 }
        //             }
        //         }
        //     }
        // )
        // let hModifier  = modifier_qualification_build_t08_chain.findIn(  target ) as IBaseModifier_Plus;
        // if (GameFunc.IsValid(hModifier) && GameFunc.IsValid(hChainAbility)) {
        //     let damage_superposition = hChainAbility.GetSpecialValueFor("damage_superposition")
        //     iDamage = iDamage + iDamage * hModifier.GetStackCount() * damage_superposition * 0.01
        // }
        // let damage_table = {
        //     ability: this,
        //     attacker: caster,
        //     victim: target,
        //     damage: iDamage,
        //     damage_type: this.GetAbilityDamageType()
        // }
        // BattleHelper.GoApplyDamage(damage_table)
        // if (GameFunc.IsValid(hChainAbility)) {
        //      modifier_qualification_build_t08_chain.apply( target , caster, hChainAbility, { duration: hChainAbility.GetSpecialValueFor("duration") })
        // }
        // EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), "n_creep_HarpyStorm.ChainLighting", caster)

        // if (1 < chain_strikes) {
        //     this.Jump(target, [target], 2)
        // }
        // //  组合技
        // let modifier  = modifier_combination_t08_forked_lightning.findIn(  caster ) as IBaseModifier_Plus;
        // if (GameFunc.IsValid(modifier) && modifier.GetStackCount() > 0) {
        //     let radius = modifier.radius
        //     let extra_count = modifier.extra_count
        //     let count = 0
        //     let tTargets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        //     for (let hTarget of (tTargets)) {

        //         if (hTarget != target) {
        // let iParticleID = ResHelper.CreateParticle({
        //     resPath: "particles/items_fx/chain_lightning.vpcf",
        //     resNpc: caster,
        //     iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
        //     owner: null
        // });

        //             ParticleManager.SetParticleControlEnt(iParticleID, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true)
        //             ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        //             ParticleManager.ReleaseParticleIndex(iParticleID)

        //             let combination_t08_lightning_shackles  = combination_t08_lightning_shackles.findIn(  caster )
        //             if (GameFunc.IsValid(combination_t08_lightning_shackles) && combination_t08_lightning_shackles.IsActivated()) {
        //                 combination_t08_lightning_shackles.LightningShackles(hTarget)
        //             }

        //             let damage_table = {
        //                 ability: this,
        //                 attacker: caster,
        //                 victim: hTarget,
        //                 damage: chain_damage,
        //                 damage_type: this.GetAbilityDamageType()
        //             }
        //             BattleHelper.GoApplyDamage(damage_table)

        //             EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), "n_creep_HarpyStorm.ChainLighting", caster)

        //             if (1 < chain_strikes) {
        //                 this.Jump(hTarget, [hTarget], 2)
        //             }

        //             count = count + 1

        //             if (count >= extra_count) {
        //                 break
        //             }
        //         }
        //     }
        // }
    }

    GetIntrinsicModifierName() {
        return "modifier_t8_light_chain"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t8_light_chain extends BaseModifier_Plus {
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

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}