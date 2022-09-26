/*
 * @Author: Jaxh
 * @Date: 2021-05-07 16:05:35
 * @LastEditors: your name
 * @LastEditTime: 2021-06-15 19:08:54
 * @Description: file content
 */
import { GameEnum } from "../../GameEnum";
import { GameFunc } from "../../GameFunc";
import { AoiHelper } from "../../helper/AoiHelper";
import { LogHelper } from "../../helper/LogHelper";
import { BaseModifier, BaseModifierMotionBoth, BaseModifierMotionHorizontal, BaseModifierMotionVertical } from "./Base_Plus";

export type Modifier_Plus = BaseModifier | BaseModifier_Plus | BaseModifierMotionBoth_Plus | BaseModifierMotionVertical_Plus | BaseModifierMotionHorizontal_Plus;
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
export function registerProp(params: GameEnum.Property.Enum_MODIFIER_PROPERTY) {
    // LogHelper.print(GameRules.State_Get(), 'registerModifier')
    // 首次加载时不需要
    // if (IsServer() && GameRules.State_Get() < DOTA_GameState.DOTA_GAMERULES_STATE_TEAM_SHOWCASE) {
    //     return
    // }
    return (target: BaseModifier_Plus, attr: string, desc: any = null) => {
        // 处理属性
        if (desc == null) {
            if (target.__AllRegisterProperty == null) {
                target.__AllRegisterProperty = {}
            }
            if (target.__AllRegisterProperty[params] == null) {
                target.__AllRegisterProperty[params] = new Set();
            }
            target.__AllRegisterProperty[params].add(attr);
            // LogHelper.print(target.constructor.name, params, attr, target.__AllRegisterProperty[params].size)
        }
        // 处理函数
        else {
            if (target.__AllRegisterFunction == null) {
                target.__AllRegisterFunction = {}
            }
            if (target.__AllRegisterFunction[params] == null) {
                target.__AllRegisterFunction[params] = new Set();
            }
            target.__AllRegisterFunction[params].add(desc.value);
            // LogHelper.print(target.constructor.name, params, target.__AllRegisterFunction[params].size)
        }
    }
}


