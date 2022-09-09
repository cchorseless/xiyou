import { GameEnum } from "../../../GameEnum";
import { EntityHelper } from "../../../helper/EntityHelper";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_no_health_bar } from "../../../npc/modifier/modifier_no_health_bar";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { BuildingState } from "../../System/Building/BuildingState";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { RoundBuildingComponent } from "../Round/RoundBuildingComponent";
import { WearableComponent } from "../Wearable/WearableComponent";
import { BuildingComponent } from "./BuildingComponent";
import { BuildingEntityRoot } from "./BuildingEntityRoot";

/**塔防组件 */
@registerET()
export class BuildingManagerComponent extends ET.Component {
    /**是否建造过一个建筑 */
    bHasBuild: boolean = false;
    tGlobalBuffs: BuildingConfig.IBuffInfo[] = [];
    onAwake() { }

    /**
     * 放置建築
     * @param hero
     * @param name
     * @param location
     * @param angle
     */
    public placeBuilding(towerID: string, location: Vector, angle: number = BuildingConfig.BUILDING_ANGLE) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let playerID = domain.GetPlayerOwnerID();
        if (!domain.IsAlive()) return;
        // 相同的塔
        let bHasCount = this.getBuildingCount(towerID);
        if (bHasCount >= BuildingConfig.MAX_SAME_TOWER) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_has_same_tower, playerID);
            return;
        }
        //  人口判断
        let iPopulationAdd = GameRules.Addon.ETRoot.BuildingSystem().GetBuildingPopulation(towerID);
        let PlayerDataComp = domain.ETRoot.AsPlayer().PlayerDataComp();
        let freePopulation = PlayerDataComp.getFreePopulation();
        if (iPopulationAdd > freePopulation) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_population_limit);
            return;
        }
        let building = EntityHelper.CreateEntityByName(towerID, location, domain.GetTeamNumber(), false, domain, domain) as BaseNpc_Plus;
        if (!building) {
            return;
        }
        ResHelper.CreateParticle(
            new ResHelper.ParticleInfo()
                .set_resPath("particles/econ/items/antimage/antimage_ti7/antimage_blink_start_ti7_ribbon_bright.vpcf")
                .set_owner(building)
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_validtime(5)
        );
        BuildingEntityRoot.Active(building);
        building.SetTeam(DOTATeam_t.DOTA_TEAM_GOODGUYS);
        let buildingroot = building.ETRoot.As<BuildingEntityRoot>();
        buildingroot.SetConfigId(playerID, towerID);
        domain.ETRoot.AddDomainChild(buildingroot);
        buildingroot.AddComponent(BuildingComponent, location, angle);
        if (buildingroot.GetDotaHeroName()) {
            buildingroot.AddComponent(WearableComponent, buildingroot.GetDotaHeroName());
        }
        buildingroot.AddComponent(AbilityManagerComponent);
        buildingroot.AddComponent(ChessComponent);
        buildingroot.AddComponent(RoundBuildingComponent);
        buildingroot.updateNetTable();
        /**互相绑定 */
        building.SetControllableByPlayer(playerID, true);
        building.addSpawnedHandler(
            ET.Handler.create(this, () => {
                modifier_no_health_bar.applyOnly(building, building);
                // modifier_building.apply(this.createUnit, domain)
            })
        );
        // 全场buff
        // if (this.tGlobalBuffs.length > 0) {
        //     for (let info of this.tGlobalBuffs) {
        //         let cls = PrecacheHelper.GetRegClass<typeof BaseModifier_Plus>(info.sBuffName);
        //         cls.apply(domain, domain, info.hAbility, info.tParams);
        //     }
        // }
        // 改变人口
        if (buildingroot.ChessComp().isInBattle()) {
            PlayerDataComp.changePopulation(iPopulationAdd);
            PlayerDataComp.updateNetTable();
        }
        this.bHasBuild = true;
        return building;
    }

    /**
     *
     * @param playerID
     * @param target
     * @param fGoldReturn 金币返还比例
     * @returns
     */
    public sellBuilding(target: BuildingEntityRoot, fGoldReturn = 0.5) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        if (target.DomainParent && target.DomainParent != domain.ETRoot) {
            return;
        }
        let building = target.BuildingComp();
        if (building == null) {
            return;
        }
        let PlayerDataComp = domain.ETRoot.AsPlayer().PlayerDataComp();
        let iPopulationAdd = GameRules.Addon.ETRoot.BuildingSystem().GetBuildingPopulation(target.ConfigID);
        // 改变人口
        if (target.ChessComp().isInBattle()) {
            PlayerDataComp.changePopulation(-iPopulationAdd);
            PlayerDataComp.updateNetTable();
        }
        let iGoldCost = building.GetGoldCost();
        let iGoldReturn = math.floor(iGoldCost * fGoldReturn);
        domain.ETRoot.AsPlayer().CombinationManager().remove(target);
        target.Dispose();
    }

    public getAllBuilding() {
        return this.GetDomain<BaseNpc_Plus>().ETRoot.GetDomainChilds(BuildingEntityRoot);
    }
    public getAllBattleBuilding() {
        return this.GetDomain<BaseNpc_Plus>()
            .ETRoot.GetDomainChilds(BuildingEntityRoot)
            .filter((b) => {
                return b.ChessComp().isInBattle();
            });
    }

    /**
     * 建筑物数量
     * @param buildName
     * @returns
     */
    public getBuildingCount(towerID: string) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let buildings = domain.ETRoot.GetDomainChilds(BuildingEntityRoot);
        let r = 0;
        buildings.forEach((c) => {
            if (c.ConfigID === towerID) {
                r += 1;
            }
        });
        return r;
    }
}
