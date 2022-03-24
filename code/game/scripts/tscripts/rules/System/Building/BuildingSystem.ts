import { KVHelper } from "../../../helper/KVHelper"
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus"
import { BuildingManagerComponent } from "../../Components/Building/BuildingManagerComponent"
import { ET } from "../../Entity/Entity"
import { BuildingConfig } from "./BuildingConfig"
import { BuildingState } from "./BuildingState"

export class BuildingSystem {


    public static init() {
        BuildingState.init();
    };
    static readonly AllManager: { [k: string]: BuildingManagerComponent } = {};

    public static RegComponent(comp: BuildingManagerComponent) {
        BuildingSystem.AllManager[comp.PlayerID] = comp;
    }
    /**
     * 地块坐标
     * @param location 
     * @param size 
     */
    public static SnapToGrid(location: Vector, size: number = BuildingConfig.BUILDING_SIZE) {
        if (size % 2 != 0) {
            location.x = BuildingSystem.SnapToGrid32(location.x)
            location.y = BuildingSystem.SnapToGrid32(location.y)
        }
        else {
            location.x = BuildingSystem.SnapToGrid64(location.x)
            location.y = BuildingSystem.SnapToGrid64(location.y)
        }
    }
    private static SnapToGrid64(coord: number) {
        return 64 * math.floor(0.5 + coord / 64)
    }
    private static SnapToGrid32(coord: number) {
        return 32 + 64 * math.floor(coord / 64)
    }



    public static CreateBlockerOnPoint(location: Vector, size: number = BuildingConfig.BUILDING_SIZE, blocker: CBaseEntity = null) {
        let polygon = BuildingSystem.GridNavSquare(location, size);
        return BuildingSystem.CreateBlocker(polygon, blocker)
    }

    public static CreateBlocker(polygon: Array<Vector>, blocker: CBaseEntity = null) {
        // blocker = blocker || SpawnEntityFromTableSynchronous("info_target", { origin: Vector(0, 0, 0) })
        // blocker.polygon = polygon
        // CustomNetTables.SetTableValue("build_blocker", '' + blocker.entindex(), Polygon2D(polygon))
        // BuildSystem.hBlockers[blocker.entindex()] = blocker
        return blocker
    }

    /**
     * 生成地块坐标
     * @param location
     * @param size
     * @returns
     */
    public static GridNavSquare(location: Vector, size: number = BuildingConfig.BUILDING_SIZE) {
        BuildingSystem.SnapToGrid(location, size)
        let halfSide = (size / 2) * BuildingConfig.BUILDING_UNIT;
        return [
            Vector(location.x - halfSide, location.y - halfSide, 0),
            Vector(location.x + halfSide, location.y - halfSide, 0),
            Vector(location.x + halfSide, location.y + halfSide, 0),
            Vector(location.x - halfSide, location.y + halfSide, 0),
        ]
    }
    /**
    * 获取建筑物的人口数
    * @param buildingName
    */
    public static GetBuildingPopulation(towerID: string) {
        let config = KVHelper.KvServerConfig.building_unit_tower[towerID as "npc_dota_hero_lina_custom"];
        if (config) {
            return parseInt(config.Population)
        }
        return 0
    }
}