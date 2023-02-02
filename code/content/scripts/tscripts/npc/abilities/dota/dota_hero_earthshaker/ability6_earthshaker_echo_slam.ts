import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_earthshaker_1_root } from "./ability1_earthshaker_fissure";
/** dota原技能数据 */
export const Data_earthshaker_echo_slam = { "ID": "5026", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_EarthShaker.EchoSlam", "AbilityCastPoint": "0 0 0 0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "150.0 130.0 110.0", "AbilityManaCost": "145 205 265", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "echo_slam_damage_range": "600", "CalculateSpellDamageTooltip": "0" }, "02": { "var_type": "FIELD_INTEGER", "echo_slam_echo_search_range": "600" }, "03": { "var_type": "FIELD_INTEGER", "echo_slam_echo_range": "600" }, "04": { "var_type": "FIELD_INTEGER", "echo_slam_echo_damage": "70 90 110", "LinkedSpecialBonus": "special_bonus_unique_earthshaker_2" }, "05": { "var_type": "FIELD_INTEGER", "echo_slam_initial_damage": "100 140 180" } } };

@registerAbility()
export class ability6_earthshaker_echo_slam extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earthshaker_echo_slam";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earthshaker_echo_slam = Data_earthshaker_echo_slam;
    Init() {
        this.SetDefaultSpecialValue("echo_slam_damage_range", 800);
        this.SetDefaultSpecialValue("echo_slam_echo_search_range", 800);
        this.SetDefaultSpecialValue("echo_slam_echo_range", 800);
        this.SetDefaultSpecialValue("echo_slam_echo_damage", [100, 200, 400, 800, 1600, 3200]);
        this.SetDefaultSpecialValue("echo_slam_echo_damage_per_str", 0);
        this.SetDefaultSpecialValue("echo_slam_initial_damage", [200, 400, 800, 1600, 3200, 6400]);
        this.SetDefaultSpecialValue("echo_slam_initial_damage_per_str", [5, 6, 7, 8, 9, 10]);

    }


    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_earthshaker_custom_3")
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("echo_slam_damage_range")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let echo_slam_damage_range = this.GetSpecialValueFor("echo_slam_damage_range")
        let echo_slam_echo_search_range = this.GetSpecialValueFor("echo_slam_echo_search_range")
        let echo_slam_echo_range = this.GetSpecialValueFor("echo_slam_echo_range")
        let echo_slam_echo_damage = this.GetSpecialValueFor("echo_slam_echo_damage")
        let echo_slam_echo_damage_per_str = this.GetSpecialValueFor("echo_slam_echo_damage_per_str") + hCaster.GetTalentValue("special_bonus_unique_earthshaker_custom_4")
        let echo_slam_initial_damage = this.GetSpecialValueFor("echo_slam_initial_damage")
        let echo_slam_initial_damage_per_str = this.GetSpecialValueFor("echo_slam_initial_damage_per_str")

        let tHeroes = [] as any[]

        let echo_slam_echo_speed = 600

        let iStr = hCaster.GetStrength != null && hCaster.GetStrength() || 0
        let fEchoDamage = echo_slam_echo_damage + echo_slam_echo_damage_per_str * iStr
        let fInitialDamage = echo_slam_initial_damage + echo_slam_initial_damage_per_str * iStr

        // echo slam echo search
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), echo_slam_echo_search_range, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        if (hCaster.HasScepter()) {
            let _tTargets = AoiHelper.FindUnitsInRadiusByModifierName("modifier_earthshaker_1_root", hCaster.GetTeamNumber(), Vector(0, 0, 0), 5000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let v of (_tTargets)) {
                let hModifier = modifier_earthshaker_1_root.findIn(v) as modifier_earthshaker_1_root;
                if (GameFunc.IsValid(hModifier) && GameFunc.IsValid(hModifier.GetCasterPlus()) && hModifier.GetCasterPlus().GetPlayerOwnerID() == hCaster.GetPlayerOwnerID()) {
                    table.insert(tTargets, v)
                }
            }
        }

        let iCount = 0
        let iHeroCount = 0
        if (tTargets.length > 0) {
            for (let hTarget of (tTargets)) {
                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_EarthShaker.EchoSlamEcho", hCaster), hCaster)

                let tEchoTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), echo_slam_echo_range, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
                for (let hEchoTarget of (tEchoTargets)) {
                    if (hEchoTarget != hTarget) {
                        let tInfo = {
                            Ability: this,
                            Target: hEchoTarget,
                            vSourceLoc: hTarget.GetAttachmentOrigin(hTarget.ScriptLookupAttachment("attach_hitloc")),
                            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_earthshaker/earthshaker_echoslam.vpcf", hCaster),
                            iMoveSpeed: echo_slam_echo_speed,
                            bDodgeable: false,
                            flExpireTime: GameRules.GetGameTime() + 10,
                            ExtraData: {
                                echo_slam_echo_damage: fEchoDamage,
                            }
                        }
                        ProjectileManager.CreateTrackingProjectile(tInfo)
                    }
                }
                iCount = iCount + 1
                if (hTarget.IsConsideredHero()) {
                    for (let hEchoTarget of (tEchoTargets)) {
                        if (GameFunc.IsValid(hEchoTarget) && hEchoTarget.IsAlive()) {
                            if (hEchoTarget != hTarget) {
                                let tInfo = {
                                    Ability: this,
                                    Target: hEchoTarget,
                                    vSourceLoc: hTarget.GetAttachmentOrigin(hTarget.ScriptLookupAttachment("attach_hitloc")),
                                    EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_earthshaker/earthshaker_echoslam.vpcf", hCaster),
                                    iMoveSpeed: echo_slam_echo_speed,
                                    bDodgeable: false,
                                    flExpireTime: GameRules.GetGameTime() + 10,
                                    ExtraData: {
                                        echo_slam_echo_damage: fEchoDamage,
                                    }
                                }
                                ProjectileManager.CreateTrackingProjectile(tInfo)
                            }
                        }
                    }
                    iCount = iCount + 1

                    iHeroCount = iHeroCount + 1
                    table.insert(tHeroes, hTarget.entindex())
                }
            }
        }

        // echo slam damage
        tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), echo_slam_damage_range, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)

        if (hCaster.HasScepter()) {
            let _tTargets = AoiHelper.FindUnitsInRadiusByModifierName("modifier_earthshaker_1_root", hCaster.GetTeamNumber(), Vector(0, 0, 0), 5000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let v of (_tTargets)) {
                let hModifier = modifier_earthshaker_1_root.findIn(v) as modifier_earthshaker_1_root;
                if (GameFunc.IsValid(hModifier) && GameFunc.IsValid(hModifier.GetCasterPlus()) && hModifier.GetCasterPlus().GetPlayerOwnerID() == hCaster.GetPlayerOwnerID()) {
                    table.insert(tTargets, v)
                }
            }
        }

        for (let hTarget of (tTargets)) {
            BattleHelper.GoApplyDamage({
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fInitialDamage,
                damage_type: this.GetAbilityDamageType()
            })

            if (GameFunc.IsValid(hTarget) && hTarget.IsConsideredHero() && !hTarget.IsAlive()) {
                modifier_earthshaker_6_particle_death.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            }
        }
        if (iCount > 0) {
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthShaker.EchoSlam", hCaster))
        } else {
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthShaker.EchoSlamSmall", hCaster))
        }
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_earthshaker/earthshaker_echoslam_start.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
        ParticleManager.SetParticleControl(iParticleID, 1, Vector(iCount, 0, 0))
        ParticleManager.SetParticleControl(iParticleID, 10, Vector(3 + iHeroCount * 0.5, 0, 0))
        ParticleManager.ReleaseParticleIndex(iParticleID)

        for (let iTargetEntIndex of (tHeroes)) {
            let hTarget = EntIndexToHScript(iTargetEntIndex)
            if (GameFunc.IsValid(hTarget)) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_earthshaker/earthshaker_echoslam_tgt.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
                ParticleManager.SetParticleControl(iParticleID, 6, Vector(RandomFloat(1.5, 2), 1, 1))
                ParticleManager.SetParticleControl(iParticleID, 10, Vector(3 + iHeroCount * 0.5, 0, 0))
                ParticleManager.ReleaseParticleIndex(iParticleID)
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (GameFunc.IsValid(hTarget)) {
            if (hTarget.IsMagicImmune() || !hTarget.IsAlive()) {
                return true
            }
            let hCaster = this.GetCasterPlus()
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Earthsaker.EchoProjectile.Target", hCaster), hCaster)
            BattleHelper.GoApplyDamage({
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: ExtraData.echo_slam_echo_damage,
                damage_type: this.GetAbilityDamageType()
            })

            if (GameFunc.IsValid(hTarget) && hTarget.IsConsideredHero() && !hTarget.IsAlive()) {
                modifier_earthshaker_6_particle_death.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            }
        }
        return true
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_earthshaker_6"
    // }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_earthshaker_6 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
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

            let range = ability.GetSpecialValueFor("echo_slam_damage_range")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earthshaker_6_particle_death extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_target_death.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, hParent.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
