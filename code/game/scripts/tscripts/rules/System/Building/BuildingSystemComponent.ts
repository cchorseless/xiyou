import { reloadable } from "../../../GameCache";
import { KVHelper } from "../../../helper/KVHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { GameFunc } from "../../../GameFunc";

@reloadable
export class BuildingSystemComponent extends ET.SingletonComponent {

    /**允许建造位置 */
    public tAllowsPosition: Vector[][] = [];
    public tBlockersPosition: Vector[][] = [];

    public tPlayerExtraSlot = {}
    public init() {
        // let building_allow = Entities.FindAllByName("build_allow");
        // for (let v of building_allow) {
        //     let origin = v.GetAbsOrigin()
        //     let angles = v.GetAngles()
        //     let bounds = v.GetBounds()
        //     let vMin = (RotatePosition(Vector(0, 0, 0), angles, bounds.Mins) + origin) as Vector;
        //     let vMax = (RotatePosition(Vector(0, 0, 0), angles, bounds.Maxs) + origin) as Vector;
        //     BuildingState.tAllowsPosition.push([
        //         Vector(vMin.x, vMin.y, 0),
        //         Vector(vMax.x, vMin.y, 0),
        //         Vector(vMax.x, vMax.y, 0),
        //         Vector(vMin.x, vMax.y, 0),
        //     ]);
        // }
    }



    /**
     * 是否是有效建筑位置
     * @param location
     * @param size
     * @returns
     */
    public IsValidPosition(location: Vector, size: number = BuildingConfig.BUILDING_SIZE) {
        return true
        let halfSide = (size / 2) * BuildingConfig.BUILDING_UNIT - 1;
        let leftBorderX = location.x - halfSide
        let rightBorderX = location.x + halfSide
        let topBorderY = location.y + halfSide
        let bottomBorderY = location.y - halfSide
        let points = [
            location,
            Vector(leftBorderX, bottomBorderY, 0),
            Vector(rightBorderX, bottomBorderY, 0),
            Vector(rightBorderX, topBorderY, 0),
            Vector(leftBorderX, topBorderY, 0),
        ];
        //  允许建造区域监测
        for (let pos of points) {
            let pOk = false
            for (let polygon of this.tAllowsPosition) {
                if (GameFunc.VectorFunctions.IsPointInPolygon(pos, polygon)) {
                    pOk = true
                    break
                }
            }
            if (!pOk) {
                return false
            }
        }
        //  已建造区域检测
        for (let polygon of this.tBlockersPosition) {
            for (let pos of points) {
                if (GameFunc.VectorFunctions.IsPointInPolygon(pos, polygon)) {
                    return false
                }
            }
        }
        return true
    }

    public onAwake(...args: any[]): void {
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

declare global {
    /**
     * @ServerOnly
     */
    var GBuildingSystem: typeof BuildingSystemComponent;
}
if (_G.GBuildingSystem == undefined) {
    _G.GBuildingSystem = BuildingSystemComponent;
}