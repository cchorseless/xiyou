import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_lina_fiery_soul = { "ID": "5042", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "fiery_soul_attack_speed_bonus": "40 60 80 100", "LinkedSpecialBonus": "special_bonus_unique_lina_2" }, "02": { "var_type": "FIELD_FLOAT", "fiery_soul_move_speed_bonus": "5 6 7 8", "LinkedSpecialBonus": "special_bonus_unique_lina_2", "LinkedSpecialBonusField": "value2" }, "03": { "var_type": "FIELD_INTEGER", "fiery_soul_max_stacks": "3" }, "04": { "var_type": "FIELD_INTEGER", "fiery_soul_stack_duration": "12" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class lina_3 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lina_fiery_soul";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lina_fiery_soul = Data_lina_fiery_soul;
    Init() {
        this.SetDefaultSpecialValue("fiery_soul_stack_duration", 8);
        this.SetDefaultSpecialValue("fiery_soul_max_stacks", 5);
        this.SetDefaultSpecialValue("fiery_soul_attack_speed_bonus", [30, 40, 50, 60, 70]);
        this.SetDefaultSpecialValue("fiery_soul_magic_bonus", [3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("max_attack_speed_scepter", 200);
        this.SetDefaultSpecialValue("chance_factor", 2);

    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lina_3"
    // }

}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lina_3 extends BaseModifier_Plus {
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

    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: IModifierTable) {
        let unit = params.unit
        let hAbility = params.ability
        if (unit == null || !unit.IsAlive() || unit != this.GetParentPlus() || unit.IsIllusion() || hAbility == null || hAbility.IsItem()) {
            return
        }
        // 炽魂
        let fiery_soul_stack_duration = this.GetSpecialValueFor("fiery_soul_stack_duration")
        modifier_lina_3_fiery_soul.apply(unit, unit, this.GetAbilityPlus(), { duration: fiery_soul_stack_duration })
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_lina_3_fiery_soul// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lina_3_fiery_soul extends BaseModifier_Plus {
    chance_factor: number;
    fiery_soul_max_stacks: number;
    fiery_soul_magic_bonus: number;
    max_attack_speed_scepter: number;
    fiery_soul_attack_speed_bonus: number;
    particleID: ParticleID;
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("lina_fiery_soul", this.GetParentPlus())
    }
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hParent = this.GetParentPlus()
        this.chance_factor = this.GetSpecialValueFor("chance_factor")
        this.fiery_soul_max_stacks = this.GetSpecialValueFor("fiery_soul_max_stacks") + hParent.GetTalentValue("special_bonus_unique_lina_custom_7")
        this.fiery_soul_attack_speed_bonus = this.GetSpecialValueFor("fiery_soul_attack_speed_bonus")
        this.fiery_soul_magic_bonus = this.GetSpecialValueFor("fiery_soul_magic_bonus") + hParent.GetTalentValue("special_bonus_unique_lina_custom_8")
        this.max_attack_speed_scepter = this.GetSpecialValueFor("max_attack_speed_scepter")
        if (IsServer()) {
            if (this.GetStackCount() < this.fiery_soul_max_stacks) {
                this.IncrementStackCount()
            }
        } else {
            this.particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lina/lina_fiery_soul.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(this.particleID, 1, Vector(this.GetStackCount(), 0, 0))
            this.AddParticle(this.particleID, false, false, -1, false, false)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        let hParent = this.GetParentPlus()
        this.chance_factor = this.GetSpecialValueFor("chance_factor")
        this.fiery_soul_max_stacks = this.GetSpecialValueFor("fiery_soul_max_stacks") + hParent.GetTalentValue("special_bonus_unique_lina_custom_7")
        this.fiery_soul_attack_speed_bonus = this.GetSpecialValueFor("fiery_soul_attack_speed_bonus")
        this.fiery_soul_magic_bonus = this.GetSpecialValueFor("fiery_soul_magic_bonus") + hParent.GetTalentValue("special_bonus_unique_lina_custom_8")
        this.max_attack_speed_scepter = this.GetSpecialValueFor("max_attack_speed_scepter")
        if (IsServer()) {
            if (this.GetStackCount() < this.fiery_soul_max_stacks) {
                this.IncrementStackCount()
            }
        } else {
            ParticleManager.SetParticleControl(this.particleID, 1, Vector(this.GetStackCount(), 0, 0))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.fiery_soul_magic_bonus * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    On_Tooltip2() {
        if (this.GetParentPlus().HasScepter()) {
            return this.chance_factor * this.GetStackCount()
        }
        return 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        return this.fiery_soul_attack_speed_bonus * this.GetStackCount()
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    EOM_GetModifierMaximumAttackSpeedBonus(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        if (this.GetStackCount() >= this.fiery_soul_max_stacks && hParent.HasScepter()) {
            return this.max_attack_speed_scepter
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    EOM_GetModifierSpellAmplifyBonus(params: IModifierTable) {
        return this.fiery_soul_magic_bonus * this.GetStackCount()
    }
}
