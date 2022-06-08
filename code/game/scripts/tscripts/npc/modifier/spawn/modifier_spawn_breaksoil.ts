import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { EnemyUnitEntityRoot } from "../../../rules/Components/Enemy/EnemyUnitEntityRoot";
import { BaseModifierMotionVertical_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_spawn_breaksoil extends BaseModifierMotionVertical_Plus {
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
    Init(kv: ModifierTable) {
        if (IsServer()) {
            if (this.ApplyVerticalMotionController() == false) {
                this.Destroy();
                return;
            }
            // 初始化高度
            this.vStartPosition = GameFunc.AsVector(GetGroundPosition(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus()) + Vector(0, 0, -200));
            this.GetParentPlus().SetOrigin(this.vStartPosition);
            let ppp = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo().set_resPath("particles/units/heroes/hero_sandking/sandking_loadout.vpcf").set_iAttachment(ParticleAttachment_t.PATTACH_WORLDORIGIN).set_validtime(5).set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControl(ppp, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(ppp, 1, this.GetParentPlus().GetAbsOrigin());
            EmitSoundOn("Hero_EarthSpirit.Magnetize.Debris", this.GetParentPlus());
            //  play_particle("particles/econ/items/natures_prophet/natures_prophet_weapon_sufferwood/furion_teleport_end_team_sufferwood.vpcf",ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,this.GetParentPlus(),5)
            //  let pos = keys.pos || ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
            //  let pp = ParticleManager.CreateParticle("particles/econ/items/natures_prophet/natures_prophet_weapon_sufferwood/furion_teleport_end_team_sufferwood.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
            //  ParticleManager.SetParticleControlEnt( pp, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true );
            //  ParticleManager.SetParticleControlEnt( pp, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true );
            // 目标点
            this.vTargetPosition = GetGroundPosition(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus());
        }
    }

    OnDestroy() {
        super.Destroy();
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this);
            this.GetParentPlus().RemoveVerticalMotionController(this);
            //  this.GetParentPlus().SetForwardVector(Vector(0,-1,0))
            if (this.GetParentPlus().ETRoot.AsValid<EnemyUnitEntityRoot>("EnemyUnitEntityRoot")) {
                let EnemyUnit = this.GetParentPlus().ETRoot.As<EnemyUnitEntityRoot>().EnemyUnitComp();
                if (EnemyUnit != null ) {
                    EnemyUnit.OnSpawnAnimalFinish();
                }
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    g_GetOverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }

    UpdateVerticalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let curr_position = GameFunc.AsVector(this.GetParentPlus().GetOrigin() + Vector(0, 0, 10));
            me.SetAbsOrigin(curr_position);
            //  判断是否到达了地面
            if (GameFunc.AsVector(me.GetOrigin() - this.vTargetPosition).Length() < 20) {
                // 到终点了
                me.SetAbsOrigin(this.vTargetPosition);
                me.InterruptMotionControllers(true);
                this.Destroy();
            }
        }
    }
}
