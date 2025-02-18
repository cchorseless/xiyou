import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t40_ghost_hand extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t40_ghost_hand"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t40_ghost_hand extends BaseModifier_Plus {
    damage_mana: number;
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
        this.damage_mana = this.GetSpecialValueFor("damage_mana")
        this.duration = this.GetSpecialValueFor("duration")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        let hCaster = params.attacker
        let hTarget = params.target
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (hCaster == this.GetParentPlus() && !hCaster.PassivesDisabled() && UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, hCaster.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_manaburn.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: params.target
            })

            ParticleManager.ReleaseParticleIndex(iParticleID)
            hTarget.ReduceMana(math.min(this.damage_mana, hTarget.GetMana()))
            modifier_t40_ghost_hand_debuff.apply(params.target, hCaster, this.GetAbilityPlus(), { duration: this.duration })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t40_ghost_hand_debuff extends BaseModifier_Plus {
    reduce_move_speed_pct: number;
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
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.reduce_move_speed_pct = this.GetSpecialValueFor("reduce_move_speed_pct")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.reduce_move_speed_pct
    }
}