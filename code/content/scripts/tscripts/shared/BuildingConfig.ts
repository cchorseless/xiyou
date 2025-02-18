export module BuildingConfig {

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
    export const MAX_SAME_TOWER = 999;
    /**最大人口等级 */
    export const POPULATION_BASEMAXLEVEL = 6;
    /**最大人口数量 */
    export const POPULATION_MAX = 20;
    /**最高星级 */
    export const MAX_STAR = 5;

    export const MODEL_SCALE = [1, 1.2, 1.3, 1.4, 1.5, 1.6];

    export enum ERarity {
        D = 1,
        C = 2,
        B = 3,
        A = 4,
        S = 10,
        SS = 11,
    }

    /**错误信息 */
    export enum ErrorCode {
        /**相同塔限制 */
        dota_hud_error_has_same_tower = "dota_hud_error_has_same_tower",
        /**人口限制 */
        dota_hud_error_population_limit = "dota_hud_error_population_limit",
        /**金币不足 */
        dota_hud_error_gold_limit = "dota_hud_error_gold_limit",
        dota_hud_error_only_hero_can_use = "dota_hud_error_only_hero_can_use",
        dota_hud_error_cant_build_at_location = "dota_hud_error_cant_build_at_location",
    }
}