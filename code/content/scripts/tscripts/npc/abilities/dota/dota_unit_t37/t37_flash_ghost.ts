import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t37_flash_ghost extends BaseAbility_Plus {

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        let vPosition = this.GetCursorPosition()
        modifier_t37_flash_ghost_thinker.applyThinker(vPosition, hCaster, this, { duration: duration }, hCaster.GetTeamNumber(), false)
    }
    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        if (GameFunc.IsValid(hTarget)) {
            let hCaster = this.GetCasterPlus()
            let fDamage = this.GetSpecialValueFor("spark_damage")
            let damage_radius = this.GetSpecialValueFor("damage_radius")
            let ministun_duration = this.GetSpecialValueFor("ministun_duration")
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            // let modifier_combination_t37_netherworld_assault = modifier_combination_t37_netherworld_assault.findIn(hCaster) as IBaseModifier_Plus;
            // todo:范围爆炸特效
            for (let hTarget of (tTarget)) {
                let damage_table =
                {
                    ability: this,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: this.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(damage_table)
                modifier_t37_flash_ghost_slow_debuff.apply(hTarget, hCaster, this, { duration: ministun_duration })
                // if ((GameFunc.IsValid(modifier_combination_t37_netherworld_assault) && modifier_combination_t37_netherworld_assault.GetStackCount() > 0) && this.HasNihilityBuff(hTarget)) {
                // let hNetherworld = modifier_combination_t37_netherworld_assault.GetAbilityPlus() as IBaseAbility_Plus
                // if (GameFunc.IsValid(hNetherworld) && hNetherworld._OnSpellStart != null) {
                // hNetherworld._OnSpellStart(hTarget)
                // }
                // }
            }
            EmitSoundOn("Hero_ArcWarden.SparkWraith.Damage", hCaster)
            return true
        }
    }
    HasNihilityBuff(hTarget: IBaseNpc_Plus) {
        // for (let sBuff of (DECREPIFY_EFFECT)) {

        //     if (GameFunc.IsValid(hTarget) && sBuff.exist(  hTarget )) {;
        //         return true
        //     }
        // }
        return false
    }

    GetIntrinsicModifierName() {
        return "modifier_t37_flash_ghost"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t37_flash_ghost extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(),
                range,
                hCaster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE,
                FindOrder.FIND_CLOSEST
            )

            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position,
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t37_flash_ghost_thinker extends BaseModifier_Plus {
    activation_delay: number;
    think_interval: number;
    radius: number;
    wraith_speed: number;
    sound_loop: string;
    activated: boolean;
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

        let hParent = this.GetParentPlus()
        this.activation_delay = this.GetSpecialValueFor("activation_delay")
        this.think_interval = this.GetSpecialValueFor("think_interval")
        this.radius = this.GetSpecialValueFor("radius")
        this.wraith_speed = this.GetSpecialValueFor("wraith_speed")
        if (IsServer()) {
            this.sound_loop = "Hero_ArcWarden.SparkWraith.Loop"
            EmitSoundOn(this.sound_loop, hParent)
            this.activated = false
            this.StartIntervalThink(this.activation_delay)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_arc_warden/arc_warden_wraith.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.activation_delay = this.GetSpecialValueFor("activation_delay")
        this.think_interval = this.GetSpecialValueFor("think_interval")
        this.radius = this.GetSpecialValueFor("radius")
        this.wraith_speed = this.GetSpecialValueFor("wraith_speed")
    }
    BeDestroy() {

        if (IsServer()) {
            StopSoundOn(this.sound_loop, this.GetParentPlus())
            this.GetParentPlus().ForceKill(false)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            if (this.activated) {
                let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                if (tTarget.length > 0) {
                    for (let hTarget of (tTarget)) {

                        if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                            let info = {
                                Target: hTarget,
                                Source: hParent,
                                Ability: hAbility,
                                EffectName: "particles/units/heroes/hero_arc_warden/arc_warden_wraith_prj.vpcf",
                                iMoveSpeed: this.wraith_speed,
                                vSourceLoc: hParent.GetAbsOrigin(),
                                bDodgeable: true,
                            }
                            ProjectileManager.CreateTrackingProjectile(info)
                            break
                        }
                    }
                    EmitSoundOn("Hero_ArcWarden.SparkWraith.Activate", hParent)
                    this.OnDestroy()
                }
            } else {
                this.activated = true
                this.StartIntervalThink(this.think_interval)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t37_flash_ghost_slow_debuff extends BaseModifier_Plus {
    move_speed_slow_pct: number;
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
    Init(params: IModifierTable) {
        this.move_speed_slow_pct = this.GetSpecialValueFor("move_speed_slow_pct")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.move_speed_slow_pct
    }
}