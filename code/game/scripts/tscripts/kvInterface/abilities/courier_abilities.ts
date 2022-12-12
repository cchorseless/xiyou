
export namespace courier_abilities { 
export interface OBJ_0_1 {
"courier_abilities" :OBJ_1_1 ,
}
export interface OBJ_1_1 {
"ability3_courier_base" :OBJ_2_1 ,
"ability6_courier_base" :OBJ_2_1 ,
"courier_draw_card_v1" :OBJ_2_1 ,
"courier_draw_card_v2" :OBJ_2_1 ,
"courier_draw_card_v3" :OBJ_2_1 ,
"courier_auto_gold" :OBJ_2_1 ,
"courier_fire_chess" :OBJ_2_1 ,
"courier_recovery_chess" :OBJ_2_1 ,
"courier_upgrade_chess" :OBJ_2_1 ,
"courier_challenge_gold" :OBJ_2_1 ,
"courier_challenge_wood" :OBJ_2_1 ,
"courier_challenge_equip" :OBJ_2_1 ,
"courier_challenge_artifact" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
export interface OBJ_2_1 {
"BaseClass" :string ,
"ScriptFile" :string ,
"AbilityTextureName" :string ,
"MaxLevel" :string ,
"AbilityBehavior" :string ,
"AbilitySound" :string ,
"HasScepterUpgrade" :string ,
"AbilityCastRange" :string ,
"AbilityCooldown" :string ,
"AbilityManaCost" :string ,
"AbilitySpecial" :OBJ_3_1 ,
"AbilityUnitTargetTeam" :string ,
"AbilityUnitTargetType" :string ,
"CustomHidden" :string ,
[k:string] : string | OBJ_3_1 }
export interface OBJ_3_1 {
"01" :OBJ_4_1 ,
"02" :OBJ_4_1 ,
"03" :OBJ_4_1 ,
"04" :OBJ_4_1 ,
[k:string] : OBJ_4_1 }
export interface OBJ_4_1 {
"var_type" :string ,
"radius" :string ,
"movespeed_bonus" :string ,
"slow_duration" :string ,
"stun_duration" :string ,
"draw_count" :string ,
"wood_cost" :string ,
[k:string] : string }
}