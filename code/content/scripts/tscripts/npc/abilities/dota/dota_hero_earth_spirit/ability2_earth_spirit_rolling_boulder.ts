import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_earth_spirit_3 } from "./ability3_earth_spirit_geomagnetic_grip";
import { modifier_earth_spirit_6_magnetized } from "./ability6_earth_spirit_magnetize";

/** dota原技能数据 */
export const Data_earth_spirit_rolling_boulder = { "ID": "5609", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_EarthSpirit.RollingBoulder.Cast", "AbilityCastRange": "3000", "AbilityCastPoint": "0.01", "AbilityCooldown": "16.0 12.0 8.0 4.0", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "160" }, "02": { "var_type": "FIELD_INTEGER", "speed": "800" }, "03": { "var_type": "FIELD_INTEGER", "rock_speed": "1600" }, "04": { "var_type": "FIELD_FLOAT", "distance": "750.0", "LinkedSpecialBonus": "special_bonus_unique_earth_spirit_4" }, "05": { "var_type": "FIELD_FLOAT", "rock_distance": "1500.0", "LinkedSpecialBonus": "special_bonus_unique_earth_spirit_4", "LinkedSpecialBonusField": "value2" }, "06": { "var_type": "FIELD_FLOAT", "delay": "0.6" }, "07": { "var_type": "FIELD_INTEGER", "damage": "70 90 110 130", "LinkedSpecialBonus": "special_bonus_unique_earth_spirit" }, "08": { "var_type": "FIELD_FLOAT", "stun_duration": "0.4 0.6 0.8 1.0", "LinkedSpecialBonus": "special_bonus_unique_earth_spirit_3" }, "09": { "var_type": "FIELD_FLOAT", "rock_bonus_duration": "0.4 0.6 0.8 1.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_earth_spirit_rolling_boulder extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earth_spirit_rolling_boulder";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earth_spirit_rolling_boulder = Data_earth_spirit_rolling_boulder;
    Init() {
        this.SetDefaultSpecialValue("radius", 100);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("base_damage", [200, 400, 700, 1000, 1400, 1800]);
        this.SetDefaultSpecialValue("str_factor", [4, 5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("stun_duration", 2);
        this.SetDefaultSpecialValue("stun_duration_enhanced", 4);
        this.SetDefaultSpecialValue("launch_interval", 0.4);
        this.SetDefaultSpecialValue("speed", 800);
        this.SetDefaultSpecialValue("speed_enhanced", 1600);
        this.SetDefaultSpecialValue("distance", 1400);

    }


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("distance")
    }

    OnAbilityPhaseStart() {
        this.GetCasterPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.RollingBoulder.Cast", this.GetCasterPlus()))
        return true
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        let enhanced = 0
        let mdf4 = modifier_earth_spirit_3.findIn(hCaster)
        if (GameFunc.IsValid(mdf4) && mdf4.UseStone()) {
            enhanced = 1
        }

        modifier_earth_spirit_2_roll.apply(hCaster, hCaster, this, { duration: duration, enhanced: enhanced })
    }

    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any) {
        let hPhantom = EntIndexToHScript(ExtraData.phantom_index || -1)
        if (GameFunc.IsValid(hPhantom)) {
            hPhantom.SetAbsOrigin(vLocation)
        }
    }

    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hPhantom = EntIndexToHScript(ExtraData.phantom_index || -1) as IBaseNpc_Plus
        // if (false) {
        //     let vStartPos = this.GetCasterPlus().GetAbsOrigin()
        //     let vDirection = HorizonVector(hPhantom.GetForwardVector())
        //     let radius = this.GetSpecialValueFor("radius")
        //     let position1 = vStartPos + Rotation2D(vDirection, math.rad(90)) * radius
        //     let position2 = vStartPos + Rotation2D(vDirection, math.rad(-90)) * radius
        //     let position3 = vLocation + Rotation2D(vDirection, math.rad(90)) * radius
        //     let position4 = vLocation + Rotation2D(vDirection, math.rad(-90)) * radius

        //     DebugDrawLine(position1, position3, 255, 255, 255, true, 1)
        //     DebugDrawLine(position2, position4, 255, 255, 255, true, 1)
        //     DebugDrawCircle(vStartPos, Vector(255, 255, 255), 1, radius, true, 1)
        //     DebugDrawCircle(vLocation, Vector(255, 255, 255), 1, radius, true, 1)
        // }

        if (GameFunc.IsValid(hPhantom)) {
            if (GameFunc.IsValid(hTarget)) {
                hPhantom.SetAbsOrigin(hTarget.GetAbsOrigin())
            }
            hPhantom.addTimer(0, () => {
                UTIL_Remove(hPhantom)
            })
        }

        if (!GameFunc.IsValid(hTarget)) {
            return true
        }

        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { tMagnetized: Array<any> }

        hTarget.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.RollingBoulder.Damage", hCaster))
        hTarget.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.RollingBoulder.Target", hCaster))

        let base_damage = this.GetSpecialValueFor("base_damage")
        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let stun_duration_enhanced = this.GetSpecialValueFor("stun_duration_enhanced")

        let damage = base_damage
        if (ExtraData.enhanced == 1 && hCaster.GetStrength) {
            damage = damage + hCaster.GetStrength() * this.GetSpecialValueFor("str_factor")
        }

        let tTargets = [hTarget]
        let explode = false
        if (modifier_earth_spirit_6_magnetized.exist(hTarget) && hCaster.tMagnetized && hCaster.tMagnetized.length > 1) {
            tTargets = hCaster.tMagnetized
            explode = true
        }

        for (let v of (tTargets)) {
            if (GameFunc.IsValid(v)) {
                if (hCaster.HasTalent('special_bonus_unique_earth_spirit_custom_3')) {
                    modifier_earth_spirit_2_cannot_miss.apply(hCaster, hCaster, this, null)
                    BattleHelper.Attack(hCaster, v, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN)
                    modifier_earth_spirit_2_cannot_miss.remove(hCaster);
                }

                BattleHelper.GoApplyDamage({
                    ability: this,
                    attacker: hCaster,
                    victim: v,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType()
                })

                let duration = (ExtraData.enhanced == 1) && stun_duration || stun_duration_enhanced
                modifier_stunned.apply(v, hCaster, this, { duration: duration * v.GetStatusResistanceFactor(hCaster) })
            }

            //  todo: 链接特效
            //  if ( explode && v != hTarget ) {
            // 	 particles/units/heroes/hero_earth_spirit/espirit_stone_explosion_bolt.vpcf
            //  }
        }

        // 撞一个单位就删除弹道
        return true
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_earth_spirit_2"
    // }


}

// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_2// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_2 extends BaseModifier_Plus {
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
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let hCaster = hAbility.GetCasterPlus()

        if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        if (!hAbility.GetAutoCastState()) {
            return
        }

        if (!hAbility.IsAbilityReady()) {
            return
        }

        let distance = hAbility.GetSpecialValueFor("distance")
        let teamFilter = hAbility.GetAbilityTargetTeam()
        let typeFilter = hAbility.GetAbilityTargetType()
        let flagFilter = hAbility.GetAbilityTargetFlags()
        let order = FindOrder.FIND_CLOSEST
        let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), distance, null, teamFilter, typeFilter, flagFilter, order)
        if (targets[0] != null) {
            ExecuteOrderFromTable({
                UnitIndex: hCaster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                AbilityIndex: hAbility.entindex(),
            })
        }
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_2_roll// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_2_roll extends BaseModifier_Plus {
    launch_interval: number;
    speed: number;
    speed_enhanced: number;
    distance: number;
    radius: number;
    enhanced: any;
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
        this.launch_interval = this.GetSpecialValueFor("launch_interval") - this.GetCasterPlus().GetTalentValue('special_bonus_unique_earth_spirit_custom_5')
        this.speed = this.GetSpecialValueFor("speed")
        this.speed_enhanced = this.GetSpecialValueFor("speed_enhanced")
        this.distance = this.GetSpecialValueFor("distance")
        this.radius = this.GetSpecialValueFor("radius")
        let hParent = this.GetParentPlus()

        if (IsServer()) {
            this.enhanced = params.enhanced
            hParent.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL)
            this.StartIntervalThink(this.launch_interval)
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earth_spirit/espirit_rollingboulder.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(particleID, false, false, -1, false, false)
            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(particleID, 3, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(particleID, 10, Vector(2, 0, 0))
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        this.launch_interval = this.GetSpecialValueFor("launch_interval") - this.GetCasterPlus().GetTalentValue('special_bonus_unique_earth_spirit_custom_5')
        this.speed = this.GetSpecialValueFor("speed")
        this.speed_enhanced = this.GetSpecialValueFor("speed_enhanced")
        this.distance = this.GetSpecialValueFor("distance")
        this.radius = this.GetSpecialValueFor("radius")
        if (IsServer()) {
            this.enhanced = params.enhanced
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            hParent.RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL)
            hParent.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL_END)
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.RollingBoulder.Destroy", this.GetCasterPlus()))
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
        }
    }
    OnIntervalThink() {
        if (!IsServer()) {
            return
        }

        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let hParent = this.GetParentPlus()
        if (hParent.IsTempestDouble() || hParent.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        let teamFilter = hAbility.GetAbilityTargetTeam()
        let typeFilter = hAbility.GetAbilityTargetType()
        let flagFilter = hAbility.GetAbilityTargetFlags()
        let iTeam = hParent.GetTeamNumber()
        let order = FindOrder.FIND_ANY_ORDER
        let targets = AoiHelper.FindEntityInRadius(iTeam, hParent.GetAbsOrigin(), this.distance, null, teamFilter, typeFilter, flagFilter, order)

        let vParentPos = hParent.GetAbsOrigin()
        let vDirection = RandomVector(1)
        let speed = (this.enhanced == 1) && this.speed_enhanced || this.speed

        if (targets[0] != null) {
            vDirection = GameFunc.VectorFunctions.HorizonVector((targets[0].GetAbsOrigin() - vParentPos) as Vector)
        }

        let thinker = modifier_earth_spirit_2_phantom.applyThinker(vParentPos, hParent, hAbility, { duration: this.distance / speed }, iTeam, false)
        hParent.SetForwardVector(vDirection)
        thinker.SetForwardVector(vDirection)

        let projectile_info = {
            Ability: hAbility,
            Source: hParent,
            //  EffectName : ,
            vSpawnOrigin: hParent.GetAbsOrigin(),
            vVelocity: (vDirection * speed) as Vector,
            bDeleteOnHit: true,
            fDistance: this.distance,
            fStartRadius: this.radius,
            fEndRadius: this.radius,
            iUnitTargetTeam: teamFilter,
            iUnitTargetType: typeFilter,
            iUnitTargetFlags: flagFilter,
            ExtraData: {
                enhanced: this.enhanced,
                phantom_index: thinker.entindex(),
            }
        }
        ProjectileManager.CreateLinearProjectile(projectile_info)
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_2_phantom// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_2_phantom extends BaseModifier_Plus {
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
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.RollingBoulder.Stone", hCaster))
        } else {
            let hParent = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earth_spirit/espirit_rollingboulder.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_POINT,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(particleID, 3, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(particleID, 10, Vector(2, 0, 0))
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().StopSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.RollingBoulder.Loop", this.GetCasterPlus()))
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_2_cannot_miss// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_2_cannot_miss extends BaseModifier_Plus {
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
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true,
        }
    }
}
