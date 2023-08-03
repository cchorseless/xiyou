import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

// 沉睡
@registerModifier()
export class modifier_generic_sleep extends BaseModifier_Plus {
    public minDuration: number;
    BeCreated(kv: any): void {
        this.minDuration = kv.min_duration || 0;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (params.unit == this.GetParentPlus() && this.GetElapsedTime() > this.minDuration) {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE)
    CC_GetOverrideAnimationRate(): number {
        return 0.5;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_sleep.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_nightmare.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 4;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_NIGHTMARED]: true,
            [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true,
            [modifierstate.MODIFIER_STATE_LOW_ATTACK_PRIORITY]: true
        };
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
