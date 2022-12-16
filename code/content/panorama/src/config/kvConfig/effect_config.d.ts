
declare namespace effect_config { 
 interface OBJ_0_1 {
"effect_config" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"modifier_phy_arm_base_3" :OBJ_2_1 ,
"modifier_phy_arm_base_6" :OBJ_2_1 ,
"modifier_phy_arm_base_9" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"target" :string ,
"prop" :OBJ_3_1 ,
[k:string] : string | OBJ_3_1 }
 interface OBJ_3_1 {
"PHYSICAL_ARMOR_BASE" :string ,
[k:string] : string }
}