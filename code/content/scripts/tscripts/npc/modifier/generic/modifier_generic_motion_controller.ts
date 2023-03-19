
import { BaseModifierMotionBoth_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
@registerModifier()
export class modifier_generic_motion_controller extends BaseModifierMotionBoth_Plus {
    public distance: number;
    public direction: any;
    public duration: number;
    public height: any;
    public bInterruptible: any;
    public bGroundStop: any;
    public bDecelerate: any;
    public bIgnoreTenacity: any;
    public treeRadius: any;
    public bStun: any;
    public bDestroyTreesAlongPath: any;
    public velocity: any;
    public horizontal_velocity: any;
    public horizontal_acceleration: any;
    public vertical_velocity: any;
    public vertical_acceleration: any;
    IgnoreTenacity() {
        return this.bIgnoreTenacity == 1;
    }
    IsPurgable(): boolean {
        return this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber();
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.distance = params.distance;
        this.direction = Vector(params.direction_x, params.direction_y, params.direction_z).Normalized();
        this.duration = params.duration;
        this.height = params.height;
        this.bInterruptible = params.bInterruptible;
        this.bGroundStop = params.bGroundStop;
        this.bDecelerate = params.bDecelerate;
        this.bIgnoreTenacity = params.bIgnoreTenacity;
        this.treeRadius = params.treeRadius;
        this.bStun = params.bStun;
        this.bDestroyTreesAlongPath = params.bDestroyTreesAlongPath;
        this.velocity = this.direction * this.distance / this.duration;
        if (this.bDecelerate && this.bDecelerate == 1) {
            this.horizontal_velocity = (2 * this.distance / this.duration) * this.direction;
            this.horizontal_acceleration = -(2 * this.distance) / (this.duration * this.duration);
        }
        if (this.height) {
            this.vertical_velocity = 4 * this.height / this.duration;
            this.vertical_acceleration = -(8 * this.height) / (this.duration * this.duration);
        }
        if (this.ApplyHorizontalMotionController() == false) {
            this.Destroy();
        }
        if (this.GetParentPlus().HasModifier("modifier_tusk_walrus_punch_air_time") || this.GetParentPlus().HasModifier("modifier_tusk_walrus_kick_air_time") || this.ApplyVerticalMotionController() == false) {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveHorizontalMotionController(this);
        this.GetParentPlus().RemoveVerticalMotionController(this);
        if (this.GetRemainingTime() <= 0 && this.treeRadius) {
            GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetOrigin(), this.treeRadius, true);
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        if (!this.bDecelerate || this.bDecelerate == 0) {
            me.SetOrigin(me.GetOrigin() + this.velocity * dt as Vector);
        } else {
            me.SetOrigin(me.GetOrigin() + (this.horizontal_velocity * dt) as Vector);
            this.horizontal_velocity = this.horizontal_velocity + (this.direction * this.horizontal_acceleration * dt);
        }
        if (this.bDestroyTreesAlongPath && this.bDestroyTreesAlongPath == 1) {
            GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetOrigin(), this.GetParentPlus().GetHullRadius(), true);
        }
        if (this.bInterruptible == 1 && this.GetParentPlus().IsStunned()) {
            this.Destroy();
        }
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.height) {
            me.SetOrigin(me.GetOrigin() + Vector(0, 0, this.vertical_velocity) * dt as Vector);
            if (this.bGroundStop == 1 && GetGroundHeight(this.GetParentPlus().GetAbsOrigin(), undefined) > this.GetParentPlus().GetAbsOrigin().z) {
                this.Destroy();
            } else {
                this.vertical_velocity = this.vertical_velocity + (this.vertical_acceleration * dt);
            }
        } else {
            me.SetOrigin(GetGroundPosition(me.GetOrigin(), undefined));
        }
    }
    OnVerticalMotionInterrupted(): void {
        this.Destroy();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {}
        if (this.bStun && this.bStun == 1) {
            state[modifierstate.MODIFIER_STATE_STUNNED] = true;
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return GameActivity_t.ACT_DOTA_FLAIL;
        }
    }
}
