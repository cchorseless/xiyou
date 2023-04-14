import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

@registerAbility()
export class courier_auto_gold extends BaseAbility_Plus {
    GetBehavior() {
        let hCaster = this.GetCasterPlus();
        let iCount = modifier_builder_gold.GetStackIn(hCaster);
        if (iCount == 1) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
        }
    }

    GetCooldown(level: number): number {
        return 20
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerOwnerID()
        let iGold = this.GetMaxGold();
        iGold = RandomInt(1, iGold);
        let iWood = this.GetMaxWood();
        iWood = RandomInt(1, iWood);
        if (modifier_builder_gold_crit.findIn(hCaster)) {
            iGold = iGold * RandomInt(this.GetSpecialValueFor("crit_min"), this.GetSpecialValueFor("crit_max")) * 0.01
            iWood = iWood * RandomInt(this.GetSpecialValueFor("crit_min"), this.GetSpecialValueFor("crit_max")) * 0.01
        }
        GGameScene.GetPlayer(iPlayerID).PlayerDataComp().ModifyGold(iGold);
        GGameScene.GetPlayer(iPlayerID).PlayerDataComp().ModifyWood(iWood);
    }
    GetIntrinsicModifierName() {
        return "modifier_builder_gold";
    }

    GetMaxGold(isoverride = true) {
        let iRound = GRoundSystem.GetInstance().GetCurrentRoundIndex();
        let basic_gold = this.GetSpecialValueFor("gold_max");
        if (!isoverride) {
            basic_gold = this.GetLevelSpecialValueNoOverride("gold_max", this.GetLevel());
        }
        let gold_inc_round = this.GetSpecialValueFor("gold_inc_round");
        return basic_gold + gold_inc_round * iRound;
    }

    GetMaxWood(isoverride = true) {
        let iRound = GRoundSystem.GetInstance().GetCurrentRoundIndex();
        let basic_wood = this.GetSpecialValueFor("wood_max");
        if (!isoverride) {
            basic_wood = this.GetLevelSpecialValueNoOverride("wood_max", this.GetLevel());
        }
        let wood_inc_round = this.GetSpecialValueFor("wood_inc_round");
        return basic_wood + wood_inc_round * iRound;
    }

    Init(): void {
        let Ihander = GHandler.create(this, (keys: ModifierOverrideAbilitySpecialEvent) => {
            let hParent = this.GetCasterPlus();
            let data = NetTablesHelper.GetDotaEntityData(hParent.GetEntityIndex(), "modifier_builder_gold") || {};
            if (keys.ability_special_value == "gold_max") {
                return data.gold_max;
            }
            else if (keys.ability_special_value == "wood_max") {
                return data.wood_max;
            }
        })
        this.RegAbilitySpecialValueOverride("gold_max", Ihander);
        this.RegAbilitySpecialValueOverride("wood_max", Ihander);
    }
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
    BeCreated(params: IModifierTable) {
        if (IsServer()) {
            this.StartIntervalThink(1)
            this.SetStackCount(0)
        }
    }

    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        if (IsValid(hParent)) {
            NetTablesHelper.SetDotaEntityData(hParent.GetEntityIndex(), {
                gold_max: this.GetAbilityPlus<courier_auto_gold>().GetMaxGold(false),
                wood_max: this.GetAbilityPlus<courier_auto_gold>().GetMaxWood(false),
            }, "modifier_builder_gold")
            let MemberShip = GTActivityMemberShipData.GetOneInstance(hParent.GetPlayerOwnerID());
            if (MemberShip && MemberShip.IsVip()) {
                this.SetStackCount(1)
                let hAbility = this.GetAbilityPlus()
                if (IsValid(hAbility) && hAbility.IsCooldownReady()) {
                    if (hAbility.GetAutoCastState()) {
                        hAbility.OnSpellStart()
                        hAbility.UseResources(false, false, true)
                        // Notification.Combat({
                        //     message: "Notification_Plus_Auto_Gold.length",
                        //     player_id: hParent.GetPlayerOwnerID(),
                        // })
                    }
                }
            }
        }
    }

    SetAbilityAutoCast() {
        if (IsServer()) {
            this.SetStackCount(1);
            let hAbility = this.GetAbilityPlus();
            if (IsValid(hAbility)) {
                hAbility.ToggleAutoCast();
            }
        }
    }
}


@registerModifier()
export class modifier_builder_gold_crit extends BaseModifier_Plus {

    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }

}