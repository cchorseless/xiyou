import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { LogHelper } from "../../../../helper/LogHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { GameSetting } from "../../../../GameSetting";


@registerAbility()
export class t20_mana_steal extends BaseAbility_Plus {


    Jump(hTarget: BaseNpc_Plus, tUnits: BaseNpc_Plus[], iCount: number) {
        let hCaster = this.GetCasterPlus()
        let damage = this.GetSpecialValueFor("damage")
        let bounce_radius = this.GetSpecialValueFor("bounce_radius")
        let max_bounce_times = this.GetSpecialValueFor("max_bounce_times")
        let bounce_interval = this.GetSpecialValueFor("bounce_interval")
        this.addTimer(
            bounce_interval,
            () => {
                if (!GameFunc.IsValid(hCaster)) {
                    return
                }
                if (!GameFunc.IsValid(hTarget)) {
                    return
                }

                let hNewTarget = AoiHelper.GetBounceTarget(tUnits, hCaster.GetTeamNumber(), bounce_radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, hTarget.GetAbsOrigin(), FindOrder.FIND_CLOSEST)
                if (hNewTarget != null) {
                    //  净魂 减魔抗
                    // let combination_t20_diffusal = combination_t20_diffusal.findIn(hCaster)
                    // let has_combination_t20_diffusal = GameFunc.IsValid(combination_t20_diffusal) && combination_t20_diffusal.IsActivated()
                    // if (has_combination_t20_diffusal) {
                    //     // combination_t20_diffusal.Diffusal(hNewTarget)
                    // }
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/items2_fx/necronomicon_archer_manaburn.vpcf",
                        resNpc: null,
                        iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                        owner: null
                    });

                    ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
                    ParticleManager.SetParticleControlEnt(iParticleID, 1, hNewTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hNewTarget.GetAbsOrigin(), true)
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                    // modifier_t20_mana_steal_particle.applyThinker(hTarget.GetAttachmentOrigin(hTarget.ScriptLookupAttachment("attach_hitloc")), hNewTarget, this, { duration= BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)

                    let tDamageTable = {
                        victim: hNewTarget,
                        attacker: hCaster,
                        damage: damage,
                        damage_type: this.GetAbilityDamageType(),
                        ability: this
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                    this.RegainManaInRaius(damage)
                    EmitSoundOnLocationWithCaster(hNewTarget.GetAbsOrigin(), "n_creep_SatyrSoulstealer.ManaBurn", hCaster)
                    if (iCount < max_bounce_times) {
                        table.insert(tUnits, hNewTarget)
                        this.Jump(hNewTarget, tUnits, iCount + 1)
                    }
                }
            }
        )
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()

        let damage = this.GetSpecialValueFor("damage")
        let bounce_radius = this.GetSpecialValueFor("bounce_radius")
        let max_bounce_times = this.GetSpecialValueFor("max_bounce_times")
        let bounce_interval = this.GetSpecialValueFor("bounce_interval")

        //  净魂 减魔抗
        // let combination_t20_diffusal  = combination_t20_diffusal.findIn(  hCaster )
        // let has_combination_t20_diffusal = GameFunc.IsValid(combination_t20_diffusal) && combination_t20_diffusal.IsActivated()
        // if (has_combination_t20_diffusal) {
        //     // combination_t20_diffusal.Diffusal(hTarget)
        // }

        modifier_t20_mana_steal_particle.applyThinker(hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack1")), hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/items2_fx/necronomicon_archer_manaburn.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID)
        let tDamageTable = {
            victim: hTarget,
            attacker: hCaster,
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }
        BattleHelper.GoApplyDamage(tDamageTable)
        this.RegainManaInRaius(damage)
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "n_creep_SatyrSoulstealer.ManaBurn", hCaster)

        if (1 < max_bounce_times) {
            this.Jump(hTarget, [hTarget], 2)
        }
    }

    RegainManaInRaius(fDamage: number) {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        let mana_regain_pct = this.GetSpecialValueFor("mana_regain_pct")
        let mana_regain_radius = this.GetSpecialValueFor("mana_regain_radius")
        let fManaRegain = fDamage * mana_regain_pct * 0.01

        let tBuildings = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), mana_regain_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_CLOSEST)
        for (let i = tBuildings.length - 1; i >= 0; i--) {
            if (!tBuildings[i].IsBuilding()) {
                table.remove(tBuildings, i)
            }
        }
        for (let hTarget of (tBuildings)) {

            //  let iParticleID = ResHelper.CreateParticle({
            //     resPath: "particles/units/towers/smart_aura_effect_manarestore.vpcf",
            //     resNpc: null,
            //     iAttachment:   ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            //     owner:  hTarget
            // });

            //  ParticleManager.ReleaseParticleIndex(iParticleID)
            hTarget.GiveMana(fManaRegain)
            SendOverheadEventMessage(hCaster.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_ADD, hTarget, fManaRegain, hCaster.GetPlayerOwner())
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_t20_mana_steal"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t20_mana_steal extends BaseModifier_Plus {
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

            //  优先攻击目标
            let hTarget = hCaster.GetAttackTarget()
            if (hTarget != null && hTarget.GetClassname() == "dota_item_drop") {
                hTarget = null
            }
            if (hTarget != null && !hTarget.IsPositionInRange(hCaster.GetAbsOrigin(), range)) {
                hTarget = null
            }

            //  搜索范围
            if (hTarget == null) {
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                hTarget = targets[0]
            }

            //  施法命令
            if (hTarget != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: hCaster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: hTarget.entindex(),
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t20_mana_steal_particle extends modifier_particle_thinker {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/items2_fx/necronomicon_archer_manaburn.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }

}