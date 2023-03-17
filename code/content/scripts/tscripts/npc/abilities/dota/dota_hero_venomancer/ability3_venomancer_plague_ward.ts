
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_poison } from "../../../modifier/effect/modifier_generic_poison";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability1_venomancer_venomous_gale } from "./ability1_venomancer_venomous_gale";

/** dota原技能数据 */
export const Data_venomancer_plague_ward = { "ID": "5180", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySound": "Hero_Venomancer.Plague_Ward", "AbilityCastRange": "850", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "5.0", "AbilityManaCost": "20 22 24 26", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "40.0", "LinkedSpecialBonus": "special_bonus_unique_venomancer_7" }, "02": { "var_type": "FIELD_INTEGER", "ward_hp_tooltip": "120 230 340 450", "LinkedSpecialBonus": "special_bonus_unique_venomancer", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_MULTIPLY" }, "03": { "var_type": "FIELD_INTEGER", "ward_damage_tooltip": "13 22 31 40", "LinkedSpecialBonus": "special_bonus_unique_venomancer", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_MULTIPLY" }, "04": { "var_type": "FIELD_INTEGER", "ward_hp": "150 400 650 900" }, "05": { "var_type": "FIELD_INTEGER", "ward_damage": "26 44 62 80" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_venomancer_plague_ward extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "venomancer_plague_ward";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_venomancer_plague_ward = Data_venomancer_plague_ward;
    Init() {
        this.SetDefaultSpecialValue("active_poison_percent", [60, 65, 70, 80, 100]);
        this.SetDefaultSpecialValue("sting_duration", [4, 6, 8, 10, 12]);
        this.SetDefaultSpecialValue("sting_movement_slow", [-11, -13, -15, -17, -19]);
        this.SetDefaultSpecialValue("sting_poison_count", [100, 130, 180, 250, 400]);
        this.SetDefaultSpecialValue("active_poison_count", 5);
        this.SetDefaultSpecialValue("chance", 15);

    }

    Init_old() {
        this.SetDefaultSpecialValue("active_poison_percent", [40, 50, 60, 70, 80]);
        this.SetDefaultSpecialValue("sting_duration", [4, 6, 8, 10, 12]);
        this.SetDefaultSpecialValue("sting_movement_slow", -75);
        this.SetDefaultSpecialValue("sting_poison_count", [40, 60, 80, 100, 120]);
        this.SetDefaultSpecialValue("active_poison_count", [10, 9, 8, 7, 6]);

    }


    GetIntrinsicModifierName() {
        return "modifier_venomancer_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_venomancer_3 extends BaseModifier_Plus {
    sting_duration: number;
    active_poison_percent: number;
    sting_poison_count: number;
    active_poison_count: number;
    chance: number;
    count: number = 0;
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
    Init(params: IModifierTable) {
        this.sting_duration = this.GetSpecialValueFor("sting_duration")
        this.sting_poison_count = this.GetSpecialValueFor("sting_poison_count")
        this.active_poison_percent = this.GetSpecialValueFor("active_poison_percent")
        this.active_poison_count = this.GetSpecialValueFor("active_poison_count")
        this.chance = this.GetSpecialValueFor("chance")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    AttackLanded(params: ModifierAttackEvent) {
        let hAbility = this.GetAbilityPlus()
        let hParent = this.GetParentPlus()
        let hTarget = params.target as BaseNpc_Hero_Plus
        if (!GFuncEntity.IsValid(hTarget) || hTarget.GetClassname() == "dota_item_drop" || params.attacker != hParent || BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_FAKEATTACK) || !GFuncEntity.IsValid(hAbility)) {
            return
        }
        modifier_generic_poison.Poison(hTarget, hParent, hAbility, this.sting_poison_count)
        modifier_venomancer_3_attack_debuff.apply(hTarget, hParent, hAbility, { duration: this.sting_duration * hTarget.GetStatusResistanceFactor(hParent) })
        if (UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            this.count = this.count + 1
            if (this.count >= this.active_poison_count) {
                modifier_generic_poison.PoisonActive(hTarget, hParent, hAbility, this.active_poison_percent * 0.01)
                this.count = 0
            }
        }
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasShard()) {
            let hAbility1 = ability1_venomancer_venomous_gale.findIn(hCaster)
            if (GFuncEntity.IsValid(hAbility1) && hAbility1.GetLevel() > 0) {
                if (GFuncMath.PRD(this.chance, hCaster, "venomancer_shard")) {
                    let vStart = (hParent == hCaster) && hParent.GetAttachmentOrigin(hParent.ScriptLookupAttachment("attach_mouth")) || hParent.GetAttachmentOrigin(hParent.ScriptLookupAttachment("attach_attack1"))
                    hAbility1.CreateLinearProjectile(vStart, hTarget.GetAbsOrigin())
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_3_attack_debuff extends BaseModifier_Plus {
    sting_movement_slow: number;
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("venomancer_poison_sting", this.GetCasterPlus())
    }
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
        this.sting_movement_slow = this.GetSpecialValueFor("sting_movement_slow")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {

        let hCaster = this.GetCasterPlus()
        let slow = this.sting_movement_slow
        if (GFuncEntity.IsValid(hCaster)) {
            //  负数 正数
            slow = slow - this.GetCasterPlus().GetTalentValue('special_bonus_unique_venomancer_custom_2')
        }
        return slow
    }
}
