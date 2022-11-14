
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_sven_6_buff } from "./ability6_sven_gods_strength";

/** dota原技能数据 */
export const Data_sven_great_cleave = { "ID": "5095", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "cleave_starting_width": "150" }, "02": { "var_type": "FIELD_INTEGER", "cleave_ending_width": "360" }, "03": { "var_type": "FIELD_INTEGER", "cleave_distance": "700" }, "04": { "var_type": "FIELD_INTEGER", "great_cleave_damage": "30 50 70 90", "LinkedSpecialBonus": "special_bonus_unique_sven_8" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_sven_great_cleave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sven_great_cleave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sven_great_cleave = Data_sven_great_cleave;
    Init() {
        this.SetDefaultSpecialValue("cleave_starting_width", 250);
        this.SetDefaultSpecialValue("cleave_ending_width", 500);
        this.SetDefaultSpecialValue("cleave_distance", 1000);
        this.SetDefaultSpecialValue("great_cleave_damage", [55, 70, 85, 100, 115, 130]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("cleave_starting_width", 250);
        this.SetDefaultSpecialValue("cleave_ending_width", 500);
        this.SetDefaultSpecialValue("cleave_distance", 1000);
        this.SetDefaultSpecialValue("great_cleave_damage", [55, 70, 85, 100, 115, 130]);

    }


    GetIntrinsicModifierName() {
        return "modifier_sven_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sven_2 extends BaseModifier_Plus {
    cleave_starting_width: number;
    cleave_ending_width: number;
    cleave_distance: number;
    great_cleave_damage: number;
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
        this.cleave_starting_width = this.GetSpecialValueFor("cleave_starting_width")
        this.cleave_ending_width = this.GetSpecialValueFor("cleave_ending_width")
        this.cleave_distance = this.GetSpecialValueFor("cleave_distance")
        this.great_cleave_damage = this.GetSpecialValueFor("great_cleave_damage")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierTable) {
        if (params.target == null) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }

        if (params.attacker == this.GetParentPlus()) {
            if (!params.attacker.PassivesDisabled() && !params.attacker.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                let sParticlePath = '';
                if (modifier_sven_6_buff.exist(params.attacker)) {
                    sParticlePath = "particles/units/heroes/hero_sven/sven_spell_great_cleave_gods_strength.vpcf"
                    if (params.attacker.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_CRIT)) {
                        sParticlePath = "particles/units/heroes/hero_sven/sven_spell_great_cleave_gods_strength_crit.vpcf"
                    }
                } else {
                    sParticlePath = "particles/units/heroes/hero_sven/sven_spell_great_cleave.vpcf"
                    if (params.attacker.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_CRIT)) {
                        sParticlePath = "particles/units/heroes/hero_sven/sven_spell_great_cleave_crit.vpcf"
                    }
                }

                sParticlePath = ResHelper.GetParticleReplacement(sParticlePath, params.attacker)
                let iParticleID = ResHelper.CreateParticle({
                    resPath: sParticlePath,
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: params.attacker
                });

                let n = 0
                AoiHelper.DoCleaveAction(params.attacker, params.target, this.cleave_starting_width, this.cleave_ending_width, this.cleave_distance, (hTarget) => {
                    let tDamageTable = {
                        ability: this.GetAbilityPlus(),
                        victim: hTarget,
                        attacker: params.attacker,
                        damage: params.original_damage * (this.great_cleave_damage + params.attacker.GetTalentValue("special_bonus_unique_sven_custom_2")) * 0.01,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY,
                        eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_CLEAVE + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                    n = n + 1
                    ParticleManager.SetParticleControlEnt(iParticleID, n + 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                })
                ParticleManager.SetParticleControl(iParticleID, 1, Vector(2, 17, n))
                ParticleManager.ReleaseParticleIndex(iParticleID)

                params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_Sven.GreatCleave", params.attacker))
            }
        }
    }
}
