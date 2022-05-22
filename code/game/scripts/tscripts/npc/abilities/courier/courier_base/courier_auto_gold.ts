import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { RoundSystem } from "../../../../rules/System/Round/RoundSystem";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

// 高级抽卡
@registerAbility()
export class courier_auto_gold extends BaseAbility_Plus {
    // GetBehavior() {
    //     let hCaster = this.GetOwnerPlus();
    //     let iCount = modifier_builder_gold.GetStackIn(hCaster);
    //     if (iCount == 1) {
    //         return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
    //     } else {
    //         return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
    //     }
    // }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let basic_gold = this.GetSpecialValueFor("basic_gold");
        let gold_inc_round = this.GetSpecialValueFor("gold_inc_round");

        // let iRound = Rounds.GetCurrentRound()
        // let iPlayerID = hCaster.GetPlayerOwnerID()
        let iGold = 100;
        // let iGold = basic_gold + gold_inc_round * iRound
        // if ( Rounds.IsEndlessRound() ) {
        //     return
        // }
        // if ( PlayerProperty.GetProperty(iPlayerID, PLAYER_PROPERTY_GOLD_ABILITY_CRIT) > 0 ) {
        //     iGold = iGold * RandomInt(this.GetSpecialValueFor("crit_min"), this.GetSpecialValueFor("crit_max")) * 0.01
        // }
        // PlayerData.ModifyGold(iPlayerID, iGold, true)
        // SendOverheadEventMessage(hCaster.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hCaster, iGold, null);
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_builder_gold";
    // }
    // OnUpgrade() {
    //     if (this.GetLevel() == 1) {
    //         this.ToggleAutoCast();
    //     }
    // }
}

@registerModifier()
export class modifier_builder_gold extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    OnCreated(params: ModifierTable) {
        if (IsServer()) {
            // this.StartIntervalThink(1)
            // this.SetStackCount(0)
        }
    }
    OnRefresh(params: ModifierTable) {
        if (IsServer()) {
        }
    }
    OnIntervalThink() {
        // let hParent = this.GetParentPlus()
        // if ( GameFunc.IsValid(hParent) ) {
        // 	if ( PlayerProperty.HasPlus(hParent.GetPlayerOwnerID()) ) {
        // 		this.SetStackCount(1)
        // 		let hAbility = this.GetAbilityPlus()
        // 		if ( GameFunc.IsValid(hAbility) && hAbility.IsCooldownReady() ) {
        // 			if ( hAbility.GetAutoCastState() ) {
        // 				hAbility.OnSpellStart()
        // 				hAbility.UseResources(false, false, true)
        // 				Notification.Combat({
        // 					message : "Notification_Plus_Auto_Gold.length",
        // 					player_id : hParent.GetPlayerOwnerID(),
        // 				})
        // 			}
        // 		}
        // 	}
        // }
    }
}
