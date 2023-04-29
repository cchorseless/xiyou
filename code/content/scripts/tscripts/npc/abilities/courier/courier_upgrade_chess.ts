
import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
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
            GNotificationSystem.ErrorMessage("popu level max", iPlayerID);
            return false;
        }
        let r = playerroot.PlayerDataComp().isEnoughItem(EEnum.EMoneyType.Wood, this.GetWoodCost());
        if (!r) {
            GNotificationSystem.ErrorMessage("wood not enough", iPlayerID);
        }
        return r;
    }

    GetAbilityJinDuMax(ilevel?: number): number {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        if (playerroot) {
            return playerroot.PlayerDataComp().popuLevelMax;
        }
        else {
            return super.GetAbilityJinDuMax(ilevel);
        }
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        playerroot.PlayerDataComp().ModifyGold(-this.GetGoldCost());
        playerroot.PlayerDataComp().ModifyWood(-this.GetWoodCost());
        this.applyPopuLevelUp(1);
        ResHelper.CreateParticle(new ResHelper.ParticleInfo()
            .set_resPath("particles/units/heroes/hero_oracle/oracle_false_promise_cast_enemy.vpcf")
            .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
            .set_owner(hCaster)
            .set_validtime(3)
        )
        EmitSoundOn("lvl_up", hCaster)
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

    GetAbilityJinDuInfo(ilevel?: number): string {
        return `${0},${this.GetAbilityJinDuMax()},${this.GetPopuLevel()}`
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
            GNotificationSystem.ErrorMessage("tech level max", iPlayerID);
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
        ResHelper.CreateParticle(new ResHelper.ParticleInfo()
            .set_resPath("particles/units/heroes/hero_oracle/oracle_false_promise_cast_enemy.vpcf")
            .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
            .set_owner(hCaster)
            .set_validtime(3)
        );
        EmitSoundOn("lvl_up", hCaster)
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
        this.addOneRandomEquip();
    }

    addOneRandomEquip() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        let poolgroupconfig: number;
        if (this.GetTechLevel() <= 10) {
            poolgroupconfig = this.GetSpecialValueFor("poolgroupconfig_1");
        }
        else if (this.GetTechLevel() <= 15) {
            poolgroupconfig = this.GetSpecialValueFor("poolgroupconfig_2");
        }
        else {
            poolgroupconfig = this.GetSpecialValueFor("poolgroupconfig_3");
        }
        let itemname = KVHelper.RandomPoolGroupConfig(poolgroupconfig + "");
        if (itemname) {
            let hero = playerroot.Hero;
            let itemEntity = hero.AddItemOrInGround(itemname);
            if (IsValid(itemEntity)) {
                let npcroot = hero.ETRoot as IBattleUnitEntityRoot;
                if (npcroot.InventoryComp()) {
                    GItemEntityRoot.Active(itemEntity);
                    let itemroot = itemEntity.ETRoot as IItemEntityRoot;
                    npcroot.InventoryComp().putInItem(itemroot);
                }
            }
        }
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
    GetAbilityJinDuMax(ilevel?: number): number {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerID();
        let playerroot = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        if (playerroot) {
            return playerroot.PlayerDataComp().techLevelMax;
        }
        else {
            return super.GetAbilityJinDuMax(ilevel);
        }
    }
    GetTechLevel() {
        return math.max(this.GetLevel(), 1);
    }

    GetAbilityJinDuInfo(ilevel?: number): string {
        return `${0},${this.GetAbilityJinDuMax()},${this.GetTechLevel()}`
    }
}




