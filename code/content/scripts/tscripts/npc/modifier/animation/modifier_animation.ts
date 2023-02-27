
import { AnimationHelper } from "../../../helper/AnimationHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
@registerModifier()
export class modifier_animation extends BaseModifier_Plus {
    public keys: any;
    public activity: any;
    public rate: any;
    public rest: any;
    public translate: any;
    BeCreated(keys: any): void {
        this.keys = keys;
        if (!IsServer()) {
            let stack = keys.stack_count;
            let activity = bit.band(stack,);
            let rate = bit.rshift(bit.band(stack,), 11);
            let rest = bit.rshift(bit.band(stack,), 19);
            this.activity = activity;
            this.rate = rate / 20;
            this.rest = rest;
            this.translate = AnimationHelper._CODE_TO_ANIMATION_TRANSLATE[this.rest];
        } else {
            this.translate = keys.translate;
        }
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
        2: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_WEIGHT,
        4: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
    }
    return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** ...__args */): GameActivity_t {
        return this.activity;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE)
    CC_GetOverrideAnimationRate( /** ...__args */): number {
        return this.rate;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_WEIGHT)
    CC_GetOverrideAnimationWeight( /** ...__args */): number {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers( /** ...__args */): string {
        return this.translate || 0;
    }
}
