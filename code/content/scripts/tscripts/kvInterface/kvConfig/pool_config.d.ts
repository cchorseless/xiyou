
declare namespace pool_config { 
 interface OBJ_0_1 {
"pooldata" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"1000" :OBJ_2_1 ,
"1001" :OBJ_2_1 ,
"1002" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"building_hero_axe" :OBJ_3_1 ,
"building_hero_kunkka" :OBJ_3_1 ,
"building_hero_juggernaut" :OBJ_3_1 ,
"building_hero_mars" :OBJ_3_1 ,
"building_hero_primal_beast" :OBJ_3_1 ,
"building_hero_sven" :OBJ_3_1 ,
"building_hero_pudge" :OBJ_3_1 ,
"building_hero_skeleton_king" :OBJ_3_1 ,
"building_hero_slardar" :OBJ_3_1 ,
"building_hero_troll_warlord" :OBJ_3_1 ,
"building_hero_tusk" :OBJ_3_1 ,
"building_hero_ursa" :OBJ_3_1 ,
[k:string] : OBJ_3_1 }
 interface OBJ_3_1 {
"ItemName" :string ,
"ItemCount" :string ,
"ItemWeight" :string ,
"isVaild" :string ,
[k:string] : string }
}