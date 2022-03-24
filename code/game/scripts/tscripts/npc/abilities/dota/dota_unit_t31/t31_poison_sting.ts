import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { LogHelper } from "../../../../helper/LogHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";


@registerAbility()
export class t31_poison_sting extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t31_poison_sting"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t31_poison_sting extends BaseModifier_Plus {
    poison_damage: number;
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
    Init(params: ModifierTable) {
        this.poison_damage = this.GetSpecialValueFor("poison_damage")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (!GameFunc.IsValid(params.attacker)) { return }
        if (params.attacker == this.GetParentPlus()) {
            if (!params.attacker.PassivesDisabled() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                modifier_poison.Poison(params.target, params.attacker, this.GetAbilityPlus(), this.poison_damage)
            }
        }
    }
}