
declare namespace common_units { 
 interface OBJ_0_1 {
"common_units" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"unit_ward_observer" :OBJ_2_1 ,
"unit_remote_mine" :OBJ_2_1 ,
"unit_dummy" :OBJ_2_1 ,
"unit_portal" :OBJ_2_1 ,
"unit_enemy_courier" :OBJ_2_1 ,
"unit_base_bossbaoxiang" :OBJ_2_1 ,
"unit_base_gold_bag" :OBJ_2_1 ,
"unit_base_equip_bag" :OBJ_2_1 ,
"unit_target_dummy" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"UnitLabel" :string ,
"vscripts" :string ,
"BaseClass" :string ,
"Model" :string ,
"ModelScale" :string ,
"Creature" :OBJ_3_1 ,
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
"ArmorPhysical" :string ,
"MagicalResistance" :string ,
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
[k:string] : string | OBJ_3_1 }
 interface OBJ_3_1 {
[k:string] : any }
}