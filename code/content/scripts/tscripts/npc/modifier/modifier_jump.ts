
import { GameFunc } from "../../GameFunc";
import { ResHelper } from "../../helper/ResHelper";
import { BaseModifierMotionBoth_Plus, registerProp } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

@registerModifier()
export class modifier_jump extends BaseModifierMotionBoth_Plus {
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
    sound: string;
    animation: GameActivity_t;
    Init(kv: IModifierTable) {
        if (IsServer()) {
            if (this.ApplyHorizontalMotionController() == false || this.ApplyVerticalMotionController() == false) {
                this.Destroy();
                return;
            }
            this.vStartPosition = GetGroundPosition(this.GetParentPlus().GetOrigin(), this.GetParentPlus());
            this.vTargetPosition = Vector(kv.vx, kv.vy, 128);
            this.vDirection = ((this.vTargetPosition - this.vStartPosition) as Vector).Normalized();
            this.flHorizontalSpeed = 1000.0 / 30;
            this.flDistance = ((this.vTargetPosition - this.vStartPosition) as Vector).Length2D() + this.flHorizontalSpeed;
            this.leap_traveled = 0;
            // this.GetParentPlus().SetForwardVector(this.vDirection)
            this.sound = "Ability.TossThrow";
            //  创建开始的特效和音效
            EmitSoundOn(this.sound, this.GetParentPlus());
            this.animation = GameActivity_t.ACT_DOTA_FLAIL;
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let npc = this.GetParentPlus();
            npc.RemoveHorizontalMotionController(this);
            npc.RemoveVerticalMotionController(this);
            if (npc.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                npc.SetForwardVector(Vector(0, 1, 0));
            } else if (npc.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_BADGUYS) {
                npc.SetForwardVector(Vector(0, -1, 0));
            }
        }
    }

    CheckState() {
        let state = {
            //  [modifierstate.MODIFIER_STATE_STUNNED] : true,
            //  [modifierstate.MODIFIER_STATE_UNSELECTABLE] : true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
        };
        return state;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    g_OverrideAnimation() {
        return this.animation || GameActivity_t.ACT_DOTA_FLAIL;
    }

    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            //  判断是否到达了终点
            //  if ( this.leap_traveled < this.flDistance ) {
            if (GameFunc.AsVector(me.GetAbsOrigin() - this.vTargetPosition).Length2D() > this.flHorizontalSpeed) {
                me.SetAbsOrigin(GameFunc.AsVector(me.GetAbsOrigin() + this.vDirection * this.flHorizontalSpeed));
                this.leap_traveled = this.leap_traveled + this.flHorizontalSpeed;
            } else {
                // 到终点了
                me.SetAbsOrigin(this.vTargetPosition);
                let chessComp = me.ETRoot.As<IBuildingEntityRoot>().ChessComp();
                // RemoveAbilityAndModifier(me, "jiaoxie");
                me.InterruptMotionControllers(true);
                ResHelper.CreateParticle(
                    new ResHelper.ParticleInfo()
                        .set_resPath("particles/dev/library/base_dust_hit_shockwave.vpcf")
                        .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                        .set_owner(me)
                        .set_validtime(3)
                );
                EmitSoundOn("Hero_OgreMagi.Idle.Headbutt", me);
                this.Destroy();
                chessComp.OnblinkChessFinish();
            }
        }
    }

    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.flDistance > 300) {
                let z = (math.sin((this.leap_traveled / this.flDistance) * 3.1415926) * 2 * this.flDistance) / 3.1415926;
                me.SetAbsOrigin(GameFunc.AsVector(GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, z / 2)));
                //  } else {
                //      this.animation = GameActivity_t.ACT_DOTA_RUN
            }
        }
    }
}
