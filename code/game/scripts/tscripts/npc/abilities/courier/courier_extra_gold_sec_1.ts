
import { GameFunc } from "../../../GameFunc";
import { EEnum } from "../../../shared/Gen/Types";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 额外金币
@registerAbility()
export class courier_extra_gold_sec_1 extends BaseAbility_Plus {
    OnUpgrade() {
        if (this.GetLevel() > 0) {
            let hCaster = this.GetCasterPlus()
            this.StartCooldown(this.GetSpecialValueFor("interval"))
            hCaster.AddNewModifier(hCaster, this, "modifier_courier_gold_sec_1", null)
        }
    }




}



@registerModifier()
export class modifier_courier_gold_sec_1 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    interval: number;
    gold_sec_min: number;
    gold_sec_max: number;

    Init(params: ModifierTable) {
        this.interval = this.GetSpecialValueFor("interval")
        this.gold_sec_min = this.GetSpecialValueFor("gold_sec_min")
        this.gold_sec_max = this.GetSpecialValueFor("gold_sec_max")
        if (IsServer()) {
            this.addTimer(this.interval, this.CC_IntervalThink)
        }
    }

    CC_IntervalThink() {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.Destroy()
            return
        }
        // if (Rounds.IsEndlessRound()) {
        //     this.StartIntervalThink(-1)
        //     return
        // }
        let iPlayerID = hParent.GetPlayerOwnerID()
        let random = RandomInt(this.gold_sec_min, this.gold_sec_max);
        GPlayerSystem.GetInstance().GetPlayer(iPlayerID).PlayerDataComp().changeItem(EEnum.EMoneyType.Gold, random);
        // PlayerData.ModifyGold(iPlayerID, random, true)
        hAbility.StartCooldown(this.interval)
        SendOverheadEventMessage(hParent.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hParent, random, null)
        return this.interval;
    }
}