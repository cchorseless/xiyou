
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_slardar_amplify_damage = { "ID": "5117", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Slardar.Amplify_Damage", "AbilityCastRange": "700 800 900", "AbilityCastPoint": "0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "5", "AbilityManaCost": "25", "AbilityModifierSupportValue": "6.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "armor_reduction": "-10 -15 -20", "LinkedSpecialBonus": "special_bonus_unique_slardar_5" }, "02": { "var_type": "FIELD_FLOAT", "duration": "18" } } };

@registerAbility()
export class ability6_slardar_amplify_damage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slardar_amplify_damage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slardar_amplify_damage = Data_slardar_amplify_damage;
    Init() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("armor_reduction", [-4, -8, -12, -16, -20, -25]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("armor_reduction", -45);

    }



    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    GetIntrinsicModifierName() {
        return "modifier_slardar_6"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_slardar_6 extends BaseModifier_Plus {
    modifier: modifier_slardar_6_hidden;
    level: number;
    has_talent: BaseAbility_Plus;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(1)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            if (!GameFunc.IsValid(this.modifier) ||
                this.level == null ||
                this.level != this.GetAbilityPlus().GetLevel() ||
                this.has_talent == null ||
                this.has_talent != this.GetCasterPlus().HasTalent("special_bonus_unique_slardar_custom_7"))
            //  this.hero_star != this.GetCasterPlus().GetStar()) {
            {
                this.level = this.GetAbilityPlus().GetLevel()
                this.has_talent = this.GetCasterPlus().HasTalent("special_bonus_unique_slardar_custom_7")
                // this.hero_star = this.GetCasterPlus().GetStar()
                this.modifier = modifier_slardar_6_hidden.apply(this.GetParentPlus(), this.GetParentPlus(), this.GetAbilityPlus())
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
export class modifier_slardar_6_hidden extends BaseModifier_Plus {
    radius: number;
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
    IsAura() {
        return !this.GetParentPlus().IsIllusion() && !this.GetCasterPlus().PassivesDisabled()
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
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
    }
    GetAura() {
        return "modifier_slardar_6_aura"
    }
    Init(params: ModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slardar_6_aura extends BaseModifier_Plus {
    armor_reduction: number;
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
    ShouldUseOverheadOffset() {
        return true
    }
    Init(params: ModifierTable) {
        this.armor_reduction = this.GetSpecialValueFor("armor_reduction")
        if (params.IsOnCreated && IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/particle_sr/slardar/slardar_amp_damage.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, true)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_slardar_amp_damage.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, true, 10, false, false)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    G_PHYSICAL_ARMOR_BONUS() {
        return this.armor_reduction - this.GetCasterPlus().GetTalentValue("special_bonus_unique_slardar_custom_7")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        if (!GameFunc.IsValid(this.GetCasterPlus()) || this.GetCasterPlus().PassivesDisabled()) {
            return 0
        }
        return this.armor_reduction - this.GetCasterPlus().GetTalentValue("special_bonus_unique_slardar_custom_7")
    }

}
