import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { EnemyUnitEntityRoot } from "../../../rules/Components/Enemy/EnemyUnitEntityRoot";
import { BaseModifierMotionBoth_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
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
    Init(kv: ModifierTable) {
        if (IsServer()) {
            if (this.ApplyHorizontalMotionController() == false || this.ApplyVerticalMotionController() == false) {
                this.Destroy();
                return;
            }

            this.vStartPosition = GetGroundPosition(this.GetParentPlus().GetOrigin(), this.GetParentPlus());
            this.vTargetPosition = Vector(kv.vx, kv.vy, 128);
            this.vDirection = GameFunc.AsVector(this.vTargetPosition - this.vStartPosition).Normalized();
            this.fDistance = GameFunc.AsVector(this.vTargetPosition - this.vStartPosition).Length2D();
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

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this);
            this.GetParentPlus().RemoveVerticalMotionController(this);
            let chessComp = this.GetParentPlus().ETRoot.As<EnemyUnitEntityRoot>().ChessComp();

            if (chessComp != null ) {
                this.GetParentPlus().SetForwardVector(Vector(0, 1, 0));
            }
        }
    }

    CheckState() {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
        };

        return state;
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    g_GetOverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }

    UpdateHorizontalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            //  判断是否到达了终点
            //  if ( this.leap_traveled < this.flDistance ) {
            if (this.step < 30) {
                me.SetAbsOrigin(GameFunc.AsVector(this.vStartPosition + this.vDirection * this.fDistance * (this.step / 30)));
                this.step = this.step + 1;
            } else {
                // 到终点了
                me.SetAbsOrigin(this.vTargetPosition);
                let chessComp = me.ETRoot.As<EnemyUnitEntityRoot>().ChessComp();
                chessComp.is_moving = false;
                me.InterruptMotionControllers(true);
                this.Destroy();
                chessComp.blink_start_p = null;
            }
        }
    }

    UpdateVerticalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let z = (1 - (this.step / 15 - 1) * (this.step / 15 - 1)) * this.height;
            me.SetAbsOrigin(GameFunc.AsVector(GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, z)));
        }
    }
}
