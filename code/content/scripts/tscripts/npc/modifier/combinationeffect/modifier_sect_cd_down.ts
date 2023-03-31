import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_cd_down_base_a extends modifier_combination_effect {
    Init() {
        this.cooldown_pect = this.getSpecialData("cooldown_pect");
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_song_debuff_b.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_cannibalism/sect_cannibalism1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);

    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    cooldown_pect: number;


}
@registerModifier()
export class modifier_sect_cd_down_base_b extends modifier_sect_cd_down_base_a {
}
@registerModifier()
export class modifier_sect_cd_down_base_c extends modifier_sect_cd_down_base_a {
}
