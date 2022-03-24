import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";

export module BuildingConfig {
    /**玩家建造数据 */
    export interface IBuffInfo {
        hAbility: BaseAbility_Plus;
        sBuffName: string;
        tParams: ModifierTable,
    }

    /**Whether to recolor the ghost model green/red or not */
    export const RECOLOR_GHOST_MODEL = true;
    /**Whether to recolor the queue of buildings placed(Lua) */
    export const RECOLOR_BUILDING_PLACED = true;
    /**建筑物角度 */
    export const BUILDING_ANGLE = -90;
    /**建筑物格子数 */
    export const BUILDING_SIZE = 2;
    /**建筑物格子 */
    export const BUILDING_UNIT = 64;
    /**相同的塔最多造数量 */
    export const MAX_SAME_TOWER = 1;
    /**最大人口等级 */
    export const POPULATION_BASEMAXLEVEL = 6;
    /**最大人口数量 */
    export const POPULATION_MAX = 20;
    /**最高星级 */
    export const MAX_STAR = 5;

}