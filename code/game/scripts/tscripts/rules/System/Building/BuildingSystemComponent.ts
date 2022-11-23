import { reloadable } from "../../../GameCache";
import { KVHelper } from "../../../helper/KVHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { BuildingState } from "./BuildingState";

@reloadable
export class BuildingSystemComponent extends ET.Component {
    public onAwake(...args: any[]): void {
        BuildingState.init();
    }

    /**
     * 地块坐标
     * @param location
     * @param size
     */
    public SnapToGrid(location: Vector, size: number = BuildingConfig.BUILDING_SIZE) {
        if (size % 2 != 0) {
            location.x = this.SnapToGrid32(location.x);
            location.y = this.SnapToGrid32(location.y);
        } else {
            location.x = this.SnapToGrid64(location.x);
            location.y = this.SnapToGrid64(location.y);
        }
    }
    private SnapToGrid64(coord: number) {
        return 64 * math.floor(0.5 + coord / 64);
    }
    private SnapToGrid32(coord: number) {
        return 32 + 64 * math.floor(coord / 64);
    }

    public CreateBlockerOnPoint(location: Vector, size: number = BuildingConfig.BUILDING_SIZE, blocker: CBaseEntity = null) {
        let polygon = this.GridNavSquare(location, size);
        return this.CreateBlocker(polygon, blocker);
    }

    public CreateBlocker(polygon: Array<Vector>, blocker: CBaseEntity = null) {
        // blocker = blocker || SpawnEntityFromTableSynchronous("info_target", { origin: Vector(0, 0, 0) })
        // blocker.polygon = polygon
        // CustomNetTables.SetTableValue("build_blocker", '' + blocker.entindex(), Polygon2D(polygon))
        // BuildSystem.hBlockers[blocker.entindex()] = blocker
        return blocker;
    }

    /**
     * 生成地块坐标
     * @param location
     * @param size
     * @returns
     */
    public GridNavSquare(location: Vector, size: number = BuildingConfig.BUILDING_SIZE) {
        this.SnapToGrid(location, size);
        let halfSide = (size / 2) * BuildingConfig.BUILDING_UNIT;
        return [
            Vector(location.x - halfSide, location.y - halfSide, 0),
            Vector(location.x + halfSide, location.y - halfSide, 0),
            Vector(location.x + halfSide, location.y + halfSide, 0),
            Vector(location.x - halfSide, location.y + halfSide, 0),
        ];
    }
    /**
     * 获取建筑物的人口数
     * @param buildingName
     */
    public GetBuildingPopulation(towerID: string) {
        let config = KVHelper.KvServerConfig.building_unit_tower[towerID];
        if (config) {
            return parseInt(config.Population);
        }
        return 0;
    }
}
