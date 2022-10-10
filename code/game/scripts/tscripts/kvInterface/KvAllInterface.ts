
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
export interface KvAllInterface  {
"shipin_config": shipin_config.OBJ_1_1,
"pool_config": pool_config.OBJ_1_1,
"pool_group_config": pool_group_config.OBJ_1_1,
"prop_config": prop_config.OBJ_1_1,
"effect_config": effect_config.OBJ_1_1,
"population_config": population_config.OBJ_1_1,
"tech_config": tech_config.OBJ_1_1,
"lang_config": lang_config.OBJ_1_1,
"building_combination": building_combination.OBJ_1_1,
"building_combination_ability": building_combination_ability.OBJ_1_1,
"building_item_card": building_item_card.OBJ_1_1,
"building_round": building_round.OBJ_1_1,
"building_round_board": building_round_board.OBJ_1_1,
"building_round_challenge": building_round_challenge.OBJ_1_1,
"building_round_board_challenge": building_round_board_challenge.OBJ_1_1,
"building_unit_tower": building_unit_tower.OBJ_1_1,
"building_unit_enemy": building_unit_enemy.OBJ_1_1,
"building_config": building_config.OBJ_1_1,
"building_unit_summoned": building_unit_summoned.OBJ_1_1,
"building_ability_tower": building_ability_tower.OBJ_1_1,
}
export const KvAllPath = {
"shipin_config": "scripts/npc/kvConfig/shipin_config.kv",
"pool_config": "scripts/npc/kvConfig/pool_config.kv",
"pool_group_config": "scripts/npc/kvConfig/pool_group_config.kv",
"prop_config": "scripts/npc/kvConfig/prop_config.kv",
"effect_config": "scripts/npc/kvConfig/effect_config.kv",
"population_config": "scripts/npc/kvConfig/population_config.kv",
"tech_config": "scripts/npc/kvConfig/tech_config.kv",
"lang_config": "scripts/npc/kvConfig/lang_config.kv",
"building_combination": "scripts/npc/building/building_combination.kv",
"building_combination_ability": "scripts/npc/building/building_combination_ability.kv",
"building_item_card": "scripts/npc/building/building_item_card.kv",
"building_round": "scripts/npc/building/building_round.kv",
"building_round_board": "scripts/npc/building/building_round_board.kv",
"building_round_challenge": "scripts/npc/building/building_round_challenge.kv",
"building_round_board_challenge": "scripts/npc/building/building_round_board_challenge.kv",
"building_unit_tower": "scripts/npc/building/building_unit_tower.kv",
"building_unit_enemy": "scripts/npc/building/building_unit_enemy.kv",
"building_config": "scripts/npc/building/building_config.kv",
"building_unit_summoned": "scripts/npc/building/building_unit_summoned.kv",
"building_ability_tower": "scripts/npc/building/building_ability_tower.kv",
}
export interface KvServerInterface   {
"shipin_config": shipin_config.OBJ_1_1,
"pool_config": pool_config.OBJ_1_1,
"pool_group_config": pool_group_config.OBJ_1_1,
"prop_config": prop_config.OBJ_1_1,
"effect_config": effect_config.OBJ_1_1,
"population_config": population_config.OBJ_1_1,
"tech_config": tech_config.OBJ_1_1,
"lang_config": lang_config.OBJ_1_1,
"building_combination": building_combination.OBJ_1_1,
"building_combination_ability": building_combination_ability.OBJ_1_1,
"building_item_card": building_item_card.OBJ_1_1,
"building_round": building_round.OBJ_1_1,
"building_round_board": building_round_board.OBJ_1_1,
"building_round_challenge": building_round_challenge.OBJ_1_1,
"building_round_board_challenge": building_round_board_challenge.OBJ_1_1,
"building_unit_tower": building_unit_tower.OBJ_1_1,
"building_unit_enemy": building_unit_enemy.OBJ_1_1,
"building_config": building_config.OBJ_1_1,
"building_unit_summoned": building_unit_summoned.OBJ_1_1,
"building_ability_tower": building_ability_tower.OBJ_1_1,
}
export const KvServer = {
"shipin_config": "scripts/npc/kvConfig/shipin_config.kv",
"pool_config": "scripts/npc/kvConfig/pool_config.kv",
"pool_group_config": "scripts/npc/kvConfig/pool_group_config.kv",
"prop_config": "scripts/npc/kvConfig/prop_config.kv",
"effect_config": "scripts/npc/kvConfig/effect_config.kv",
"population_config": "scripts/npc/kvConfig/population_config.kv",
"tech_config": "scripts/npc/kvConfig/tech_config.kv",
"lang_config": "scripts/npc/kvConfig/lang_config.kv",
"building_combination": "scripts/npc/building/building_combination.kv",
"building_combination_ability": "scripts/npc/building/building_combination_ability.kv",
"building_item_card": "scripts/npc/building/building_item_card.kv",
"building_round": "scripts/npc/building/building_round.kv",
"building_round_board": "scripts/npc/building/building_round_board.kv",
"building_round_challenge": "scripts/npc/building/building_round_challenge.kv",
"building_round_board_challenge": "scripts/npc/building/building_round_board_challenge.kv",
"building_unit_tower": "scripts/npc/building/building_unit_tower.kv",
"building_unit_enemy": "scripts/npc/building/building_unit_enemy.kv",
"building_config": "scripts/npc/building/building_config.kv",
"building_unit_summoned": "scripts/npc/building/building_unit_summoned.kv",
"building_ability_tower": "scripts/npc/building/building_ability_tower.kv",
}
export interface KvClientInterface   {
"shipin_config": shipin_config.OBJ_1_1,
"pool_config": pool_config.OBJ_1_1,
"pool_group_config": pool_group_config.OBJ_1_1,
"prop_config": prop_config.OBJ_1_1,
"effect_config": effect_config.OBJ_1_1,
"population_config": population_config.OBJ_1_1,
"tech_config": tech_config.OBJ_1_1,
"lang_config": lang_config.OBJ_1_1,
"building_combination": building_combination.OBJ_1_1,
"building_combination_ability": building_combination_ability.OBJ_1_1,
"building_item_card": building_item_card.OBJ_1_1,
"building_round": building_round.OBJ_1_1,
"building_round_board": building_round_board.OBJ_1_1,
"building_round_challenge": building_round_challenge.OBJ_1_1,
"building_round_board_challenge": building_round_board_challenge.OBJ_1_1,
"building_unit_tower": building_unit_tower.OBJ_1_1,
"building_unit_enemy": building_unit_enemy.OBJ_1_1,
"building_config": building_config.OBJ_1_1,
"building_unit_summoned": building_unit_summoned.OBJ_1_1,
"building_ability_tower": building_ability_tower.OBJ_1_1,
}
export const KvClient = {
"shipin_config": "scripts/npc/kvConfig/shipin_config.kv",
"pool_config": "scripts/npc/kvConfig/pool_config.kv",
"pool_group_config": "scripts/npc/kvConfig/pool_group_config.kv",
"prop_config": "scripts/npc/kvConfig/prop_config.kv",
"effect_config": "scripts/npc/kvConfig/effect_config.kv",
"population_config": "scripts/npc/kvConfig/population_config.kv",
"tech_config": "scripts/npc/kvConfig/tech_config.kv",
"lang_config": "scripts/npc/kvConfig/lang_config.kv",
"building_combination": "scripts/npc/building/building_combination.kv",
"building_combination_ability": "scripts/npc/building/building_combination_ability.kv",
"building_item_card": "scripts/npc/building/building_item_card.kv",
"building_round": "scripts/npc/building/building_round.kv",
"building_round_board": "scripts/npc/building/building_round_board.kv",
"building_round_challenge": "scripts/npc/building/building_round_challenge.kv",
"building_round_board_challenge": "scripts/npc/building/building_round_board_challenge.kv",
"building_unit_tower": "scripts/npc/building/building_unit_tower.kv",
"building_unit_enemy": "scripts/npc/building/building_unit_enemy.kv",
"building_config": "scripts/npc/building/building_config.kv",
"building_unit_summoned": "scripts/npc/building/building_unit_summoned.kv",
"building_ability_tower": "scripts/npc/building/building_ability_tower.kv",
}
