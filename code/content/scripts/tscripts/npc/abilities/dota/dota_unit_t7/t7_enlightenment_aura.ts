import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t7_enlightenment_aura extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t7_enlightenment_aura_hidden"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t7_enlightenment_aura extends BaseModifier_Plus {
    level: any;
    modifier: IBaseModifier_Plus;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(1)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            if (!GameFunc.IsValid(this.modifier) || this.level == null || this.level != this.GetAbilityPlus().GetLevel()) {
                this.level = this.GetAbilityPlus().GetLevel()
                this.modifier = modifier_t7_enlightenment_aura_hidden.apply((this.GetParentPlus(), this.GetParentPlus(), this.GetAbilityPlus(), null)) as IBaseModifier_Plus
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            if (GameFunc.IsValid(this.modifier)) {
                this.modifier.Destroy()
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t7_enlightenment_aura_hidden extends BaseModifier_Plus {
    aura_radius: number;
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
        return this.GetStackCount() == 0 && !this.GetCasterPlus().IsIllusion() && !this.GetCasterPlus().PassivesDisabled()
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
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAura() {
        return "modifier_t7_enlightenment_aura_effect"
    }
    GetAuraEntityReject(hTarget: IBaseNpc_Plus) {
        return this.GetParentPlus() == hTarget
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.aura_radius = this.GetSpecialValueFor("aura_radius")
        if (IsServer()) {
            this.SetStackCount(0)
            this.StartIntervalThink(0)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            if (GameFunc.IsValid(this.GetAbilityPlus()) && this.GetAbilityPlus().IsActivated()) {
                this.SetStackCount(0)
            } else {
                this.SetStackCount(1)
            }
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        this.aura_radius = this.GetSpecialValueFor("aura_radius")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t7_enlightenment_aura_effect extends BaseModifier_Plus {
    aura_intellect_pct: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/combination_t07_enlightenment_aura_buff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            })

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.aura_intellect_pct = this.GetSpecialValueFor("aura_intellect_pct")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.EOM_GetModifierBonusStats_Intellect()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    EOM_GetModifierBonusStats_Intellect() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            let iInt = this.GetCasterPlus().GetIntellect()
            let iNew = math.floor(iInt * this.aura_intellect_pct * 0.01)
            return iNew
        }
    }
}