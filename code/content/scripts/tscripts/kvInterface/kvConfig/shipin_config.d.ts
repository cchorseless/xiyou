
declare namespace shipin_config { 
 interface OBJ_0_1 {
"shipin_config" :OBJ_1_1 ,
}
 interface OBJ_1_1 {
"1" :OBJ_2_1 ,
[k:string] : OBJ_2_1 }
 interface OBJ_2_1 {
"name" :string ,
"prefab" :string ,
"image_inventory" :string ,
"item_description" :string ,
"item_name" :string ,
"model_player" :string ,
"used_by_heroes" :string ,
"asset_modifier" :string ,
"control_point" :string ,
[k:string] : string }
}