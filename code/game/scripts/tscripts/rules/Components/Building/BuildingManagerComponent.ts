import { GameEnum } from "../../../GameEnum";
import { EntityHelper } from "../../../helper/EntityHelper";
import { EventHelper } from "../../../helper/EventHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { BuildingState } from "../../System/Building/BuildingState";
import { BuildingSystem } from "../../System/Building/BuildingSystem";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";
import { BuildingComponent } from "./BuildingComponent";

/**塔防组件 */
export class BuildingManagerComponent extends ET.Component {

    /**当前人口数量 */
    curPopulation: number = 0;
    /**当前人口上限 */
    curPopulationRoof: number = 0;
    /**人口等级 */
    population_level: number = 0;
    /**是否建造过一个建筑 */
    bHasBuild: boolean = false;

    tGlobalBuffs: BuildingConfig.IBuffInfo[] = [];

    onAwake() {

    }

    /**
     * 获取空闲人口数量
     * @param playerID
     * @returns
     */
    public getFreePopulation() {
        return this.curPopulationRoof - this.curPopulation;
    }

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
            EventHelper.ErrorMessage(GameEnum.Event.ErrorCode.dota_hud_error_has_same_tower, playerID);
            return
        }
        //  人口判断
        // let iPopulationAdd = BuildingSystem.GetBuildingPopulation(towerID);
        // let freePopulation = this.getFreePopulation();
        // if (iPopulationAdd > freePopulation) {
        //     EventHelper.ErrorMessage(GameEnum.Event.ErrorCode.dota_hud_error_population_limit)
        //     return false
        // }
        let building = EntityHelper.CreateEntityByName(towerID, location, domain.GetTeamNumber(), false, domain, domain) as BaseNpc_Plus;
        if (!building) { return };
        ET.EntityRoot.Active(building);
        domain.ETRoot.AddDomainChild(building.ETRoot);
        building.ETRoot.AddComponent(BuildingComponent, towerID, location, angle);
        building.ETRoot.AddComponent(CombinationComponent, towerID);
        // domain.ETRoot.GetComponent(CombinationManagerComponent).add(domain.ETRoot);
        /**互相绑定 */
        building.SetControllableByPlayer(playerID, true);
        building.addSpawnedHandler(ET.Handler.create(this, () => {
            // modifier_building.apply(this.createUnit, domain)
            // modifier_test.apply(this.createUnit, domain)
        }));
        // 全场buff
        // if (this.tGlobalBuffs.length > 0) {
        //     for (let info of this.tGlobalBuffs) {
        //         let cls = PrecacheHelper.GetRegClass<typeof BaseModifier_Plus>(info.sBuffName);
        //         cls.apply(domain, domain, info.hAbility, info.tParams);
        //     }
        // }
        // 改变人口
        // this.curPopulation += iPopulationAdd;
        this.bHasBuild = true;
        // FireLeftPopulationChanged(playerID, this.GetMaxPopulation(playerID) - this.tPlayerBuildings[playerID].population)
        return building
    }

    /**
     *
     * @param playerID
     * @param target
     * @param fGoldReturn 金币返还比例
     * @returns
     */
    public sellBuilding(target: ET.EntityRoot, fGoldReturn = 0.5) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        if (target.DomainParent && target.DomainParent != domain.ETRoot) {
            return;
        }
        let building = target.GetComponent(BuildingComponent);
        if (building == null) {
            return;
        }
        let iGoldCost = building.GetGoldCost()
        let iGoldReturn = math.floor(iGoldCost * fGoldReturn)
        domain.ETRoot.GetComponent(CombinationManagerComponent).remove(target);

    }

    /**
     * 建筑物数量
     * @param buildName
     * @returns
     */
    public getBuildingCount(towerID: string) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let buildings = domain.ETRoot.GetDomainChildComponents(BuildingComponent);
        let r = 0;
        buildings.forEach(
            (c) => {
                if (c.towerID === towerID) {
                    r += 1
                }
            }
        )
        return r
    }
}