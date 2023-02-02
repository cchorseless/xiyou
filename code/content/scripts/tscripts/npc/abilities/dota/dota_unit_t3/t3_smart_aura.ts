import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t3_smart_aura extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t3_smart_aura"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t3_smart_aura extends BaseModifier_Plus {
    aura_radius: any;
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
    GetAuraRadius() {
        return this.aura_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MANA_ONLY
    }
    GetAura() {
        return "modifier_t3_smart_aura_effect"
    }
    Init(params: IModifierTable) {
        this.aura_radius = this.GetSpecialValueFor("aura_radius")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t3_smart_aura_effect extends BaseModifier_Plus {
    restore_chance: number;
    restore_amount: number;
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
        this.restore_chance = this.GetSpecialValueFor("restore_chance")
        this.restore_amount = this.GetSpecialValueFor("restore_amount")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: IModifierTable) {
        if (GameFunc.IsValid(this.GetAbilityPlus()) && GameFunc.IsValid(this.GetCasterPlus()) && !this.GetCasterPlus().PassivesDisabled()) {
            if (params.unit == this.GetParentPlus()) {
                let hAbility = params.ability
                if (hAbility != null && !hAbility.IsItem() && hAbility.ProcsMagicStick()) {
                    if (GameFunc.mathUtil.PRD(this.restore_chance, this.GetParentPlus(), "t3_smart_aura")) {
                        // 魔力崩坏侍从技开启时无法回蓝
                        // let hAbility_qualification_build_t21 = qualification_build_t21.findIn(this.GetParentPlus())
                        // if ((GameFunc.IsValid(hAbility_qualification_build_t21) && !hAbility_qualification_build_t21.GetToggleState()) || // 有技能且开启状态，则光环不给他回魔
                        //     !GameFunc.IsValid(hAbility_qualification_build_t21)
                        // ) { // 没有技能，就给他回魔
                        modifier_t3_smart_aura_particle.apply(this.GetParentPlus(), this.GetParentPlus(), hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

                        this.GetParentPlus().GiveMana(this.GetParentPlus().GetMaxMana() * this.restore_amount * 0.01)

                        // let qualification_build_t03 = qualification_build_t03.findIn(this.GetParentPlus())
                        // if (GameFunc.IsValid(qualification_build_t03)) {
                        //     qualification_build_t03.Trigger()
                        // }
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t3_smart_aura_particle extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/smart_aura_effect.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}