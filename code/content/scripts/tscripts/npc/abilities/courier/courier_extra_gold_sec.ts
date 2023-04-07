
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 额外金币
@registerAbility()
export class courier_extra_gold_sec_1 extends BaseAbility_Plus {
    // OnUpgrade() {
    //     if (this.GetLevel() > 0) {
    //         let hCaster = this.GetCasterPlus()
    //         hCaster.AddNewModifier(hCaster, this, "modifier_courier_gold_sec_1", null)
    //     }
    // }
    GetIntrinsicModifierName() {
        return modifier_courier_gold_sec_1.name;
    }

    GetCooldown(level: number): number {
        return this.GetSpecialValueFor("interval");
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
    gold_interval: number;

    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        if (hParent.GetTeamNumber() != DOTATeam_t.DOTA_TEAM_GOODGUYS) { return }
        this.interval = this.GetSpecialValueFor("interval")
        this.gold_interval = this.GetSpecialValueFor("gold_interval")
        if (IsServer() && params.IsOnCreated) {
            this.CC_IntervalThink();
            GTimerHelper.AddTimer(this.interval, GHandler.create(this, () => this.CC_IntervalThink()));
        }
    }

    CC_IntervalThink() {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hAbility)) {
            this.Destroy()
            return
        }
        // if (Rounds.IsEndlessRound()) {
        //     this.StartIntervalThink(-1)
        //     return
        // }
        let iPlayerID = hParent.GetPlayerID()
        GPlayerEntityRoot.GetOneInstance(iPlayerID).PlayerDataComp().ModifyGold(this.gold_interval);
        // PlayerData.ModifyGold(iPlayerID, random, true)
        hAbility.StartCooldown(this.interval)
        return this.interval;
    }
}


@registerAbility()
export class courier_extra_gold_sec_2 extends courier_extra_gold_sec_1 {
    GetIntrinsicModifierName() {
        return modifier_courier_gold_sec_2.name;
    }
}

@registerModifier()
export class modifier_courier_gold_sec_2 extends modifier_courier_gold_sec_1 {
}

@registerAbility()
export class courier_extra_gold_sec_3 extends courier_extra_gold_sec_1 {
    GetIntrinsicModifierName() {
        return modifier_courier_gold_sec_3.name;
    }
}

@registerModifier()
export class modifier_courier_gold_sec_3 extends modifier_courier_gold_sec_1 {
}