import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_spectre_desolate = { "ID": "5335", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySound": "Hero_Spectre.Desolate", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_damage": "18 32 46 60", "LinkedSpecialBonus": "special_bonus_unique_spectre_2" }, "02": { "var_type": "FIELD_INTEGER", "radius": "425" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_spectre_desolate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spectre_desolate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spectre_desolate = Data_spectre_desolate;
    Init() {
        this.SetDefaultSpecialValue("agi_factor", [1, 1.2, 1.5, 2, 2.5, 3]);
        this.SetDefaultSpecialValue("move_speed_percent", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("duration", 3);
        this.SetDefaultSpecialValue("duration_stack", 3);
        this.SetDefaultSpecialValue("attack_count", 1);
        this.SetDefaultSpecialValue("shard_extra_count", 1);

    }

    Init_old() {
        this.SetDefaultSpecialValue("lose_health_percent", 10);
        this.SetDefaultSpecialValue("agi_factor", [0.5, 1, 1.5, 2, 2.5, 3]);
        this.SetDefaultSpecialValue("move_speed_percent", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("duration", 3);

    }



    GetIntrinsicModifierName() {
        return "modifier_spectre_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_spectre_2 extends BaseModifier_Plus {
    agi_factor: number;
    radius: number;
    duration_stack: number;
    duration: number;
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
        this.agi_factor = this.GetSpecialValueFor("agi_factor")
        this.radius = this.GetSpecialValueFor("radius")
        this.duration = this.GetSpecialValueFor("duration")
        this.duration_stack = this.GetSpecialValueFor("duration_stack")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (!GameFunc.IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        // 攻击者是幽鬼或者幻象
        let hParent = this.GetParentPlus()
        if (hParent.IsIllusion() && !hParent.HasScepter()) {
            return
        }
        let attacker = params.attacker as BaseNpc_Plus
        if (params.attacker == hParent && hParent.GetAgility != null) {
            let hModifier = modifier_spectre_2_debuff.apply(params.target, attacker.GetSource(), this.GetAbilityPlus(), { duration: this.duration })
            if (GameFunc.IsValid(hModifier)) {
                let iStack = hModifier.GetStackCount()
                let fDamage = math.floor(iStack * hParent.GetAgility() * (this.agi_factor + hParent.GetTalentValue("special_bonus_unique_spectre_custom_8")))
                let damage_table = {
                    ability: this.GetAbilityPlus(),
                    attacker: params.attacker,
                    victim: params.target,
                    damage: fDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_spectre_2_debuff extends BaseModifier_Plus {
    move_speed_percent: number;
    attack_count: number;
    shard_extra_count: number;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.move_speed_percent = this.GetSpecialValueFor("move_speed_percent") + (GameFunc.IsValid(hCaster) && hCaster.GetTalentValue("special_bonus_unique_spectre_custom_2") || 0)
        this.attack_count = this.GetSpecialValueFor("attack_count")
        this.shard_extra_count = this.GetSpecialValueFor("shard_extra_count")
        if (IsServer()) {
            let iCount = hCaster.HasShard() && this.attack_count + this.shard_extra_count || this.attack_count
            this.changeStackCount(iCount)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-iCount)
            })
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.move_speed_percent * this.GetStackCount()
    }
}
