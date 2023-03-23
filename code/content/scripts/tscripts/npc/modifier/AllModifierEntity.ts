import { modifier_property } from "../propertystat/modifier_property";
import { modifier_animation } from "./animation/modifier_animation";
import { modifier_animation_freeze } from "./animation/modifier_animation_freeze";
import { modifier_animation_translate } from "./animation/modifier_animation_translate";
import { modifier_animation_translate_permanent } from "./animation/modifier_animation_translate_permanent";
import { modifier_dummy_unit } from "./battle/modifier_dummy_unit";
import { modifier_illusion } from "./battle/modifier_illusion";
import { modifier_jiaoxie_wudi } from "./battle/modifier_jiaoxie_wudi";
import { modifier_mana_control } from "./battle/modifier_mana_control";
import { modifier_summon } from "./battle/modifier_summon";

import { modifier_sect_archer_base_a } from "./combinationeffect/modifier_sect_archer";
import { modifier_sect_assault_base_a } from "./combinationeffect/modifier_sect_assault";
import { modifier_sect_atkspeed_base_a } from "./combinationeffect/modifier_sect_atkspeed";
import { modifier_sect_black_art_base_a } from "./combinationeffect/modifier_sect_black_art";
import { modifier_sect_blink_base_a } from "./combinationeffect/modifier_sect_blink";
import { modifier_sect_cabala_base_a } from "./combinationeffect/modifier_sect_cabala";
import { modifier_sect_cannibalism_base_a } from "./combinationeffect/modifier_sect_cannibalism";
import { modifier_sect_cd_down_base_a } from "./combinationeffect/modifier_sect_cd_down";
import { modifier_sect_cleave_base_a } from "./combinationeffect/modifier_sect_cleave";
import { modifier_sect_control_base_a } from "./combinationeffect/modifier_sect_control";
import { modifier_sect_copy_base_a } from "./combinationeffect/modifier_sect_copy";
import { modifier_sect_demon_base_a } from "./combinationeffect/modifier_sect_demon";
import { modifier_sect_disarm_base_a } from "./combinationeffect/modifier_sect_disarm";
import { modifier_sect_double_head_base_a } from "./combinationeffect/modifier_sect_double_head";
import { modifier_sect_fish_chess_base_a } from "./combinationeffect/modifier_sect_fish_chess";
import { modifier_sect_flame_base_a } from "./combinationeffect/modifier_sect_flame";
import { modifier_sect_ghost_base_a } from "./combinationeffect/modifier_sect_ghost";
import { modifier_sect_health_base_a } from "./combinationeffect/modifier_sect_health";
import { modifier_sect_ice_base_a } from "./combinationeffect/modifier_sect_ice";
import { modifier_sect_invent_base_a } from "./combinationeffect/modifier_sect_invent";
import { modifier_sect_light_base_a } from "./combinationeffect/modifier_sect_light";
import { modifier_sect_magarm_up_base_a } from "./combinationeffect/modifier_sect_magarm_up";
import { modifier_sect_magic_base_a } from "./combinationeffect/modifier_sect_magic";
import { modifier_sect_miss_base_a } from "./combinationeffect/modifier_sect_miss";
import { modifier_sect_phyarm_down_base_a } from "./combinationeffect/modifier_sect_phyarm_down";
import { modifier_sect_phyarm_up_base_a } from "./combinationeffect/modifier_sect_phyarm_up";
import { modifier_sect_phycrit_base_a } from "./combinationeffect/modifier_sect_phycrit";
import { modifier_sect_poision_base_a } from "./combinationeffect/modifier_sect_poision";
import { modifier_sect_scilence_base_a } from "./combinationeffect/modifier_sect_scilence";
import { modifier_sect_seckill_base_a } from "./combinationeffect/modifier_sect_seckill";
import { modifier_sect_shield_base_a } from "./combinationeffect/modifier_sect_shield";
import { modifier_sect_steal_base_a } from "./combinationeffect/modifier_sect_steal";
import { modifier_sect_suck_blood_base_a } from "./combinationeffect/modifier_sect_suck_blood";
import { modifier_sect_summon_base_a } from "./combinationeffect/modifier_sect_summon";
import { modifier_sect_territory_base_a } from "./combinationeffect/modifier_sect_territory";
import { modifier_sect_thorns_base_a } from "./combinationeffect/modifier_sect_thorns";
import { modifier_sect_transform_base_a } from "./combinationeffect/modifier_sect_transform";
import { modifier_sect_treatment_base_a } from "./combinationeffect/modifier_sect_treatment";
import { modifier_sect_vanity_base_a } from "./combinationeffect/modifier_sect_vanity";
import { modifier_sect_warpath_base_a } from "./combinationeffect/modifier_sect_warpath";
import { modifier_sect_weapon_base_a } from "./combinationeffect/modifier_sect_weapon";



import { modifier_courier_fx_ambient_1 } from "./courier_ambient_effect/modifier_courier_fx_ambient_1";
import { modifier_courier_fx_ambient_10 } from "./courier_ambient_effect/modifier_courier_fx_ambient_10";
import { modifier_courier_fx_ambient_11 } from "./courier_ambient_effect/modifier_courier_fx_ambient_11";
import { modifier_courier_fx_ambient_12 } from "./courier_ambient_effect/modifier_courier_fx_ambient_12";
import { modifier_courier_fx_ambient_13 } from "./courier_ambient_effect/modifier_courier_fx_ambient_13";
import { modifier_courier_fx_ambient_14 } from "./courier_ambient_effect/modifier_courier_fx_ambient_14";
import { modifier_courier_fx_ambient_15 } from "./courier_ambient_effect/modifier_courier_fx_ambient_15";
import { modifier_courier_fx_ambient_16 } from "./courier_ambient_effect/modifier_courier_fx_ambient_16";
import { modifier_courier_fx_ambient_18 } from "./courier_ambient_effect/modifier_courier_fx_ambient_18";
import { modifier_courier_fx_ambient_19 } from "./courier_ambient_effect/modifier_courier_fx_ambient_19";
import { modifier_courier_fx_ambient_20 } from "./courier_ambient_effect/modifier_courier_fx_ambient_20";
import { modifier_courier_fx_ambient_21 } from "./courier_ambient_effect/modifier_courier_fx_ambient_21";
import { modifier_courier_fx_ambient_24 } from "./courier_ambient_effect/modifier_courier_fx_ambient_24";
import { modifier_courier_fx_ambient_3 } from "./courier_ambient_effect/modifier_courier_fx_ambient_3";
import { modifier_courier_fx_ambient_30 } from "./courier_ambient_effect/modifier_courier_fx_ambient_30";
import { modifier_courier_fx_ambient_31 } from "./courier_ambient_effect/modifier_courier_fx_ambient_31";
import { modifier_courier_fx_ambient_32 } from "./courier_ambient_effect/modifier_courier_fx_ambient_32";
import { modifier_courier_fx_ambient_33 } from "./courier_ambient_effect/modifier_courier_fx_ambient_33";
import { modifier_courier_fx_ambient_34 } from "./courier_ambient_effect/modifier_courier_fx_ambient_34";
import { modifier_courier_fx_ambient_37 } from "./courier_ambient_effect/modifier_courier_fx_ambient_37";
import { modifier_courier_fx_ambient_38 } from "./courier_ambient_effect/modifier_courier_fx_ambient_38";
import { modifier_courier_fx_ambient_4 } from "./courier_ambient_effect/modifier_courier_fx_ambient_4";
import { modifier_courier_fx_ambient_5 } from "./courier_ambient_effect/modifier_courier_fx_ambient_5";
import { modifier_courier_fx_ambient_6 } from "./courier_ambient_effect/modifier_courier_fx_ambient_6";
import { modifier_courier_fx_ambient_7 } from "./courier_ambient_effect/modifier_courier_fx_ambient_7";
import { modifier_courier_fx_ambient_8 } from "./courier_ambient_effect/modifier_courier_fx_ambient_8";
import { modifier_courier_fx_ambient_9 } from "./courier_ambient_effect/modifier_courier_fx_ambient_9";
import { AllGenericEffect } from "./effect/AllGenericEffect";
import { modifier_generic_motion_controller } from "./generic/modifier_generic_motion_controller";
import { modifier_spawn_activity } from "./spawn/modifier_spawn_activity";


[
    modifier_animation_freeze,
    modifier_animation_translate_permanent,
    modifier_animation_translate,
    modifier_animation,
];

[
    modifier_property,
    modifier_illusion,
    modifier_summon,
    modifier_dummy_unit,
    modifier_spawn_activity,
    modifier_jiaoxie_wudi,
    modifier_generic_motion_controller,
    modifier_mana_control,
];

[
    modifier_sect_archer_base_a,
    modifier_sect_assault_base_a,
    modifier_sect_atkspeed_base_a,
    modifier_sect_black_art_base_a,
    modifier_sect_blink_base_a,
    modifier_sect_cabala_base_a,
    modifier_sect_cannibalism_base_a,
    modifier_sect_cd_down_base_a,
    modifier_sect_cleave_base_a,
    modifier_sect_control_base_a,
    modifier_sect_copy_base_a,
    modifier_sect_demon_base_a,
    modifier_sect_disarm_base_a,
    modifier_sect_double_head_base_a,
    modifier_sect_fish_chess_base_a,
    modifier_sect_flame_base_a,
    modifier_sect_ghost_base_a,
    modifier_sect_health_base_a,
    modifier_sect_ice_base_a,
    modifier_sect_invent_base_a,
    modifier_sect_light_base_a,
    modifier_sect_magarm_up_base_a,
    modifier_sect_magic_base_a,
    modifier_sect_miss_base_a,
    modifier_sect_phyarm_down_base_a,
    modifier_sect_phyarm_up_base_a,
    modifier_sect_phycrit_base_a,
    modifier_sect_poision_base_a,
    modifier_sect_scilence_base_a,
    modifier_sect_seckill_base_a,
    modifier_sect_shield_base_a,
    modifier_sect_steal_base_a,
    modifier_sect_suck_blood_base_a,
    modifier_sect_summon_base_a,
    modifier_sect_territory_base_a,
    modifier_sect_thorns_base_a,
    modifier_sect_transform_base_a,
    modifier_sect_treatment_base_a,
    modifier_sect_vanity_base_a,
    modifier_sect_warpath_base_a,
    modifier_sect_weapon_base_a,

];



[
    modifier_courier_fx_ambient_1,
    modifier_courier_fx_ambient_3,
    modifier_courier_fx_ambient_4,
    modifier_courier_fx_ambient_5,
    modifier_courier_fx_ambient_6,
    modifier_courier_fx_ambient_7,
    modifier_courier_fx_ambient_8,
    modifier_courier_fx_ambient_9,
    modifier_courier_fx_ambient_10,
    modifier_courier_fx_ambient_11,
    modifier_courier_fx_ambient_12,
    modifier_courier_fx_ambient_13,
    modifier_courier_fx_ambient_14,
    modifier_courier_fx_ambient_15,
    modifier_courier_fx_ambient_16,
    modifier_courier_fx_ambient_18,
    modifier_courier_fx_ambient_19,
    modifier_courier_fx_ambient_20,
    modifier_courier_fx_ambient_21,
    modifier_courier_fx_ambient_24,
    modifier_courier_fx_ambient_30,
    modifier_courier_fx_ambient_31,
    modifier_courier_fx_ambient_32,
    modifier_courier_fx_ambient_33,
    modifier_courier_fx_ambient_34,
    modifier_courier_fx_ambient_37,
    modifier_courier_fx_ambient_38,
]

export class AllModifierEntity {
    static init() {
        GLogHelper.print("register all AllModifierEntity");
        AllGenericEffect.init();
    }
}