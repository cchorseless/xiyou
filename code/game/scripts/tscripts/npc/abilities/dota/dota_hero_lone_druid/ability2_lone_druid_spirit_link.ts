import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus"; import { modifier_feared } from "../../../modifier/effect/modifier_feared";
import { modifier_building } from "../../../modifier/modifier_building";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle } from "../../../modifier/modifier_particle";
;

/** dota原技能数据 */
export const Data_lone_druid_spirit_link = { "ID": "7309", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_LoneDruid.Rabid", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_2", "AbilityCastGestureSlot": "DEFAULT", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_attack_speed": "15 30 45 60", "LinkedSpecialBonus": "special_bonus_unique_lone_druid_6" }, "02": { "var_type": "FIELD_INTEGER", "lifesteal_percent": "20 35 50 65" } } };

@registerAbility()
export class ability2_lone_druid_spirit_link extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lone_druid_spirit_link";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lone_druid_spirit_link = Data_lone_druid_spirit_link;

    Init() {
        this.SetDefaultSpecialValue("bonus_attack_speed", [50, 70, 90, 110, 130, 150]);
        this.SetDefaultSpecialValue("bonus_attack_speed_limit", [40, 80, 120, 160, 200, 240]);
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lone_druid_1"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lone_druid_1 extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(1)
        }
    }


    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (hParent.HasTalent("special_bonus_unique_lone_druid_custom_4")) {
                modifier_lone_druid_1_buff.apply(hParent, hParent, hAbility, null)
            } else {
                modifier_lone_druid_1_buff.remove(hParent);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    OnSummonned(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params.unit == hParent && GameFunc.IsValid(params.target)) {
            modifier_lone_druid_1_buff.apply(params.target, hParent, hAbility, null)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lone_druid_1_buff extends BaseModifier_Plus {
    bonus_attack_speed: number;
    bonus_attack_speed_limit: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }
    Init(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")
        this.bonus_attack_speed_limit = this.GetSpecialValueFor("bonus_attack_speed_limit")
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.StartIntervalThink(-1)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)

    G_MAX_ATTACKSPEED_BONUS() {
        return this.bonus_attack_speed_limit
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.bonus_attack_speed
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.bonus_attack_speed_limit
    }
}
