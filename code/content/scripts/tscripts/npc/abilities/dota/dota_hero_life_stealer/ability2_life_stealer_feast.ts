import { BattleHelper } from "../../../../helper/BattleHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_life_stealer_feast = { "ID": "5250", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "hp_leech_percent": "1.6 2.2 2.8 3.4", "LinkedSpecialBonus": "special_bonus_unique_lifestealer_3" }, "02": { "var_type": "FIELD_FLOAT", "hp_damage_percent": "0.6 0.8 1 1.2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_life_stealer_feast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "life_stealer_feast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_life_stealer_feast = Data_life_stealer_feast;
    Init() {
        this.SetDefaultSpecialValue("max_health_bonus_damage_pct", [5, 6, 7, 8, 9]);

    }


    InheritAbility(hTarget: IBaseNpc_Plus, InheritPct: number) {
        let hCaster = this.GetCasterPlus()
        modifier_life_stealer_2.apply(hTarget, hCaster, this, { InheritPct: InheritPct })
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_life_stealer_2"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_2 extends BaseModifier_Plus {
    max_health_bonus_damage_pct: number;
    InheritPct: any;
    IsHidden() {
        return this.GetStackCount() == 100
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
        return "life_stealer_feast"
    }
    Init(params: IModifierTable) {
        this.max_health_bonus_damage_pct = this.GetSpecialValueFor("max_health_bonus_damage_pct")
        if (IsServer()) {
            // 非继承技能字段值时100%
            this.InheritPct = params.InheritPct || 100
            this.SetStackCount(this.InheritPct)
        }
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: IModifierTable) {
        if (!IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params.attacker == hParent && !params.attacker.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            let fMaxHealth = params.attacker.GetMaxHealth()
            let fDamage = fMaxHealth * this.max_health_bonus_damage_pct * 0.01 * this.InheritPct * 0.01
            if (hCaster.HasTalent("special_bonus_unique_life_stealer_custom_8")) {
                modifier_life_stealer_2_attack_buff.apply(hParent, hParent, hAbility, { fDamage: fDamage })
                BattleHelper.Attack(hParent, params.target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)
                modifier_life_stealer_2_attack_buff.remove(hParent);
            } else {
                let damage_table =
                {
                    ability: hAbility,
                    attacker: hParent,
                    victim: params.target,
                    damage: fDamage,
                    extra_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_NO_SPELL_CRIT,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_2_attack_buff extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.SetStackCount(params.fDamage || 0)
        }
    }
    BeRefresh(params: IModifierTable) {

        if (IsServer()) {
            this.SetStackCount(params.fDamage || 0)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.GetStackCount()
    }
}
