import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_drow_ranger_multishot = { "ID": "343", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DIRECTIONAL", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilityCastPoint": "0.0", "AbilityChannelTime": "1.75", "AbilityCooldown": "26 24 22 20", "AbilityManaCost": "50 70 90 110", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "wave_count": "3" }, "02": { "var_type": "FIELD_INTEGER", "arrow_count_per_wave": "4" }, "03": { "var_type": "FIELD_INTEGER", "arrow_damage_pct": "85 110 135 160", "LinkedSpecialBonus": "special_bonus_unique_drow_ranger_1" }, "04": { "var_type": "FIELD_FLOAT", "arrow_slow_duration": "1.25 2 2.75 3.5" }, "05": { "var_type": "FIELD_INTEGER", "arrow_width": "90" }, "06": { "var_type": "FIELD_INTEGER", "arrow_speed": "1200" }, "07": { "var_type": "FIELD_FLOAT", "arrow_range_multiplier": "2" }, "08": { "var_type": "FIELD_INTEGER", "arrow_angle": "50" } }, "AbilityCastAnimation": "ACT_DOTA_CHANNEL_ABILITY_3" };

@registerAbility()
export class ability3_drow_ranger_multishot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "drow_ranger_multishot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_drow_ranger_multishot = Data_drow_ranger_multishot;
    Init() {
        this.SetDefaultSpecialValue("trueshot_ranged_attack_speed", [15, 20, 25, 30, 35]);
        this.SetDefaultSpecialValue("radius", 700);
        this.SetDefaultSpecialValue("increase_damage_pct", [5, 8, 11, 15, 20]);
        this.SetDefaultSpecialValue("increase_agi_pct", 45);

    }



    // GetIntrinsicModifierName() {
    //     return "modifier_drow_ranger_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_drow_ranger_3 extends BaseModifier_Plus {
    has_talent_4: IBaseAbility_Plus;
    has_talent_5: IBaseAbility_Plus;
    has_talent_8: IBaseAbility_Plus;
    level: number;
    modifier: modifier_drow_ranger_3_hidden;
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
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
    OnIntervalThink() {
        if (IsServer()) {
            if (!GameFunc.IsValid(this.modifier) || this.level == null || this.level != this.GetAbilityPlus().GetLevel() || this.has_talent_4 == null || this.has_talent_5 == null || this.has_talent_8 == null || this.has_talent_4 != this.GetCasterPlus().HasTalent("special_bonus_unique_drow_ranger_custom_4") || this.has_talent_5 != this.GetCasterPlus().HasTalent("special_bonus_unique_drow_ranger_custom_5") || this.has_talent_8 != this.GetCasterPlus().HasTalent("special_bonus_unique_drow_ranger_custom_8")
            /**this.hero_star == null || this.hero_star != this.GetCasterPlus().GetStar()*/) {
                let caster = this.GetCasterPlus()
                this.level = this.GetAbilityPlus().GetLevel()
                this.has_talent_4 = caster.HasTalent("special_bonus_unique_drow_ranger_custom_4")
                this.has_talent_5 = caster.HasTalent("special_bonus_unique_drow_ranger_custom_5")
                this.has_talent_8 = caster.HasTalent("special_bonus_unique_drow_ranger_custom_8")
                // this.hero_star = this.GetCasterPlus().GetStar()
                this.modifier = modifier_drow_ranger_3_hidden.apply(caster, this.GetParentPlus(), this.GetAbilityPlus())
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_drow_ranger_3_hidden extends BaseModifier_Plus {
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
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_drow_ranger_custom_4")) {
            return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
        }
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_RANGED_ONLY
    }
    GetAura() {
        return "modifier_drow_ranger_3_aura"
    }
    Init(params: IModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_drow_ranger_3_aura extends BaseModifier_Plus {
    trueshot_ranged_attack_speed: number;
    increase_agi_pct: number;
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
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        this.trueshot_ranged_attack_speed = this.GetSpecialValueFor("trueshot_ranged_attack_speed")
        this.increase_agi_pct = this.GetSpecialValueFor("increase_agi_pct")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    G_MAX_ATTACKSPEED_BONUS() {
        return ((GameFunc.IsValid(this.GetCasterPlus()) && this.GetParentPlus().GetUnitLabel() == "HERO") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_drow_ranger_custom_8") || 0)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster) || hCaster.PassivesDisabled()) {
            return 0
        }

        let iAgi = hCaster.GetAgility != null && hCaster.GetAgility() || 9
        let trueshot_ranged_attack_speed = this.trueshot_ranged_attack_speed + hCaster.GetTalentValue("special_bonus_unique_drow_ranger_custom_5")
        return iAgi * trueshot_ranged_attack_speed * 0.01
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_PERCENTAGE)
    EOM_GetModifierStats_Agility_Percentage(params: IModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard() && this.GetParentPlus().IsRangedAttacker() && this.GetParentPlus().GetUnitLabel() == "HERO") {
            return this.increase_agi_pct
        }
    }
}
