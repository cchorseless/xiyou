import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_tinker_rearm = { "ID": "5153", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilitySound": "Hero_Tinker.Rearm", "AbilityDraftUltShardAbility": "tinker_defense_matrix", "AbilityCastPoint": "0", "AbilityChannelTime": "3.5 2.0 1.25", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityChannelAnimation": "ACT_DOTA_CHANNEL_ABILITY_4", "AbilityCooldown": "0.0 0.0 0.0", "AbilityManaCost": "100 210 320", "AbilitySpecial": {} };

@registerAbility()
export class ability6_tinker_rearm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tinker_rearm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tinker_rearm = Data_tinker_rearm;
    Init() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("collision_radius", 50);
        this.SetDefaultSpecialValue("splash_radius", 150);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("speed", 400);
        this.SetDefaultSpecialValue("machines_per_sec", 24);
        this.SetDefaultSpecialValue("distance", 1800);
        this.SetDefaultSpecialValue("damage", [350, 500, 650, 800, 950, 1100]);
        this.SetDefaultSpecialValue("scepter_duration", 3);

    }

    Init_old() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("collision_radius", 50);
        this.SetDefaultSpecialValue("splash_radius", 150);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("speed", 400);
        this.SetDefaultSpecialValue("machines_per_sec", 24);
        this.SetDefaultSpecialValue("distance", 1800);
        this.SetDefaultSpecialValue("damage", [350, 500, 650, 800, 950, 1100]);

    }

    vLastPosition: Vector;


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        let duration = this.GetSpecialValueFor("duration")

        let vPosition = this.GetCursorPosition()
        let vCasterPosition = hCaster.GetAbsOrigin()

        let vDirection = (vPosition - vCasterPosition) as Vector
        vDirection.z = 0
        vDirection = vDirection.Normalized()
        if (vDirection == Vector(0, 0, 0)) {
            vDirection = hCaster.GetForwardVector()
        }

        modifier_tinker_6_thinker.applyThinker(vPosition, hCaster, this, {
            duration: duration,
            direction_x: vDirection.x,
            direction_y: vDirection.y,
            direction_z: vDirection.z
        }, hCaster.GetTeamNumber(), false)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Tinker.March_of_the_Machines.Cast", hCaster))

        modifier_tinker_6_particle_cast.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Tinker.March_of_the_Machines", hCaster), hCaster)

        //  记录上一次释放的位置
        this.vLastPosition = vPosition
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            let hCaster = this.GetCasterPlus()
            if (hTarget.GetTeamNumber() != hCaster.GetTeamNumber()) {
                let damage = this.GetSpecialValueFor("damage") + hCaster.GetTalentValue("special_bonus_unique_tinker_custom_3") * hCaster.GetIntellect()
                let splash_radius = this.GetSpecialValueFor("splash_radius")
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), splash_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
                for (let hUnit of (tTargets)) {
                    let tDamageTable = {
                        ability: this,
                        attacker: hCaster,
                        victim: hUnit,
                        damage: damage,
                        damage_type: this.GetAbilityDamageType()
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
            } else if (hCaster.HasScepter() && hTarget.GetUnitLabel() == "HERO") {
                let scepter_duration = this.GetSpecialValueFor("scepter_duration")
                modifier_tinker_6_buff.apply(hTarget, hCaster, this, { duration: scepter_duration })
            } else {
                return false
            }
        }
        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_tinker_6"
    }

    OnStolen(hSourceAbility: this) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tinker_6 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability6_tinker_rearm
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

            let teamFilter = caster.HasScepter() && DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH || DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先释放在上一次释放的位置
            let radius = ability.GetSpecialValueFor("radius")
            if (ability.vLastPosition != null && caster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)

                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ability.vLastPosition,
                        AbilityIndex: ability.entindex()
                    })
                }
            } else {
                //  优先攻击目标
                let target

                //  搜索范围
                if (target == null) {
                    let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), radius, null, teamFilter, typeFilter, flagFilter, order)
                    target = targets[0]
                }

                //  施法命令
                if (target != null) {
                    let vDirection = (target.GetAbsOrigin() - caster.GetAbsOrigin()) as Vector
                    vDirection.z = 0
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: (caster.GetAbsOrigin() + vDirection.Normalized() * range) as Vector,
                        AbilityIndex: ability.entindex()
                    })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_tinker_6_thinker extends BaseModifier_Plus {
    radius: number;
    collision_radius: number;
    speed: number;
    distance: number;
    machines_per_sec: number;
    iCount: number;
    vDirection: Vector;
    sSoundName: string;
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
        this.radius = this.GetSpecialValueFor("radius")
        this.collision_radius = this.GetSpecialValueFor("collision_radius")
        this.speed = this.GetSpecialValueFor("speed")
        this.distance = this.GetSpecialValueFor("distance")
        this.machines_per_sec = this.GetSpecialValueFor("machines_per_sec")
        if (IsServer()) {
            this.iCount = math.floor(this.GetDuration() * this.machines_per_sec)
            this.vDirection = Vector(params.direction_x, params.direction_y, params.direction_z)
            this.StartIntervalThink(1 / this.machines_per_sec)
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_Tinker.March_of_the_Machines", this.GetCasterPlus())
            this.GetParentPlus().EmitSound(this.sSoundName)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().StopSound(this.sSoundName)
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            let hCaster = this.GetCasterPlus()
            if (!GameFunc.IsValid(hAbility) && !GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            let hParent = this.GetParentPlus()
            let vPosition = hParent.GetAbsOrigin()

            let vStartPosition = (vPosition - this.vDirection * this.radius + GameFunc.VectorFunctions.Rotation2D(this.vDirection, math.rad(90)) * RandomFloat(-this.radius, this.radius)) as Vector

            let tInfo: CreateLinearProjectileOptions = {
                Ability: hAbility,
                Source: hCaster,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_tinker/tinker_machine.vpcf", hCaster),
                vSpawnOrigin: vStartPosition,
                vVelocity: (this.vDirection * this.speed) as Vector,
                fDistance: this.distance,
                fStartRadius: this.collision_radius,
                fEndRadius: this.collision_radius,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            }
            ProjectileManager.CreateLinearProjectile(tInfo)

            this.iCount = this.iCount - 1

            if (this.iCount <= 0) {
                this.StartIntervalThink(-1)
            }

            this.SetDuration(math.max(this.GetRemainingTime(), this.distance / this.speed), true)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tinker_6_buff extends BaseModifier_Plus {
    damage: any;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.damage = this.GetSpecialValueFor("damage") + hCaster.GetTalentValue("special_bonus_unique_tinker_custom_3") * hCaster.GetIntellect()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_PHYSICAL_DAMAGE_CONSTANT)
    G_OUTGOING_PHYSICAL_DAMAGE_CONSTANT() {
        return this.damage
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP2)
    On_Tooltip2() {
        return this.damage
    }
}
//  Particle
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_tinker_6_particle_cast extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_tinker/tinker_motm.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
