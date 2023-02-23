

import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ActiveRootAbility } from "../../ActiveRootAbility";

/** dota原技能数据 */
export const Data_ursa_enrage = { "ID": "5360", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Ursa.Enrage", "HasScepterUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_4", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "0", "AbilityCooldown": "70 50 30", "AbilityManaCost": "0 0 0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_reduction": "80" }, "02": { "var_type": "FIELD_INTEGER", "status_resistance": "50", "LinkedSpecialBonus": "special_bonus_unique_ursa_8" }, "03": { "var_type": "FIELD_FLOAT", "duration": "4 4.5 5", "LinkedSpecialBonus": "special_bonus_unique_ursa_3" }, "04": { "var_type": "FIELD_FLOAT", "cooldown_scepter": "30 24 18", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_ursa_enrage extends ActiveRootAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ursa_enrage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ursa_enrage = Data_ursa_enrage;
    Init() {
        this.SetDefaultSpecialValue("enrage_multiplier", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("attack_rate", [1.2, 1.15, 1.1, 1.05, 1.0, 0.95]);
        this.SetDefaultSpecialValue("duration", 5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("enrage_multiplier", [2, 3, 4, 5, 6, 8]);
        this.SetDefaultSpecialValue("attack_rate", [1.2, 1.15, 1.1, 1.05, 1.0, 0.95]);
        this.SetDefaultSpecialValue("duration", 5);

    }



    GetBehavior() {
        let hCaster = this.GetCasterPlus()
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        if (hCaster.HasTalent("special_bonus_unique_ursa_custom_4")) {
            iBehavior = iBehavior + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE
        }
        return iBehavior
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_ursa_custom_7"
        let iDuration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue(sTalentName)
        hCaster.Purge(false, true, false, true, true)
        modifier_ursa_6_buff.apply(hCaster, hCaster, this, { duration: iDuration })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Ursa.Enrage", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_ursa_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ursa_6 extends BaseModifier_Plus {
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

            if (modifier_ursa_6_buff.exist(caster)) {
                return
            }

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
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
export class modifier_ursa_6_buff extends BaseModifier_Plus {
    enrage_multiplier: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    status_resistance: number;
    attack_rate: number;
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
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ursa/ursa_enrage_buff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hParent.GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ursa/ursa_enrage_buff_2.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hParent.GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ursa/ursa_enrage_hero_effect.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(particleID, false, false, 100, true, false)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_ursa_custom_4"
        this.enrage_multiplier = this.GetSpecialValueFor("enrage_multiplier") + hCaster.GetTalentValue("special_bonus_unique_ursa_custom_6")
        this.status_resistance = hCaster.GetTalentValue(sTalentName)
        this.attack_rate = this.GetSpecialValueFor("attack_rate")

    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CB_tooltip(params: IModifierTable) {
        return this.enrage_multiplier
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CB_tooltip2(params: IModifierTable) {
        return this.status_resistance
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: IModifierTable) {
        return this.attack_rate
    }


}
