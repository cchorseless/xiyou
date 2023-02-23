
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_dummy } from "../../../modifier/modifier_dummy";

/** dota原技能数据 */
export const Data_snapfire_spit_creep = { "ID": "6486", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "MaxLevel": "1", "FightRecapLevel": "1", "IsGrantedByScepter": "1", "AbilitySound": "Hero_Snapfire.MortimerBlob.Launch", "AbilityCastRange": "3000", "AbilityCastPoint": "0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityCooldown": "0", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "min_range": "0" }, "11": { "var_type": "FIELD_FLOAT", "min_lob_travel_time": "0.1" }, "12": { "var_type": "FIELD_FLOAT", "max_lob_travel_time": "2.0" }, "13": { "var_type": "FIELD_FLOAT", "burn_linger_duration": "1.0" }, "14": { "var_type": "FIELD_FLOAT", "stun_duration": "1.5" }, "15": { "var_type": "FIELD_FLOAT", "min_height_above_lowest": "150.0" }, "16": { "var_type": "FIELD_FLOAT", "min_height_above_highest": "100.0" }, "17": { "var_type": "FIELD_FLOAT", "min_acceleration": "1000.0" }, "18": { "var_type": "FIELD_FLOAT", "max_acceleration": "2000.0" }, "01": { "var_type": "FIELD_INTEGER", "projectile_speed": "1400" }, "02": { "var_type": "FIELD_INTEGER", "projectile_width": "130" }, "03": { "var_type": "FIELD_INTEGER", "impact_radius": "400" }, "05": { "var_type": "FIELD_INTEGER", "projectile_vision": "500" }, "06": { "var_type": "FIELD_FLOAT", "burn_interval": "0.5" }, "07": { "var_type": "FIELD_INTEGER", "burn_damage": "100" }, "08": { "var_type": "FIELD_INTEGER", "move_slow_pct": "25", "LinkedSpecialBonus": "special_bonus_unique_snapfire_4" }, "09": { "var_type": "FIELD_FLOAT", "burn_ground_duration": "3.0" } } };

@registerAbility()
export class ability5_snapfire_spit_creep extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "snapfire_spit_creep";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_snapfire_spit_creep = Data_snapfire_spit_creep;


    GetAOERadius() {
        return this.GetSpecialValueFor("impact_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { tMarkUnit: IBaseNpc_Plus[] }
        let vPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")
        modifier_snapfire_5_buff.apply(hCaster, hCaster, this, { duration: duration, vTarget: (vPosition) })
        if (hCaster.tMarkUnit != null) {
            for (let hTarget of (hCaster.tMarkUnit)) {
                if (GameFunc.IsValid(hTarget)) {
                    modifier_snapfire_5_buff.apply(hCaster, hCaster, this, { duration: duration, vTarget: (hTarget.GetAbsOrigin()) })
                }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_snapfire_5"
    }

    OnProjectileHit_ExtraData(hThinker: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (GameFunc.IsValid(hThinker)) {
            let hCaster = this.GetCasterPlus()
            let vPosition = hThinker.GetAbsOrigin()
            let impact_damage = this.GetSpecialValueFor("impact_damage")
            let impact_damage_str_factor = this.GetSpecialValueFor("impact_damage_str_factor")
            let impact_per_damage_percent = this.GetSpecialValueFor("impact_per_damage_percent")
            let impact_radius = this.GetSpecialValueFor("impact_radius")
            let burn_ground_duration = this.GetSpecialValueFor("burn_ground_duration")

            let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, null, impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            let fDamage = impact_damage + hCaster.GetStrength() * impact_damage_str_factor
            for (let hTarget of (tTargets)) {
                // 血盆大口
                // let hModifier = modifier_snapfire_3_scepter_buff.findIn(hCaster) as IBaseModifier_Plus;
                // if (GameFunc.IsValid(hModifier)) {
                //     let hModifierCaster = hModifier.GetCasterPlus()
                //     if (GameFunc.IsValid(hModifierCaster)) {
                //         BattleHelper.Attack(hModifierCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                //         fDamage = fDamage + hModifierCaster.GetAverageTrueAttackDamage(hModifierCaster)
                //     }
                // }
                let damage_table =
                {
                    ability: this,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                }
                BattleHelper.GoApplyDamage(damage_table)
            }

            EmitSoundOnLocationWithCaster(vPosition, "Hero_Snapfire.MortimerBlob.Impact", hCaster)

            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_snapfire/hero_snapfire_ultimate_impact.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
            ParticleManager.SetParticleControl(iParticleID, 3, vPosition)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            let burn_damage = fDamage * impact_per_damage_percent * 0.01
            modifier_snapfire_5_debuff_burn_ground.apply(hThinker, hCaster, this, { duration: burn_ground_duration, burn_damage: burn_damage })
        }
        return true
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_5 extends BaseModifier_Plus {
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
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
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
export class modifier_snapfire_5_buff extends BaseModifier_Plus {
    projectile_count: number;
    projectile_speed: number;
    projectile_width: number;
    max_lob_travel_time: number;
    min_lob_travel_time: number;
    impact_radius: number;
    interval: number;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let vPosition = GameFunc.VectorFunctions.StringToVector(params.vTarget)
            this.SetStackCount(this.projectile_count)
            this.StartIntervalThink(this.interval)
            this.Spit(vPosition)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.projectile_count = this.GetSpecialValueFor("projectile_count") + hCaster.GetTalentValue("special_bonus_unique_snapfire_custom_5")
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed")
        this.projectile_width = this.GetSpecialValueFor("projectile_width")
        this.min_lob_travel_time = this.GetSpecialValueFor("min_lob_travel_time")
        this.max_lob_travel_time = this.GetSpecialValueFor("max_lob_travel_time")
        this.impact_radius = this.GetSpecialValueFor("impact_radius")
        this.interval = this.GetSpecialValueFor("interval")
        if (IsServer()) {
            this.SetStackCount(this.projectile_count)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let tTarget = FindUnitsInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), null, hAbility.GetCastRange(hParent.GetAbsOrigin(), hParent), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            let hTarget = GameFunc.ArrayFunc.RandomArray(tTarget)[0]
            if (hTarget != null) {
                this.Spit(hTarget.GetAbsOrigin())
            }
        }
    }
    Spit(vPosition: Vector) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let hThinker = modifier_dummy.applyThinker(vPosition, hParent, hAbility, null, hParent.GetTeamNumber(), false)
            let vStartPosition = hParent.GetAttachmentOrigin(hParent.ScriptLookupAttachment("attach_mouth"))
            let fDistance = ((vStartPosition - vPosition) as Vector).Length2D()
            let fFlyTime = GameFunc.mathUtil.Clamp(fDistance / this.projectile_speed, this.min_lob_travel_time, this.max_lob_travel_time)
            let fSpeed = fDistance / fFlyTime
            hParent.FaceTowards(vPosition)
            let iParticleID = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_snapfire/hero_snapfire_ultimate_calldown.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, null, hParent.GetTeamNumber())
            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.impact_radius, 0, -(this.impact_radius / fFlyTime) * 2))
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(fFlyTime, 0, 0))
            // hThinker.add(fFlyTime, () => {
            //     ParticleManager.DestroyParticle(iParticleID, false)
            // })
            hParent.EmitSound("Hero_Snapfire.MortimerBlob.Launch")
            let tInfo = {
                Target: hThinker,
                Ability: hAbility,
                vSourceLoc: vStartPosition,
                EffectName: "particles/units/heroes/hero_snapfire/snapfire_lizard_blobs_arced.vpcf",
                iMoveSpeed: fSpeed,
                bProvidesVision: true,
            }
            ProjectileManager.CreateTrackingProjectile(tInfo)
            hParent.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4, 0.9 / this.interval)
            this.DecrementStackCount()
            if (this.GetStackCount() <= 0) {
                this.StartIntervalThink(-1)
                this.Destroy()
            }
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: (!this.GetCasterPlus().HasTalent("special_bonus_unique_snapfire_custom_6")),
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    GetTurnRate_Percentage() {
        return 100
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_5_debuff_burn_ground extends BaseModifier_Plus {
    impact_radius: number;
    burn_duration: number;
    burn_damage: any;
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

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.StartIntervalThink(0)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_snapfire/hero_snapfire_ultimate_linger.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.impact_radius = this.GetSpecialValueFor("impact_radius")
        this.burn_duration = this.GetSpecialValueFor("burn_duration")
        if (IsServer()) {
            this.burn_damage = params.burn_damage || 0
        }
    }
    BeDestroy() {

        if (IsServer()) {
            modifier_dummy.remove(this.GetParentPlus());
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                return
            }
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            for (let hTarget of (tTarget)) {
                if (GameFunc.IsValid(hTarget)) {
                    modifier_snapfire_5_debuff_burn.apply(hTarget, hCaster, hAbility, { duration: this.burn_duration, burn_damage: this.burn_damage })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_5_debuff_burn extends BaseModifier_Plus {
    burn_interval: number;
    impact_damage: number;
    impact_damage_str_factor: number;
    impact_per_damage_percent: number;
    burn_damage: any;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            this.StartIntervalThink(this.burn_interval)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_snapfire/hero_snapfire_burn_debuff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_snapfire_magma.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.burn_interval = this.GetSpecialValueFor("burn_interval")
        this.impact_damage = this.GetSpecialValueFor("impact_damage")
        this.impact_damage_str_factor = this.GetSpecialValueFor("impact_damage_str_factor")
        this.impact_per_damage_percent = this.GetSpecialValueFor("impact_per_damage_percent")
        if (IsServer()) {
            this.burn_damage = params.burn_damage || 0
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (GameFunc.IsValid(hCaster)) {
                let damage_table =
                {
                    ability: hAbility,
                    attacker: hCaster,
                    victim: hParent,
                    damage: this.burn_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    eom_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT,
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        }
    }
}
