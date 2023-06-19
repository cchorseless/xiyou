import { AoiHelper } from "../../../helper/AoiHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

@registerAbility()
export class kingkong_2 extends BaseAbility_Plus {
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let flDistance = this.GetSpecialValueFor("distance")
        let flStartWidth = this.GetSpecialValueFor("start_width")
        let flEndWidth = this.GetSpecialValueFor("end_width")
        let physical2magical = this.GetSpecialValueFor("physical2magical")
        let flDamage = this.GetAbilityDamage()
        let flDuration = this.GetDuration()
        let vStart = hCaster.GetAbsOrigin()
        let vDirection = hCaster.GetForwardVector()

        let vEnd = vStart + vDirection * flDistance as Vector;
        let v = GFuncVector.Rotation2D(vDirection, math.rad(90))
        let tPolygon = [
            vStart + v * flStartWidth,
            vEnd + v * flEndWidth,
            vEnd - v * flEndWidth,
            vStart - v * flStartWidth,
        ] as Vector[];
        DebugDrawLine(tPolygon[0], tPolygon[1], 255, 255, 255, true, 1)
        DebugDrawLine(tPolygon[1], tPolygon[2], 255, 255, 255, true, 1)
        DebugDrawLine(tPolygon[2], tPolygon[3], 255, 255, 255, true, 1)
        DebugDrawLine(tPolygon[3], tPolygon[0], 255, 255, 255, true, 1)

        let iTeamNumber = hCaster.GetTeamNumber()
        let iTeamFilter = this.GetAbilityTargetTeam()
        let iTypeFilter = this.GetAbilityTargetType()
        let iFlagFilter = this.GetAbilityTargetFlags()
        let tTargets = AoiHelper.FindEntityInRadius(iTeamNumber, vStart, flDistance, null, iTeamFilter, iTypeFilter, iFlagFilter, FindOrder.FIND_ANY_ORDER)
        for (let hUnit of (tTargets)) {
            if (IsValid(hUnit) && GFuncVector.IsPointInPolygon(hUnit.GetAbsOrigin(), tPolygon)) {
                // let physical2magical = hCaster.GetPhysicalAttack() * physical2magical * 0.01
                let tDamageInfo = {
                    victim: hUnit,
                    attacker: hCaster,
                    damage: flDamage,
                    damage_type: this.GetAbilityDamageType(),
                    ability: this,
                }
                ApplyDamage(tDamageInfo)
                hUnit.ApplyStunned(this, hCaster, flDuration)
            }
        }
        let iParticleID = ParticleManager.CreateParticle("particles/units/boss/kingkong/roar.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, hCaster)
        ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", hCaster.GetAbsOrigin(), false)
        ParticleManager.SetParticleControl(iParticleID, 1, vEnd)
        hCaster.EmitSound("Hero_LoneDruid.SavageRoar.Cast")
    }
    GetIntrinsicModifierName() {
        return "modifier_kingkong_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_kingkong_2 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    BeCreated(params: IModifierTable) {
        if (IsServer()) {
            this.StartIntervalThink(1)
        }
    }
    OnIntervalThink() {
        if (this.GetAbilityPlus().IsAbilityReady()) {
            let radius = this.GetAbilityPlus().GetSpecialValueFor("distance")
            let tTargets = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), null, radius, this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), this.GetAbilityPlus().GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false)
            if (IsValid(tTargets[0])) {
                ExecuteOrderFromTable({
                    UnitIndex: this.GetParentPlus().entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: this.GetAbilityPlus().entindex(),
                })
            }
        }
    }
}