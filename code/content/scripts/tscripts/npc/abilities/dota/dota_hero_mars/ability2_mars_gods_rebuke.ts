import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_knockback } from "../../../modifier/modifier_knockback";
import { modifier_mars_1_hit_obstacle_stun, modifier_mars_1_move } from "./ability1_mars_spear";

/** dota原技能数据 */
export const Data_mars_gods_rebuke = { "ID": "6495", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "FightRecapLevel": "1", "AbilitySound": "Hero_Mars.Shield.Cast", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCastRange": "500", "AbilityCastPoint": "0.2", "AbilityCooldown": "16 14 12 10", "AbilityManaCost": "80", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "scepter_cooldown": "3.5", "RequiresScepter": "1" }, "01": { "var_type": "FIELD_INTEGER", "crit_mult": "150 190 230 270", "LinkedSpecialBonus": "special_bonus_unique_mars_gods_rebuke_extra_crit" }, "02": { "var_type": "FIELD_INTEGER", "angle": "140" }, "03": { "var_type": "FIELD_INTEGER", "radius": "500" }, "04": { "var_type": "FIELD_FLOAT", "knockback_duration": "0.3" }, "05": { "var_type": "FIELD_FLOAT", "knockback_distance": "150" }, "06": { "var_type": "FIELD_INTEGER", "knockback_slow": "40" }, "07": { "var_type": "FIELD_FLOAT", "knockback_slow_duration": "2" }, "08": { "var_type": "FIELD_FLOAT", "activity_duration": "2" }, "09": { "var_type": "FIELD_INTEGER", "bonus_damage_vs_heroes": "20 25 30 35" } } };

@registerAbility()
export class ability2_mars_gods_rebuke extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "mars_gods_rebuke";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_mars_gods_rebuke = Data_mars_gods_rebuke;
    Init() {
        this.SetDefaultSpecialValue("crit_damage_per", [120, 150, 180, 220, 260, 300]);
        this.SetDefaultSpecialValue("angle", 140);
        this.SetDefaultSpecialValue("radius", 650);
        this.SetDefaultSpecialValue("knockback_duration", 0.3);
        this.SetDefaultSpecialValue("knockback_distance", 200);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")
        let angle = this.GetSpecialValueFor("angle") / 2
        let duration = this.GetSpecialValueFor("knockback_duration")
        let distance = this.GetSpecialValueFor("knockback_distance")
        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        let vCaster = hCaster.GetAbsOrigin()
        let vCasterDir = ((vPosition - vCaster) as Vector).Normalized()
        let fCasterAngle = VectorAngles(vCasterDir).y
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_mars/mars_shield_bash.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
        ParticleManager.SetParticleControlForward(iParticleID, 0, hCaster.GetForwardVector())
        ParticleManager.ReleaseParticleIndex(iParticleID)
        EmitSoundOnLocationWithCaster(vCaster, ResHelper.GetSoundReplacement("Hero_Mars.Shield.Cast", hCaster), hCaster)
        let hModifier = modifier_mars_2_buff.apply(hCaster, hCaster, this, null)
        for (let hTarget of (tTarget as IBaseNpc_Plus[])) {
            if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                let vTargetDir = ((hTarget.GetAbsOrigin() - vCaster) as Vector).Normalized()
                let vTargetAngle = VectorAngles(vTargetDir).y
                let fAngleDiff = math.abs(AngleDiff(fCasterAngle, vTargetAngle))
                if (fAngleDiff <= angle) {
                    let vCenter = hCaster.GetAbsOrigin()
                    let modifierKnockback = {
                        center_x: vCenter.x,
                        center_y: vCenter.y,
                        center_z: vCenter.z,
                        should_stun: false,
                        duration: duration,
                        knockback_duration: duration,
                        knockback_distance: distance,
                        knockback_height: 25
                    }
                    BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN)
                    if (!modifier_mars_1_move.exist(hTarget) && !modifier_mars_1_hit_obstacle_stun.exist(hTarget)) {
                        modifier_knockback.apply(hTarget, hCaster, this, modifierKnockback)
                    }
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_mars/mars_shield_bash_crit.vpcf",
                        resNpc: hCaster,
                        iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                        owner: hCaster
                    });

                    ParticleManager.SetParticleControl(iParticleID, 0, hTarget.GetAbsOrigin())
                    ParticleManager.SetParticleControl(iParticleID, 1, hTarget.GetAbsOrigin())
                    ParticleManager.SetParticleControlForward(iParticleID, 1, vCasterDir)
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                    EmitSoundOn(ResHelper.GetSoundReplacement("Hero_Mars.Shield.Crit", hCaster), hTarget)
                }
            }
        }
        hModifier.Destroy()
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_mars_2"
    // }

}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mars_2 extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            //  施法命令
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_2_buff extends BaseModifier_Plus {
    crit_damage_per: number;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.crit_damage_per = this.GetSpecialValueFor("crit_damage_per") + hCaster.GetTalentValue("special_bonus_unique_mars_custom_4")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.CRITICALSTRIKE)
    EOM_GetModifierCriticalStrike(params: ModifierTable) {
        if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            return this.crit_damage_per
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        }
    }
}
