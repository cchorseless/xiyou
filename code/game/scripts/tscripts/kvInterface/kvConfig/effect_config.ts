// generate with PIPIXIA's kv generator 
export namespace effect_config { 
export interface OBJ_0_1 {
"effect_config" :OBJ_1_1 ,
}
export interface OBJ_1_1 {
"modifier_phy_arm_base_3" :OBJ_2_1 ,
"modifier_phy_arm_base_6" :OBJ_2_1 ,
"modifier_phy_arm_base_9" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
export interface OBJ_2_1 {
"target" :string ,
"prop" :OBJ_3_1 ,
[k:string] : string | OBJ_3_1 }
export interface OBJ_3_1 {
"PHYSICAL_ARMOR_BASE" :string ,
"PHYSICAL_ARMOR_BASE2" :string ,
[k:string] : string }
}