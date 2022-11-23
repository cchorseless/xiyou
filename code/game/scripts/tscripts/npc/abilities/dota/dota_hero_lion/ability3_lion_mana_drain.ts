import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionVertical_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_lion_mana_drain = { "ID": "5046", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "HasShardUpgrade": "1", "AbilityCastRange": "850", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityChannelTime": "5.1", "AbilityCooldown": "15 12 9 6", "AbilityManaCost": "10 10 10 10", "AbilityModifierSupportValue": "5.0", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "5.0" }, "02": { "var_type": "FIELD_INTEGER", "mana_per_second": "20 40 60 120", "LinkedSpecialBonus": "special_bonus_unique_lion_5" }, "03": { "var_type": "FIELD_INTEGER", "break_distance": "1100" }, "04": { "var_type": "FIELD_FLOAT", "tick_interval": "0.1" }, "05": { "var_type": "FIELD_INTEGER", "movespeed": "20 25 30 35", "LinkedSpecialBonus": "special_bonus_unique_lion_6" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_lion_mana_drain extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lion_mana_drain";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lion_mana_drain = Data_lion_mana_drain;
    Init() {
        this.SetDefaultSpecialValue("mana", [400, 600, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("overflow_duration", 5);
        this.SetDefaultSpecialValue("intellect_factor", [0.2, 0.3, 0.4, 0.5, 0.6]);

    }




    GetTargetMana(hTarget: BaseNpc_Plus) {
        if (this.GetLevel() <= 0) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let mana = this.GetSpecialValueFor("mana")
        let overflow_duration = this.GetSpecialValueFor("overflow_duration") + hCaster.GetTalentValue("special_bonus_unique_lion_custom_3")
        hTarget.ReduceMana(mana)
        let fOverflowMana = math.max(mana - (hCaster.GetMaxMana() - hCaster.GetMana()), 0)
        if (fOverflowMana > 0) {
            modifier_lion_3_mana.apply(hCaster, hCaster, this, { duration: overflow_duration, overflow_mana: fOverflowMana })
        }
        hCaster.GiveMana(mana)
        modifier_lion_3_particle_drain.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_3_mana extends BaseModifier_Plus {
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
        return ResHelper.GetAbilityTextureReplacement("lion_mana_drain", this.GetCasterPlus())
    }

    Init(params: ModifierTable) {
        if (IsServer()) {
            let fMana = (params.overflow_mana || 0)
            this.changeStackCount(fMana)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-fMana)
            })
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            this.SetStackCount(0)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MANA_BONUS)
    EOM_GetModifierManaBonus(params: ModifierTable) {
        return this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_3_particle_drain extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lion/lion_spell_mana_drain_custom.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
