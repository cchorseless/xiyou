
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_phantom_assassin_phantom_strike = { "ID": "5191", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_CUSTOM", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_CUSTOM", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_PhantomAssassin.Strike.Start", "AbilityCastRange": "1000 1000 1000 1000", "AbilityCastPoint": "0.25", "AbilityCooldown": "11 9 7 5", "AbilityManaCost": "35 40 45 50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_attack_speed": "75 100 125 150" }, "02": { "var_type": "FIELD_FLOAT", "duration": "2" }, "03": { "var_type": "FIELD_INTEGER", "abilitycastrange": "", "LinkedSpecialBonus": "special_bonus_unique_phantom_assassin_6" }, "04": { "var_type": "FIELD_INTEGER", "AbilityCharges": "", "LinkedSpecialBonus": "special_bonus_unique_phantom_assassin_9" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_phantom_assassin_phantom_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_assassin_phantom_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_assassin_phantom_strike = Data_phantom_assassin_phantom_strike;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_speed", 230);
        this.SetDefaultSpecialValue("duration", [2.0, 2.5, 3.0, 3.5, 4.0, 4.5]);
        this.SetDefaultSpecialValue("ignore_armor", [15, 20, 25, 30, 35, 45]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_attack_speed", 230);
        this.SetDefaultSpecialValue("duration", [2.0, 2.5, 3.0, 3.5, 4.0, 4.5]);
        this.SetDefaultSpecialValue("ignore_armor", [15, 20, 25, 30, 35, 45]);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_phantom_assassin_custom_4")
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        let vCasterPosition = hCaster.GetAbsOrigin()
        modifier_phantom_assassin_2_particle_phantom_assassin_phantom_strike_start.applyThinker(hCaster.GetForwardVector(), hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)
        EmitSoundOnLocationWithCaster(vCasterPosition, ResHelper.GetSoundReplacement("Hero_PhantomAssassin.Strike.Start", hCaster), hCaster)
        EmitSoundOnLocationWithCaster(vCasterPosition, ResHelper.GetSoundReplacement("Hero_PhantomAssassin.Strike.End", hCaster), hCaster)
        modifier_phantom_assassin_2_buff.apply(hCaster, hCaster, this, { duration: duration })
    }

    GetIntrinsicModifierName() {
        return "modifier_phantom_assassin_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_phantom_assassin_2 extends BaseModifier_Plus {
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

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_phantom_assassin_2_buff extends BaseModifier_Plus {
    bonus_attack_speed: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE)
    ignore_armor: number;
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
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_phantom_assassin_custom_8"
        this.ignore_armor = this.GetSpecialValueFor("ignore_armor") + hCaster.GetTalentValue(sTalentName)
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        return this.bonus_attack_speed
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_phantom_assassin_2_particle_phantom_assassin_phantom_strike_start extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_phantom_assassin/phantom_assassin_phantom_strike_start.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControlForward(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_phantom_assassin/phantom_assassin_phantom_strike_end.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }

}
