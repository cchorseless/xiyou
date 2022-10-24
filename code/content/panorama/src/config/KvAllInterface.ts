
import { shipin_config } from "./kvConfig/shipin_config" 
import { pool_config } from "./kvConfig/pool_config" 
import { pool_group_config } from "./kvConfig/pool_group_config" 
import { prop_config } from "./kvConfig/prop_config" 
import { effect_config } from "./kvConfig/effect_config" 
import { population_config } from "./kvConfig/population_config" 
import { tech_config } from "./kvConfig/tech_config" 
import { lang_config } from "./kvConfig/lang_config" 
import { building_combination } from "./building/building_combination" 
import { building_combination_ability } from "./building/building_combination_ability" 
import { building_item_card } from "./building/building_item_card" 
import { building_round } from "./building/building_round" 
import { building_round_board } from "./building/building_round_board" 
import { building_round_challenge } from "./building/building_round_challenge" 
import { building_round_board_challenge } from "./building/building_round_board_challenge" 
import { building_unit_tower } from "./building/building_unit_tower" 
import { building_unit_enemy } from "./building/building_unit_enemy" 
import { building_config } from "./building/building_config" 
import { building_unit_summoned } from "./building/building_unit_summoned" 
import { building_ability_tower } from "./building/building_ability_tower" 
export interface KvAllInterface extends 
shipin_config.OBJ_0_1,
pool_config.OBJ_0_1,
pool_group_config.OBJ_0_1,
prop_config.OBJ_0_1,
effect_config.OBJ_0_1,
population_config.OBJ_0_1,
tech_config.OBJ_0_1,
lang_config.OBJ_0_1,
building_combination.OBJ_0_1,
building_combination_ability.OBJ_0_1,
building_item_card.OBJ_0_1,
building_round.OBJ_0_1,
building_round_board.OBJ_0_1,
building_round_challenge.OBJ_0_1,
building_round_board_challenge.OBJ_0_1,
building_unit_tower.OBJ_0_1,
building_unit_enemy.OBJ_0_1,
building_config.OBJ_0_1,
building_unit_summoned.OBJ_0_1,
building_ability_tower.OBJ_0_1{ }
