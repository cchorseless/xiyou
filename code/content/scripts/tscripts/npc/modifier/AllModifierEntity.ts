import { modifier_property } from "../propertystat/modifier_property";
import { modifier_animation } from "./animation/modifier_animation";
import { modifier_animation_freeze } from "./animation/modifier_animation_freeze";
import { modifier_animation_translate } from "./animation/modifier_animation_translate";
import { modifier_animation_translate_permanent } from "./animation/modifier_animation_translate_permanent";
import { modifier_dummy_unit } from "./battle/modifier_dummy_unit";
import { modifier_generic_illusion } from "./battle/modifier_generic_illusion";
import { modifier_generic_summon } from "./battle/modifier_generic_summon";
import { modifier_jiaoxie_wudi } from "./battle/modifier_jiaoxie_wudi";
import { modifier_mana_control } from "./battle/modifier_mana_control";
import { modifier_tower_auto_attack } from "./battle/modifier_tower_auto_attack";
import { modifier_combination_effect } from "./combinationeffect/modifier_combination_effect";




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
import { modifier_wearable } from "./modifier_wearable";
import { modifier_spawn_activity } from "./spawn/modifier_spawn_activity";


[
    modifier_animation_freeze,
    modifier_animation_translate_permanent,
    modifier_animation_translate,
    modifier_animation,
];

[
    modifier_property,
    modifier_generic_illusion,
    modifier_generic_summon,
    modifier_dummy_unit,
    modifier_spawn_activity,
    modifier_jiaoxie_wudi,
    modifier_generic_motion_controller,
    modifier_mana_control,
    modifier_wearable,
    modifier_tower_auto_attack,
];

[
    modifier_combination_effect,
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