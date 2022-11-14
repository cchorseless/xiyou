import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifierMotionHorizontal_Plus, BaseModifierMotionVertical_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability1_pangolier_swashbuckle } from "./ability1_pangolier_swashbuckle";
import { ability2_pangolier_shield_crash, modifier_pangolier_2_jump } from "./ability2_pangolier_shield_crash";

/** dota原技能数据 */
export const Data_pangolier_gyroshell = { "ID": "6343", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "FightRecapLevel": "1", "AbilityDraftUltShardAbility": "pangolier_rollup", "AbilityCastRange": "0", "AbilityCastPoint": "1.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "70", "AbilityManaCost": "100 150 200", "AbilityDamage": "180 260 340", "precache": { "model": "models/heroes/pangolier/pangolier_gyroshell2.vmdl" }, "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "knockback_radius": "150" }, "11": { "var_type": "FIELD_FLOAT", "duration": "10.0", "LinkedSpecialBonus": "special_bonus_unique_pangolier_6" }, "12": { "var_type": "FIELD_FLOAT", "jump_recover_time": "0.25" }, "01": { "var_type": "FIELD_FLOAT", "cast_time_tooltip": "1.2" }, "02": { "var_type": "FIELD_FLOAT", "tick_interval": "0.05" }, "03": { "var_type": "FIELD_FLOAT", "forward_move_speed": "550" }, "04": { "var_type": "FIELD_FLOAT", "turn_rate_boosted": "165" }, "05": { "var_type": "FIELD_FLOAT", "turn_rate": "120" }, "06": { "var_type": "FIELD_INTEGER", "radius": "400" }, "07": { "var_type": "FIELD_INTEGER", "hit_radius": "150" }, "08": { "var_type": "FIELD_FLOAT", "bounce_duration": "0.4" }, "09": { "var_type": "FIELD_FLOAT", "stun_duration": "1.0 1.25 1.5" } } };

@registerAbility()
export class ability6_pangolier_gyroshell extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pangolier_gyroshell";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pangolier_gyroshell = Data_pangolier_gyroshell;
    Init() {
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("jump_recover_time", 0.4);
        this.SetDefaultSpecialValue("damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("cast_point", 0.4);
        this.SetDefaultSpecialValue("knockback_height", 200);
        this.SetDefaultSpecialValue("knockback_duration", 1);
        this.SetDefaultSpecialValue("lucky_shot_chance", 20);
        this.SetDefaultSpecialValue("damage_pct_perS", [80, 90, 100, 110, 120, 140]);
        this.SetDefaultSpecialValue("cast_time_tooltip", 0.3);
        this.SetDefaultSpecialValue("tick_interval", 0.05);
        this.SetDefaultSpecialValue("forward_move_speed", 1200);
        this.SetDefaultSpecialValue("jump_height", 250);
        this.SetDefaultSpecialValue("jump_duration", 0.5);
        this.SetDefaultSpecialValue("hit_radius", 150);
        this.SetDefaultSpecialValue("bounce_duration", 0.4);
        this.SetDefaultSpecialValue("stun_duration", [1.0, 1.4, 1.8, 2.2, 2.6, 3.0]);
        this.SetDefaultSpecialValue("knockback_radius", 100);

    }

    Init_old() {
        this.SetDefaultSpecialValue("forward_move_speed", 1200);
        this.SetDefaultSpecialValue("jump_height", 250);
        this.SetDefaultSpecialValue("jump_duration", 0.5);
        this.SetDefaultSpecialValue("hit_radius", 150);
        this.SetDefaultSpecialValue("bounce_duration", 0.4);
        this.SetDefaultSpecialValue("stun_duration", [1.0, 1.4, 1.8, 2.2, 2.6, 3.0]);
        this.SetDefaultSpecialValue("knockback_radius", 70);
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("jump_recover_time", 0.4);
        this.SetDefaultSpecialValue("damage", [400, 800, 1200, 1600, 2200, 3000]);
        this.SetDefaultSpecialValue("cast_point", 0.4);
        this.SetDefaultSpecialValue("knockback_height", 200);
        this.SetDefaultSpecialValue("knockback_duration", 1);
        this.SetDefaultSpecialValue("lucky_shot_chance", 20);
        this.SetDefaultSpecialValue("cast_time_tooltip", 0.3);
        this.SetDefaultSpecialValue("tick_interval", 0.05);

    }

    vDirection: Vector;
    vCasterLoc: Vector;
    vTargetPosition: Vector;
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let jump_duration = this.GetSpecialValueFor("jump_duration")
        let cast_point = this.GetSpecialValueFor("cast_point")
        this.vCasterLoc = /**hCaster.GetBuilding == null &&*/ hCaster.GetAbsOrigin() /**|| hCaster.GetBuilding().GetLocation()*/
        this.vDirection = (-hTarget.GetForwardVector()) as Vector
        let fOffsetDistance = hTarget.GetMoveSpeedModifier(hTarget.GetBaseMoveSpeed(), false)
        // let hLastCorner = Entities.FindByName(null, hTarget.Spawner_lastCornerName)
        // let hNextCorner = Entities.FindByName(null, hTarget.Spawner_targetCornerName)
        // if (hLastCorner && hNextCorner) {
        //     this.vDirection = (hLastCorner.GetAbsOrigin() - hNextCorner.GetAbsOrigin()) as Vector
        //     this.vDirection.z = 0
        //     let fNextCornerDistance = ((hNextCorner.GetAbsOrigin() - hTarget.GetAbsOrigin()) as Vector).Length2D()
        //     fOffsetDistance = fOffsetDistance > fNextCornerDistance && fNextCornerDistance || fOffsetDistance
        // }

        this.vTargetPosition = (hTarget.GetAbsOrigin() - this.vDirection.Normalized() * fOffsetDistance) as Vector

        hCaster.SetForwardVector(((this.vTargetPosition - this.vCasterLoc) as Vector).Normalized())
        hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4)
        modifier_pangolier_6_straight.apply(hCaster, hCaster, this, null)
        modifier_pangolier_6_stun.apply(hCaster, hCaster, this, { duration: cast_point })
        hCaster.addTimer(cast_point, () => {
            modifier_pangolier_6_jump_start.apply(hCaster, hCaster, this, { duration: jump_duration })
            //  添加反向技能
            // let pangolier_3_bounce = pangolier_3_bounce.findIn(hCaster)
            // if (!GameFunc.IsValid(pangolier_3_bounce)) {
            //     pangolier_3_bounce = hCaster.AddAbility("pangolier_3_bounce")
            //     hCaster.SwapAbilities("pangolier_3", "pangolier_3_bounce", false, true)
            // }
            // if (GameFunc.IsValid(pangolier_3_bounce)) {
            //     pangolier_3_bounce.SetLevel(1)
            //     this.SetActivated(false)
            //     if (pangolier_3_bounce.GetAutoCastState() != this.GetAutoCastState()) {
            //         pangolier_3_bounce.ToggleAutoCast()
            //     }
            // }
        })

        modifier_pangolier_6_particle_pangolier_gyroshell_cast.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.Gyroshell.Cast", hCaster))
        hCaster.EmitSound(ResHelper.GetSoundReplacement("pangolin_pangolin_ability4_08", hCaster))
    }
    Bounce() {
        let hCaster = this.GetCasterPlus()
        let bounce_duration = this.GetSpecialValueFor("bounce_duration")
        let modifier = modifier_pangolier_6_rolling.findIn(hCaster)
        let jump_modifier = modifier_pangolier_2_jump.findIn(hCaster)
        if (modifier != null) {
            hCaster.RemoveHorizontalMotionController(modifier)
            if (jump_modifier == null) {
                modifier_pangolier_6_bounce_back.apply(hCaster, hCaster, this, { duration: bounce_duration })
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_pangolier_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pangolier_6 extends BaseModifier_Plus {
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
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: target.entindex(),
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    GetIgnoreCastAngle(params: ModifierTable) {
        if (IsServer()) {
            if (this.GetCasterPlus().GetCurrentActiveAbility() == this.GetAbilityPlus()) {
                return 1
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DISABLE_TURNING)
    GetDisableTurning(params: ModifierTable) {
        if (IsServer()) {
            if (this.GetCasterPlus().GetCurrentActiveAbility() == this.GetAbilityPlus()) {
                return 1
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_6_jump_start extends BaseModifierMotionBoth_Plus {
    jump_height: number;
    duration: number;
    jump_duration: number;
    flTime: number;
    vVelocity: Vector;
    flDistance: number;
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.jump_height = this.GetSpecialValueFor("jump_height")
        this.jump_duration = this.GetSpecialValueFor("jump_duration")
        this.duration = this.GetSpecialValueFor("duration")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability6_pangolier_gyroshell
            let vDirection = ((hAbility.vTargetPosition - hCaster.GetAbsOrigin()) as Vector).Normalized()
            hCaster.SetForwardVector(vDirection)
            if (this.ApplyHorizontalMotionController() && this.ApplyVerticalMotionController()) {
                this.flTime = 0
                this.flDistance = ((hAbility.vTargetPosition - hCaster.GetAbsOrigin()) as Vector).Length2D()
                this.vVelocity = (vDirection * this.flDistance / this.jump_duration) as Vector
            } else {
                this.Destroy()
            }
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_pangolier/pangolier_gyroshell_cast.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability6_pangolier_gyroshell
            hCaster.RemoveHorizontalMotionController(this)
            hCaster.RemoveVerticalMotionController(this)
            // if (hAbility.iParticleID) {
            //     ParticleManager.DestroyParticle(hAbility.iParticleID, true)
            // }

            hCaster.SetAbsOrigin(hAbility.vTargetPosition)
            modifier_pangolier_6_rolling.apply(hCaster, hCaster, hAbility, { duration: this.duration })
        }
    }
    UpdateHorizontalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let vPosition = me.GetAbsOrigin() + this.vVelocity * dt
            me.SetAbsOrigin(vPosition as Vector)
        }
    }
    OnHorizontalMotionInterrupted() {
    }
    UpdateVerticalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let z = math.sin(this.flTime * (3.1415926 / this.jump_duration)) * this.jump_height
            this.flTime = this.flTime + dt
            me.SetAbsOrigin((GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, z)) as Vector)
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_2
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_6_rolling extends BaseModifierMotionHorizontal_Plus {
    jump_recover_time: any;
    forward_move_speed: number;
    damage: number;
    hit_radius: number;
    tick_interval: number;
    bounce_duration: number;
    stun_duration: number;
    damage_pct_perS: number;
    vVelocity: Vector;
    GetTexture() {
        return "modifier_magicimmune"
    }
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.forward_move_speed = this.GetSpecialValueFor("forward_move_speed")
        this.damage = this.GetSpecialValueFor("damage")
        this.jump_recover_time = this.GetSpecialValueFor("jump_recover_time")
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.hit_radius = this.GetSpecialValueFor("hit_radius")
        this.stun_duration = this.GetSpecialValueFor("stun_duration")
        this.bounce_duration = this.GetSpecialValueFor("bounce_duration")
        this.damage_pct_perS = this.GetSpecialValueFor("damage_pct_perS")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability6_pangolier_gyroshell
            hCaster.SetForwardVector(hAbility.vDirection.Normalized())
            modifier_pangolier_6_swashbuckle.apply(hCaster, hCaster, hAbility, null)
            if (this.ApplyHorizontalMotionController()) {
                this.vVelocity = (hAbility.vDirection.Normalized() * this.forward_move_speed) as Vector
                this.StartIntervalThink(this.tick_interval)
            } else {
                this.Destroy()
            }

            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.Gyroshell.Loop", hCaster))
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_pangolier/pangolier_gyroshell.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            hCaster.RemoveHorizontalMotionController(this)
            hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_Pangolier.Gyroshell.Loop", hCaster))
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.Gyroshell.Stop", hCaster))
            modifier_pangolier_6_jump_back.apply(hCaster, hCaster, hAbility, { duration: this.jump_recover_time })
            modifier_pangolier_6_swashbuckle.remove(hCaster);
            let hParticleModifier = modifier_pangolier_6_particle_pangolier_gyroshell_cast.findIn(hCaster)
            if (GameFunc.IsValid(hParticleModifier)) {
                hParticleModifier.Destroy()
            }
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), this.hit_radius, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {

            if (!modifier_pangolier_6_knockback.exist(hTarget)) {
                //  if ( hTarget.GetUnitName() != "wave_gold" ) {
                modifier_pangolier_6_knockback.apply(hTarget, hCaster, hAbility, { duration: this.stun_duration })
                //  }
                //  pipixia 增加技能生命百分比伤害
                let damage = this.damage
                damage = damage + hCaster.GetMaxHealth() * this.damage_pct_perS / 100;
                let damage_table = {
                    ability: hAbility,
                    victim: hTarget,
                    attacker: hCaster,
                    damage: damage,
                    damage_type: hAbility.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(damage_table)
                EmitSoundOnLocationForAllies(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Pangolier.Gyroshell.Stun.Creep", hCaster), hCaster)
            }
        }
    }
    UpdateHorizontalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let vPosition = (me.GetAbsOrigin() + this.vVelocity * dt) as Vector
            if (GridNav.IsTraversable(vPosition)) {
                me.SetAbsOrigin(vPosition)
            } else {
                (this.GetAbilityPlus() as ability6_pangolier_gyroshell).Bounce()
            }
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_RUN
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: ModifierTable) {
        return "models/heroes/pangolier/pangolier_gyroshell2.vmdl"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_6_jump_back extends BaseModifierMotionBoth_Plus {
    jump_height: number;
    jump_recover_time: number;
    flDistance: number;
    flTime: number;
    vVelocity: number;
    hParticleModifier: modifier_pangolier_6_particle_pangolier_swashbuckler_dash;
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
        this.jump_height = this.GetSpecialValueFor("jump_height")
        this.jump_recover_time = this.GetSpecialValueFor("jump_recover_time")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability6_pangolier_gyroshell

            let vDirection = ((hAbility.vCasterLoc - hCaster.GetAbsOrigin()) as Vector).Normalized()
            hCaster.SetForwardVector((-vDirection) as Vector)
            if (this.ApplyHorizontalMotionController() && this.ApplyVerticalMotionController()) {
                hCaster.RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4)
                hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2)

                this.hParticleModifier = modifier_pangolier_6_particle_pangolier_swashbuckler_dash.apply(hCaster, hCaster, hAbility)
                hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.TailThump.Cast", hCaster))
                this.flTime = 0
                this.flDistance = ((hAbility.vCasterLoc - hCaster.GetAbsOrigin()) as Vector).Length2D()
                this.vVelocity = vDirection * this.flDistance / this.jump_recover_time
            } else {
                this.Destroy()
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            //  if ( GameFunc.IsValid(this.hPtclThinker) ) {
            //  	 this.hPtclThinker.sPtclName.remove( this.hPtclThinker );
            //  }
            if (GameFunc.IsValid(this.hParticleModifier)) {
                this.hParticleModifier.Destroy()
            }
            let hCaster = this.GetCasterPlus()

            hCaster.RemoveHorizontalMotionController(this)
            hCaster.RemoveVerticalMotionController(this)

            let vForward = hCaster.GetForwardVector()
            vForward.z = 0
            hCaster.SetForwardVector(vForward)
            hCaster.SetAbsOrigin((this.GetAbilityPlus() as ability6_pangolier_gyroshell).vCasterLoc)

            modifier_pangolier_6_straight.remove(hCaster);;

            // let pangolier_3 = pangolier_3.findIn(hCaster)
            // if (pangolier_3) {
            //     hCaster.SwapAbilities("pangolier_3", "pangolier_3_bounce", true, false)
            //     hCaster.RemoveAbility("pangolier_3_bounce")
            //     pangolier_3.SetActivated(true)
            // }
        }
    }
    UpdateHorizontalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let vPosition = (me.GetAbsOrigin() + this.vVelocity * dt) as Vector
            me.SetAbsOrigin(vPosition)
        }
    }

    UpdateVerticalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let z = math.sin(this.flTime * (3.1415926 / this.jump_recover_time)) * this.jump_height
            this.flTime = this.flTime + dt
            me.SetAbsOrigin((GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, z)) as Vector)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_6_bounce_back extends BaseModifierMotionVertical_Plus {
    flTime: number;
    bounce_duration: number;
    iDeltaHeight: number;
    GetTexture() {
        return "pangolier_gyroshell"
    }
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
    OnCreated() {
        this.bounce_duration = this.GetSpecialValueFor("bounce_duration")
        this.flTime = 0
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.Gyroshell.Carom", hCaster))
            hCaster.StartGesture(GameActivity_t.ACT_DOTA_FLAIL)
            this.iDeltaHeight = hCaster.GetAbsOrigin().z - GetGroundPosition(hCaster.GetAbsOrigin(), hCaster).z
            this.ApplyVerticalMotionController()
        }
    }
    UpdateVerticalMotion(me: BaseNpc_Plus, dt: number) {
        let z = math.sin(this.flTime * (3.1415926 / this.bounce_duration)) * 50
        this.flTime = this.flTime + dt
        me.SetAbsOrigin((GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, this.iDeltaHeight + z)) as Vector)
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let modifier = modifier_pangolier_6_rolling.findIn(hCaster)
            if (modifier) {
                modifier.vVelocity = (-modifier.vVelocity) as Vector
                hCaster.SetForwardVector(modifier.vVelocity.Normalized())
                modifier.ApplyHorizontalMotionController()
            }
            hCaster.RemoveGesture(GameActivity_t.ACT_DOTA_FLAIL)
            hCaster.RemoveVerticalMotionController(this)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_6_knockback extends BaseModifierMotionBoth_Plus {
    knockback_height: number;
    knockback_duration: number;
    knockback_radius: number;
    flTime: number;
    vVelocity: Vector;
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
        return true
    }
    IsStunDebuff() {
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    OnCreated() {
        this.knockback_height = this.GetSpecialValueFor("knockback_height")
        this.knockback_duration = this.GetSpecialValueFor("knockback_duration")
        this.knockback_radius = this.GetSpecialValueFor("knockback_radius")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()

            if (this.ApplyHorizontalMotionController() && this.ApplyVerticalMotionController()) {
                let vDirection = (hCaster.GetForwardVector()).Normalized()
                this.vVelocity = (vDirection * this.knockback_radius / this.knockback_duration) as Vector
                this.flTime = 0
            } else {
                this.Destroy()
            }
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_pangolier/pangolier_dust_hit.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            hParent.RemoveHorizontalMotionController(this)
            hParent.RemoveVerticalMotionController(this)
            FindClearSpaceForUnit(hParent, hParent.GetAbsOrigin(), true)
        }
    }
    UpdateHorizontalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let vPosition = (me.GetAbsOrigin() + this.vVelocity * dt) as Vector
            if (GridNav.IsTraversable(vPosition)) {
                me.SetAbsOrigin(vPosition)
            }
        }
    }
    OnHorizontalMotionInterrupted() {
    }
    UpdateVerticalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let z = math.sin(this.flTime * (3.1415926 / this.knockback_duration)) * this.knockback_height
            this.flTime = this.flTime + dt
            me.SetAbsOrigin((GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, z)) as Vector)
            if (this.flTime >= this.knockback_duration) {
                this.GetParentPlus().RemoveHorizontalMotionController(this)
                this.GetParentPlus().RemoveVerticalMotionController(this)
            }
        }
    }
    OnVerticalMotionInterrupted() {
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_6_straight extends BaseModifier_Plus {
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
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DISABLE_TURNING)
    GetDisableTurning() {
        return 1
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    OnTeleported(params: ModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            (this.GetAbilityPlus() as ability6_pangolier_gyroshell).vCasterLoc = params.new_pos
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_6_stun extends BaseModifier_Plus {
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
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_6_swashbuckle extends BaseModifier_Plus {
    interval: number;
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
    OnCreated() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            this.interval = hCaster.HasTalent("special_bonus_unique_pangolier_custom_8") && hCaster.GetTalentValue("special_bonus_unique_pangolier_custom_8") || -1
            this.StartIntervalThink(this.interval)
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hAbility = ability1_pangolier_swashbuckle.findIn(hCaster) as ability1_pangolier_swashbuckle;
        let iRange = hAbility.GetSpecialValueFor("range")
        let strikes = hAbility.GetSpecialValueFor("strikes")
        let vDirection = hCaster.GetForwardVector()

        let teamFilter = hAbility.GetAbilityTargetTeam()
        let typeFilter = hAbility.GetAbilityTargetType()
        let flagFilter = hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
        let order = FindOrder.FIND_CLOSEST
        let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), iRange, null, teamFilter, typeFilter, flagFilter, order)
        for (let hUnit of (targets)) {

            if (hUnit != null) {
                vDirection = ((hUnit.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector).Normalized()
                break
            }
        }

        let direction_count = hCaster.HasTalent("special_bonus_unique_pangolier_custom_3") && 4 || 1
        for (let i = 1; i <= direction_count; i++) {
            let vPosition = GameFunc.VectorFunctions.Rotation2D(vDirection, math.rad(i * 90 - 90)) * iRange + hCaster.GetAbsOrigin()
            hAbility.Swashbuckle(hCaster.GetAbsOrigin(), vPosition as Vector, strikes)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_pangolier_6_particle_pangolier_swashbuckler_dash extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_pangolier/pangolier_swashbuckler_dash.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_pangolier_6_particle_pangolier_gyroshell_cast extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_pangolier/pangolier_gyroshell_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(particleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControl(particleID, 3, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControlEnt(particleID, 3, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(particleID, 5, (hCaster.GetAbsOrigin() + Vector(0, 0, 300)) as Vector)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }

}
