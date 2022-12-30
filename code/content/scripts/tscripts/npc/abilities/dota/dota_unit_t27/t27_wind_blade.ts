import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t27_wind_blade extends BaseAbility_Plus {

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        if (this.GetCasterPlus() != null) {
            return this.GetCasterPlus().Script_GetAttackRange() + this.GetCasterPlus().GetHullRadius()
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_t27_wind_blade"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t27_wind_blade extends BaseModifier_Plus {
    arrow_count: number;
    bonus_attack_speed: number;
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
        this.arrow_count = this.GetSpecialValueFor("arrow_count")
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")

    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        return this.bonus_attack_speed
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PROJECTILE_NAME)

    GetProjectileName(params: ModifierTable) {
        return "particles/units/heroes/hero_brewmaster/brewmaster_storm_attack.vpcf"
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            //  风刃
            if (!params.attacker.PassivesDisabled() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
                let max_count = this.arrow_count

                //  let combination_t27_multi_attack  = combination_t27_multi_attack.findIn(  params.attacker )
                //  let has_combination_t27_multi_attack = GameFunc.IsValid(combination_t27_multi_attack) && combination_t27_multi_attack.IsActivated()
                //  let chance = combination_t27_multi_attack.GetSpecialValueFor("chance")
                //  if ( has_combination_t27_multi_attack ) {
                //  	max_count = max_count + combination_t27_multi_attack.GetSpecialValueFor("extra_attack_number")
                //  }
                let count = 0
                let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.attacker.GetAbsOrigin(), params.attacker.Script_GetAttackRange() + params.attacker.GetHullRadius(), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
                for (let target of (targets)) {
                    if (target != params.target) {
                        count = count + 1
                        BattleHelper.Attack(params.attacker, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)

                        if (count >= max_count) {
                            break
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            if (!params.attacker.PassivesDisabled()) {
                let hTarget = params.target
                let hCaster = params.attacker
                // let combination_t27_cyclone  = combination_t27_cyclone.findIn(  hCaster )
                // let has_combination_t27_cyclone = GameFunc.IsValid(combination_t27_cyclone) && combination_t27_cyclone.IsActivated()
                // if (has_combination_t27_cyclone) {
                //     combination_t27_cyclone.Cyclone(params.original_damage, hTarget)
                // }
            }
        }
    }
}