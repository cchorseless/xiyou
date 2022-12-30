
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_huskar_berserkers_blood = { "ID": "5273", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "maximum_attack_speed": "160 210 260 310" }, "02": { "var_type": "FIELD_INTEGER", "maximum_health_regen": "20 40 60 80", "LinkedSpecialBonus": "special_bonus_unique_huskar_6" }, "03": { "var_type": "FIELD_INTEGER", "hp_threshold_max": "10" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_huskar_berserkers_blood extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "huskar_berserkers_blood";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_huskar_berserkers_blood = Data_huskar_berserkers_blood;
    Init() {
        this.SetDefaultSpecialValue("maximum_attack_speed", [120, 160, 200, 240, 280]);
        this.SetDefaultSpecialValue("maximum_health_regen", [2.5, 5.0, 7.5, 10.0, 12.5]);
        this.SetDefaultSpecialValue("hp_threshold_max", 10);
        this.SetDefaultSpecialValue("maximum_spell_crit_damage", [70, 90, 110, 150, 200]);

    }


    // GetIntrinsicModifierName() {
    //     return "modifier_huskar_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_huskar_3 extends BaseModifier_Plus {
    maximum_health_regen: number;
    maximum_attack_speed: number;
    maximum_strength: number;
    hp_threshold_max: number;
    maximum_spell_crit_damage: number;
    model_scalle_max: number;
    particleID: ParticleID;
    particleID2: ParticleID;
    IsHidden() {
        return true
    }
    HeroEffectPriority() {
        return 100
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(0)
        } else {
            this.particleID = ResHelper.CreateParticle({
                resPath: 'particles/units/heroes/hero_huskar/huskar_berserkers_blood.vpcf',
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(this.particleID, false, false, 100, false, false)
            this.particleID2 = ResHelper.CreateParticle({
                resPath: 'particles/units/heroes/hero_huskar/huskar_berserker_blood_hero_effect.vpcf',
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(this.particleID2, false, false, this.HeroEffectPriority(), true, false)
        }
    }
    Init(params: ModifierTable) {
        this.maximum_attack_speed = this.GetSpecialValueFor("maximum_attack_speed")
        this.maximum_health_regen = this.GetSpecialValueFor("maximum_health_regen")
        this.maximum_strength = this.GetSpecialValueFor("maximum_strength")
        this.hp_threshold_max = this.GetSpecialValueFor("hp_threshold_max")
        this.maximum_spell_crit_damage = this.GetSpecialValueFor("maximum_spell_crit_damage")
        this.model_scalle_max = 35
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        let iHPMax = hParent.GetMaxHealth()
        let hp_threshold_max = hCaster.HasTalent("special_bonus_unique_huskar_custom_2") && hCaster.GetTalentValue("special_bonus_unique_huskar_custom_2") || this.hp_threshold_max
        let maximum_strength = hCaster.GetTalentValue("special_bonus_unique_huskar_custom_6") + this.maximum_strength
        let fP = (iHPMax - hParent.GetHealth()) / (iHPMax * (100 - hp_threshold_max) * 0.01)
        fP = math.min(math.floor(fP * 100), 100)
        this.SetStackCount(fP)

    }
    OnStackCountChanged(iStackCount: number) {
        if (IsClient()) {
            if (this.particleID) {
                let fP = this.GetStackCount()
                ParticleManager.SetParticleControl(this.particleID, 1, Vector(fP, fP, fP))
                ParticleManager.SetParticleControl(this.particleID2, 1, Vector(fP / 10, fP / 10, fP / 10))
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_STRENGTH_BASE_PERCENTAGE)
    EOM_GetModifierBaseStats_Strength_Percentage() {
        if (this.GetParentPlus().PassivesDisabled()) {
            return 0
        }
        return this.maximum_strength / 100 * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE)
    EOM_GetModifierSpellCriticalStrikeDamage() {
        if (this.GetParentPlus().PassivesDisabled()) {
            return 0
        }
        return this.maximum_spell_crit_damage / 100 * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    GetHealthRegenPercentage() {
        if (this.GetParentPlus().PassivesDisabled()) {
            return 0
        }
        return this.maximum_health_regen / 100 * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        if (this.GetParentPlus().PassivesDisabled()) {
            return 0
        }
        return this.maximum_attack_speed / 100 * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_SCALE)
    GetModelScale() {
        return 1 + this.model_scalle_max / 100 * this.GetStackCount()
    }
}
