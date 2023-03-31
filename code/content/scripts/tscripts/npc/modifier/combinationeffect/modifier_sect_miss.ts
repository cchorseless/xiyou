import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_miss_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_mirana/mirana_moonlight_owner.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.miss_pect = this.getSpecialData("miss_pect");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    miss_pect: number;
}
@registerModifier()
export class modifier_sect_miss_base_b extends modifier_sect_miss_base_a {
    Init() {
        this.miss_pect = this.getSpecialData("miss_pect");
    }
}
@registerModifier()
export class modifier_sect_miss_base_c extends modifier_sect_miss_base_b {
}