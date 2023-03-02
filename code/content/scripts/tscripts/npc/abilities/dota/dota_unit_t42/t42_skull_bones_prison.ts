import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t42_skull_bones_prison extends BaseAbility_Plus {
    GetIntrinsicModifierName() {
        return "modifier_skull_bones_prison_custom"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skull_bones_prison_custom extends BaseModifier_Plus {
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
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params.attacker == hParent && hAbility.IsCooldownReady()) {
            // 缠绕
            modifier_skull_bones_prison_custom_root.apply(params.target, hParent, hAbility, { duration: this.duration })
            hAbility.UseResources(true, true, true)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skull_bones_prison_custom_root extends BaseModifier_Plus {
    bonus_damage_per: number;
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
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            // 缠绕特效
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_dark_willow/dark_willow_bramble.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            })

            this.AddParticle(iParticleID, false, false, -1, false, false)

        }
    }
    Init(params: IModifierTable) {
        this.bonus_damage_per = this.GetSpecialValueFor("bonus_damage_per")
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamagePercentage(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (GFuncEntity.IsValid(hCaster) && hCaster.IsAlive() && params != null && params.target == hParent && (params.attacker == hCaster || params.attacker == hCaster.GetSource())) {
            return this.bonus_damage_per
        }
    }
}