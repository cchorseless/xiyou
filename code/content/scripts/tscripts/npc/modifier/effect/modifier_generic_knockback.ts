
import { BaseModifierMotionBoth_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
@registerModifier()
export class modifier_generic_knockback extends BaseModifierMotionBoth_Plus {
    public distance: number;
    public height: any;
    public duration: number;
    public direction: any;
    public tree: any;
    public stun: any;
    public flail: any;
    public parent: IBaseNpc_Plus;
    public origin: any;
    public hVelocity: any;
    public gravity: any;
    public vVelocity: any;
    public anim: any;
    public EndCallback: IGHandler;
    public interrupted: boolean;


    static ApplyKnockBack(target: IBaseNpc_Plus, caster: IBaseNpc_Plus, abiity: IBaseAbility_Plus, kv: {
        distance?: number,
        height?: number,
        duration?: number,
        direction_x?: number,
        direction_y?: number,
        tree_destroy_radius?: number,
        IsStun?: boolean,
        IsFlail?: boolean,
    }) {
        return target.AddNewModifier(caster, abiity, "modifier_generic_knockback", kv) as modifier_generic_knockback;
    }

    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    Init(kv: any): void {
        if (IsServer()) {
            this.distance = kv.distance || 0;
            this.height = kv.height || -1;
            this.duration = kv.duration || 0;
            if (kv.direction_x && kv.direction_y) {
                this.direction = Vector(kv.direction_x, kv.direction_y, 0).Normalized();
            } else {
                this.direction = -(this.GetParentPlus().GetForwardVector());
            }
            this.tree = kv.tree_destroy_radius || this.GetParentPlus().GetHullRadius();
            this.stun = GToBoolean(kv.IsStun);
            this.flail = GToBoolean(kv.IsFlail);
            if (this.duration == 0) {
                this.Destroy();
                return;
            }
            this.parent = this.GetParentPlus();
            this.origin = this.parent.GetOrigin();
            this.hVelocity = this.distance / this.duration;
            let half_duration = this.duration / 2;
            this.gravity = 2 * this.height / (half_duration * half_duration);
            this.vVelocity = this.gravity * half_duration;
            if (this.distance > 0) {
                if (this.ApplyHorizontalMotionController() == false) {
                    this.Destroy();
                    return;
                }
            }
            if (this.height >= 0) {
                if (this.ApplyVerticalMotionController() == false) {
                    this.Destroy();
                    return;
                }
            }
            if (this.flail) {
                this.SetStackCount(1);
            } else if (this.stun) {
                this.SetStackCount(2);
            }
        }
        this.anim = this.GetStackCount();
    }

    BeDestroy( /** kv */): void {
        if (!IsServer()) {
            return;
        }
        if (!this.interrupted) {
            if (this.tree > 0) {
                GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetOrigin(), this.tree, true);
            }
        }
        this.GetParentPlus().InterruptMotionControllers(true);
        this.GetParentPlus().RemoveGesture(this.CC_GetOverrideAnimation());
        if (this.EndCallback) {
            this.EndCallback.runWith([this.interrupted]);
            this.EndCallback = null;
        }
    }
    SetEndCallback(func: IGHandler) {
        this.EndCallback = func;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        if (this.anim == 1) {
            return GameActivity_t.ACT_DOTA_FLAIL;
        } else if (this.anim == 2) {
            return GameActivity_t.ACT_DOTA_DISABLED;
        }
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: this.stun
        }
        return state;
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        let parent = this.GetParentPlus();
        let target = this.direction * this.distance * (dt / this.duration);
        parent.SetOrigin(parent.GetOrigin() + target as Vector);
    }
    OnHorizontalMotionInterrupted(): void {
        if (IsServer()) {
            this.interrupted = true;
            this.Destroy();
        }
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        this.parent.SetOrigin(this.parent.GetOrigin() + Vector(0, 0, this.vVelocity * dt) as Vector);
        this.vVelocity = this.vVelocity - this.gravity * dt;
    }
    OnVerticalMotionInterrupted(): void {
        if (IsServer()) {
            this.interrupted = true;
            this.Destroy();
        }
    }
    GetEffectName(): string {
        if (!IsServer()) {
            return;
        }
        if (this.stun) {
            return "particles/generic_gameplay/generic_stunned.vpcf";
        }
    }
    GetEffectAttachType(): ParticleAttachment_t {
        if (!IsServer()) {
            return;
        }
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
