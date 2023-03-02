import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_truesight } from "../../../modifier/modifier_truesight";

/** dota原技能数据 */
export const Data_crystal_maiden_frostbite = { "ID": "5127", "AbilityType": "DOTA_ABILITY_TYPE_BASIC", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "hero_Crystal.frostbite", "AbilityCastRange": "550", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "9 8 7 6", "AbilityManaCost": "140 145 150 155", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_per_second": "100" }, "02": { "var_type": "FIELD_INTEGER", "creep_damage_per_second": "100" }, "03": { "var_type": "FIELD_FLOAT", "duration": "1.5 2.0 2.5 3.0", "LinkedSpecialBonus": "special_bonus_unique_crystal_maiden_1" }, "04": { "var_type": "FIELD_FLOAT", "creep_duration": "10.0", "LinkedSpecialBonus": "special_bonus_unique_crystal_maiden_1" }, "05": { "var_type": "FIELD_FLOAT", "tick_interval": "0.25" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_crystal_maiden_frostbite extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "crystal_maiden_frostbite";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_crystal_maiden_frostbite = Data_crystal_maiden_frostbite;
    Init() {
        this.SetDefaultSpecialValue("total_damage", [212, 414, 818, 1414, 2200, 3000]);
        this.SetDefaultSpecialValue("damage_per_intellect", 8);
        this.SetDefaultSpecialValue("duration", [5, 5, 6, 6, 7, 7]);
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("damage_increase", 25);

    }

    GetBehavior() {
        // if (IsServer()) {
        //     return this.GetCasterPlus().IsChanneling() &&
        //         DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET +
        //         DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST +
        //         DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE +
        //         DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL ||
        //         DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET +
        //         DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST
        // }
        // return tonumber(tostring(super.GetBehavior()))
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
    }
    Frostbite(target: IBaseNpc_Plus, bonusDamagePercentage: number = 0) {
        bonusDamagePercentage = bonusDamagePercentage || 0
        let hCaster = this.GetCasterPlus()

        let total_damage = this.GetSpecialValueFor("total_damage")
        let damage_per_intellect = this.GetSpecialValueFor("damage_per_intellect") + hCaster.GetTalentValue("special_bonus_unique_crystal_maiden_custom_7")
        let duration = this.GetSpecialValueFor("duration")
        LogHelper.print(duration, 111)
        modifier_crystal_maiden_2_debuff.apply(target, hCaster, this, { duration: duration })
        let damage_table = {
            ability: this,
            victim: target,
            attacker: hCaster,
            damage: (total_damage + damage_per_intellect * hCaster.GetIntellect()) * (1 + bonusDamagePercentage * 0.01),
            damage_type: this.GetAbilityDamageType()
        }
        BattleHelper.GoApplyDamage(damage_table)
        target.EmitSound(ResHelper.GetSoundReplacement("hero_Crystal.frostbite", hCaster))
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetCastRange(hCaster.GetAbsOrigin(), hCaster)
        // let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
        // for (let target of (targets)) {
        // this.Frostbite(target)
        // }
        this.Frostbite(this.GetCursorTarget())
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_crystal_maiden_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_crystal_maiden_2 extends BaseModifier_Plus {
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

            let range = this.GetAbilityPlus().GetCastRange(hCaster.GetAbsOrigin(), hCaster)
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_crystal_maiden_2_debuff extends BaseModifier_Plus {
    damage_increase: number;
    sSoundName: string;
    modifier_truesight: CDOTA_Buff;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.damage_increase = hCaster.HasShard() && this.GetSpecialValueFor("damage_increase") || 0
        if (IsServer()) {
            LogHelper.print(params)
            this.sSoundName = ResHelper.GetSoundReplacement("hero_Crystal.frostbite", hParent)
            this.modifier_truesight = modifier_truesight.apply(this.GetParentPlus(), hParent, this.GetAbilityPlus(), { duration: params.duration })
            modifier_crystal_maiden_2_particle.apply(hParent, hCaster, this.GetAbilityPlus(), { duration: params.duration })
        }
    }

    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().StopSound(this.sSoundName)
            if (GFuncEntity.IsValid(this.modifier_truesight as IBaseModifier_Plus)) {
                this.modifier_truesight.Destroy()
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SPELL_DAMAGE_PERCENTAGE)
    CC_INCOMING_SPELL_DAMAGE_PERCENTAGE() {
        return this.damage_increase
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)

    CC_tooltip() {
        return this.damage_increase
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_crystal_maiden_2_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_crystalmaiden/maiden_frostbite.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: hCaster
            });
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), false)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            let iParticleID2 = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_frost.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: hParent
            });
            this.AddParticle(iParticleID2, false, true, 10, false, false)
            let iParticleID3 = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });
            this.AddParticle(iParticleID3, false, true, 10, false, false)
        }
    }


}
