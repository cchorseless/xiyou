import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability2_night_stalker_crippling_fear } from "./ability2_night_stalker_crippling_fear";

/** dota原技能数据 */
export const Data_night_stalker_darkness = { "ID": "5278", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_Nightstalker.Darkness", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "140 130 120", "AbilityManaCost": "125 175 225", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "30.0" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "50 100 150" } } };

@registerAbility()
export class ability6_night_stalker_darkness extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "night_stalker_darkness";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_night_stalker_darkness = Data_night_stalker_darkness;
    Init() {
        this.SetDefaultSpecialValue("duration", 12);
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("attack_rate", 1.3);
        this.SetDefaultSpecialValue("bonus_damage", [200, 500, 800, 1100, 1500, 2000]);
        this.SetDefaultSpecialValue("bonus_damage_pct", [40, 60, 80, 100, 120, 150]);
        this.SetDefaultSpecialValue("bonus_cast_time", 90);
        this.SetDefaultSpecialValue("interval_scepter", 1.4);
        this.SetDefaultSpecialValue("radius_scepter", 1200);

    }

    Init_old() {
        this.SetDefaultSpecialValue("duration", 12);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("attack_rate", 1.3);
        this.SetDefaultSpecialValue("bonus_damage", [50, 200, 400, 700, 1100, 1700]);
        this.SetDefaultSpecialValue("bonus_damage_pct", [20, 30, 40, 50, 60, 70]);
        this.SetDefaultSpecialValue("bonus_cast_time", 90);
        this.SetDefaultSpecialValue("interval_scepter", 1.4);
        this.SetDefaultSpecialValue("radius_scepter", 900);

    }



    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_night_stalker_custom_3")
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("radius_scepter")
        }
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let iLevel = this.GetLevel()
        let duration = this.GetSpecialValueFor("duration")

        modifier_night_stalker_6_buff.remove(hCaster);
        modifier_night_stalker_6_buff.apply(hCaster, hCaster, this, { duration: duration })

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Nightstalker.Darkness", hCaster))

        let hAbility = ability2_night_stalker_crippling_fear.findIn(hCaster) as ability2_night_stalker_crippling_fear;;
        if (GameFunc.IsValid(hAbility) && hAbility.CheckNightTime != null) {
            hAbility.CheckNightTime()
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_night_stalker_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_night_stalker_6 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
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
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            if (modifier_night_stalker_6_buff.exist(caster)) {
                return
            }

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
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
export class modifier_night_stalker_6_buff extends BaseModifier_Plus {
    radius: number;
    bHasScepter: boolean;
    interval_scepter: number;
    bonus_damage: number;
    bonus_damage_pct: number;
    attack_rate: number;
    bonus_cast_time: number;
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
    IsAura() {
        return true
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAura() {
        return "modifier_night_stalker_6_night"
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.bHasScepter = hCaster.HasScepter()
        this.radius = this.bHasScepter && this.GetSpecialValueFor("radius_scepter") || this.GetSpecialValueFor("radius")
        this.interval_scepter = this.GetSpecialValueFor("interval_scepter")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        this.bonus_damage_pct = this.GetSpecialValueFor("bonus_damage_pct")
        this.attack_rate = this.GetSpecialValueFor("attack_rate") + hCaster.GetTalentValue("special_bonus_unique_night_stalker_custom_4")
        this.bonus_cast_time = this.GetSpecialValueFor("bonus_cast_time")
        if (IsServer()) {
            if (this.bHasScepter) {
                this.OnIntervalThink()
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)

            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_dark_buff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)

            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_darkness_hero_effect.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, true, false)

            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_crippling_fear_aura.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.radius, this.radius, this.radius))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetParentPlus()
            if (!GameFunc.IsValid(hCaster)) {
                return
            }
            let hAbility = ability2_night_stalker_crippling_fear.findIn(hCaster) as ability2_night_stalker_crippling_fear;
            if (GameFunc.IsValid(hAbility) && hAbility.CheckNightTime != null) {
                hAbility.CheckNightTime()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()

            if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }

            let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                BattleHelper.Attack(hCaster, hTarget, iAttackState)
            }

            this.StartIntervalThink(this.interval_scepter)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "hunter_night"
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    Get_VisualZDelta() {
        return math.min(this.GetElapsedTime(), 0.5) * 256
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.bonus_damage
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        return this.bonus_damage_pct
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: IModifierTable) {
        return this.attack_rate
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    GetPercentageCasttime(params: IModifierTable) {
        return this.bonus_cast_time
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_night_stalker_6_night extends BaseModifier_Plus {
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
}
