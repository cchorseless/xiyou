
declare namespace building_unit_summoned { 
 interface OBJ_0_1 {
"building_unit_summoned" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"npc_dota_lycan_wolf_custom" :OBJ_2_1 ,
"npc_dota_lycan_large_wolf_custom" :OBJ_2_1 ,
"npc_dota_t34_summon_custom" :OBJ_2_1 ,
"npc_dota_venomancer_ward_custom" :OBJ_2_1 ,
"npc_custom_necronomicon_archer" :OBJ_2_1 ,
"npc_custom_necronomicon_warrior" :OBJ_2_1 ,
"npc_void_spirit_summon" :OBJ_2_1 ,
"npc_dota_hero_ember_spirit_remnant" :OBJ_2_1 ,
"npc_furion_treant_custom" :OBJ_2_1 ,
"npc_t41_custom" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"BaseClass" :string ,
"UnitLabel" :string ,
"Ability1" :string ,
"StatusHealth" :string ,
"StatusHealthRegen" :string ,
"AttackDamageMin" :string ,
"AttackDamageMax" :string ,
"AttackRate" :string ,
"AttackAnimationPoint" :string ,
"AttackCapabilities" :string ,
"RingRadius" :string ,
"AttackRange" :string ,
"MovementSpeed" :string ,
"MovementCapabilities" :string ,
"BoundsHullName" :string ,
"Model" :string ,
"ModelScale" :string ,
"SoundSet" :string ,
"HealthBarOffset" :string ,
"Creature" :OBJ_3_1 ,
"MovementTurnRate" :string ,
"ProjectileModel" :string ,
"ProjectileSpeed" :string ,
"StatusMana" :string ,
[k:string] : string | OBJ_3_1 }
 interface OBJ_3_1 {
"AttachWearables" :OBJ_4_1 ,
[k:string] : OBJ_4_1 }
 interface OBJ_4_1 {
"1" :OBJ_5_1 ,
"2" :OBJ_5_1 ,
"3" :OBJ_5_1 ,
"4" :OBJ_5_1 ,
"5" :OBJ_5_1 ,
"6" :OBJ_5_1 ,
[k:string] : OBJ_5_1 }
 interface OBJ_5_1 {
"ItemDef" :string ,
[k:string] : string }
}