import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_feared } from "../../../modifier/effect/modifier_feared";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability1_nevermore_shadowraze1, modifier_nevermore_1_debuff } from "./ability1_nevermore_shadowraze1";
import { modifier_nevermore_2 } from "./ability2_nevermore_shadowraze2";

/** dota原技能数据 */
export const Data_nevermore_requiem = { "ID": "5064", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "2", "HasScepterUpgrade": "1", "AbilitySound": "Hero_Nevermore.RequiemOfSouls", "AbilityCastPoint": "1.67 1.67 1.67", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_6", "AbilityCooldown": "120 110 100", "AbilityDamage": "80 120 160", "AbilityManaCost": "150 175 200", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "soul_death_release": "0.5" }, "11": { "var_type": "FIELD_FLOAT", "requiem_heal_pct_scepter": "100", "RequiresScepter": "1" }, "12": { "var_type": "FIELD_FLOAT", "requiem_damage_pct_scepter": "40", "RequiresScepter": "1", "CalculateSpellDamageTooltip": "0" }, "01": { "var_type": "FIELD_INTEGER", "requiem_radius": "1000" }, "02": { "var_type": "FIELD_INTEGER", "requiem_reduction_ms": "-25" }, "03": { "var_type": "FIELD_FLOAT", "requiem_slow_duration": "0.8" }, "04": { "var_type": "FIELD_FLOAT", "requiem_slow_duration_max": "2.4" }, "05": { "var_type": "FIELD_INTEGER", "requiem_reduction_radius": "700 700 700" }, "06": { "var_type": "FIELD_INTEGER", "requiem_soul_conversion": "1" }, "07": { "var_type": "FIELD_INTEGER", "requiem_line_width_start": "125" }, "08": { "var_type": "FIELD_INTEGER", "requiem_line_width_end": "350" }, "09": { "var_type": "FIELD_INTEGER", "requiem_line_speed": "700 700 700" } } };

@registerAbility()
export class ability6_nevermore_requiem extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nevermore_requiem";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nevermore_requiem = Data_nevermore_requiem;
    Init() {
        this.SetDefaultSpecialValue("fear_duration", 1.5);
        this.SetDefaultSpecialValue("shadowraze_stack_increase", 20);
        this.SetDefaultSpecialValue("cast_time_tooltip", 1.67);
        this.SetDefaultSpecialValue("soul_release", 25);
        this.SetDefaultSpecialValue("requiem_radius", 1000);
        this.SetDefaultSpecialValue("requiem_reduction_ms", -25);
        this.SetDefaultSpecialValue("requiem_slow_duration", 5);
        this.SetDefaultSpecialValue("requiem_line_width_start", 125);
        this.SetDefaultSpecialValue("requiem_line_width_end", 425);
        this.SetDefaultSpecialValue("requiem_line_speed", [700, 700, 700]);
        this.SetDefaultSpecialValue("requiem_damage_pct_scepter", 40);

    }

    Init_old() {
        this.SetDefaultSpecialValue("requiem_line_speed", [700, 700, 700]);
        this.SetDefaultSpecialValue("requiem_damage_pct_scepter", 40);
        this.SetDefaultSpecialValue("fear_duration", 1.5);
        this.SetDefaultSpecialValue("shadowraze_stack_increase", 10);
        this.SetDefaultSpecialValue("cast_time_tooltip", 1.67);
        this.SetDefaultSpecialValue("soul_release", 25);
        this.SetDefaultSpecialValue("requiem_radius", 1000);
        this.SetDefaultSpecialValue("requiem_reduction_ms", -25);
        this.SetDefaultSpecialValue("requiem_slow_duration", 5);
        this.SetDefaultSpecialValue("requiem_line_width_start", 125);
        this.SetDefaultSpecialValue("requiem_line_width_end", 425);

    }

    ParticleModifier: IBaseModifier_Plus;
    iPreParticleID: any;


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("requiem_radius")
    }
    GetCastAnimation() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_nevermore_custom")) {
            return GameActivity_t.ACT_RESET
        }
        return super.GetCastAnimation()
    }
    GetCastPoint() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_nevermore_custom")) {
            return 0
        }
        return super.GetCastPoint()
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        if (!hCaster.HasTalent("special_bonus_unique_nevermore_custom")) {
            this.ParticleModifier = modifier_nevermore_6_particle_nevermore_wings.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }) as IBaseModifier_Plus
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Nevermore.RequiemOfSoulsCast", hCaster))
        }
        return true
    }
    OnAbilityPhaseInterrupted() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_nevermore_custom")) {
        } else {
            if (GFuncEntity.IsValid(this.ParticleModifier)) {
                this.ParticleModifier.Destroy()
            }
            hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_Nevermore.RequiemOfSoulsCast", hCaster))
        }
    }
    Requiem() {
        let hCaster = this.GetCasterPlus()
        let soul_release = this.GetSpecialValueFor("soul_release")
        let requiem_radius = this.GetSpecialValueFor("requiem_radius")
        let requiem_line_width_start = this.GetSpecialValueFor("requiem_line_width_start")
        let requiem_line_width_end = this.GetSpecialValueFor("requiem_line_width_end")
        let requiem_line_speed = this.GetSpecialValueFor("requiem_line_speed")
        let requiem_damage_pct_scepter = this.GetSpecialValueFor("requiem_damage_pct_scepter")
        let shadowraze_stack_increase = this.GetSpecialValueFor("shadowraze_stack_increase")

        let iSouls = modifier_nevermore_2.exist(hCaster) && modifier_nevermore_2.GetStackIn(hCaster, hCaster)
        let iReleaseSouls = math.max(math.floor(iSouls * soul_release * 0.01), iSouls > 0 && 1 || 0)

        if (!hCaster.HasScepter()) {
            hCaster.SetModifierStackCount("modifier_nevermore_2", hCaster, iSouls - iReleaseSouls)
        }
        modifier_nevermore_6_particle_nevermore_requiemofsouls.applyThinker(Vector(iReleaseSouls, 0, 0), hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Nevermore.RequiemOfSouls", hCaster))

        let nevermore_1 = ability1_nevermore_shadowraze1.findIn(hCaster)
        if (GFuncEntity.IsValid(nevermore_1) && nevermore_1.GetLevel() > 0) {
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), requiem_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {

                let hModifier = modifier_nevermore_1_debuff.findIn(hTarget) as modifier_nevermore_1_debuff;
                let iStack = 0
                if (!GFuncEntity.IsValid(hModifier)) {
                    hModifier = modifier_nevermore_1_debuff.apply(hTarget, hCaster, nevermore_1, { duration: nevermore_1.GetSpecialValueFor("duration") }) as modifier_nevermore_1_debuff
                } else {
                    iStack = hModifier.GetStackCount()
                }
                if (GFuncEntity.IsValid(hModifier)) {
                    iStack = math.max(iStack + 1, math.floor(iStack * (1 + shadowraze_stack_increase * 0.01)))
                    hModifier.SetStackCount(iStack)
                }
            }
        }

        let vDiretion = Vector(1, 0, 0)
        let vStartPosition = hCaster.GetAbsOrigin()
        for (let i = 0; i <= iReleaseSouls - 1; i++) {
            let vTempDiretion = GFuncVector.Rotation2D(vDiretion, math.rad((360 / iReleaseSouls) * i))
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_nevermore/nevermore_requiemofsouls_line.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, vStartPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, (vTempDiretion * requiem_line_speed) as Vector)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(0, requiem_radius / requiem_line_speed, 0))
            ParticleManager.ReleaseParticleIndex(iParticleID)

            let info = {
                Ability: this,
                Source: hCaster,
                vSpawnOrigin: vStartPosition,
                vVelocity: (vTempDiretion * requiem_line_speed) as Vector,
                fDistance: requiem_radius,
                fStartRadius: requiem_line_width_start,
                fEndRadius: requiem_line_width_end,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                ExtraData: {
                    damage: this.GetAbilityDamage()
                }
            }
            ProjectileManager.CreateLinearProjectile(info)
        }

        if (hCaster.HasScepter()) {
            this.addTimer(requiem_radius / requiem_line_speed, () => {
                let nevermore_1 = ability1_nevermore_shadowraze1.findIn(hCaster)
                if (GFuncEntity.IsValid(nevermore_1) && nevermore_1.GetLevel() > 0) {
                    let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), requiem_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
                    for (let hTarget of (tTargets)) {

                        let hModifier = modifier_nevermore_1_debuff.findIn(hTarget) as modifier_nevermore_1_debuff;
                        let iStack = 0
                        if (!GFuncEntity.IsValid(hModifier)) {
                            hModifier = modifier_nevermore_1_debuff.apply(hTarget, hCaster, nevermore_1, { duration: nevermore_1.GetSpecialValueFor("duration") }) as modifier_nevermore_1_debuff
                        } else {
                            iStack = hModifier.GetStackCount()
                        }
                        if (GFuncEntity.IsValid(hModifier)) {
                            iStack = math.max(iStack + 1, math.floor(iStack * (1 + shadowraze_stack_increase * 0.01)))
                            hModifier.SetStackCount(iStack)
                        }
                    }
                }

                let vDiretion = Vector(1, 0, 0)
                let vEndPosition = hCaster.GetAbsOrigin()
                for (let i = 0; i <= iReleaseSouls - 1; i++) {
                    let vTempDiretion = GFuncVector.Rotation2D(vDiretion, math.rad((360 / iReleaseSouls) * i))
                    let vStartPosition = (vEndPosition + vTempDiretion * requiem_radius) as Vector
                    vTempDiretion = (-vTempDiretion) as Vector
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_nevermore/nevermore_requiemofsouls_line.vpcf",
                        resNpc: hCaster,
                        iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                        owner: null
                    });

                    ParticleManager.SetParticleControl(iParticleID, 0, vStartPosition)
                    ParticleManager.SetParticleControl(iParticleID, 1, (vTempDiretion * requiem_line_speed) as Vector)
                    ParticleManager.SetParticleControl(iParticleID, 2, Vector(0, requiem_radius / requiem_line_speed, 0))
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                    let info = {
                        Ability: this,
                        Source: hCaster,
                        vSpawnOrigin: vStartPosition,
                        vVelocity: (vTempDiretion * requiem_line_speed) as Vector,
                        fDistance: requiem_radius,
                        fStartRadius: requiem_line_width_end,
                        fEndRadius: requiem_line_width_start,
                        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                        iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                        ExtraData: {
                            damage: this.GetAbilityDamage() * requiem_damage_pct_scepter * 0.01
                        }
                    }
                    ProjectileManager.CreateLinearProjectile(info)
                }
            })
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_nevermore_custom")) {
            let cast_time = this.GetSpecialValueFor("cast_time_tooltip")
            modifier_nevermore_6_particle_nevermore_wings.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            modifier_nevermore_6_particle_nevermore_spirit.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Nevermore.RequiemOfSoulsCast", hCaster))
            this.addTimer(cast_time, () => {
                this.Requiem()
            })
        } else {
            if (this.iPreParticleID != null) {
                ParticleManager.ReleaseParticleIndex(this.iPreParticleID)
                this.iPreParticleID = null
            }
            this.Requiem()
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            let hCaster = this.GetCasterPlus()
            let requiem_slow_duration = this.GetSpecialValueFor("requiem_slow_duration")
            let fear_duration = this.GetSpecialValueFor("fear_duration")
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Nevermore.RequiemOfSouls.Damage", hCaster), hCaster)

            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: ExtraData.damage || 0,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)

            modifier_nevermore_6_debuff.apply(hTarget, hCaster, this, { duration: requiem_slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })
            modifier_feared.apply(hTarget, hCaster, this, { duration: fear_duration * hTarget.GetStatusResistanceFactor(hCaster) })
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_nevermore_6"
    }

    OnStolen(hSourceAbility: this) {
        let hCaster = this.GetCasterPlus()
        let target = hSourceAbility.GetCasterPlus()
        let hSourceModifier = target.FindModifierByNameAndCaster("modifier_nevermore_6", target)
        let hModifier = hCaster.FindModifierByNameAndCaster("modifier_nevermore_6", hCaster)
        if (hSourceModifier) {
            if (!hModifier) {
                hModifier = modifier_nevermore_6.apply(hCaster, hCaster, this, null)
            }
            hModifier.SetStackCount(hSourceModifier.GetStackCount())
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_nevermore_6 extends BaseModifier_Plus {
    requiem_radius: number;
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
    Init(params: IModifierTable) {
        this.requiem_radius = this.GetSpecialValueFor("requiem_radius")
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

            let range = ability.GetSpecialValueFor("requiem_radius")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_nevermore_6_debuff extends BaseModifier_Plus {
    requiem_reduction_ms: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
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
    Init(params: IModifierTable) {
        this.requiem_reduction_ms = this.GetSpecialValueFor("requiem_reduction_ms")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.requiem_reduction_ms
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_nevermore_6_particle_nevermore_requiemofsouls extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_nevermore/nevermore_requiemofsouls.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, hParent.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_nevermore_6_particle_nevermore_wings extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_nevermore/nevermore_wings.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_nevermore_6_particle_nevermore_spirit extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let cast_time = this.GetSpecialValueFor("cast_time_tooltip")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_nevermore/nevermore_spirit.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            hAbility.addTimer(cast_time, () => {
                ParticleManager.DestroyParticle(iParticleID, false)
                ParticleManager.DestroyParticle(iParticleID, false)
            })
        }
    }
}
