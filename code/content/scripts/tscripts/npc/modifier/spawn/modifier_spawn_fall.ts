import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifierMotionVertical_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_spawn_fall extends BaseModifierMotionVertical_Plus {
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
    Init(kv: IModifierTable) {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let pos = parent.GetAbsOrigin()
            // 初始化高度
            this.vStartPosition = GetGroundPosition(pos, parent) + Vector(0, 0, 1000) as Vector;
            this.GetParentPlus().SetAbsOrigin(this.vStartPosition);
            //  play_particle("particles/econ/items/natures_prophet/natures_prophet_weapon_sufferwood/furion_teleport_end_team_sufferwood.vpcf",ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,this.GetParentPlus(),5)
            //  let pos = keys.pos || ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
            //  let pp = ParticleManager.CreateParticle("particles/econ/items/natures_prophet/natures_prophet_weapon_sufferwood/furion_teleport_end_team_sufferwood.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
            //  ParticleManager.SetParticleControlEnt( pp, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true );
            //  ParticleManager.SetParticleControlEnt( pp, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true );
            //  Timers.CreateTimer(5, () => {
            //      if ( pp != null ) {
            //          ParticleManager.DestroyParticle(pp,true)
            //      }
            //  })
            // 不知道为啥 有时候会出现这个错误 BeginMotionOrDestroy 移动失败
            // 目标点
            this.vTargetPosition = GetGroundPosition(pos, parent);
            this.StartIntervalThink(FrameTime())
        }
    }

    OnIntervalThink(): void {
        this.UpdateVerticalMotion(this.GetParentPlus(), FrameTime());
    }

    DestroyHandler: IGHandler;
    BeDestroy() {
        if (IsServer()) {
            this.GetParentPlus().RemoveVerticalMotionController(this);
            if (this.DestroyHandler) {
                this.DestroyHandler.run();
                this.DestroyHandler = null;
            }
        }
    }
    CheckState() {
        let state = {
            // [modifierstate.MODIFIER_STATE_STUNNED]: true,
            //  [modifierstate.MODIFIER_STATE_UNSELECTABLE] : true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
        };
        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }

    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let curr_position = this.GetParentPlus().GetAbsOrigin() + Vector(0, 0, -60) as Vector;
            me.SetAbsOrigin(curr_position);
            //  判断是否到达了地面
            if ((me.GetAbsOrigin() - this.vTargetPosition as Vector).Length() <= 30) {
                // 到终点了
                me.SetAbsOrigin(this.vTargetPosition);
                me.InterruptMotionControllers(true);
                ResHelper.CreateParticle(
                    new ResHelper.ParticleInfo()
                        .set_resPath("particles/dev/library/base_dust_hit_shockwave.vpcf")
                        .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                        .set_validtime(3)
                        .set_owner(me)
                );
                EmitSoundOn("Hero_OgreMagi.Idle.Headbutt", me);
                this.StartIntervalThink(-1)
                this.Destroy()
            }
        }
    }
}
