import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
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
        let iRound = GRoundSystem.GetInstance().GetCurrentRoundIndex();
        let iPlayerID = hCaster.GetPlayerOwnerID()
        let basic_gold = this.GetSpecialValueFor("gold_max");
        let gold_inc_round = this.GetSpecialValueFor("gold_inc_round");
        let iGold = basic_gold + gold_inc_round * iRound;
        iGold = RandomInt(1, iGold);
        let basic_wood = this.GetSpecialValueFor("wood_max");
        let wood_inc_round = this.GetSpecialValueFor("wood_inc_round");
        let iWood = basic_wood + wood_inc_round * iRound;
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
        if (GFuncEntity.IsValid(hParent)) {
            let MemberShip = GTActivityMemberShipData.GetOneInstance(hParent.GetPlayerOwnerID());
            if (MemberShip && MemberShip.IsVip()) {
                this.SetStackCount(1)
                let hAbility = this.GetAbilityPlus()
                if (GFuncEntity.IsValid(hAbility) && hAbility.IsCooldownReady()) {
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
            if (GFuncEntity.IsValid(hAbility)) {
                hAbility.ToggleAutoCast();
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_TOOLTIP(keys: any): void {
        GLogHelper.print(keys, 1111)
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