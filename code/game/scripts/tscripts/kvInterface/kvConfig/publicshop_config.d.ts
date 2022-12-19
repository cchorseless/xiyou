
declare namespace publicshop_config { 
 interface OBJ_0_1 {
"publicshopdata" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"GoldShop" :OBJ_2_1 ,
"WoodShop" :OBJ_2_1 ,
"RandomShop" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"1" :OBJ_3_1 ,
"2" :OBJ_3_1 ,
"3" :OBJ_3_1 ,
"4" :OBJ_3_1 ,
"5" :OBJ_3_1 ,
"6" :OBJ_3_1 ,
"7" :OBJ_3_1 ,
"8" :OBJ_3_1 ,
"9" :OBJ_3_1 ,
"10" :OBJ_3_1 ,
"11" :OBJ_3_1 ,
"12" :OBJ_3_1 ,
"13" :OBJ_3_1 ,
"14" :OBJ_3_1 ,
"15" :OBJ_3_1 ,
[k:string] : OBJ_3_1 }
 interface OBJ_3_1 {
"ItemName" :string ,
"ItemLimit" :string ,
"MinDifficulty" :string ,
[k:string] : string }
}