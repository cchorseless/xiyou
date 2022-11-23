
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_lycan_feral_impulse = { "ID": "5397", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_damage": "12 24 36 48", "LinkedSpecialBonus": "special_bonus_unique_lycan_4" }, "02": { "var_type": "FIELD_INTEGER", "bonus_hp_regen": "2 4 6 8", "LinkedSpecialBonus": "special_bonus_unique_lycan_3" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_lycan_feral_impulse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lycan_feral_impulse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lycan_feral_impulse = Data_lycan_feral_impulse;
    Init() {
        this.SetDefaultSpecialValue("bonus_damage", [24, 30, 36, 42, 48]);
        this.SetDefaultSpecialValue("radius", 1200);

    }


    // GetIntrinsicModifierName() {
    //     return "modifier_lycan_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lycan_3 extends BaseModifier_Plus {
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
        return !this.GetParentPlus().IsIllusion() && !this.GetCasterPlus().PassivesDisabled()
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAuraEntityReject(hEntity: BaseNpc_Plus) {
        if (this.GetParentPlus().GetTalentValue("special_bonus_unique_lycan_custom_6") > 0) {
            return !(hEntity.IsSummoned() || hEntity.GetUnitLabel() == "HERO" || hEntity == this.GetCasterPlus())
        }
        return !(hEntity.IsSummoned() || hEntity == this.GetCasterPlus())
    }
    GetAura() {
        return "modifier_lycan_3_aura"
    }
    Init(params: ModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lycan_3_aura extends BaseModifier_Plus {
    bonus_damage: number;
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
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("lycan_feral_impulse", this.GetCasterPlus())
    }
    Init(params: ModifierTable) {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        let hCaster = this.GetCasterPlus()
        let extra_bonus_damage = (GameFunc.IsValid(hCaster) && hCaster.HasTalent("special_bonus_unique_lycan_custom_3")) && hCaster.GetTalentValue("special_bonus_unique_lycan_custom_3") || 0
        return this.bonus_damage + extra_bonus_damage
    }

}
