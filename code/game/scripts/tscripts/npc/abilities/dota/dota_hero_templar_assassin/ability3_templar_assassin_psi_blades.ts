import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";

/** dota原技能数据 */
export const Data_templar_assassin_psi_blades = { "ID": "5196", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_attack_range": "80 130 180 230", "LinkedSpecialBonus": "special_bonus_unique_templar_assassin_8" }, "02": { "var_type": "FIELD_FLOAT", "attack_spill_range": "2" }, "03": { "var_type": "FIELD_INTEGER", "attack_spill_width": "90" }, "04": { "var_type": "FIELD_INTEGER", "attack_spill_pct": "100" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_templar_assassin_psi_blades extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "templar_assassin_psi_blades";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_templar_assassin_psi_blades = Data_templar_assassin_psi_blades;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_range", [60, 120, 180, 240, 300]);
        this.SetDefaultSpecialValue("damage_range", [590, 630, 670, 710, 750]);
        this.SetDefaultSpecialValue("damage_width", 125);
        this.SetDefaultSpecialValue("damage_percent", [50, 60, 70, 80, 90]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_attack_range", [60, 120, 180, 240, 300]);
        this.SetDefaultSpecialValue("damage_range", [590, 630, 670, 710, 750]);
        this.SetDefaultSpecialValue("damage_width", 125);
        this.SetDefaultSpecialValue("damage_percent", [50, 60, 70, 80, 90]);

    }



    GetIntrinsicModifierName() {
        return "modifier_templar_assassin_3"
    }

}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_templar_assassin_3 extends BaseModifier_Plus {
    bonus_attack_range: number;
    damage_range: number;
    damage_width: number;
    damage_percent: number;
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
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        this.damage_range = this.GetSpecialValueFor("damage_range")
        this.damage_width = this.GetSpecialValueFor("damage_width")
        this.damage_percent = this.GetSpecialValueFor("damage_percent")
    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    GetAttackRangeBonus() {
        return this.bonus_attack_range
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    On_Attacked(params: ModifierTable) { // onattacked才能获取到税后伤害
        let hParent = this.GetParentPlus()
        let hAtkTarget = params.target

        if (!IsServer() || hAtkTarget == null || hAtkTarget.GetClassname() == "dota_item_drop" || BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_FAKEATTACK)) {
            return
        }

        let hAbility = this.GetAbilityPlus()
        let direct = GameFunc.VectorFunctions.HorizonVector((hAtkTarget.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector)
        let iPositionMove = this.damage_width * 0.5 * direct // 需要按方向移动100码，防止溅射到前面的怪
        let vEndPosition = direct * this.damage_range + iPositionMove + hAtkTarget.GetAbsOrigin()
        let tTargets = []
        // 天赋溅射一个圆
        if (hParent.HasTalent("special_bonus_unique_templar_assassin_custom_3")) {
            tTargets = FindUnitsInRadius(hParent.GetTeamNumber(), hAtkTarget.GetAbsOrigin(), null, hParent.GetTalentValue("special_bonus_unique_templar_assassin_custom_3"), hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), 0, false)
        } else {
            tTargets = FindUnitsInLine(hParent.GetTeamNumber(), hAtkTarget.GetAbsOrigin() + iPositionMove, vEndPosition, null, this.damage_width, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags())
        }
        let fDamage = params.damage * this.damage_percent * 0.01
        if (tTargets[0] != null) {
            let damage_table: BattleHelper.DamageOptions = {
                ability: this.GetAbilityPlus(),
                attacker: hParent,
                victim: null,
                damage: fDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
            }
            for (let hTarget of (tTargets)) {
                if (hTarget != hAtkTarget) {
                    EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_TemplarAssassin.PsiBlade", hAtkTarget), hAtkTarget)
                    let particleName = ResHelper.GetParticleReplacement("particles/units/heroes/hero_templar_assassin/templar_assassin_psi_blade.vpcf", hParent)
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: particleName,
                        resNpc: null,
                        iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                        owner: null
                    });

                    ParticleManager.SetParticleControlEnt(iParticleID, 0, hAtkTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hAtkTarget.GetAbsOrigin() + Vector(0, 0, 100), true)
                    ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", (hTarget.GetAbsOrigin() + Vector(0, 0, 100) as Vector), true)
                    damage_table.victim = hTarget
                    BattleHelper.GoApplyDamage(damage_table)
                }
            }
        }
    }
}
