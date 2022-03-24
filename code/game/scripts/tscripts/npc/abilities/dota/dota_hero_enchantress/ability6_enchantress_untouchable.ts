import { GameEnum } from "../../../../GameEnum";
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
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";

/** dota原技能数据 */
export const Data_enchantress_untouchable = { "ID": "5267", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "HasScepterUpgrade": "1", "AbilityDraftUltScepterAbility": "enchantress_bunny_hop", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "slow_attack_speed": "-120 -160 -200", "LinkedSpecialBonus": "special_bonus_unique_enchantress_3" }, "02": { "var_type": "FIELD_INTEGER", "slow_duration": "4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability6_enchantress_untouchable extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enchantress_untouchable";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enchantress_untouchable = Data_enchantress_untouchable;

    Init() {
        this.SetDefaultSpecialValue("max_radius", 1500);
        this.SetDefaultSpecialValue("max_speed_radius", 400);
        this.SetDefaultSpecialValue("min_damage_radius", 400);
        this.SetDefaultSpecialValue("distance_level", 100);
        this.SetDefaultSpecialValue("min_speed", [-10, -15, -20, -25, -30, -35]);
        this.SetDefaultSpecialValue("max_speed", [-30, -35, -40, -45, -50, -60]);
        this.SetDefaultSpecialValue("min_damage", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("max_damage", [5, 8, 11, 14, 17, 20]);

    }



    // GetIntrinsicModifierName() {
    //     return "modifier_enchantress_6"
    // }
}
// // // // // // // // // // // // // // // // // // // -modifier_enchantress_6// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_enchantress_6 extends BaseModifier_Plus {
    max_radius: number;
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
        return this.max_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
    }
    GetAura() {
        return 'modifier_enchantress_6_debuff'
    }
    Init(params: ModifierTable) {
        this.max_radius = this.GetSpecialValueFor("max_radius")
    }

}
// // // // // // // // // // // // // // // // // // // -modifier_enchantress_6_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_enchantress_6_debuff extends BaseModifier_Plus {
    max_radius: number;
    max_speed_radius: number;
    min_damage_radius: number;
    distance_level: number;
    max_speed: number;
    min_speed: number;
    min_damage: number;
    max_damage: number;
    speed_per_level: number;
    damage_per_level: number;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.max_radius = this.GetSpecialValueFor("max_radius")
        this.max_speed_radius = this.GetSpecialValueFor("max_speed_radius")
        this.min_damage_radius = this.GetSpecialValueFor("min_damage_radius")
        this.distance_level = this.GetSpecialValueFor("distance_level")
        this.min_speed = this.GetSpecialValueFor("min_speed") + hCaster.GetTalentValue("special_bonus_unique_enchantress_custom_2")
        this.max_speed = this.GetSpecialValueFor("max_speed") + hCaster.GetTalentValue("special_bonus_unique_enchantress_custom_2")
        this.min_damage = this.GetSpecialValueFor("min_damage") + hCaster.GetTalentValue("special_bonus_unique_enchantress_custom_8")
        this.max_damage = this.GetSpecialValueFor("max_damage") + hCaster.GetTalentValue("special_bonus_unique_enchantress_custom_8")
        //  每100码需要减少的速度,增伤，提前算好
        this.speed_per_level = (this.min_speed - this.max_speed) / ((this.max_radius - this.max_speed_radius) / this.distance_level)
        this.damage_per_level = (this.max_damage - this.min_damage) / ((this.max_radius - this.min_damage_radius) / this.distance_level)
        if (params.IsOnCreated && IsClient()) {
            //  状态特效
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_enchantress_untouchable.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, -1, false, false)
            //  开始瞬间的特效
            let iParticleID2 = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_enchantress/enchantress_untouchable.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID2, false, false, -1, false, false)
        }
    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        let fDistance = ((hParent.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector).Length2D()
        if (fDistance < this.max_speed_radius + this.distance_level) {
            return this.max_speed
        } else if (fDistance >= this.max_radius) {
            return this.min_speed
        } else {
            let level = math.floor((fDistance - this.max_speed_radius) / this.distance_level)
            return this.max_speed + level * this.speed_per_level
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        let fDistance = ((hParent.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector).Length2D()
        if (fDistance < this.min_damage_radius + this.distance_level) {
            return this.min_damage
        } else if (fDistance >= this.max_radius) {
            return this.max_damage
        } else {
            let level = math.floor((fDistance - this.min_damage_radius) / this.distance_level)
            return this.min_damage + level * this.damage_per_level
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingPureDamagePercentage(params: ModifierTable) {
        return this.tooltip()
    }



}
