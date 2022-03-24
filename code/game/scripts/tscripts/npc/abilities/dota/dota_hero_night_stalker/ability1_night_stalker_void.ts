import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_night_stalker_2, modifier_night_stalker_2_form } from "./ability2_night_stalker_crippling_fear";

/** dota原技能数据 */
export const Data_night_stalker_void = { "ID": "5275", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilitySound": "Hero_Nightstalker.Void", "HasScepterUpgrade": "1", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilityCastRange": "525", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "11 10 9 8", "AbilityManaCost": "80 90 100 110", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "80 160 240 320", "LinkedSpecialBonus": "special_bonus_unique_night_stalker_4" }, "02": { "var_type": "FIELD_FLOAT", "duration_day": "1.25" }, "03": { "var_type": "FIELD_FLOAT", "duration_night": "2.5 3 3.5 4" }, "04": { "var_type": "FIELD_INTEGER", "movespeed_slow": "-50" }, "05": { "var_type": "FIELD_INTEGER", "attackspeed_slow": "-50" }, "06": { "var_type": "FIELD_INTEGER", "radius_scepter": "900", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_FLOAT", "scepter_ministun": "0.5", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_night_stalker_void extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "night_stalker_void";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_night_stalker_void = Data_night_stalker_void;
    Init() {
        this.SetDefaultSpecialValue("night_damage_pct", 50);
        this.SetDefaultSpecialValue("aoe_day", 500);
        this.SetDefaultSpecialValue("radius_night", 900);
        this.SetDefaultSpecialValue("duration_day", 1.25);
        this.SetDefaultSpecialValue("duration_night", [2.5, 2.75, 3, 3.25, 3.5, 4]);
        this.SetDefaultSpecialValue("movespeed_slow", -50);
        this.SetDefaultSpecialValue("damage", [600, 900, 1400, 2000, 2700, 3500]);
        this.SetDefaultSpecialValue("damage_per_str", [2, 2.5, 3, 3.5, 4, 5]);
        this.SetDefaultSpecialValue("stun_duration_day", 0);
        this.SetDefaultSpecialValue("stun_duration_night", 2);

    }

    Init_old() {
        this.SetDefaultSpecialValue("aoe_day", 300);
        this.SetDefaultSpecialValue("radius_night", 900);
        this.SetDefaultSpecialValue("duration_day", 1.25);
        this.SetDefaultSpecialValue("duration_night", [2.5, 2.75, 3, 3.25, 3.5, 4]);
        this.SetDefaultSpecialValue("movespeed_slow", -50);
        this.SetDefaultSpecialValue("damage", [600, 900, 1400, 2000, 2700, 3500]);
        this.SetDefaultSpecialValue("damage_per_str", [2, 2.5, 3, 3.5, 4, 5]);
        this.SetDefaultSpecialValue("stun_duration_day", 0);
        this.SetDefaultSpecialValue("stun_duration_night", 0.5);

    }



    GetBehavior() {
        let hCaster = this.GetCasterPlus()
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        if (modifier_night_stalker_2_form.exist(hCaster)) {
            iBehavior = iBehavior - DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT - DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET
        }
        return iBehavior
    }
    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        if (modifier_night_stalker_2_form.exist(hCaster)) {
            return 0
        }
        return this.GetSpecialValueFor("aoe_day") + hCaster.GetTalentValue("special_bonus_unique_night_stalker_custom_1")
    }
    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (modifier_night_stalker_2_form.exist(hCaster)) {
            return this.GetSpecialValueFor("radius_night") + hCaster.GetTalentValue("special_bonus_unique_night_stalker_custom_1")
        }
        return super.GetCastRange(vLocation, hTarget)
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        modifier_night_stalker_1_particle_cast.apply(hCaster, hCaster, this, null)
        return true
    }
    OnAbilityPhaseInterrupted() {
        let hCaster = this.GetCasterPlus()
        modifier_night_stalker_1_particle_cast.remove(hCaster);
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        modifier_night_stalker_1_particle_cast.remove(hCaster);

        if (modifier_night_stalker_2_form.exist(hCaster)) {
            let fCastRange = this.GetCastRange(hCaster.GetAbsOrigin(), hCaster)
            let iTeamFilter = this.GetAbilityTargetTeam()
            let iTypeFilter = this.GetAbilityTargetType()
            let iFlagFilter = this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let iOrder = FindOrder.FIND_CLOSEST
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), fCastRange, null, iTeamFilter, iTypeFilter, iFlagFilter, iOrder)
            for (let hUnit of (tTargets)) {
                this.go_Void(hUnit)
            }
        } else {
            let vPosition = this.GetCursorPosition()
            let fRadius = this.GetAOERadius()
            let iTeamFilter = this.GetAbilityTargetTeam()
            let iTypeFilter = this.GetAbilityTargetType()
            let iFlagFilter = this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let iOrder = FindOrder.FIND_CLOSEST
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, fRadius, null, iTeamFilter, iTypeFilter, iFlagFilter, iOrder)
            for (let hUnit of (tTargets)) {
                this.go_Void(hUnit)
            }
        }
    }
    go_Void(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let bIsNighttime = modifier_night_stalker_2_form.exist(hCaster)

        let duration_day = this.GetSpecialValueFor("duration_day")
        let duration_night = this.GetSpecialValueFor("duration_night")
        let duration = bIsNighttime && duration_night || duration_day
        let damage = this.GetSpecialValueFor("damage")
        let damage_per_str = this.GetSpecialValueFor("damage_per_str") + hCaster.GetTalentValue("special_bonus_unique_night_stalker_custom_4")
        let stun_duration_day = this.GetSpecialValueFor("stun_duration_day")
        let stun_duration_night = this.GetSpecialValueFor("stun_duration_night")
        let stun_duration = bIsNighttime && stun_duration_night || stun_duration_day
        let night_damage_pct = this.GetSpecialValueFor("night_damage_pct")
        let hModifier = modifier_night_stalker_2.findIn(hCaster)
        if (GameFunc.IsValid(hModifier) && hModifier.GetVoidDamage != null) {
            damage = damage + hModifier.GetVoidDamage()
        }

        modifier_night_stalker_1_particle_hit.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        modifier_night_stalker_1_debuff.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
        if (stun_duration > 0) {
            modifier_stunned.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })
        }

        let iStr = 0
        if (hCaster.GetStrength != null) {
            iStr = hCaster.GetStrength()
        }
        if (hCaster.HasTalent("special_bonus_unique_night_stalker_custom_6")) {
            if (hCaster.GetAgility != null) {
                iStr = iStr + hCaster.GetAgility()
            }
            if (hCaster.GetIntellect != null) {
                iStr = iStr + hCaster.GetIntellect()
            }
        }
        let fDamage = (damage + iStr * damage_per_str) * (1 + night_damage_pct * 0.01)
        let tDamageTable = {
            ability: this,
            victim: hTarget,
            attacker: hCaster,
            damage: fDamage,
            damage_type: this.GetAbilityDamageType(),
        }
        BattleHelper.GoApplyDamage(tDamageTable)

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Nightstalker.Void", hCaster), hCaster)
    }

    GetIntrinsicModifierName() {
        return "modifier_night_stalker_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_night_stalker_1 extends BaseModifier_Plus {
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

            if (modifier_night_stalker_2_form.exist(caster)) {
                let range = ability.GetCastRange(caster.GetAbsOrigin(), caster)

                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)

                //  施法命令
                if (targets[0] != null) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex(),
                    })
                }
            } else {
                let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
                let radius = ability.GetAOERadius()

                let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(),
                    range,
                    caster.GetTeamNumber(),
                    radius,
                    null,
                    ability.GetAbilityTargetTeam(),
                    ability.GetAbilityTargetType(),
                    ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
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
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_night_stalker_1_debuff extends BaseModifier_Plus {
    movespeed_slow: number;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.movespeed_slow = this.GetSpecialValueFor("movespeed_slow")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_void.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        return this.movespeed_slow
    }
}
//  Particle
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_night_stalker_1_particle_hit extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_void_hit.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_night_stalker_1_particle_cast extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_void_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hCaster.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
