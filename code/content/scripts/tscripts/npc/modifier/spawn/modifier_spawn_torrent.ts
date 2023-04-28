import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifierMotionBoth_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_spawn_torrent extends BaseModifierMotionBoth_Plus {
    IsStunDebuff() {
        return true;
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
    fDistance: number;
    step: number;
    height: number;
    Init(kv: IModifierTable) {
        if (IsServer()) {
            if (!this.BeginMotionOrDestroy()) { return };
            this.vStartPosition = GetGroundPosition(this.GetParentPlus().GetOrigin(), this.GetParentPlus());
            this.vTargetPosition = Vector(kv.vx, kv.vy, 0);
            this.vDirection = GFuncVector.AsVector(this.vTargetPosition - this.vStartPosition).Normalized();
            this.fDistance = GFuncVector.AsVector(this.vTargetPosition - this.vStartPosition).Length2D();
            this.step = 0; // 0~30
            this.height = RandomInt(200, 600);
            //  创建开始的特效和音效
            EmitSoundOn("animation.torrent", this.GetParentPlus());
            let ppp = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_WORLDORIGIN)
                    .set_resPath("particles/units/heroes/hero_kunkka/kunkka_spell_torrent_splash_group_c.vpcf")
                    .set_validtime(3)
            );
            ParticleManager.SetParticleControl(ppp, 0, this.GetParentPlus().GetOrigin());
        }
    }
    DestroyHandler: IGHandler;
    BeDestroy() {
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this);
            this.GetParentPlus().RemoveVerticalMotionController(this);
            if (this.DestroyHandler) {
                this.DestroyHandler.run();
                this.DestroyHandler = null;
            }
        }
    }
    OnVerticalMotionInterrupted(): void {
        this.Destroy()
    }

    OnHorizontalMotionInterrupted(): void {
        this.Destroy()
    }
    CheckState() {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
        };

        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }

    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            //  判断是否到达了终点
            //  if ( this.leap_traveled < this.flDistance ) {
            if (this.step < 30) {
                me.SetAbsOrigin(GFuncVector.AsVector(this.vStartPosition + this.vDirection * this.fDistance * (this.step / 30)));
                this.step = this.step + 1;
            } else {
                // 到终点了
                me.SetAbsOrigin(this.vTargetPosition);
                me.InterruptMotionControllers(true);
            }
        }
    }

    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let z = (1 - (this.step / 15 - 1) * (this.step / 15 - 1)) * this.height;
            me.SetAbsOrigin(GFuncVector.AsVector(GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, z)));
        }
    }
}
