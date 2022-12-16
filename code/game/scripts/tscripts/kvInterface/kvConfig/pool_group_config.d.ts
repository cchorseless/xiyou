
declare namespace pool_group_config { 
 interface OBJ_0_1 {
"poolgroupdata" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"10000" :OBJ_2_1 ,
"10001" :OBJ_2_1 ,
"10002" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"1000" :OBJ_3_1 ,
"1001" :OBJ_3_1 ,
"1002" :OBJ_3_1 ,
[k:string] : OBJ_3_1 }
 interface OBJ_3_1 {
"PoolName" :string ,
"PoolWeight" :string ,
"isVaild" :string ,
[k:string] : string }
}