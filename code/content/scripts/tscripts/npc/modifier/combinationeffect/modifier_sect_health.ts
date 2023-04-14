import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_health_base_a extends modifier_combination_effect {

    Init() {
        let parent = this.GetParentPlus();
        this.health_bonus = this.getSpecialData("health_bonus");
        this.buff_fx = ResHelper.CreateParticleEx("particles/generic/generic_model_big.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.AddTimer(2, () => {
            ParticleManager.ClearParticle(this.buff_fx);
        })
        if (IsServer()) {
            this.StepChangeModelScale(parent.GetModelScale() * 1.1);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    health_bonus: number

    StepChangeModelScale(scale: number, step = 0.02) {
        let parent = this.GetParentPlus();
        parent.TempData().target_scale = scale;
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            if (!IsValid(parent)) { return }
            if (parent.TempData().target_scale !== scale) {
                return
            }
            let cur_scale = parent.GetModelScale();
            if (math.abs(cur_scale - scale) <= step) {
                return
            }
            if (cur_scale > scale) {
                parent.SetModelScale(cur_scale - step);
            }
            else {
                parent.SetModelScale(cur_scale + step);
            }
            return 1;
        }))
    }

}
@registerModifier()
export class modifier_sect_health_base_b extends modifier_sect_health_base_a {
    Init() {
        this.health_bonus = this.getSpecialData("health_bonus");
    }
}
@registerModifier()
export class modifier_sect_health_base_c extends modifier_sect_health_base_b {
}