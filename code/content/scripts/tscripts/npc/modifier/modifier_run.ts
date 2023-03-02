
import { BaseModifierMotionHorizontal_Plus, registerProp } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

@registerModifier()
export class modifier_run extends BaseModifierMotionHorizontal_Plus {
    IsStunDebuff() {
        return false;
    }

    IsHidden() {
        return true;
    }

    IsPurgable() {
        return false;
    }

    RemoveOnDeath() {
        return false;
    }
    vStartPosition: Vector;
    vTargetPosition: Vector;
    vDirection: Vector;
    flHorizontalSpeed: number;
    flDistance: number;
    leap_traveled: number;
    sound: string = "Courier.Footsteps";
    animation: GameActivity_t;
    Init(kv: IModifierTable) {
        if (IsServer()) {
            if (this.ApplyHorizontalMotionController() == false) {
                this.Destroy();
                return;
            }
            let speed = 500;
            if (this.GetParentPlus() != null && this.GetParentPlus().GetIdealSpeed() != null) {
                speed = this.GetParentPlus().GetIdealSpeed();
            }
            if (speed > 2000) {
                speed = 2000;
            }
            if (speed < 100) {
                speed = 100;
            }
            if (kv.speed != null) {
                speed = kv.speed;
            }
            this.vStartPosition = GetGroundPosition(this.GetParentPlus().GetOrigin(), this.GetParentPlus());
            this.vTargetPosition = Vector(tonumber(kv.vx), tonumber(kv.vy), 128);
            this.vDirection = GFuncVector.AsVector(this.vTargetPosition - this.vStartPosition).Normalized();
            this.flHorizontalSpeed = speed / 30;
            this.flDistance = GFuncVector.AsVector(this.vTargetPosition - this.vStartPosition).Length2D() + this.flHorizontalSpeed;
            this.leap_traveled = 0;
            this.GetParentPlus().SetForwardVector(this.vDirection)
            this.sound = "Courier.Footsteps";
            //  创建开始的特效和音效
            EmitSoundOn(this.sound, this.GetParentPlus());
            this.animation = GameActivity_t.ACT_DOTA_RUN;
            this.GetParentPlus().AddActivityModifier("run");
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_RUN);
        }
    }

    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_IDLE);
            this.GetParentPlus().RemoveHorizontalMotionController(this);
            // this.GetParentPlus().RemoveVerticalMotionController(this);
        }
    }


    CheckState() {
        let state = {
            //  [modifierstate.MODIFIER_STATE_STUNNED] : true,
            //  [modifierstate.MODIFIER_STATE_UNSELECTABLE] : true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            //  [modifierstate.MODIFIER_STATE_INVULNERABLE] : true,
        };

        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation() {
        if (this.GetParentPlus().IsStunned()) {
            return GameActivity_t.ACT_DOTA_DISABLED;
        } else {
            return this.animation || GameActivity_t.ACT_DOTA_RUN;
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_AUTOATTACK)
    CC_DISABLE_AUTOATTACK() {
        return 0
    }

    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            //  判断是否到达了终点
            //  if ( this.leap_traveled < this.flDistance ) {
            if (GFuncVector.AsVector(me.GetAbsOrigin() - this.vTargetPosition).Length2D() > this.flHorizontalSpeed) {
                // 没到终点
                if (me.IsStunned() != true && me.IsFrozen() != true) {
                    me.MoveToPositionAggressive(this.vTargetPosition)
                    // me.SetAbsOrigin(GetGroundPosition(GFuncVector.AsVector(me.GetAbsOrigin() + this.vDirection * this.flHorizontalSpeed), me));
                    this.leap_traveled += this.flHorizontalSpeed;
                } else {
                    // 眩晕或冰冻，不位移
                }
            } else {
                // 到终点了
                me.SetAbsOrigin(GetGroundPosition(this.vTargetPosition, me));
                let chessComp = me.ETRoot.As<IBuildingEntityRoot>().ChessComp();
                me.InterruptMotionControllers(true);
                //  play_particle("particles/dev/library/base_dust_hit_shockwave.vpcf",ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,me,3)
                //  EmitSoundOn("Hero_OgreMagi.Idle.Headbutt",me)
                this.Destroy();
                chessComp.OnblinkChessFinish();
            }
        }
    }

    // UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
    //  if ( IsServer() ) {
    //      if ( this.flDistance > 300 ) {
    //          let z = math.sin(this.leap_traveled/this.flDistance*3.1415926)*2*this.flDistance/3.1415926
    //          me.SetAbsOrigin(GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0,0,z/2))
    //      //  } else {
    //      //      this.animation = GameActivity_t.ACT_DOTA_RUN
    //      }
    //  }
    // }
}
