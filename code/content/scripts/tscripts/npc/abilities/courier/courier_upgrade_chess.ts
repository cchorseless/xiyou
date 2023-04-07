
import { EventHelper } from "../../../helper/EventHelper";
import { EEnum } from "../../../shared/Gen/Types";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

@registerAbility()
export class courier_upgrade_population extends BaseAbility_Plus {

    GetCooldown() {
        return 0.3
    }

    GetManaCost() {
        return 0
    }

    OnAbilityPhaseStart(): boolean {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        if (playerroot.PlayerDataComp().popuLevelMax <= this.GetLevel()) {
            EventHelper.ErrorMessage("popu level max", iPlayerID);
            return false;
        }
        let r = playerroot.PlayerDataComp().isEnoughItem(EEnum.EMoneyType.Wood, this.GetWoodCost());
        if (!r) {
            EventHelper.ErrorMessage("wood not enough", iPlayerID);
        }
        return r;
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.PlayerDataComp().ModifyGold(-this.GetGoldCost());
        playerroot.PlayerDataComp().ModifyWood(-this.GetWoodCost());
        this.applyPopuLevelUp(1);
    }

    GetGoldCost(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(this.GetPopuLevel() + "").PopuGoldCost;
    }
    GetWoodCost(): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(this.GetPopuLevel() + "").PopuWoodCost;
    }


    applyPopuLevelUp(addlevel: number) {
        for (let i = 0; i < addlevel; i++) {
            this.UpgradeAbility(true);
        }
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.PlayerDataComp().applyPopuLevelUp(addlevel);
        playerroot.PlayerDataComp().SyncClient();

    }


    Init(): void {
        let Ihander = GHandler.create(this, (keys: ModifierOverrideAbilitySpecialEvent) => {
            if (keys.ability_special_value == "gold_cost") {
                return this.GetGoldCost();
            }
            else if (keys.ability_special_value == "wood_cost") {
                return this.GetWoodCost();
            }
            else if (keys.ability_special_value == "population_add") {
                return GJSONConfig.CourierAbilityLevelUpConfig.get(this.GetPopuLevel() + "").PopulationRoof;;
            }
        })
        this.RegAbilitySpecialValueOverride("gold_cost", Ihander);
        this.RegAbilitySpecialValueOverride("wood_cost", Ihander);
        this.RegAbilitySpecialValueOverride("population_add", Ihander);
    }

    GetPopuLevel() {
        return math.max(this.GetLevel(), 1);
    }
}



@registerAbility()
export class courier_upgrade_tech extends BaseAbility_Plus {

    GetCooldown() {
        return 0.3
    }

    GetManaCost() {
        return 0
    }
    OnAbilityPhaseStart(): boolean {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        if (playerroot.PlayerDataComp().techLevelMax <= this.GetLevel()) {
            EventHelper.ErrorMessage("tech level max", iPlayerID);
            return false;
        }
        return true;
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.PlayerDataComp().ModifyGold(-this.GetGoldCost());
        this.applyTechLevelUp(1);
    }

    GetGoldCost(level?: number): number {
        return GJSONConfig.CourierAbilityLevelUpConfig.get(this.GetTechLevel() + "").TechGoldcost;
    }


    applyTechLevelUp(addlevel: number) {
        for (let i = 0; i < addlevel; i++) {
            this.UpgradeAbility(true);
        }
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.PlayerDataComp().applyTechLevelUp(addlevel);
        playerroot.PlayerDataComp().SyncClient();
    }
    Init(): void {
        let Ihander = GHandler.create(this, (keys: ModifierOverrideAbilitySpecialEvent) => {
            if (keys.ability_special_value == "gold_cost") {
                return this.GetGoldCost();
            } else if (keys.ability_special_value == "good_add_interval") {
                return GJSONConfig.CourierAbilityLevelUpConfig.get(this.GetTechLevel() + "").TechExtraGood;
            } else if (keys.ability_special_value == "wood_add_interval") {
                return GJSONConfig.CourierAbilityLevelUpConfig.get(this.GetTechLevel() + "").TechExtraWood;
            }
        })
        this.RegAbilitySpecialValueOverride("gold_cost", Ihander);
        this.RegAbilitySpecialValueOverride("good_add_interval", Ihander);
        this.RegAbilitySpecialValueOverride("wood_add_interval", Ihander);


    }

    GetTechLevel() {
        return math.max(this.GetLevel(), 1);
    }


}




