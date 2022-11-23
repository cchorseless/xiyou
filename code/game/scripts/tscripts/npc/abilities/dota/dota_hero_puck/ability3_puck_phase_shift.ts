import { GameEnum } from "../../../../shared/GameEnum";
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
export const Data_puck_phase_shift = { "ID": "5072", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilitySound": "Hero_Puck.Phase_Shift", "AbilityCastPoint": "0 0 0 0", "AbilityChannelTime": "0.75 1.50 2.25 3.25", "AbilityCooldown": "7.5 7 6.5 6", "AbilityManaCost": "0 0 0 0", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "0.75 1.50 2.25 3.25" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_puck_phase_shift extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "puck_phase_shift";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_puck_phase_shift = Data_puck_phase_shift;
    Init() {
        this.SetDefaultSpecialValue("chance", 40);
        this.SetDefaultSpecialValue("bonus_random_stat", [4, 5, 6, 7, 9]);
        this.SetDefaultSpecialValue("shard_chance_reduce", 20);

    }



    GetIntrinsicModifierName() {
        return "modifier_puck_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_puck_3 extends BaseModifier_Plus {
    chance: number;
    bonus_random_stat: number;
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
        this.chance = this.GetSpecialValueFor("chance")
        this.bonus_random_stat = this.GetSpecialValueFor("bonus_random_stat")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        let hAttacker = params.attacker as BaseNpc_Plus
        // && !Spawner.IsEndless()
        if (hAttacker == this.GetParentPlus()) {
            let chance = this.chance + hAttacker.GetTalentValue("special_bonus_unique_puck_custom_6") - (hAttacker.HasShard() && this.GetSpecialValueFor("shard_chance_reduce") || 0)
            if (GameFunc.mathUtil.PRD(chance, hAttacker, "puck_4")) {
                this.Process(hAttacker, hAttacker)
            }
        }
    }
    Process(hCaster: BaseNpc_Plus, hTarget: BaseNpc_Plus) {
        // if (Spawner.IsEndless()) {
        //     return
        // }
        let bonus_random_stat = this.bonus_random_stat + hCaster.GetTalentValue("special_bonus_unique_puck_custom_3")
        if (hCaster.HasShard()) {
            modifier_puck_3_buff.apply(hTarget, hCaster, this.GetAbilityPlus(), { stack: bonus_random_stat, type: 3 })
        } else {
            modifier_puck_3_buff.apply(hTarget, hCaster, this.GetAbilityPlus(), { stack: bonus_random_stat })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_puck_3_buff extends BaseModifier_Plus {
    private _tooltip: number;
    tData: { iStack: any; iStr: any; iAgi: any; iInt: any; };
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
    AddCustomTransmitterData() {
        return this.tData
    }
    HandleCustomTransmitterData(tData: any) {
        this.tData = tData
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.SetHasCustomTransmitterData(true)

        if (IsServer()) {
            let iStackCount = params.stack || 0
            let iType = params.type || RandomInt(0, 2)
            this.tData = {
                iStack: iStackCount,
                iStr: iType == 0 && iStackCount || 0,
                iAgi: iType == 1 && iStackCount || 0,
                iInt: iType == 2 && iStackCount || 0,
            }
            this.SetStackCount(this.tData.iStack)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            let iStackCount = params.stack || 0
            let iType = params.type || RandomInt(0, 2)
            this.tData.iStack = this.tData.iStack + iStackCount
            if (iType == 0) {
                this.tData.iStr = this.tData.iStr + iStackCount
            } else if (iType == 1) {
                this.tData.iAgi = this.tData.iAgi + iStackCount
            } else if (iType == 2) {
                this.tData.iInt = this.tData.iInt + iStackCount
            } else if (iType == 3) {
                this.tData.iStr = this.tData.iStr + iStackCount
                this.tData.iAgi = this.tData.iAgi + iStackCount
                this.tData.iInt = this.tData.iInt + iStackCount
            }
            this.SetStackCount(this.tData.iStack)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        this._tooltip = (this._tooltip || 0) % 3 + 1
        if (this._tooltip == 1) {
            return this.EOM_GetModifierBonusStats_Strength()
        } else if (this._tooltip == 2) {
            return this.EOM_GetModifierBonusStats_Agility()
        } else if (this._tooltip == 3) {
            return this.EOM_GetModifierBonusStats_Intellect()
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    EOM_GetModifierBonusStats_Strength() {
        if (this.tData) {
            return this.tData.iStr || 0
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    EOM_GetModifierBonusStats_Agility() {
        if (this.tData) {
            return this.tData.iAgi || 0
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    EOM_GetModifierBonusStats_Intellect() {
        if (this.tData) {
            return this.tData.iInt || 0
        }
    }
}
