
declare interface KvAllInterface extends 
npc_heroes_custom.OBJ_0_1,
dota_items.OBJ_0_1,
dota_abilities.OBJ_0_1,
lang_config.OBJ_0_1,
common_units.OBJ_0_1,
courier_units.OBJ_0_1,
building_item_card.OBJ_0_1,
building_unit_tower.OBJ_0_1,
building_unit_enemy.OBJ_0_1,
building_unit_summoned.OBJ_0_1,
building_ability_tower.OBJ_0_1,
courier_abilities.OBJ_0_1,
imba_abilities.OBJ_0_1,
imba_items.OBJ_0_1,
artifact_items.OBJ_0_1,
imba_item_recipes.OBJ_0_1{ }
declare type KV_AllAbilitys =  courier_abilities.OBJ_1_1 | imba_abilities.OBJ_1_1 | building_ability_tower.OBJ_1_1 ;
declare type KV_AllItems  = building_item_card.OBJ_1_1 |imba_items.OBJ_1_1 |artifact_items.OBJ_1_1 |imba_item_recipes.OBJ_1_1 ;
declare type KV_AllUnits  = building_unit_enemy.OBJ_1_1 |building_unit_tower.OBJ_1_1 |building_unit_summoned.OBJ_1_1 |common_units.OBJ_1_1 ;
