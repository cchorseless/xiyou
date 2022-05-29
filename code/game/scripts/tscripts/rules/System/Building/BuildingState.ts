import { GameFunc } from "../../../GameFunc";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BuildingConfig } from "./BuildingConfig";


export class BuildingState {

    /**允许建造位置 */
    public static tAllowsPosition: Vector[][] = [];
    public static tBlockersPosition: Vector[][] = [];

    public static tPlayerExtraSlot = {}
    public static init() {
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
    public static IsValidPosition(location: Vector, size: number = BuildingConfig.BUILDING_SIZE) {
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
            for (let polygon of BuildingState.tAllowsPosition) {
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
        for (let polygon of BuildingState.tBlockersPosition) {
            for (let pos of points) {
                if (GameFunc.VectorFunctions.IsPointInPolygon(pos, polygon)) {
                    return false
                }
            }
        }
        return true
    }



}