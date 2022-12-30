
declare namespace building_round_challenge { 
 interface OBJ_0_1 {
"building_round_challenge" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"challenge_wood" :OBJ_2_1 ,
"challenge_gold" :OBJ_2_1 ,
"challenge_star_card" :OBJ_2_1 ,
"challenge_equip" :OBJ_2_1 ,
"challenge_crystal" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"unit" :string ,
"challenge_point" :string ,
"cost-key" :string ,
"cost-value" :string ,
"round_type" :string ,
"round_desc" :string ,
"challenge_cd" :string ,
"round_time" :string ,
"spawn_num" :string ,
"spawn_interval" :string ,
"failure_count" :string ,
"hp_x" :string ,
"hp_y" :string ,
"HPMult" :OBJ_3_1 ,
"MPMult" :OBJ_3_1 ,
"Prizes" :OBJ_3_1 ,
"challenge_difficulty" :string ,
[k:string] : string | OBJ_3_1 }
 interface OBJ_3_1 {
"0" :string ,
"1" :string ,
"2" :string ,
"3" :string ,
"4" :string ,
"5" :string ,
"6" :string ,
"888" :string ,
"999" :string ,
"type" :string ,
"coef" :string ,
"base" :string ,
"pool" :string ,
"weight" :string ,
[k:string] : string }
}