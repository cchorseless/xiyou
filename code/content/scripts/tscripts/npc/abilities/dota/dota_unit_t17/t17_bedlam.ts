import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t17_bedlam extends BaseAbility_Plus {

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        // let modifier_combination_t17_enhanced_bedlam = Load(hCaster, "modifier_combination_t17_enhanced_bedlam")
        // let extra_radius = (GameFunc.IsValid(modifier_combination_t17_enhanced_bedlam) && modifier_combination_t17_enhanced_bedlam.GetStackCount() > 0) && modifier_combination_t17_enhanced_bedlam.extra_radius || 0
        // return this.GetSpecialValueFor("radius") + extra_radius
        return 0
    }
    GetIntrinsicModifierName() {
        return "modifier_t17_bedlam"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t17_bedlam extends BaseModifier_Plus {
    radius: number;
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
    IsAura() {
        return !this.GetCasterPlus().IsIllusion() && !this.GetCasterPlus().PassivesDisabled()
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAuraRadius() {
        let hParent = this.GetParentPlus()
        // let modifier_combination_t17_enhanced_bedlam = Load(hParent, "modifier_combination_t17_enhanced_bedlam")
        // let extra_radius = (GameFunc.IsValid(modifier_combination_t17_enhanced_bedlam) && modifier_combination_t17_enhanced_bedlam.GetStackCount() > 0) && modifier_combination_t17_enhanced_bedlam.extra_radius || 0
        // return this.radius + extra_radius
        return 0
    }
    GetAura() {
        return "modifier_t17_bedlam_slow"
    }
    Init(params: ModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t17_bedlam_slow extends BaseModifier_Plus {
    slow_movespeed: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_invoker/invoker_ghost_walk_debuff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.slow_movespeed = this.GetSpecialValueFor("slow_movespeed")
    }
    // @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    // GetMoveSpeedBonus_Percentage() {
    //     let hCaster = this.GetCasterPlus()
    //     let modifier_combination_t17_enhanced_bedlam = Load(hCaster, "modifier_combination_t17_enhanced_bedlam")
    //     let extra_slow_movespeed = (GameFunc.IsValid(modifier_combination_t17_enhanced_bedlam) && modifier_combination_t17_enhanced_bedlam.GetStackCount() > 0) && modifier_combination_t17_enhanced_bedlam.extra_slow_movespeed || 0
    //     return this.slow_movespeed + extra_slow_movespeed
    // }
    // @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    // GetTurnRate_Percentage() {
    //     let hCaster = this.GetCasterPlus()
    //     let modifier_combination_t17_enhanced_bedlam = Load(hCaster, "modifier_combination_t17_enhanced_bedlam")
    //     let turn_back_rate = (GameFunc.IsValid(modifier_combination_t17_enhanced_bedlam) && modifier_combination_t17_enhanced_bedlam.GetStackCount() > 0) && modifier_combination_t17_enhanced_bedlam.turn_back_rate || 0
    //     return turn_back_rate
    // }
}