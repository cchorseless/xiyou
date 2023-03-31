import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_atkspeed_base_a extends modifier_combination_effect {
    atk_speed: number;
    Init() {
        this.atk_speed = this.getSpecialData("atk_speed");
        let parent = this.GetParentPlus();
        // "particles/items2_fx/mask_of_madness.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/items2_fx/mask_of_madness.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT(): number {
        return this.atk_speed;
    }
}
@registerModifier()
export class modifier_sect_atkspeed_base_b extends modifier_combination_effect {
    atk_speed: number;
    Init() {
        this.atk_speed = this.getSpecialData("atk_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT(): number {
        return this.atk_speed;
    }
}
@registerModifier()
export class modifier_sect_atkspeed_base_c extends modifier_sect_atkspeed_base_b {
}

