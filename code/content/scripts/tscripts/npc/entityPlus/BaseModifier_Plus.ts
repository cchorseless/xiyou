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
    /**
     * @Server
     * @param bCreated 
     * @returns 
     */
    CheckUnique?(bCreated = false) {
        if (!IsServer()) { return }
        let hParent = this.GetParentPlus();
        if (bCreated) {
            let mod = hParent.FindAllModifiersByName(this.GetName());
            if (mod.length >= 2) {
                this.SetStackCount(1);
                return;
            } else {
                this.SetStackCount(0);
                return;
            }
        } else {
            if (this.GetStackCount() == 0) {
                let mod = hParent.FindModifierByName(this.GetName());
                if (mod) {
                    mod.SetStackCount(0);
                }
            }
        }
    }
    CheckUniqueValue?(value: number, tSuperiorModifierNames: string[]) {
        let hParent = this.GetParent();
        if (tSuperiorModifierNames) {
            for (const sSuperiorMod of (tSuperiorModifierNames)) {
                if (hParent.HasModifier(sSuperiorMod)) {
                    return 0;
                }
            }
        }
        if (bit.band(this.GetAttributes(), DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE) == DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE) {
            if (this.GetStackCount() == 1) {
                return 0;
            }
        }
        return value;
    }

}

export class ParticleModifierThinker extends BaseModifier {
    IsHidden() { return true }
    IsDebuff() { return false }
    IsPurgable() { return false }
    IsPurgeException() { return false }
    IsStunDebuff() { return false }
    AllowIllusionDuplicate() { return false }
    GetAttributes() { return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE }
    BeDestroy() {
        if (IsServer()) {
            if (IsValid(this.GetParentPlus())) {
                this.GetParentPlus().RemoveSelf()
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }
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
    return (target: IModifier_Plus, attr: string, desc: any = null) => {
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

