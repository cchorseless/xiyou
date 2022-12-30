import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_medusa_mana_shield = { "ID": "5506", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_Medusa.ManaShield.On", "AbilityCastPoint": "0.4 0.4 0.4 0.4", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "damage_per_mana": "1.6 1.9 2.2 2.5" }, "02": { "var_type": "FIELD_FLOAT", "absorption_pct": "70" }, "03": { "var_type": "FIELD_INTEGER", "bonus_mana": "100 150 200 250" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_medusa_mana_shield extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "medusa_mana_shield";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_medusa_mana_shield = Data_medusa_mana_shield;
    Init() {
        this.SetDefaultSpecialValue("mana_cost", 1);
        this.SetDefaultSpecialValue("mana_damage", [10, 15, 20, 25, 30, 35]);
        this.SetDefaultSpecialValue("triple_mana_damage", 3);

    }

    GetManaCost() {
        let hCaster = this.GetCasterPlus()
        let percent = this.GetSpecialValueFor("mana_cost")
        if (hCaster.HasTalent("special_bonus_unique_medusa_custom_5")) {
            percent = percent + hCaster.GetTalentValue("special_bonus_unique_medusa_custom_5")
        }
        return hCaster.GetMaxMana() * percent / 100
    }
    GetIntrinsicModifierName() {
        return "modifier_medusa_6"
    }

}
// ==========================================Modifiers==========================================
// // // // // // // // // // // // // // // // // // // -modifier_medusa_6// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_medusa_6 extends BaseModifier_Plus {
    records: any[];
    mana_damage: number;
    triple_mana_damage: number;
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
    Init(params: ModifierTable) {
        this.mana_damage = this.GetSpecialValueFor("mana_damage")
        this.triple_mana_damage = this.GetSpecialValueFor("triple_mana_damage")
        if (params.IsOnCreated && IsServer()) {
            this.records = []
        }
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        let hTarget = params.target
        let hAbility = this.GetAbilityPlus()
        if (hTarget == null || hTarget.GetClassname() == "dota_item_drop" || params.attacker != hParent || hParent.IsIllusion() || (hParent.GetCurrentActiveAbility() != hAbility && !hAbility.GetAutoCastState()) || hParent.IsSilenced() || !hAbility.IsOwnersManaEnough() || !(hAbility.CastFilterResult() == UnitFilterResult.UF_SUCCESS)) {
            return
        }
        modifier_medusa_6_projectile.apply(hParent, hParent, this.GetAbilityPlus(), null)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        let hTarget = params.target
        let hAbility = this.GetAbilityPlus()
        if (hTarget == null || hTarget.GetClassname() == "dota_item_drop" || params.attacker != hParent || hParent.IsIllusion()) {
            return
        }

        modifier_medusa_6_projectile.remove(hParent);

        if ((hParent.GetCurrentActiveAbility() != hAbility && !hAbility.GetAutoCastState()) || hParent.IsSilenced() || !hAbility.IsOwnersManaEnough() || !(hAbility.CastFilterResult() == UnitFilterResult.UF_SUCCESS) || BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            return
        }
        this.records[params.record] = hAbility.GetManaCost(-1)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || this.records[params.record] == null) {
            return
        }
        this.GetAbilityPlus().UseResources(true, true, true)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || this.records[params.record] == null) {
            return
        }
        BattleHelper.GoApplyDamage(
            {
                ability: this.GetAbilityPlus(),
                attacker: this.GetParentPlus(),
                victim: params.target,
                damage: (this.GetCasterPlus().HasShard() && this.triple_mana_damage * this.mana_damage || this.mana_damage) * this.records[params.record],
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            }
        )
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || this.records[params.record] == null) {
            return
        }
        //  table.remove(this.records, params.record)
        //  不能用table.remove因为他会往前移动index
        this.records[params.record] = null
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_medusa_6_projectile// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_medusa_6_projectile extends BaseModifier_Plus {
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: ModifierTable) {
        return ResHelper.GetParticleReplacement("particles/particle_sr/medusa/medusa_3.vpcf", this.GetCasterPlus())
    }

}
