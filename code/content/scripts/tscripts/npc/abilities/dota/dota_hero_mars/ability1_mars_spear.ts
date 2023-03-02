import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_mars_6_blocker, modifier_mars_6_spear_aura } from "./ability6_mars_arena_of_blood";
/** dota原技能数据 */
export const Data_mars_spear = { "ID": "6583", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DIRECTIONAL", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "FightRecapLevel": "1", "AbilitySound": "Hero_Mars.Spear.Cast", "HasShardUpgrade": "1", "AbilityCastPoint": "0.25", "AbilityCooldown": "14.0", "AbilityManaCost": "110 120 130 140", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "scepter_cooldown": "7" }, "01": { "var_type": "FIELD_INTEGER", "damage": "100 175 250 325", "LinkedSpecialBonus": "special_bonus_unique_mars_spear_bonus_damage" }, "02": { "var_type": "FIELD_FLOAT", "spear_speed": "1400" }, "03": { "var_type": "FIELD_INTEGER", "spear_width": "125" }, "04": { "var_type": "FIELD_INTEGER", "spear_vision": "300" }, "05": { "var_type": "FIELD_INTEGER", "spear_range": "900 1000 1100 1200" }, "06": { "var_type": "FIELD_FLOAT", "activity_duration": "1.7" }, "07": { "var_type": "FIELD_FLOAT", "stun_duration": "1.6 2.0 2.4 2.8", "LinkedSpecialBonus": "special_bonus_unique_mars_spear_stun_duration" }, "08": { "var_type": "FIELD_FLOAT", "knockback_duration": "0.25" }, "09": { "var_type": "FIELD_FLOAT", "knockback_distance": "75" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5" };

@registerAbility()
export class ability1_mars_spear extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "mars_spear";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_mars_spear = Data_mars_spear;
    Init() {
        this.SetDefaultSpecialValue("attack_damage_percent", [100, 120, 140, 160, 180, 200]);
        this.SetDefaultSpecialValue("hit_attack_damage_percent", 500);
        this.SetDefaultSpecialValue("stun_duration", 3);
        this.SetDefaultSpecialValue("speed", 1400);
        this.SetDefaultSpecialValue("radius", 125);
        this.SetDefaultSpecialValue("range", 900);
        this.SetDefaultSpecialValue("delay", 0.452);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GFuncEntity.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let delay = this.GetSpecialValueFor("delay")
        let range = this.GetSpecialValueFor("range")
        let radius = this.GetSpecialValueFor("radius")
        let speed = this.GetSpecialValueFor("speed")
        let sLastCornerName = "hTarget.Spawner_lastCornerName"
        let sNextCornerName = "hTarget.Spawner_targetCornerName"

        let vPosition = hTarget.GetAbsOrigin()
        let vDirection = -hTarget.GetForwardVector() as Vector

        let hLastCorner = Entities.FindByName(null, sLastCornerName)
        let hNextCorner = Entities.FindByName(null, sNextCornerName)
        if (hLastCorner && hNextCorner) {
            vDirection = (hLastCorner.GetAbsOrigin() - hNextCorner.GetAbsOrigin()) as Vector
            vDirection.z = 0
            if (vDirection.x == 0) {
                vPosition.x = hLastCorner.GetAbsOrigin().x
            } else if (vDirection.y == 0) {
                vPosition.y = hLastCorner.GetAbsOrigin().y
            }
            vDirection = vDirection.Normalized()
        }
        else {
            this.EndCooldown()
            this.RefundManaCost()
            return
        }
        let fOffsetDistance = delay * hTarget.GetMoveSpeedModifier(hTarget.GetBaseMoveSpeed(), false) + radius

        let vStartPosition = (vPosition - vDirection * fOffsetDistance) as Vector

        let hThinker = CreateUnitByName(hCaster.GetUnitName(), vStartPosition, false, hCaster, hCaster, hCaster.GetTeamNumber())

        for (let i = hThinker.GetAbilityCount() - 1; i >= 0; i--) {
            let ability = hThinker.GetAbilityByIndex(i)
            if (GFuncEntity.IsValid(ability)) {
                hThinker.RemoveAbilityByHandle(ability)
            }
        }
        hThinker.SetForwardVector(hCaster.GetForwardVector())
        hThinker.FaceTowards(hTarget.GetAbsOrigin())
        hThinker.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_5)
        EmitSoundOnLocationWithCaster(vStartPosition, ResHelper.GetSoundReplacement("Hero_Mars.Spear.Cast", hCaster), hCaster)
        EmitSoundOnLocationWithCaster(vStartPosition, ResHelper.GetSoundReplacement("Hero_Mars.Spear", hCaster), hCaster)
        modifier_mars_1_thinker.apply(hThinker, hCaster, this, { duration: delay + (radius + range + radius) / speed + BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        let vTargetPosition = (vStartPosition + vDirection * range) as Vector
        this.addTimer(delay, () => {
            let tInfo = {
                Ability: this,
                Source: hCaster,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_mars/mars_spear.vpcf", hCaster),
                vSpawnOrigin: vStartPosition,
                fDistance: range,
                fStartRadius: radius,
                fEndRadius: radius,
                vVelocity: (vDirection.Normalized() * speed) as Vector,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                bProvidesVision: false,
                ExtraData: {
                    thinker_ent_index: hThinker.entindex(),
                    target_position_x: vTargetPosition.x,
                    target_position_y: vTargetPosition.y,
                    target_position_z: vTargetPosition.z,
                }
            }
            ProjectileManager.CreateLinearProjectile(tInfo)
        })
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        if (GFuncEntity.IsValid(hTarget)) {
            if (ExtraData.target_position_x != null && ExtraData.target_position_y != null && ExtraData.target_position_z != null) {
                let speed = this.GetSpecialValueFor("speed")
                let radius = this.GetSpecialValueFor("radius")
                let vTargetPosition = Vector(ExtraData.target_position_x, ExtraData.target_position_y, ExtraData.target_position_z)
                let vDirection = (vTargetPosition - vLocation) as Vector
                vDirection.z = 0
                let attack_damage_percent = this.GetSpecialValueFor("attack_damage_percent")
                let fDamage = hCaster.GetAverageTrueAttackDamage(hCaster) * attack_damage_percent * 0.01
                let damage_table =
                {
                    ability: this,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                }
                BattleHelper.GoApplyDamage(damage_table)
                EmitSoundOn("Hero_Mars.Spear.Target", hTarget)
                // 被定住的无法在被其他的矛移动，不然方向会有问题
                if (!modifier_mars_1_hit_obstacle_stun.exist(hTarget)) {
                    modifier_mars_1_move.apply(hTarget, hCaster, this, {
                        duration: vDirection.Length2D() / speed,
                        start_position: vLocation + vDirection.Normalized() * radius,
                        target_position: vTargetPosition + vDirection.Normalized() * radius
                    })
                }
            }
            return false
        }
        return true
    }
    GetIntrinsicModifierName() {
        return "modifier_mars_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_1 extends BaseModifier_Plus {
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
    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(ability)) {
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
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_FARTHEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_1_thinker extends BaseModifier_Plus {
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

    }

    BeDestroy() {

        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_1_move extends BaseModifierMotionHorizontal_Plus {
    stun_duration: number;
    hit_attack_damage_percent: number;
    vTargetPosition: Vector;
    vStartPosition: Vector;
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
            if (this.ApplyHorizontalMotionController()) {
                this.vStartPosition = GFuncVector.StringToVector(params.start_position)
                this.vTargetPosition = GFuncVector.StringToVector(params.target_position)
            } else {
                this.Destroy()
            }
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.stun_duration = this.GetSpecialValueFor("stun_duration") + hCaster.GetTalentValue("special_bonus_unique_mars_custom_4")
        this.hit_attack_damage_percent = this.GetSpecialValueFor("hit_attack_damage_percent")
    }
    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this)
        }
    }
    UpdateHorizontalMotion(hParent: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            let fPercent = this.GetElapsedTime() / this.GetDuration()
            if (GFuncEntity.IsValid(hCaster) && hCaster.IsAlive()) {
                let vPosition = GFuncVector.VectorLerp(fPercent, this.vStartPosition, this.vTargetPosition)
                let vDirection = ((this.vTargetPosition - this.vStartPosition) as Vector).Normalized()
                hParent.SetAbsOrigin(vPosition)
                let arena_walls = Entities.FindAllByClassnameWithin("npc_dota_phantomassassin_gravestone", hParent.GetAbsOrigin(), 160)
                for (let arena_wall of (arena_walls as IBaseNpc_Plus[])) {
                    if (arena_wall.FindModifierByName('modifier_mars_6_blocker') as modifier_mars_6_blocker) {
                        let fCasterAngle = VectorAngles(vDirection).y
                        let vTargetAngle = VectorAngles(arena_wall.GetForwardVector()).y
                        let fAngleDiff = math.abs(AngleDiff(fCasterAngle, vTargetAngle))
                        if (fAngleDiff >= 120 && hParent.FindModifierByName('modifier_mars_6_spear_aura') as modifier_mars_6_spear_aura) {
                            this.Pinned(vDirection)
                        }
                        break
                    }
                }
                if ((!GridNav.IsTraversable(vPosition))) {
                    this.Pinned(vDirection)
                }
            }
        }
    }
    Pinned(vDirection: Vector) {
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        let hParent = this.GetParentPlus()
        let fDamage = hCaster.GetAverageTrueAttackDamage(hCaster) * this.hit_attack_damage_percent * 0.01
        let damage_table =
        {
            ability: hAbility,
            attacker: hCaster,
            victim: hParent,
            damage: fDamage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
        }
        BattleHelper.GoApplyDamage(damage_table)
        modifier_mars_1_hit_obstacle_stun.apply(hParent, hCaster, hAbility, { duration: this.stun_duration * hParent.GetStatusResistanceFactor(hCaster), vDir: (vDirection) })
        this.Destroy()
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_1_hit_obstacle_stun extends BaseModifier_Plus {
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
    GetEffectName() {
        return "particles/units/heroes/hero_mars/mars_spear_impact_debuff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
    }
    GetStatusEffectName() {
        return "particles/status_fx/status_effect_mars_spear.vpcf"
    }
    StatusEffectPriority() {
        return 10
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let vDir = GFuncVector.StringToVector(params.vDir)
            let delta = 200
            let location = GetGroundPosition(hParent.GetAbsOrigin(), hParent) + vDir * delta
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_mars/mars_spear_impact.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, (vDir * 1000) as Vector)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.GetDuration(), 0, 0))
            ParticleManager.SetParticleControlForward(iParticleID, 0, vDir)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            //  EmitSoundOn( "Hero_Mars.Spear.Root", hParent)
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_GetModifierOutgoingDamagePercentage() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_mars_custom_6")
    }
}
