import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t42_skull_fatal_blow extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_skull_fatal_blow_custom"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skull_fatal_blow_custom extends BaseModifier_Plus {
    crit_chance: number;
    crit_multiplier: number;
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
        this.crit_chance = this.GetSpecialValueFor("crit_chance")
        this.crit_multiplier = this.GetSpecialValueFor("crit_multiplier")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    EOM_GetModifierCriticalStrike(params: IModifierTable) {
        if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            if (GameFunc.mathUtil.PRD(this.crit_chance, params.target, "skull_fatal_blow")) {
                return this.crit_multiplier
            }
        }
        return 0
    }
}