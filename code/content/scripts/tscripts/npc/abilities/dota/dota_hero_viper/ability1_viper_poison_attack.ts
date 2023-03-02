
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_viper_poison_attack = { "ID": "5218", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "hero_viper.poisonAttack.Cast", "HasShardUpgrade": "1", "AbilityCastRange": "600 640 680 720", "AbilityCastPoint": "0", "AbilityCooldown": "0.0", "AbilityDamage": "0 0 0 0", "AbilityManaCost": "20 22 24 26", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "4" }, "02": { "var_type": "FIELD_FLOAT", "damage": "4 8 12 16" }, "03": { "var_type": "FIELD_INTEGER", "movement_speed": "6 8 10 12" }, "04": { "var_type": "FIELD_INTEGER", "magic_resistance": "3 5 7 9" }, "05": { "var_type": "FIELD_INTEGER", "max_stacks": "5" }, "06": { "var_type": "FIELD_INTEGER", "bonus_range": "25 65 105 145" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_viper_poison_attack extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "viper_poison_attack";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_viper_poison_attack = Data_viper_poison_attack;
    Init() {
        this.SetDefaultSpecialValue("poison_count", [50, 100, 150, 200, 250, 300]);
        this.SetDefaultSpecialValue("poison_count_agility", 2);
        this.SetDefaultSpecialValue("movespeed_reduce", [6, 8, 10, 12, 14, 16]);
        this.SetDefaultSpecialValue("magical_armor_reduce", [-3, -5, -7, -9, -11, -13]);
        this.SetDefaultSpecialValue("max_debuff_count", 3);
        this.SetDefaultSpecialValue("duration", 4);

    }

    Init_old() {
        this.SetDefaultSpecialValue("poison_count", [50, 100, 150, 200, 250, 300]);
        this.SetDefaultSpecialValue("poison_count_agility", 2);
        this.SetDefaultSpecialValue("movespeed_reduce", [6, 8, 10, 12, 14, 16]);
        this.SetDefaultSpecialValue("magical_armor_reduce", [3, 5, 7, 9, 11, 13]);
        this.SetDefaultSpecialValue("max_debuff_count", 3);
        this.SetDefaultSpecialValue("duration", 4);

    }

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return math.max(this.GetCasterPlus().Script_GetAttackRange(), super.GetCastRange(vLocation, hTarget))
    }
    GetIntrinsicModifierName() {
        return "modifier_viper_1"
    }

}

// // // // // // // // // // // // // // // // // // // -modifier_viper_1// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_1 extends BaseModifier_Plus {
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
    poison_count: number;
    poison_count_agility: number;
    duration: number;
    records: Array<any>;
    Init(params: IModifierTable) {
        this.poison_count = this.GetSpecialValueFor("poison_count")
        this.poison_count_agility = this.GetSpecialValueFor("poison_count_agility")
        this.duration = this.GetSpecialValueFor("duration")
        if (IsServer()) {
            this.records = []
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    AttackStart(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = params.attacker
        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hTarget) ||
            hTarget.GetClassname() == "dota_item_drop" ||
            hParent != this.GetParentPlus() ||
            hParent.IsIllusion() ||
            hAbility.CastFilterResult() != UnitFilterResult.UF_SUCCESS ||
            hParent.IsSilenced() ||
            !hAbility.IsCooldownReady() ||
            !hAbility.IsOwnersManaEnough() ||
            (hParent.GetCurrentActiveAbility() != hAbility && !hAbility.GetAutoCastState())) {
            return
        }

        modifier_viper_1_projectile.apply(hParent, hParent, hAbility, null)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    AttackRecord(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = params.attacker
        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hTarget) || hTarget.GetClassname() == "dota_item_drop" || hParent != this.GetParentPlus() || hParent.IsIllusion()) {
            return
        }
        modifier_viper_1_projectile.remove(hParent);
        if (BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) ||
            hAbility.CastFilterResult() != UnitFilterResult.UF_SUCCESS ||
            hParent.IsSilenced() ||
            !hAbility.IsCooldownReady() ||
            !hAbility.IsOwnersManaEnough() ||
            (hParent.GetCurrentActiveAbility() != hAbility && !hAbility.GetAutoCastState())) {
            return
        }
        table.insert(this.records, params.record)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    Attack(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = params.attacker
        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hTarget) || hParent != this.GetParentPlus() || this.records.indexOf(params.record) == -1) {
            return
        }
        hParent.EmitSound(ResHelper.GetSoundReplacement("hero_viper.poisonAttack.Cast", hParent))
        hAbility.UseResources(true, true, true)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    AttackLanded(params: ModifierAttackEvent) {
        let hTarget = params.target as IBaseNpc_Plus
        let hParent = params.attacker as BaseNpc_Hero_Plus
        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hTarget) || hParent != this.GetParentPlus() || this.records.indexOf(params.record) == -1) {
            return
        }
        let iCount = this.poison_count
        if (hParent.GetAgility) {
            let n = this.poison_count_agility
            if (hParent.HasTalent("special_bonus_unique_viper_custom_6")) {
                n = n + hParent.GetTalentValue("special_bonus_unique_viper_custom_6")
            }
            iCount = iCount + hParent.GetAgility() * n
        }
        modifier_poison.Poison(hTarget, hParent, hAbility, iCount)
        modifier_viper_1_debuff.apply(hTarget, hParent, hAbility, { duration: this.duration * hTarget.GetStatusResistanceFactor(hParent) })
    }
    AttackRecordDestroy(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = params.attacker
        let hAbility = this.GetAbilityPlus()
        let index = this.records.indexOf(params.record)
        if (!GFuncEntity.IsValid(hTarget) || hParent != this.GetParentPlus() || index == -1) {
            return
        }
        this.records.splice(index, 1)
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_viper_1_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_1_debuff extends BaseModifier_Plus {
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
    movespeed_reduce: number;
    magical_armor_reduce: number;
    max_debuff_count: number;
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.movespeed_reduce = this.GetSpecialValueFor("movespeed_reduce")
        this.magical_armor_reduce = this.GetSpecialValueFor("magical_armor_reduce")
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


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    GetMagicalArmorBonus() {
        return this.magical_armor_reduce * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.movespeed_reduce * this.GetStackCount() // * this.GetParentPlus().GetStatusResistanceFactor()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.magical_armor_reduce * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_viper_1_projectile// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_1_projectile extends BaseModifier_Plus {
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
