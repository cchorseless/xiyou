import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_omniknight_degen_aura = { "ID": "5265", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_AURA", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityCastRange": "375", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "speed_bonus": "10 18 26 34", "LinkedSpecialBonus": "special_bonus_unique_omniknight_2" }, "02": { "var_type": "FIELD_INTEGER", "radius": "375" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_omniknight_degen_aura extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "omniknight_degen_aura";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_omniknight_degen_aura = Data_omniknight_degen_aura;
    Init() {
        this.SetDefaultSpecialValue("bonus_damage_percent", [0.5, 1.0, 1.5, 2.0, 2.5]);
        this.SetDefaultSpecialValue("status_resistance_percent", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("max_count", 5);
        this.SetDefaultSpecialValue("duration", 2);
        this.SetDefaultSpecialValue("radius", 900);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_damage_percent", [0.5, 1.0, 1.5, 2.0, 2.5]);
        this.SetDefaultSpecialValue("status_resistance_percent", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("max_count", 5);
        this.SetDefaultSpecialValue("duration", 2);
        this.SetDefaultSpecialValue("radius", 900);

    }



    GetIntrinsicModifierName() {
        return "modifier_omniknight_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_omniknight_3 extends BaseModifier_Plus {
    radius: any;
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
        return true
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAura() {
        return "modifier_omniknight_3_debuff"
    }
    GetAuraDuration() {
        return 2
    }
    Init(params: IModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_omniknight_3_debuff extends BaseModifier_Plus {
    duration: number;
    IsHidden() {
        return true
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
        let hCaster = this.GetCasterPlus()
        this.duration = this.GetSpecialValueFor("duration")
        if (IsClient() && params.IsOnCreated) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_omniknight/omniknight_degen_aura_debuff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, false)
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    OnTakeDamage(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hCaster) || !hCaster.IsAlive() || hCaster != params.attacker || hParent != params.unit) {
            return
        }
        modifier_omniknight_3_reduce_status.apply(params.unit, hCaster, hAbility, { duration: this.duration })
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_omniknight_3_reduce_status extends BaseModifier_Plus {
    status_resistance_percent: number;
    bonus_damage_percent: number;
    private _tooltip: number;
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let max_count = this.GetSpecialValueFor("max_count") + hCaster.GetTalentValue("special_bonus_unique_omniknight_custom_8")
        this.status_resistance_percent = this.GetSpecialValueFor("status_resistance_percent") + hCaster.GetTalentValue("special_bonus_unique_omniknight_custom_3")
        this.bonus_damage_percent = this.GetSpecialValueFor("bonus_damage_percent")
        if (IsServer()) {
            if (this.GetStackCount() < max_count) {
                this.IncrementStackCount()
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    G_STATUS_RESISTANCE_STACKING() {
        return -this.status_resistance_percent * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_INCOMING_DAMAGE_PERCENTAGE() {
        return this.bonus_damage_percent * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        this._tooltip = (this._tooltip || 0) % 2 + 1
        if (this._tooltip == 1) {
            return this.status_resistance_percent * this.GetStackCount()
        } else if (this._tooltip == 2) {
            return this.bonus_damage_percent * this.GetStackCount()
        }
    }
}
