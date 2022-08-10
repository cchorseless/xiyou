import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_medusa_stone_gaze = { "ID": "5507", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Medusa.StoneGaze.Cast", "AbilityCastPoint": "0.4", "AbilityCastRange": "1200", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "90", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "1200" }, "02": { "var_type": "FIELD_FLOAT", "duration": "5 5.5 6", "LinkedSpecialBonus": "special_bonus_unique_medusa" }, "03": { "var_type": "FIELD_INTEGER", "slow": "35" }, "04": { "var_type": "FIELD_FLOAT", "stone_duration": "3.0" }, "05": { "var_type": "FIELD_FLOAT", "face_duration": "2.0" }, "06": { "var_type": "FIELD_FLOAT", "vision_cone": "0.08715" }, "07": { "var_type": "FIELD_INTEGER", "bonus_physical_damage": "40 45 50" }, "08": { "var_type": "FIELD_INTEGER", "speed_boost": "50" } } };

@registerAbility()
export class ability6_medusa_stone_gaze extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "medusa_stone_gaze";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_medusa_stone_gaze = Data_medusa_stone_gaze;
    Init() {
        this.SetDefaultSpecialValue("chance", 18);
        this.SetDefaultSpecialValue("duration", 2.4);
        this.SetDefaultSpecialValue("bonus_physical_damage", [15, 20, 25, 30, 35]);
        this.SetDefaultSpecialValue("bonus_attack_damage_per", 3);

    }


    GetIntrinsicModifierName() {
        return "modifier_medusa_3"
    }
}
// ==========================================Modifiers==========================================
// // // // // // // // // // // // // // // // // // // -modifier_medusa_3// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_medusa_3 extends BaseModifier_Plus {
    chance: number;
    duration: number;
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
        this.chance = this.GetSpecialValueFor("chance")
        this.duration = this.GetSpecialValueFor("duration")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingDamagePercentage(params: ModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let chance = this.chance + hCaster.GetTalentValue("special_bonus_unique_medusa_custom_2")
            let duration = this.duration + hCaster.GetTalentValue("special_bonus_unique_medusa_custom_4")
            if (params != null && params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                if (GameFunc.mathUtil.PRD(chance, params.attacker, "medusa_4")) {
                    modifier_medusa_3_debuff.apply(params.target, params.attacker, this.GetAbilityPlus(), { duration: duration * params.target.GetStatusResistanceFactor(params.attacker) })
                    // if (!Spawner.IsEndless()) {
                    //      modifier_medusa_3_stack.apply( params.attacker , params.attacker, this.GetAbilityPlus(), null) 
                    // }
                    //  EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), "Hero_Medusa.StoneGaze.Stun", params.attacker)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_medusa_3_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_medusa_3_debuff extends BaseModifier_Plus {
    bonus_physical_damage: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        this.bonus_physical_damage = this.GetSpecialValueFor("bonus_physical_damage") + hCaster.GetTalentValue("special_bonus_unique_medusa_custom_8")
        if (params.IsOnCreated && IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_medusa/medusa_stone_gaze_debuff_stoned.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, this.GetCasterPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_medusa_stone_gaze.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_stunned.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.bonus_physical_damage
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    g_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE() {
        return this.bonus_physical_damage
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_medusa_3_stack// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_medusa_3_stack extends BaseModifier_Plus {
    bonus_attack_damage_per: number;
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
        this.bonus_attack_damage_per = this.GetSpecialValueFor("bonus_attack_damage_per")
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        return this.GetStackCount() * this.bonus_attack_damage_per
    }



}
