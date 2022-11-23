import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { LogHelper } from "../../../../helper/LogHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { modifier_t19_brutal_link_buff } from "../dota_unit_t19/t19_brutal_link";


@registerAbility()
export class t21_magical_link extends BaseAbility_Plus {
    hLastTarget: CDOTA_BaseNPC;

    CastFilterResultTarget(hTarget: BaseNpc_Plus) {
        if (hTarget == this.GetCasterPlus()) {
            this.errorStr = "dota_hud_error_cant_cast_on_self"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        if (hTarget.GetPlayerOwnerID() != this.GetCasterPlus().GetPlayerOwnerID()) {
            this.errorStr = "dota_hud_error_cant_cast_on_ally"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, this.GetCasterPlus().GetTeamNumber())
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()

        modifier_t21_magical_link_buff.remove(hTarget);
        modifier_t19_brutal_link_buff.remove(hTarget);

        modifier_t21_magical_link_buff.apply(hTarget, hCaster, this, null)

        let t21_magical_link_break = hCaster.AddAbility(this.GetAssociatedSecondaryAbilities()) as t21_magical_link_break
        if (GameFunc.IsValid(t21_magical_link_break)) {
            t21_magical_link_break.SetLevel(this.GetLevel())
            hCaster.SwapAbilities(this.GetName(), t21_magical_link_break.GetName(), false, true)
            t21_magical_link_break.hAbility = this
        }

        this.hLastTarget = hTarget
    }
    LinkBreak() {
        let hCaster = this.GetCasterPlus()

        let t21_magical_link_break = hCaster.FindAbilityByName(this.GetAssociatedSecondaryAbilities())
        if (GameFunc.IsValid(t21_magical_link_break)) {
            hCaster.SwapAbilities(t21_magical_link_break.GetName(), this.GetName(), false, true)
            hCaster.RemoveAbility(t21_magical_link_break.GetName())
        }

        if (GameFunc.IsValid(this.hLastTarget)) {
            modifier_t21_magical_link_buff.remove(this.hLastTarget);
            modifier_t19_brutal_link_buff.remove(this.hLastTarget);
        }
    }
    ProcsMagicStick() {
        return false
    }
    GetAssociatedSecondaryAbilities() {
        return "t21_magical_link_break"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerAbility()
export class t21_magical_link_break extends BaseAbility_Plus {
    hAbility: t21_magical_link;
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        if (GameFunc.IsValid(this.hAbility)) {
            this.hAbility.LinkBreak()
        }
    }
    ProcsMagicStick() {
        return false
    }

    GetAssociatedPrimaryAbilities() {
        return "t21_magical_link"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t21_magical_link_buff extends BaseModifier_Plus {
    transform_damage_percent: number;
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    bonus_intellect: number;
    _tooltip: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            this.StartIntervalThink(1)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t21_magical_link.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.transform_damage_percent = this.GetSpecialValueFor("transform_damage_percent")
        this.bonus_intellect = this.GetSpecialValueFor("bonus_intellect")
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus() as t21_magical_link
            if (GameFunc.IsValid(hAbility) && hAbility.LinkBreak) {
                hAbility.LinkBreak()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            if (!GameFunc.IsValid(this.GetAbilityPlus()) || !GameFunc.IsValid(this.GetCasterPlus())) {
                this.Destroy()
                return
            }
            this.ForceRefresh()
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        this._tooltip = (this._tooltip || 0) % 2 + 1
        if (this._tooltip == 1) {
            return this.bonus_intellect
        } else if (this._tooltip == 2) {
            return this.transform_damage_percent
        }
    }
}