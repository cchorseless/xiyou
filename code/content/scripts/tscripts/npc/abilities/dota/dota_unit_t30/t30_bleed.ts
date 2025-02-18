import { BattleHelper } from "../../../../helper/BattleHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_bleeding } from "../../../modifier/effect/modifier_generic_bleeding";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t30_bleed extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t30_bleed"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t30_bleed extends BaseModifier_Plus {
    bleed_chance: number;
    bleed_damage_per_str: number;
    bleed_duration: number;
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
    IsAttack_bonusDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.bleed_chance = this.GetSpecialValueFor("bleed_chance")
        this.bleed_damage_per_str = this.GetSpecialValueFor("bleed_damage_per_str")
        this.bleed_duration = this.GetSpecialValueFor("bleed_duration")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (!params.attacker.PassivesDisabled() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                if (GFuncMath.PRD(this.bleed_chance, params.attacker, "t30_bleed")) {
                    let hCaster = params.attacker as IBaseNpc_Plus
                    let hTarget = params.target
                    modifier_generic_bleeding.Bleeding(hTarget, hCaster, this.GetAbilityPlus(), this.bleed_duration, (tDamageTable) => {
                        return hCaster.GetStrength() * this.bleed_damage_per_str
                    })
                }
            }
        }
    }
}