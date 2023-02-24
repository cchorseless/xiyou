import { PropertyConfig } from "../../shared/PropertyConfig";
import { BaseModifier, BaseModifierMotionBoth, BaseModifierMotionHorizontal, BaseModifierMotionVertical } from "./Base_Plus";

declare global {
    type IBaseModifier_Plus = BaseModifier_Plus;
    type IModifier_Plus = BaseModifier | BaseModifier_Plus | BaseModifierMotionBoth_Plus | BaseModifierMotionVertical_Plus | BaseModifierMotionHorizontal_Plus;
}
/**
 * 执行顺讯 装饰器=>DeclareFunctions=>constructor=>OnCreate=>Init
 */
export class BaseModifier_Plus extends BaseModifier {

    // CheckMotionControllers?(): boolean { 
    //     let parent = this.GetParent();
    //     let modifier_priority = this.GetPriority();
    //     let is_motion_controller = false;
    //     let motion_controller_priority;
    //     let found_modifier_handler;
    //     let non_imba_motion_controllers = {
    //         1: "modifier_brewmaster_storm_cyclone",
    //         2: "modifier_dark_seer_vacuum",
    //         3: "modifier_eul_cyclone",
    //         4: "modifier_earth_spirit_rolling_boulder_caster",
    //         5: "modifier_huskar_life_break_charge",
    //         6: "modifier_invoker_tornado",
    //         7: "modifier_item_forcestaff_active",
    //         8: "modifier_rattletrap_hookshot",
    //         9: "modifier_phoenix_icarus_dive",
    //         10: "modifier_shredder_timber_chain",
    //         11: "modifier_slark_pounce",
    //         12: "modifier_spirit_breaker_charge_of_darkness",
    //         13: "modifier_tusk_walrus_punch_air_time",
    //         14: "modifier_earthshaker_enchant_totem_leap"
    //     }
    //     let modifiers = parent.FindAllModifiers();
    //     for (const [_, modifier] of pairs(modifiers)) {
    //         if (this != modifier) {
    //             if (modifier.IsMotionController) {
    //                 if (modifier.IsMotionController()) {
    //                     found_modifier_handler = modifier;
    //                     is_motion_controller = true;
    //                     motion_controller_priority = modifier.GetMotionControllerPriority();
    //                     return;
    //                 }
    //             }
    //             for (const [_, non_imba_motion_controller] of pairs(non_imba_motion_controllers)) {
    //                 if (modifier.GetName() == non_imba_motion_controller) {
    //                     found_modifier_handler = modifier;
    //                     is_motion_controller = true;
    //                     motion_controller_priority = DOTA_MOTION_CONTROLLER_PRIORITY_HIGHEST;
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     if (is_motion_controller && motion_controller_priority) {
    //         if (motion_controller_priority > modifier_priority) {
    //             return false;
    //         } else if (motion_controller_priority == modifier_priority) {
    //             if (found_modifier_handler.GetCreationTime() >= this.GetCreationTime()) {
    //                 return false;
    //             } else {
    //                 found_modifier_handler.Destroy();
    //                 return true;
    //             }
    //         } else {
    //             parent.InterruptMotionControllers(true);
    //             found_modifier_handler.Destroy();
    //             return true;
    //         }
    //     } else {
    //         return true;
    //     }
    // }
}

export class BaseModifierMotionBoth_Plus extends BaseModifierMotionBoth {

}
export class BaseModifierMotionVertical_Plus extends BaseModifierMotionVertical {


}
export class BaseModifierMotionHorizontal_Plus extends BaseModifierMotionHorizontal {

}

/**
 * 装饰器 注册属性统计标签
 * @param params
 * @returns
 */
export function registerProp(params: PropertyConfig.EMODIFIER_PROPERTY) {
    // LogHelper.print(GameRules.State_Get(), 'registerModifier')
    // 首次加载时不需要
    // if (IsServer() && GameRules.State_Get() < DOTA_GameState.DOTA_GAMERULES_STATE_TEAM_SHOWCASE) {
    //     return
    // }
    return (target: BaseModifier_Plus, attr: string, desc: any = null) => {
        const params_key = params + "";
        // 处理属性
        if (desc == null) {
            if (target.__AllRegisterProperty == null) {
                target.__AllRegisterProperty = {}
            }
            if (target.__AllRegisterProperty[params_key] == null) {
                target.__AllRegisterProperty[params_key] = new Set();
            }
            target.__AllRegisterProperty[params_key].add(attr);
            // LogHelper.print(target.constructor.name, params_key, attr, target.__AllRegisterProperty[params_key].size)
        }
        // 处理函数
        else {
            if (target.__AllRegisterFunction == null) {
                target.__AllRegisterFunction = {}
            }
            if (target.__AllRegisterFunction[params_key] == null) {
                target.__AllRegisterFunction[params_key] = new Set();
            }
            target.__AllRegisterFunction[params_key].add(attr);
            // LogHelper.print(target.constructor.name, params_key, target.__AllRegisterFunction[params_key].size)
        }
    }
}

