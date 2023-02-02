import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t41_fighting_spirit extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t41_fighting_spirit"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t41_fighting_spirit extends BaseModifier_Plus {
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
    Init(params: IModifierTable) {
        this.duration = this.GetSpecialValueFor("duration")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            modifier_t41_fighting_spirit_buff.apply(this.GetParentPlus(), this.GetParentPlus(), this.GetAbilityPlus(), { duration: this.duration })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t41_fighting_spirit_buff extends BaseModifier_Plus {
    increase_attack_speed: number;
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
    Init(params: IModifierTable) {
        this.increase_attack_speed = this.GetSpecialValueFor("increase_attack_speed")
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.GetStackCount() * this.increase_attack_speed
    }
}