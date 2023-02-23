
import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_viper_corrosive_skin = { "ID": "5220", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "hero_viper.CorrosiveSkin", "AbilityModifierSupportBonus": "10", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "4.0" }, "02": { "var_type": "FIELD_INTEGER", "bonus_attack_speed": "8 16 24 32", "LinkedSpecialBonus": "special_bonus_unique_viper_6", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_MULTIPLY" }, "03": { "var_type": "FIELD_INTEGER", "bonus_magic_resistance": "10 15 20 25", "LinkedSpecialBonus": "special_bonus_unique_viper_6", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_MULTIPLY" }, "04": { "var_type": "FIELD_INTEGER", "damage": "8 16 24 32", "LinkedSpecialBonus": "special_bonus_unique_viper_1" }, "05": { "var_type": "FIELD_INTEGER", "max_range_tooltip": "1400" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_viper_corrosive_skin extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "viper_corrosive_skin";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_viper_corrosive_skin = Data_viper_corrosive_skin;
    Init() {
        this.SetDefaultSpecialValue("poison_count", [25, 50, 75, 100, 125]);
        this.SetDefaultSpecialValue("poison_count_agility", 0.2);
        this.SetDefaultSpecialValue("aura_radius", 225);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("movespeed_reduce", [6, 8, 10, 12, 14]);
        this.SetDefaultSpecialValue("max_debuff_count", 3);

    }

    Init_old() {
        this.SetDefaultSpecialValue("poison_count", [25, 50, 75, 100, 125]);
        this.SetDefaultSpecialValue("poison_count_agility", 0.2);
        this.SetDefaultSpecialValue("aura_radius", 225);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("movespeed_reduce", [6, 8, 10, 12, 14]);
        this.SetDefaultSpecialValue("magical_armor_reduce", [3, 5, 7, 9, 11]);
        this.SetDefaultSpecialValue("max_debuff_count", 3);

    }

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("aura_radius")
    }
    GetIntrinsicModifierName() {
        return "modifier_viper_3"
    }
}
// // // // // // // // // // // // // // // // // // // modifier_viper_3// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_3 extends BaseModifier_Plus {
    aura_radius: any;
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
        let hParent = this.GetParentPlus()
        if (hParent.IsIllusion && hParent.IsIllusion()) {
            return false
        }
        if (hParent.IsClone && hParent.IsClone()) {
            return false
        }
        return true
    }
    GetAuraRadius() {
        return this.aura_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
    }
    GetAuraEntityReject(hTarget: IBaseNpc_Plus) {
        let hParent = this.GetParentPlus()
        if (hParent == hTarget) {
            return true
        }
        if (hTarget.IsSummoned && hTarget.IsSummoned()) {
            if (hParent.HasTalent("special_bonus_unique_viper_custom_2")) {
                return false
            }
            return true
        }
    }
    GetAura() {
        return "modifier_viper_3_attack"
    }
    Init(params: IModifierTable) {
        this.aura_radius = this.GetSpecialValueFor("aura_radius")
    }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_viper_3_attack extends BaseModifier_Plus {
    poison_count: any;
    poison_count_agility: any;
    duration: any;
    records: any[];
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("viper_corrosive_skin", this.GetCasterPlus())
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.records = []
        }
    }
    Init(params: IModifierTable) {
        this.poison_count = this.GetSpecialValueFor("poison_count")
        this.poison_count_agility = this.GetSpecialValueFor("poison_count_agility")
        this.duration = this.GetSpecialValueFor("duration")
    }



    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = params.attacker
        let hAbility = this.GetAbilityPlus()

        if (!GameFunc.IsValid(hTarget) || !GameFunc.IsValid(hAbility) || hTarget.GetClassname() == "dota_item_drop" || hParent != this.GetParentPlus() || hParent.IsIllusion() || hAbility.CastFilterResult() != UnitFilterResult.UF_SUCCESS) {
            return
        }

        modifier_viper_3_projectile.apply(hParent, hParent, hAbility, null)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = params.attacker
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hTarget) || !GameFunc.IsValid(hAbility) || hTarget.GetClassname() == "dota_item_drop" || hParent != this.GetParentPlus() || hParent.IsIllusion() || !modifier_viper_3_projectile.exist(hParent)) {

            return
        }

        modifier_viper_3_projectile.remove(hParent);
        if (BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) || hAbility.CastFilterResult() != UnitFilterResult.UF_SUCCESS) {
            return
        }
        table.insert(this.records, params.record)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = params.attacker
        if (!GameFunc.IsValid(hTarget) || hParent != this.GetParentPlus() || this.records.indexOf(params.record) == -1) {
            return
        }
        hParent.EmitSound(ResHelper.GetSoundReplacement("hero_viper.poisonAttack.Cast", hParent))
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        let hTarget = params.target as IBaseNpc_Plus
        let hParent = params.attacker
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hTarget) || !GameFunc.IsValid(hAbility) || hParent != this.GetParentPlus() || this.records.indexOf(params.record) == -1) {
            return
        }
        modifier_poison.Poison(hTarget, hParent, hAbility, this.CalPoisonCount())
        modifier_viper_3_debuff.apply(hTarget, hParent, hAbility, { duration: this.duration * hTarget.GetStatusResistanceFactor(hParent) })
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = params.attacker
        if (!GameFunc.IsValid(hTarget) || hParent != this.GetParentPlus() || this.records.indexOf(params.record) == -1) {
            return
        }
        GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip(params: any) {
        return this.CalPoisonCount()
    }
    CalPoisonCount() {
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus
        let iCount = this.poison_count
        if (GameFunc.IsValid(hCaster) && hCaster.GetAgility) {
            iCount = iCount + hCaster.GetAgility() * this.poison_count_agility
        }
        return iCount
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_viper_3_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_3_debuff extends BaseModifier_Plus {
    movespeed_reduce: any;
    max_debuff_count: any;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }

    Init(params: IModifierTable) {
        this.movespeed_reduce = this.GetSpecialValueFor("movespeed_reduce")
        this.max_debuff_count = this.GetSpecialValueFor("max_debuff_count")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let iMaxCount = this.max_debuff_count
            if (hCaster.HasTalent("special_bonus_unique_viper_custom_8")) {
                iMaxCount = iMaxCount + hCaster.GetTalentValue("special_bonus_unique_viper_custom_8")
            }
            if (this.GetStackCount() < iMaxCount) {
                this.IncrementStackCount()
                this.addTimer(params.duration, () => {
                    this.DecrementStackCount()

                })
            }
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.movespeed_reduce * this.GetStackCount() // * this.GetParentPlus().GetStatusResistanceFactor()
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_viper_3_projectile// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_3_projectile extends BaseModifier_Plus {
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
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: IModifierTable) {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_viper/viper_poison_attack.vpcf", this.GetCasterPlus())
    }
}
