import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_luna_lunar_blessing = { "ID": "5224", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "1200" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "5 15 25 35" }, "03": { "var_type": "FIELD_INTEGER", "bonus_night_vision": "250 500 750 1000" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_luna_lunar_blessing extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "luna_lunar_blessing";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_luna_lunar_blessing = Data_luna_lunar_blessing;
    Init() {
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("bonus_attribute", [120, 180, 230, 300, 360]);
        this.SetDefaultSpecialValue("primary_attribute_damage", [0.2, 0.3, 0.4, 0.5, 0.6]);

    }

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_luna_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_luna_3 extends BaseModifier_Plus {
    modifier: modifier_luna_3_hidden;
    has_talent: IBaseAbility_Plus;
    level: number;
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
            if (!GameFunc.IsValid(this.modifier) || this.level == null || this.level != this.GetAbilityPlus().GetLevel() || this.has_talent == null ||
                this.has_talent != this.GetCasterPlus().HasTalent("special_bonus_unique_luna_custom_8")) {
                this.level = this.GetAbilityPlus().GetLevel()
                this.has_talent = this.GetCasterPlus().HasTalent("special_bonus_unique_luna_custom_8")
                // this.hero_star = this.GetCasterPlus().GetStar()
                this.modifier = modifier_luna_3_hidden.apply(this.GetParentPlus(), this.GetParentPlus(), this.GetAbilityPlus())
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
export class modifier_luna_3_hidden extends BaseModifier_Plus {
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
    AllowIllusionDuplicate() {
        return false
    }
    IsAura() {
        return !this.GetParentPlus().IsIllusion() && !this.GetCasterPlus().PassivesDisabled()
    }
    GetAuraRadius() {
        return this.radius
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
        return "modifier_luna_3_effect"
    }
    Init(params: IModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_luna_3_effect extends BaseModifier_Plus {
    bonus_attribute: number;
    primary_attribute_damage: number;
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
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.bonus_attribute = this.GetSpecialValueFor("bonus_attribute")
        this.primary_attribute_damage = this.GetSpecialValueFor("primary_attribute_damage")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_PRIMARY_BONUS)
    G_STATS_PRIMARY_BONUS() {
        return this.bonus_attribute + (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().GetTalentValue("special_bonus_unique_luna_custom_8") || 0)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    EOM_GetModifierBaseAttack_BonusDamage() {
        return this.GetParentPlus().GetPrimaryStatValue() * this.primary_attribute_damage
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        this._tooltip = (this._tooltip || 0) % 4 + 1
        if (this._tooltip == 1) {
            return this.GetParentPlus().GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_AGILITY && this.bonus_attribute + (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().GetTalentValue("special_bonus_unique_luna_custom_8") || 0) || 0
        } else if (this._tooltip == 2) {
            return this.GetParentPlus().GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_STRENGTH && this.bonus_attribute + (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().GetTalentValue("special_bonus_unique_luna_custom_8") || 0) || 0
        } else if (this._tooltip == 3) {
            return this.GetParentPlus().GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_INTELLECT && this.bonus_attribute + (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().GetTalentValue("special_bonus_unique_luna_custom_8") || 0) || 0
        } else if (this._tooltip == 4) {
            return math.floor(this.primary_attribute_damage * this.GetParentPlus().GetPrimaryStatValue())
        }
        return 0
    }
}
