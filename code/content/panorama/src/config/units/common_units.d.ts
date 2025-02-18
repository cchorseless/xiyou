
declare namespace common_units { 
 interface OBJ_0_1 {
"common_units" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"wearable_dummy" :OBJ_2_1 ,
"unit_ward_observer" :OBJ_2_1 ,
"unit_remote_mine" :OBJ_2_1 ,
"unit_dummy" :OBJ_2_1 ,
"unit_portal" :OBJ_2_1 ,
"unit_enemy_courier" :OBJ_2_1 ,
"unit_base_bossbaoxiang" :OBJ_2_1 ,
"unit_base_gold_bag" :OBJ_2_1 ,
"unit_base_equip_bag" :OBJ_2_1 ,
"unit_target_dummy" :OBJ_2_1 ,
"npc_dota_target_dummy" :OBJ_2_1 ,
"unit_npc_eon_cart" :OBJ_2_1 ,
"unit_npc_courier_egg" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"BaseClass" :string ,
"Creature" :OBJ_3_1 ,
"vscripts" :string ,
"Model" :string ,
"ModelScale" :string ,
"BoundsHullName" :string ,
"VisionDaytimeRange" :string ,
"VisionNighttimeRange" :string ,
"MinimapIcon" :string ,
"MovementCapabilities" :string ,
"AttackCapabilities" :string ,
"SoundSet" :string ,
"particle_folder" :string ,
"HealthBarOffset" :string ,
"MovementSpeed" :string ,
"MovementTurnRate" :string ,
"HasAggressiveStance" :string ,
"ArmorPhysical" :string ,
"ArmorMagical" :string ,
"StatusHealth" :string ,
"StatusHealthRegen" :string ,
"StatusMana" :string ,
"StatusManaRegen" :string ,
"ProjectileSpeed" :string ,
"AttributeBaseStrength" :string ,
"AttributeStrengthGain" :string ,
"AttributeBaseAgility" :string ,
"AttributeAgilityGain" :string ,
"AttributeBaseIntelligence" :string ,
"AttributeIntelligenceGain" :string ,
"CombatClassAttack" :string ,
"CombatClassDefend" :string ,
"ConsideredHero" :string ,
"Ability1" :string ,
"HasInventory" :string ,
[k:string] : string | OBJ_3_1 }
 interface OBJ_3_1 {
[k:string] : any }
}