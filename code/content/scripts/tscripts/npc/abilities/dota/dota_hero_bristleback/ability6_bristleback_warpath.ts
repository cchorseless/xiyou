
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bristleback_warpath = { "ID": "5551", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityDuration": "10.0 10.0 10.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_per_stack": "25 30 35", "LinkedSpecialBonus": "special_bonus_unique_bristleback_3" }, "02": { "var_type": "FIELD_INTEGER", "move_speed_per_stack": "3 4 5" }, "03": { "var_type": "FIELD_FLOAT", "stack_duration": "14.0" }, "04": { "var_type": "FIELD_INTEGER", "max_stacks": "5 7 9" } } };

@registerAbility()
export class ability6_bristleback_warpath extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bristleback_warpath";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bristleback_warpath = Data_bristleback_warpath;
    Init() {
        this.SetDefaultSpecialValue("bonus_max_stacks", [1, 1, 2, 3, 5, 8]);
        this.SetDefaultSpecialValue("inherit_pct", 30);
    }



    CastFilterResult() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            // let hAbility2 = _ability2_bristleback_quill_spray().findIn(hCaster)
            // if (!GFuncEntity.IsValid(hAbility2) || hAbility2.GetLevel() < 1) {
            //     this.errorStr = "dota_hud_error_upgrade_bristleback_2"
            //     return UnitFilterResult.UF_FAIL_CUSTOM
            // }
            return UnitFilterResult.UF_SUCCESS
        }
    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        // let hAbility2 = _ability2_bristleback_quill_spray().findIn(hCaster)
        // // 释放一次特殊的被刺，对敌方单位造成针刺扫射伤害，对范围内友方单位继承一定比例的战意效果// 在战意技能里监听三技能的释放
        // if (GFuncEntity.IsValid(hAbility2) && hAbility2.GetLevel() >= 1 && hAbility2.OnCastAbility2 != null) {
        //     hAbility2.OnCastAbility2()
        // }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_bristleback_6"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bristleback_6 extends BaseModifier_Plus {
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
            if (ability == null || ability.IsNull()) {
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
            // let hAbility2 = _ability2_bristleback_quill_spray().findIn(caster)
            // if (!GFuncEntity.IsValid(hAbility2) || hAbility2.GetLevel() < 1) {
            //     return
            // }

            let range = caster.Script_GetAttackRange()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
