import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_juggernaut_blade_dance = { "ID": "5027", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "blade_dance_crit_chance": "20 25 30 35" }, "02": { "var_type": "FIELD_INTEGER", "blade_dance_crit_mult": "180" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_juggernaut_blade_dance extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "juggernaut_blade_dance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_juggernaut_blade_dance = Data_juggernaut_blade_dance;
    Init() {
        this.SetDefaultSpecialValue("blade_dance_crit_chance", [20, 30, 40, 50, 60]);
        this.SetDefaultSpecialValue("blade_dance_crit_mult", [260, 290, 320, 350, 380]);

    }


    // GetIntrinsicModifierName() {
    //     return "modifier_juggernaut_3"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_juggernaut_3 extends BaseModifier_Plus {
    blade_dance_crit_chance: number;
    blade_dance_crit_mult: number;
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
    Init(params: IModifierTable) {
        this.blade_dance_crit_chance = this.GetSpecialValueFor("blade_dance_crit_chance")
        this.blade_dance_crit_mult = this.GetSpecialValueFor("blade_dance_crit_mult")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (!GFuncEntity.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_CRIT)) {
            modifier_juggernaut_3_crit_tgt_particle.apply(params.attacker, params.target, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Juggernaut.BladeDance", params.attacker), params.attacker)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    CC_GetModifierCriticalStrike(params: IModifierTable) {
        if (params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            let extra_blade_dance_crit_chance = params.attacker.HasTalent("special_bonus_unique_juggernaut_custom_4") && params.attacker.GetTalentValue("special_bonus_unique_juggernaut_custom_4") || 0
            let blade_dance_crit_chance = this.blade_dance_crit_chance + extra_blade_dance_crit_chance
            if (GFuncMath.PRD(params.attacker, blade_dance_crit_chance, "juggernaut_4")) {
                return this.blade_dance_crit_mult
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_juggernaut_3_crit_tgt_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_crit_tgt.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
