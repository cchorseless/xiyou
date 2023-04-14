import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_monkey_king_boundless_strike = { "ID": "5716", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "FightRecapLevel": "1", "AbilityCastAnimation": "ACT_DOTA_MK_STRIKE", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.4", "AbilityCastRange": "1100", "AbilityCooldown": "23 22 21 20", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "stun_duration": "1 1.2 1.4 1.6", "LinkedSpecialBonus": "special_bonus_unique_monkey_king_9" }, "02": { "var_type": "FIELD_INTEGER", "strike_crit_mult": "150 175 200 225", "LinkedSpecialBonus": "special_bonus_unique_monkey_king" }, "03": { "var_type": "FIELD_INTEGER", "strike_radius": "150" }, "04": { "var_type": "FIELD_INTEGER", "strike_cast_range": "1100" } } };

@registerAbility()
export class ability1_monkey_king_boundless_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "monkey_king_boundless_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_monkey_king_boundless_strike = Data_monkey_king_boundless_strike;
    Init() {
        this.SetDefaultSpecialValue("stun_duration", 1.25);
        this.SetDefaultSpecialValue("strike_crit_mult", [100, 200, 300, 400, 500, 600]);
        this.SetDefaultSpecialValue("strike_radius", 150);
        this.SetDefaultSpecialValue("strike_cast_range", 1200);
        this.SetDefaultSpecialValue("damage_bonus_health", [0.5, 0.6, 0.7, 0.85, 1, 1.25]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("stun_duration", 1.25);
        this.SetDefaultSpecialValue("strike_crit_mult", [100, 200, 300, 400, 500, 600]);
        this.SetDefaultSpecialValue("strike_radius", 150);
        this.SetDefaultSpecialValue("strike_cast_range", 1200);

    }


    OnAbilityPhaseStart() {
        let caster = this.GetCasterPlus()
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_MonkeyKing.Strike.Cast", caster))
        modifier_monkey_king_1_particle_monkey_king_strike_cast.apply(caster, caster, this, { duration: this.GetCastPoint() })
        return true
    }
    OnAbilityPhaseInterrupted() {
        let caster = this.GetCasterPlus()
        caster.StopSound(ResHelper.GetSoundReplacement("Hero_MonkeyKing.Strike.Cast", caster))
        modifier_monkey_king_1_particle_monkey_king_strike_cast.remove(caster);
        return true
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        modifier_monkey_king_1_particle_monkey_king_strike_cast.remove(caster);
        let stun_duration = this.GetSpecialValueFor("stun_duration") + caster.GetTalentValue("special_bonus_unique_monkey_king_custom")
        let strike_radius = this.GetSpecialValueFor("strike_radius")
        let strike_cast_range = this.GetSpecialValueFor("strike_cast_range")

        let vStartPosition = caster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        let vDirection = (vTargetPosition - vStartPosition) as Vector
        vDirection.z = 0
        vStartPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * (strike_radius / 2) as Vector), caster)
        vTargetPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * (strike_cast_range - strike_radius / 2) as Vector), caster)

        let targets = FindUnitsInLine(caster.GetTeamNumber(), vStartPosition, vTargetPosition, null, strike_radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags())
        modifier_monkey_king_1_buff.apply(caster, caster, this, null)
        for (let target of (targets as IBaseNpc_Plus[])) {
            BattleHelper.Attack(caster, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)
            modifier_monkey_king_1_stun.apply(target, caster, this, { duration: stun_duration * target.GetStatusResistanceFactor(caster) })
        }
        modifier_monkey_king_1_buff.remove(caster);
        //  特效buff
        modifier_monkey_king_1_particle_monkey_king_strike.applyThinker(vTargetPosition, caster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, caster.GetTeamNumber(), false)
        EmitSoundOnLocationWithCaster(vStartPosition, ResHelper.GetSoundReplacement("Hero_MonkeyKing.Strike.Impact", caster), caster)
        EmitSoundOnLocationWithCaster(vTargetPosition, ResHelper.GetSoundReplacement("Hero_MonkeyKing.Strike.Impact.EndPos", caster), caster)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_monkey_king_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_monkey_king_1 extends BaseModifier_Plus {
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


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
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

            let range = ability.GetSpecialValueFor("strike_cast_range")
            let start_width = ability.GetSpecialValueFor("strike_radius")
            let end_width = ability.GetSpecialValueFor("strike_radius")

            let position = AoiHelper.GetLinearMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)
            if (position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_1_buff extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE)
    ignore_armor: number;
    damage_bonus: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    strike_crit_mult: number;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
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
    Initial(params: IModifierTable) {
        this.ignore_armor = this.GetSpecialValueFor("ignore_armor")
        this.damage_bonus = this.GetParentPlus().GetMaxHealth() * (this.GetSpecialValueFor("damage_bonus_health"))
        this.strike_crit_mult = this.GetSpecialValueFor("strike_crit_mult") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_monkey_king_custom_4")
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.damage_bonus
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_1_stun extends BaseModifier_Plus {
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
        return true
    }
    IsStunDebuff() {
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_stunned.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_strike_slow_impact.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_1_particle_monkey_king_strike extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_strike.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(particleID, 0, hCaster.GetAbsOrigin())
            let vDirection = (hParent.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector
            vDirection.z = 0
            ParticleManager.SetParticleControlForward(particleID, 0, vDirection.Normalized())
            ParticleManager.SetParticleControl(particleID, 1, hParent.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_1_particle_monkey_king_strike_cast extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_strike_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(particleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon_bot", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 2, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon_top", hCaster.GetAbsOrigin(), true)
            if (string.find(hCaster.GetUnitName(), "monkey_king") != null) {
                ParticleManager.SetParticleControl(particleID, 3, Vector(0, 0, 0))
            } else {
                ParticleManager.SetParticleControl(particleID, 3, Vector(1, 0, 0))
            }
        }
    }
}
