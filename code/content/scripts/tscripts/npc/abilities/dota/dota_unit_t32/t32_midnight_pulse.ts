import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { LogHelper } from "../../../../helper/LogHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { GameSetting } from "../../../../GameSetting";
import { GameEnum } from "../../../../shared/GameEnum";


@registerAbility()
export class t32_midnight_pulse extends BaseAbility_Plus {

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")

        // let combination_t32_midnight_pulse_twine = combination_t32_midnight_pulse_twine.findIn(hCaster)
        // if (GameFunc.IsValid(combination_t32_midnight_pulse_twine) && combination_t32_midnight_pulse_twine.IsActivated()) {
        //     duration = duration + combination_t32_midnight_pulse_twine.GetSpecialValueFor("extra_duration")
        // }

        hCaster.EmitSound("Hero_Enigma.Midnight_Pulse")

        let hThinker = modifier_t32_midnight_pulse_thinker.applyThinker(vPosition, hCaster, this, { duration: duration }, hCaster.GetTeamNumber(), false)
        modifier_t32_midnight_pulse_bound.apply(hThinker, hThinker, this, null)
    }

    GetIntrinsicModifierName() {
        return "modifier_t32_midnight_pulse"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t32_midnight_pulse extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)

            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: hCaster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position
                    }
                )
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t32_midnight_pulse_thinker extends BaseModifier_Plus {
    base_damage: number;
    intellect_damage_factor: number;
    damage_percent: number;
    damage_interval: number;
    max_mana_damage_factor: number;
    radius: number;
    damage_type: DAMAGE_TYPES;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.base_damage = this.GetSpecialValueFor("base_damage")
        this.intellect_damage_factor = this.GetSpecialValueFor("intellect_damage_factor")
        this.damage_percent = this.GetSpecialValueFor("damage_percent")
        this.damage_interval = this.GetSpecialValueFor("damage_interval")
        this.max_mana_damage_factor = this.GetSpecialValueFor("max_mana_damage_factor")
        this.radius = this.GetSpecialValueFor("radius")
        let vPosition = this.GetParentPlus().GetAbsOrigin()
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.StartIntervalThink(this.damage_interval)
        }
        else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_enigma/enigma_midnight_pulse.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            let hAbility = this.GetAbilityPlus()

            if (!GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }

            // let combination_t32_midnight_pulse_erase  = combination_t32_midnight_pulse_erase.findIn(  hCaster )
            // let has_combination_t32_midnight_pulse_erase = GameFunc.IsValid(combination_t32_midnight_pulse_erase) && combination_t32_midnight_pulse_erase.IsActivated()

            let vPosition = this.GetParentPlus().GetAbsOrigin()

            let iIntellect = 0
            if (hCaster.GetIntellect) {
                iIntellect = hCaster.GetIntellect()
            }

            let teamFilter = hAbility.GetAbilityTargetTeam()
            let typeFilter = hAbility.GetAbilityTargetType()
            let flagFilter = hAbility.GetAbilityTargetFlags()
            let order = FindOrder.FIND_CLOSEST
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, this.radius, null, teamFilter, typeFilter, flagFilter, order)
            for (let hTarget of (tTargets)) {

                // if (has_combination_t32_midnight_pulse_erase && combination_t32_midnight_pulse_erase.Erase) {
                // combination_t32_midnight_pulse_erase.Erase(hTarget)
                // }

                let fDamage = this.base_damage + this.intellect_damage_factor * iIntellect + hTarget.GetMaxHealth() * this.damage_percent * 0.01
                fDamage = math.min(fDamage, hCaster.GetMaxMana() * this.max_mana_damage_factor)
                if (hTarget.IsAlive()) {
                    let tDamageTable = {
                        ability: hAbility,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: fDamage,
                        damage_type: this.damage_type
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            modifier_t32_midnight_pulse_bound.remove(this.GetParentPlus());
            UTIL_Remove(this.GetParentPlus())
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
@registerModifier()
export class modifier_t32_midnight_pulse_bound extends BaseModifier_Plus {
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
    IsAura() {
        if (!GameFunc.IsValid(this.GetAbilityPlus())) {
            return false
        }
        let hCaster = this.GetAbilityPlus().GetCasterPlus()
        // let modifier_combination_t32_midnight_pulse_twine = Load(hCaster, "modifier_combination_t32_midnight_pulse_twine")
        // return (GameFunc.IsValid(modifier_combination_t32_midnight_pulse_twine) && modifier_combination_t32_midnight_pulse_twine.GetStackCount() > 0)
        return true
    }
    GetAuraRadius() {
        return this.GetSpecialValueFor("radius")
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS
    }
    GetAura() {
        return "modifier_t32_midnight_pulse_aura"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t32_midnight_pulse_aura extends BaseModifier_Plus {
    radius: number;
    vPosition: Vector;
    IsHidden() {
        return true
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.radius = this.GetSpecialValueFor("radius")
        this.vPosition = this.GetCasterPlus().GetAbsOrigin()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/combination_t32_midnight_pulse_twine.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vPosition)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_LIMIT)
    GetMoveSpeed_Limit(params: ModifierTable) {
        if (IsServer() && this.vPosition != null) {
            let hParent = this.GetParentPlus()
            let vDirection = (this.vPosition - hParent.GetAbsOrigin()) as Vector
            vDirection.z = 0
            let fToPositionDistance = vDirection.Length2D()
            let vForward = hParent.GetForwardVector()
            let fCosValue = (vDirection.x * vForward.x + vDirection.y * vForward.y) / (vForward.Length2D() * fToPositionDistance)
            let fDistance = this.radius
            if (fToPositionDistance >= fDistance && fCosValue <= 0) {
                return RemapValClamped(fToPositionDistance, 0, fDistance, 550, 0.00001)
            }
        }
    }

}