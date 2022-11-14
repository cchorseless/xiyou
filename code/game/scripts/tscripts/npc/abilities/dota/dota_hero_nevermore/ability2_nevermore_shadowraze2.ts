import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_nevermore_shadowraze2 = { "ID": "5060", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "OnLearnbar": "0", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "LinkedAbility": "nevermore_shadowraze3", "AbilityCastAnimation": "ACT_DOTA_RAZE_2", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.55", "AbilityCooldown": "10", "AbilityManaCost": "75 80 85 90", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "shadowraze_damage": "90 160 230 300", "LinkedSpecialBonus": "special_bonus_unique_nevermore_2" }, "02": { "var_type": "FIELD_INTEGER", "shadowraze_radius": "250" }, "03": { "var_type": "FIELD_INTEGER", "shadowraze_range": "450" }, "04": { "var_type": "FIELD_INTEGER", "shadowraze_cooldown": "3" }, "05": { "var_type": "FIELD_INTEGER", "stack_bonus_damage": "50 60 70 80", "CalculateSpellDamageTooltip": "0" }, "06": { "var_type": "FIELD_FLOAT", "duration": "8" } } };

@registerAbility()
export class ability2_nevermore_shadowraze2 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nevermore_shadowraze2";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nevermore_shadowraze2 = Data_nevermore_shadowraze2;
    Init() {
        this.SetDefaultSpecialValue("necromastery_damage_per_soul", [5, 7, 9, 11, 13, 15]);
        this.SetDefaultSpecialValue("necromastery_max_souls", [24, 32, 40, 48, 56, 64]);
        this.SetDefaultSpecialValue("necromastery_max_souls_scepter", [32, 64, 80, 96, 112, 128]);
        this.SetDefaultSpecialValue("requiem_radius", 1000);
        this.SetDefaultSpecialValue("per_souls_amplify_spell", 0.75);

    }

    Init_old() {
        this.SetDefaultSpecialValue("necromastery_damage_per_soul", [5, 7, 9, 11, 13, 15]);
        this.SetDefaultSpecialValue("necromastery_max_souls", [24, 32, 40, 48, 56, 64]);
        this.SetDefaultSpecialValue("necromastery_max_souls_scepter", [32, 64, 80, 96, 112, 128]);
        this.SetDefaultSpecialValue("requiem_radius", 1000);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("requiem_radius")
    }
    GetIntrinsicModifierName() {
        return "modifier_nevermore_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_nevermore_2 extends BaseModifier_Plus {
    necromastery_damage_per_soul: number;
    necromastery_max_souls_scepter: number;
    per_souls_amplify_spell: number;
    requiem_radius: number;
    necromastery_max_souls: number;
    iParticleID: ParticleID;
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
        return "nevermore_necromastery"
    }
    OnCreated(params: ModifierTable) {

        if (IsClient()) {
            this.iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_nevermore/nevermore_souls.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(this.iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(this.iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.necromastery_damage_per_soul = this.GetSpecialValueFor("necromastery_damage_per_soul")
        this.necromastery_max_souls = this.GetSpecialValueFor("necromastery_max_souls")
        this.necromastery_max_souls_scepter = this.GetSpecialValueFor("necromastery_max_souls_scepter")
        this.requiem_radius = this.GetSpecialValueFor("requiem_radius")
        this.per_souls_amplify_spell = this.GetSpecialValueFor("per_souls_amplify_spell")
    }

    OnStackCountChanged(iOldStackCount: number) {
        if (IsClient()) {
            if (this.iParticleID != null) {
                ParticleManager.SetParticleControl(this.iParticleID, 4, Vector(this.GetStackCount(), this.GetStackCount(), 0))
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let extra_necromastery_max_souls = hCaster.HasTalent("special_bonus_unique_nevermore_custom_3") && hCaster.GetTalentValue("special_bonus_unique_nevermore_custom_3") || 0
        let necromastery_max_souls = hCaster.HasScepter() && this.necromastery_max_souls_scepter || this.necromastery_max_souls
        necromastery_max_souls = necromastery_max_souls + extra_necromastery_max_souls
        let extra_necromastery_damage_per_soul = hCaster.HasTalent("special_bonus_unique_nevermore_custom_4") && hCaster.GetTalentValue("special_bonus_unique_nevermore_custom_4") || 0
        let necromastery_damage_per_soul = this.necromastery_damage_per_soul + extra_necromastery_damage_per_soul
        return math.min(this.GetStackCount(), necromastery_max_souls) * necromastery_damage_per_soul
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    EOM_GetModifierSpellAmplifyBonus(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasShard()) {
            let extra_necromastery_max_souls = hCaster.HasTalent("special_bonus_unique_nevermore_custom_3") && hCaster.GetTalentValue("special_bonus_unique_nevermore_custom_3") || 0
            let necromastery_max_souls = hCaster.HasScepter() && this.necromastery_max_souls_scepter || this.necromastery_max_souls
            necromastery_max_souls = necromastery_max_souls + extra_necromastery_max_souls
            return math.min(this.GetStackCount(), necromastery_max_souls) * this.per_souls_amplify_spell
        }
        return 0
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        if (!hParent.IsIllusion() && params.unit.IsPositionInRange(hParent.GetAbsOrigin(), this.requiem_radius) && !hParent.PassivesDisabled()) {
            let iCount = 1
            if (params.unit.IsConsideredHero()) {
                iCount = 5
            }
            modifier_nevermore_2_particle_nevermore_necro_souls.apply(hParent, params.unit, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            let extra_necromastery_max_souls = hParent.HasTalent("special_bonus_unique_nevermore_custom_3") && hParent.GetTalentValue("special_bonus_unique_nevermore_custom_3") || 0
            let iMax = hParent.HasScepter() && this.necromastery_max_souls_scepter || this.necromastery_max_souls
            iMax = iMax + extra_necromastery_max_souls
            this.SetStackCount(math.max(this.GetStackCount(), math.min(iMax, this.GetStackCount() + iCount)))
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_nevermore_2_particle_nevermore_necro_souls extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let sParticlePath = "particles/units/heroes/hero_nevermore/nevermore_necro_souls.vpcf"
            if (hCaster.IsConsideredHero()) {
                sParticlePath = "particles/units/heroes/hero_nevermore/nevermore_necro_souls_hero.vpcf"
            }
            let iParticleID = ResHelper.CreateParticle({
                resPath: sParticlePath,
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
