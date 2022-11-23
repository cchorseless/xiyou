import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_tinker_laser = { "ID": "5150", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "HasScepterUpgrade": "1", "AbilitySound": "Hero_Tinker.Laser", "AbilityCastRange": "650", "AbilityCastPoint": "0.4", "AbilityCooldown": "20 18 16 14", "AbilityManaCost": "110 130 150 170", "AbilityModifierSupportValue": "0.3", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "miss_rate": "100 100 100 100" }, "02": { "var_type": "FIELD_FLOAT", "duration_hero": "3 3.5 4 4.5", "LinkedSpecialBonus": "special_bonus_unique_tinker_4" }, "03": { "var_type": "FIELD_FLOAT", "duration_creep": "6.0 6.0 6.0 6.0", "LinkedSpecialBonus": "special_bonus_unique_tinker_4" }, "04": { "var_type": "FIELD_INTEGER", "laser_damage": "80 160 240 320", "LinkedSpecialBonus": "special_bonus_unique_tinker" }, "05": { "var_type": "FIELD_INTEGER", "scepter_bounce_range": "400", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_tinker_laser extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tinker_laser";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tinker_laser = Data_tinker_laser;
    Init() {
        this.SetDefaultSpecialValue("laser_int_multiplier", [14, 15, 16, 17, 18, 19]);
        this.SetDefaultSpecialValue("laser_damage", [200, 500, 800, 1100, 1400, 1700]);
        this.SetDefaultSpecialValue("cast_range_tooltip", 900);
        this.SetDefaultSpecialValue("bounce_range", 600);
        this.SetDefaultSpecialValue("duration", 3);

    }

    Init_old() {
        this.SetDefaultSpecialValue("laser_int_multiplier", [14, 15, 16, 17, 18, 19]);
        this.SetDefaultSpecialValue("laser_damage", [200, 500, 800, 1100, 1400, 1700]);
        this.SetDefaultSpecialValue("cast_range_tooltip", 900);
        this.SetDefaultSpecialValue("scepter_bounce_range", 400);

    }



    CastFilterResultTarget(target: BaseNpc_Plus) {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            let teamFilter = this.GetAbilityTargetTeam()
            if (caster.HasScepter()) {
                teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH
            }
            if (caster.GetTeamNumber() == target.GetTeamNumber() && target.GetUnitLabel() != "HERO") {
                this.errorStr = "dota_hud_error_only_can_cast_on_hero_building"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            return UnitFilter(target, teamFilter, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, caster.GetTeamNumber())
        }
    }

    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        return this.GetSpecialValueFor("cast_range_tooltip") + hCaster.GetTalentValue("special_bonus_unique_tinker_custom_2")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Tinker.LaserAnim", hCaster))
        return true
    }
    OnAbilityPhaseInterrupted() {
        let hCaster = this.GetCasterPlus()
        hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_Tinker.LaserAnim", hCaster))
    }
    Laser(hTarget: BaseNpc_Plus, tUnits: BaseNpc_Plus[]) {
        let hCaster = this.GetCasterPlus()
        let laser_int_multiplier = this.GetSpecialValueFor("laser_int_multiplier")
        let laser_damage = this.GetSpecialValueFor("laser_damage")
        let bounce_range = this.GetSpecialValueFor("bounce_range")
        let duration = this.GetSpecialValueFor("duration")

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Tinker.LaserImpact", hCaster), hCaster)
        if (hCaster.GetTeamNumber() == hTarget.GetTeamNumber()) {
            modifier_tinker_1_buff.apply(hTarget, hCaster, this, { duration: duration })
        } else {
            let fDamage = laser_damage + hCaster.GetIntellect() * laser_int_multiplier
            // 天赋
            if (hCaster.HasTalent("special_bonus_unique_tinker_custom_6")) {
                let fDuration = hCaster.GetTalentValue("special_bonus_unique_tinker_custom_6", "duration")
                modifier_tinker_1_buff_amplify_damage.apply(hTarget, hCaster, this, { duration: fDuration })
            }
            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
        table.insert(tUnits, hTarget)
        let iTeamFilter = hCaster.HasScepter() && DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH || this.GetAbilityTargetTeam()
        let iTypeFilter = this.GetAbilityTargetType()
        let iFlagsFilter = this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
        let iOrder = FindOrder.FIND_CLOSEST
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), bounce_range, null, iTeamFilter, iTypeFilter, iFlagsFilter, iOrder)
        for (let hNewTarget of (tTargets)) {

            if (tUnits.indexOf(hNewTarget) == null && ((hNewTarget.GetTeamNumber() == hCaster.GetTeamNumber() && hNewTarget.GetUnitLabel() == "HERO") || hNewTarget.GetTeamNumber() != hCaster.GetTeamNumber())) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_tinker/tinker_laser.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 9, hNewTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hNewTarget.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(iParticleID)
                this.Laser(hNewTarget, tUnits)
                break
            }
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget() as BaseNpc_Plus
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Tinker.Laser", hCaster))

        modifier_tinker_1_particle.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        this.Laser(hTarget, [])
    }

    GetIntrinsicModifierName() {
        return "modifier_tinker_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tinker_1 extends BaseModifier_Plus {
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
                let teamFilter = caster.HasScepter() && DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH || ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                for (let hTarget of (targets)) {
                    if ((hTarget.GetTeamNumber() == caster.GetTeamNumber() && hTarget.GetUnitLabel() == "HERO") || hTarget.GetTeamNumber() != caster.GetTeamNumber()) {
                        target = hTarget
                        break
                    }
                }
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
export class modifier_tinker_1_buff extends BaseModifier_Plus {
    laser_damage: number;
    laser_int_multiplier: number;
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
        this.laser_damage = this.GetSpecialValueFor("laser_damage")
        this.laser_int_multiplier = this.GetSpecialValueFor("laser_int_multiplier")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_PURE_DAMAGE_CONSTANT)
    EOM_GetModifierOutgoingPureDamageConstant() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return (this.laser_damage + this.GetCasterPlus().GetIntellect() * this.laser_int_multiplier)
        }
        return 0
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP2)

    On_Tooltip2() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return (this.laser_damage + this.GetCasterPlus().GetIntellect() * this.laser_int_multiplier)
        }
        return 0
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tinker_1_buff_amplify_damage extends BaseModifier_Plus {
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    G_INCOMING_DAMAGE_PERCENTAGE() {
        return GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().GetTalentValue("special_bonus_unique_tinker_custom_6") || 0
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_tinker_1_particle extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetParentPlus()
        let hTarget = this.GetCasterPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_tinker/tinker_laser.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 9, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
