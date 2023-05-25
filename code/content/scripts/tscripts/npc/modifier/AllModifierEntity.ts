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
import { modifier_tower_auto_attack } from "./enmey/modifier_tower_auto_attack";
import { modifier_sect_effect_base } from "./secteffect/modifier_sect_effect_base";

import { modifier_courier_fx_ambient_1 } from "./courier/modifier_courier_fx_ambient";
import { AllGenericEffect } from "./effect/AllGenericEffect";
import { modifier_generic_motion_controller } from "./generic/modifier_generic_motion_controller";
import { modifier_wearable } from "./modifier_wearable";
import { modifier_spawn_activity } from "./spawn/modifier_spawn_activity";


[
    modifier_courier_fx_ambient_1,
];

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
    modifier_sect_effect_base,
];



export class AllModifierEntity {
    static init() {
        GLogHelper.print("register all AllModifierEntity");
        AllGenericEffect.init();
    }
}