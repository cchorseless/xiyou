import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t39_ice_bomb extends BaseAbility_Plus {
    projectile: ProjectileID;

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let vDirection = (vPosition - hCaster.GetAbsOrigin()) as Vector
        vDirection.z = 0.0
        vDirection = vDirection.Normalized()
        let projectile_speed = this.GetSpecialValueFor("projectile_speed")
        let projectile_distance = this.GetSpecialValueFor("projectile_distance")
        let attack_radius = this.GetSpecialValueFor("attack_radius")
        let info: CreateLinearProjectileOptions = {
            EffectName: "particles/units/towers/t39/troll_projectile_gale.vpcf",
            Ability: this,
            vSpawnOrigin: hCaster.GetAbsOrigin(),
            fStartRadius: attack_radius,
            fEndRadius: attack_radius,
            vVelocity: (vDirection * projectile_speed) as Vector,
            fDistance: projectile_distance,
            Source: hCaster,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
        }
        this.projectile = ProjectileManager.CreateLinearProjectile(info)
        EmitSoundOn("FrostbittenShaman.FreezingBlast.Cast", hCaster)
    }
    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        if (GameFunc.IsValid(hTarget)) {
            let hCaster = this.GetCasterPlus()
            let damage = this.GetSpecialValueFor("damage")
            let int_factor = this.GetSpecialValueFor("int_factor")
            let radius = this.GetSpecialValueFor("radius")
            // todo:爆炸特效
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t39/ice_giant_yak_explosion_2.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hTarget
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            let fDamage = damage + hCaster.GetIntellect() * int_factor
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
                EmitSoundOn("FrostbittenShaman.FreezingBlast.Impact", hCaster)
                // let modifier_combination_t39_frostbite = Load(hCaster, "modifier_combination_t39_frostbite")
                // if ((GameFunc.IsValid(modifier_combination_t39_frostbite) && modifier_combination_t39_frostbite.GetStackCount() > 0)) {
                //      modifier_t39_ice_bomb_debuff.apply( hTarget , hCaster, this, { duration = modifier_combination_t39_frostbite.duration || 0 })
                // }
            }
            return true
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_t39_ice_bomb"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t39_ice_bomb extends BaseModifier_Plus {
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
export class modifier_t39_ice_bomb_debuff extends BaseModifier_Plus {
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
    GetTexture() {
        return "lich/ti8_immortal_wrist/lich_chain_frost_immortal"
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (!IsServer()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ancient_apparition/ancient_apparition_ice_blast_debuff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_iceblast.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATUS_RESISTANCE_FORCE)

    G_STATUS_RESISTANCE_FORCE() {
        return this.GetSpecialValueFor("state_resistance")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetSpecialValueFor("state_resistance")
    }
}