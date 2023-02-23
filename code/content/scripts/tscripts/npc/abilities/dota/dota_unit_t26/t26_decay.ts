import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";


@registerAbility()
export class t26_decay extends BaseAbility_Plus {

    GetAOERadius() {
        return this.GetSpecialValueFor("aoe_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()

        modifier_t26_decay_thinker.applyThinker(vPosition, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)
    }


    GetIntrinsicModifierName() {
        return "modifier_t26_decay"


    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t26_decay extends BaseModifier_Plus {
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t26_decay_strength_gain extends BaseModifier_Plus {
    strength_gain: number;
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
    Init(params: IModifierTable) {
        this.strength_gain = this.GetSpecialValueFor("strength_gain")
        if (IsServer()) {
            this.changeStackCount(this.strength_gain)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-this.strength_gain)
            })
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(params: IModifierTable) {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t26_decay_thinker extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let vPosition = hParent.GetAbsOrigin()
        let aoe_radius = this.GetSpecialValueFor("aoe_radius")
        let damage_percent = this.GetSpecialValueFor("damage_percent")
        let strength_gain_duration = this.GetSpecialValueFor('strength_gain_duration')
        if (IsServer()) {
            hCaster.EmitSound("Hero_Undying.Decay.Cast")
            EmitSoundOnLocationWithCaster(vPosition, "Hero_Undying.Decay.Target", hCaster)

            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, aoe_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                let tDamageTable = {
                    victim: hTarget,
                    attacker: hCaster,
                    damage: hCaster.GetMaxHealth() * damage_percent * 0.01,
                    damage_type: hAbility.GetAbilityDamageType(),
                    ability: hAbility,
                }
                BattleHelper.GoApplyDamage(tDamageTable)

                modifier_t26_decay_strength_gain.apply(hCaster, hCaster, hAbility, { duration: strength_gain_duration })
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_undying/undying_decay.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(aoe_radius, aoe_radius, aoe_radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}