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

