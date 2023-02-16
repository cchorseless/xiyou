
declare namespace npc_heroes_custom { 
 interface OBJ_0_1 {
"DOTAHeroes" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"Version" :string ,
"npc_dota_hero_wisp" :OBJ_2_1 ,
[k:string] : string | OBJ_2_1 }
 interface OBJ_2_1 {
"override_hero" :string ,
"Name" :string ,
"vscripts" :string ,
"Model" :string ,
"ModelScale" :string ,
"BoundsHullName" :string ,
"RingRadius" :string ,
"VisionDaytimeRange" :string ,
"VisionNighttimeRange" :string ,
"Ability1" :string ,
"Ability2" :string ,
"Ability3" :string ,
"Ability4" :string ,
"Ability5" :string ,
"Ability6" :string ,
"AbilityLayout" :string ,
"HealthBarOffset" :string ,
"MovementSpeed" :string ,
"MovementCapabilities" :string ,
"MovementTurnRate" :string ,
"HasAggressiveStance" :string ,
"ArmorPhysical" :string ,
"MagicalResistance" :string ,
"StatusHealth" :string ,
"StatusHealthRegen" :string ,
"StatusMana" :string ,
"StatusManaRegen" :string ,
"AttackCapabilities" :string ,
"AttributeBaseStrength" :string ,
"AttributeStrengthGain" :string ,
"AttributeBaseAgility" :string ,
"AttributeAgilityGain" :string ,
"AttributeBaseIntelligence" :string ,
"AttributeIntelligenceGain" :string ,
"UnitLabel" :string ,
"DisableWearables" :string ,
"Creature" :OBJ_3_1 ,
[k:string] : string | OBJ_3_1 }
 interface OBJ_3_1 {
[k:string] : any }
}