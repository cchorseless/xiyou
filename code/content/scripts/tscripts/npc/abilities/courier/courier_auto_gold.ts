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
        return 30
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerOwnerID()
        let iGold = this.GetBaseGold();
        let iWood = this.GetBaseWood();
        // if (modifier_builder_gold_crit.findIn(hCaster)) {
        let crit_min = this.GetSpecialValueFor("crit_min");
        let crit_max = this.GetSpecialValueFor("crit_max");
        let iRandom = RandomInt(crit_min, crit_max);
        iGold = iGold * iRandom * 0.01;
        iWood = iWood * iRandom * 0.01;
        // }
        GGameScene.GetPlayer(iPlayerID).PlayerDataComp().ModifyGold(math.floor(iGold));
        GGameScene.GetPlayer(iPlayerID).PlayerDataComp().ModifyWood(math.floor(iWood));
    }
    GetIntrinsicModifierName() {
        return "modifier_builder_gold";
    }

    GetBaseGold() {
        let level = math.max(this.GetLevel(), 1);
        return GJSONConfig.CourierAbilityLevelUpConfig.get(level + "").AutoGoldGetGold;
    }

    GetBaseWood(isoverride = true) {
        let level = math.max(this.GetLevel(), 1);
        return GJSONConfig.CourierAbilityLevelUpConfig.get(level + "").AutoGoldGetWood;
    }

    Init(): void {
        let Ihander = GHandler.create(this, (keys: ModifierOverrideAbilitySpecialEvent) => {
            if (keys.ability_special_value == "gold_base") {
                return this.GetBaseGold();
            }
            else if (keys.ability_special_value == "wood_base") {
                return this.GetBaseWood();
            }
        })
        this.RegAbilitySpecialValueOverride("gold_base", Ihander);
        this.RegAbilitySpecialValueOverride("wood_base", Ihander);
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
            let tCharacter = GTCharacter.GetOneInstance(hParent.GetPlayerOwnerID());
            if (tCharacter && tCharacter.IsVip()) {
                this.SetStackCount(1)
                let hAbility = this.GetAbilityPlus()
                if (IsValid(hAbility) && hAbility.IsCooldownReady()) {
                    if (hAbility.GetAutoCastState()) {
                        hAbility.OnSpellStart()
                        hAbility.UseResources(false, false, false, true)
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