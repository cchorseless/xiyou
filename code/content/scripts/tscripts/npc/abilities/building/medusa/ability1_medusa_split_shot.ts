import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_medusa_split_shot = { "ID": "5504", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityCastPoint": "0.4 0.4 0.4 0.4", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_modifier": "-50 -40 -30 -20" }, "02": { "var_type": "FIELD_INTEGER", "damage_modifier_tooltip": "50 60 70 80" }, "03": { "var_type": "FIELD_INTEGER", "arrow_count": "4", "LinkedSpecialBonus": "special_bonus_unique_medusa_2" }, "04": { "var_type": "FIELD_INTEGER", "split_shot_bonus_range": "150" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_medusa_split_shot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "medusa_split_shot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_medusa_split_shot = Data_medusa_split_shot;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_damage_per", [10, 20, 30, 40, 50, 60]);
        this.SetDefaultSpecialValue("arrow_count", [2, 3, 4, 5, 6, 8]);
        this.SetDefaultSpecialValue("split_shot_bonus_range", 100);

    }



    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        if (this.GetCasterPlus() != null) {
            return this.GetCasterPlus().Script_GetAttackRange() + this.GetCasterPlus().GetHullRadius() + this.GetSpecialValueFor("split_shot_bonus_range")
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_medusa_1"
    }
}
// ==========================================Modifiers==========================================
// // // // // // // // // // // // // // // // // // // -modifier_medusa_1// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_medusa_1 extends BaseModifier_Plus {
    bonus_attack_damage_per: number;
    arrow_count: number;
    split_shot_bonus_range: number;
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
        let hCaster = this.GetCasterPlus()
        this.bonus_attack_damage_per = this.GetSpecialValueFor("bonus_attack_damage_per")
        this.arrow_count = this.GetSpecialValueFor("arrow_count")
        this.split_shot_bonus_range = this.GetSpecialValueFor("split_shot_bonus_range")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_medusa/medusa_bow_split_shot.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_top", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_bottom", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_mid", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        return this.bonus_attack_damage_per
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "split_shot"
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    Get_AttackSound() {
        return ResHelper.GetSoundReplacement("Hero_Medusa.AttackSplit", this.GetParentPlus())
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    Attack(params: IModifierTable) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled() && !params.attacker.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            let sTalentName = "special_bonus_unique_medusa_custom_1"
            let arrow_count = params.attacker.HasTalent(sTalentName) && this.arrow_count + params.attacker.GetTalentValue(sTalentName) || this.arrow_count
            let count = 0
            let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.attacker.GetAbsOrigin(), params.attacker.Script_GetAttackRange() + params.attacker.GetHullRadius() + this.split_shot_bonus_range, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
            for (let target of (targets)) {
                if (target != params.target) {
                    let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
                    let sTalentName = "special_bonus_unique_medusa_custom_6"
                    iAttackState = params.attacker.HasTalent(sTalentName) && iAttackState - BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB - BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS || iAttackState
                    params.attacker.Attack(target, iAttackState)

                    count = count + 1
                    if (count >= arrow_count) {
                        break
                    }
                }
            }
        }
    }
}
