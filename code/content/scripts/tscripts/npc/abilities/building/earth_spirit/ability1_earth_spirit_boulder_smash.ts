import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_earth_spirit_3 } from "./ability3_earth_spirit_geomagnetic_grip";
import { modifier_earth_spirit_6_magnetized } from "./ability6_earth_spirit_magnetize";

/** dota原技能数据 */
export const Data_earth_spirit_boulder_smash = { "ID": "5608", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_BOTH", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP", "AbilityUnitTargetFlag": "DOTA_UNIT_TARGET_FLAG_INVULNERABLE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_EarthSpirit.BoulderSmash.Target", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "150", "AbilityCastPoint": "0.01", "AbilityCooldown": "22.0 18.0 14.0 10.0", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "180" }, "02": { "var_type": "FIELD_INTEGER", "rock_search_aoe": "200" }, "03": { "var_type": "FIELD_INTEGER", "rock_damage": "105 170 235 300" }, "04": { "var_type": "FIELD_INTEGER", "move_slow": "50" }, "05": { "var_type": "FIELD_FLOAT", "duration": "1.25 2.5 3.25 4" }, "06": { "var_type": "FIELD_INTEGER", "speed": "900" }, "07": { "var_type": "FIELD_FLOAT", "unit_distance": "500.0 600.0 700.0 800.0" }, "08": { "var_type": "FIELD_FLOAT", "rock_distance": "2000.0" }, "09": { "var_type": "FIELD_INTEGER", "remnant_smash_radius_tooltip": "200" } } };

@registerAbility()
export class ability1_earth_spirit_boulder_smash extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earth_spirit_boulder_smash";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earth_spirit_boulder_smash = Data_earth_spirit_boulder_smash;
    Init() {
        this.SetDefaultSpecialValue("radius", 200);
        this.SetDefaultSpecialValue("distance", 1200);
        this.SetDefaultSpecialValue("speed", 1500);
        this.SetDefaultSpecialValue("remnant_smash_radius", 200);
        this.SetDefaultSpecialValue("base_damage", [200, 400, 800, 1200, 1800, 2400]);
        this.SetDefaultSpecialValue("str_factor", [4, 6, 8, 10, 12, 14]);
        this.SetDefaultSpecialValue("silence_duration", 4);
        this.SetDefaultSpecialValue("slow_duration", 4);
        this.SetDefaultSpecialValue("slow_percent", -60);

    }



    bNotEmitSound: any;

    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue('special_bonus_unique_earth_spirit_custom_7')
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("distance") + this.GetCasterPlus().GetTalentValue('special_bonus_unique_earth_spirit_custom_2')
    }
    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (hCaster == hTarget) {
            this.errorStr = "dota_hud_error_cant_cast_on_self"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, hCaster.GetTeamNumber())
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        let hTarget = this.GetCursorTarget()
        if (GFuncEntity.IsValid(hTarget)) {
            this.smash(1, hTarget)
        } else {
            let mdf4 = modifier_earth_spirit_3.findIn(hCaster)
            if (GFuncEntity.IsValid(mdf4)) {
                let hStone = mdf4.GetStone()
                if (GFuncEntity.IsValid(hStone)) {
                    this.smash(0, hStone)
                    return
                }
            }
            // 没有找到石头返还cd和耗蓝
            this.EndCooldown()
            this.RefundManaCost()
        }
    }

    smash(iType: number, hTargetOrStone: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let distance = this.GetSpecialValueFor("distance") + hCaster.GetTalentValue('special_bonus_unique_earth_spirit_custom_2')
        let radius = this.GetSpecialValueFor("radius")
        let speed = this.GetSpecialValueFor("speed")

        let vStartPos = hCaster.GetAbsOrigin()
        if (iType == 1) {
            vStartPos = hTargetOrStone.GetAbsOrigin()
        }
        let vDirection = GFuncVector.HorizonVector((this.GetCursorPosition() - vStartPos) as Vector)
        if (iType == 1) {
            vDirection = GFuncVector.HorizonVector(hTargetOrStone.GetForwardVector())
        }

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.BoulderSmash.Cast", hCaster))
        hTargetOrStone.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.BoulderSmash.Target", hCaster))

        let info: CreateLinearProjectileOptions & { ExtraData: { [k: string]: any } } = {
            Ability: this,
            Source: hCaster,
            //  EffectName : ,
            vSpawnOrigin: vStartPos,
            vVelocity: (vDirection * speed) as Vector,
            fDistance: distance,
            fStartRadius: radius,
            fEndRadius: radius,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            ExtraData: {
                type: iType,
            }
        }

        //  let vEndPos = vStartPos + distance * vDirection
        //  let position1 = vStartPos + Rotation2D(vDirection, math.rad(90)) * radius
        //  let position2 = vStartPos + Rotation2D(vDirection, math.rad(-90)) * radius
        //  let position3 = vEndPos + Rotation2D(vDirection, math.rad(90)) * radius
        //  let position4 = vEndPos + Rotation2D(vDirection, math.rad(-90)) * radius
        //  DebugDrawLine(position1, position3, 255, 255, 255, true, distance / speed)
        //  DebugDrawLine(position2, position4, 255, 255, 255, true, distance / speed)
        //  DebugDrawCircle(vStartPos, Vector(255, 255, 255), 1, radius, true, distance / speed)
        //  DebugDrawCircle(vEndPos, Vector(255, 255, 255), 1, radius, true, distance / speed)
        if (iType == 0) {
            info.ExtraData.smash_index = hTargetOrStone.entindex()
            hTargetOrStone.SetForwardVector(vDirection)
            modifier_earth_spirit_1_smash_target.apply(hTargetOrStone, hCaster, this, { duration: distance / speed })
            // hTargetOrStone.bUsing = true //  正在使用，不能被其他技能使用
        } else if (iType == 1) {
            // 创建幻象
            let hThinker = BaseNpc_Plus.CreateUnitByName(hTargetOrStone.GetUnitName(), vStartPos, hCaster, false)
            let abilitycount = hThinker.GetAbilityCount()
            for (let i = abilitycount - 1; i >= 0; i--) {
                let hAbility = hThinker.GetAbilityByIndex(i)
                if (GFuncEntity.IsValid(hAbility)) {
                    hThinker.RemoveAbilityByHandle(hAbility)
                }
            }
            hThinker.SetForwardVector(vDirection)
            hThinker.StartGesture(GameActivity_t.ACT_DOTA_IDLE)
            modifier_earth_spirit_illusion.apply(hThinker, hCaster, this, { duration: distance / speed })
            modifier_earth_spirit_1_smash_target.apply(hThinker, hCaster, this, { duration: distance / speed })
            info.ExtraData.smash_index = hThinker.entindex()
            info.ExtraData.smash_attacker_index = hTargetOrStone.entindex()
        }

        ProjectileManager.CreateLinearProjectile(info)
    }

    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any) {
        let hThinker = EntIndexToHScript(ExtraData.smash_index || -1) as IBaseNpc_Plus
        if (GFuncEntity.IsValid(hThinker)) {
            hThinker.SetAbsOrigin(GetGroundPosition(vLocation, hThinker))
        }
    }

    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { tMagnetized: Array<any> }

        //  到达最大距离
        if (!GFuncEntity.IsValid(hTarget)) {
            if (ExtraData.type == 0) { //  残岩
                let mdf4 = modifier_earth_spirit_3.findIn(hCaster)
                if (GFuncEntity.IsValid(mdf4) && mdf4.UseStone) {
                    let hStone = EntIndexToHScript(ExtraData.smash_index || -1)
                    if (GFuncEntity.IsValid(hStone)) {
                        UTIL_Remove(hStone)
                    }
                }
            } else if (ExtraData.type == 1) {
                let hThinker = EntIndexToHScript(ExtraData.smash_index || -1)
                if (GFuncEntity.IsValid(hThinker)) {
                    UTIL_Remove(hThinker)
                }
            }
            return
        }

        if (!this.bNotEmitSound) {
            hTarget.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.BoulderSmash.Damage", hCaster))
            if (ExtraData.type == 0) {
                hTarget.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.BoulderSmash.Silence", hCaster))
            }
            this.bNotEmitSound = true
            GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
                this.bNotEmitSound = false
            }))
        }

        let base_damage = this.GetSpecialValueFor("base_damage")
        let str_factor = this.GetSpecialValueFor("str_factor")
        let silence_duration = this.GetSpecialValueFor("silence_duration")
        let slow_duration = this.GetSpecialValueFor("slow_duration")

        let damage_info = {
            ability: this,
            attacker: hCaster,
            victim: hTarget,
            damage: base_damage, //  基础伤害
            damage_type: this.GetAbilityDamageType()
        }

        let tTargets = [hTarget]
        let explode = false
        if (modifier_earth_spirit_6_magnetized.exist(hTarget) && hCaster.tMagnetized && hCaster.tMagnetized.length > 1) {
            tTargets = hCaster.tMagnetized
            explode = true
        }

        for (let v of (tTargets)) {
            if (GFuncEntity.IsValid(v)) {
                if (ExtraData.type == 0) { //  残岩
                    //  减速、沉默
                    modifier_earth_spirit_silence.apply(v, hCaster, this, { duration: silence_duration * v.GetStatusResistanceFactor(hCaster) })
                    modifier_earth_spirit_slow.apply(v, hCaster, this, { duration: slow_duration * v.GetStatusResistanceFactor(hCaster) })
                    if (hCaster.GetStrength) {
                        damage_info.damage = damage_info.damage + hCaster.GetStrength() * str_factor
                    }

                } else if (ExtraData.type == 1) { //  英雄
                    let hAttacker = EntIndexToHScript(ExtraData.smash_attacker_index) as IBaseNpc_Plus
                    if (GFuncEntity.IsValid(hAttacker)) {
                        modifier_earth_spirit_1_cannot_miss.apply(hAttacker, hCaster, this, null)
                        BattleHelper.Attack(hAttacker, v, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN)
                        modifier_earth_spirit_1_cannot_miss.remove(hAttacker);
                    }
                }

                BattleHelper.GoApplyDamage(damage_info)

                // todo: 链接特效
                //  if ( explode && v != hTarget ) {
                // 	 let iParticleID = ResHelper.CreateParticle({
                //     resPath: "particles/units/heroes/hero_earth_spirit/espirit_stone_explosion_bolt.vpcf",
                //     resNpc: null,
                //     iAttachment:   ParticleAttachment_t.PATTACH_ABSORIGIN,
                //     owner:  hCaster
                // });

                // 	 ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), false)
                // 	 ParticleManager.SetParticleControlEnt(iParticleID, 1, v, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", v.GetAbsOrigin(), false)
                //  }
            }
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_earth_spirit_1"
    // }


}

// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_1// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_1 extends BaseModifier_Plus {
    last_target: any;
    last_type: number;
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    order(params: IModifierTable) {
        if (IsServer()) {
            if (params.issuer_player_index != -1 && params.ability == this.GetAbilityPlus()) {
                if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION) {
                    this.last_type = 0
                } else if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET) {
                    this.last_type = 1
                    this.last_target = params.target
                }
            }
        }
    }
    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hAbility)) {
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

        let fRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster)
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE
        let order = FindOrder.FIND_ANY_ORDER

        // 范围内有敌人的时候，尝试释放技能
        let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), fRange, null, teamFilter, typeFilter, flagFilter, order)
        if (targets[0] != null) {
            //  玩家手动施法过一次，自动施法根据上次的施法类型来施法
            if (this.last_type && this.last_type == 1) {
                this.CastHero(true)
            } else {
                this.CastStone(true)
            }
        }
    }
    //  bChange.true 当这次施法找不到合适的目标时，换个方式
    CastHero(bChange: boolean) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let castRange = hAbility.GetCastRange(hParent.GetAbsOrigin(), hParent) + hParent.GetCastRangeBonus()

        if (GFuncEntity.IsValid(this.last_target) && hParent.IsPositionInRange(this.last_target.GetAbsOrigin(), castRange)) {
            ExecuteOrderFromTable({
                UnitIndex: hParent.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                TargetIndex: this.last_target.entindex(),
                AbilityIndex: hAbility.entindex()
            })
            return
        } else {
            this.last_type = null
            let hFriends = FindUnitsInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), null, 1000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            for (let friend of (hFriends)) {
                if (friend.IsBuilding && friend.IsBuilding() && hParent.IsPositionInRange(friend.GetAbsOrigin(), castRange)) {
                    ExecuteOrderFromTable({
                        UnitIndex: hParent.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: friend.entindex(),
                        AbilityIndex: hAbility.entindex()
                    })
                    return
                }
            }
        }
        //  单位无效，试试用石头施法
        if (bChange) {
            this.CastStone(false)
        }
    }
    CastStone(bChange: boolean) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let fRange = hAbility.GetCastRange(hParent.GetAbsOrigin(), hParent)
        let radius = hAbility.GetSpecialValueFor("radius")

        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE
        let order = FindOrder.FIND_ANY_ORDER

        let mdf4 = modifier_earth_spirit_3.findIn(hParent)
        if (GFuncEntity.IsValid(mdf4)) {
            let hStone = mdf4.GetStoneNoUse()
            if (GFuncEntity.IsValid(hStone)) {
                let position = AoiHelper.GetLinearMostTargetsPosition(hParent.GetAbsOrigin(), fRange, hParent.GetTeamNumber(), radius, radius, null, teamFilter, typeFilter, flagFilter, order)
                if (position != vec3_invalid && hParent.IsPositionInRange(position, fRange)) {
                    ExecuteOrderFromTable({
                        UnitIndex: hParent.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: hAbility.entindex(),
                        Position: position
                    })
                    return
                }
            }
        }

        if (bChange) {
            this.CastHero(false)
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_1_smash_target// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_1_smash_target extends modifier_particle_thinker {
    distance: number;
    speed: number;
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            this.distance = this.GetSpecialValueFor("distance")
            this.speed = this.GetSpecialValueFor("speed")
            let hParent = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_target.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(particleID, 2, Vector(this.distance / this.speed, 0, 0))
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_illusion// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_illusion extends BaseModifier_Plus {
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

        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_earth_spirit_petrify.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, true, 10, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earth_spirit/espirit_stoneremnant_base.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_target.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_silence// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_silence extends BaseModifier_Plus {
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
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/items2_fx/orchid_silenced.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_slow// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_slow extends BaseModifier_Plus {
    slow_percent: number;
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
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_silence.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.slow_percent = this.GetSpecialValueFor("slow_percent")
        if (IsServer()) {
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.slow_percent
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_1_cannot_miss// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_1_cannot_miss extends BaseModifier_Plus {
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
