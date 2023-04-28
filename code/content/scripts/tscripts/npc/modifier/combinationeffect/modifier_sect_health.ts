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
            parent.StepChangeModelScale(parent.GetModelScale() * 1.1);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    health_bonus: number


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