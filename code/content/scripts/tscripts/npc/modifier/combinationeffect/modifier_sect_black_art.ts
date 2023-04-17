import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_black_art_base_a extends modifier_combination_effect {

    spell_lifesteal: number;
    Init() {
        this.spell_lifesteal = this.getSpecialData("spell_lifesteal");
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/econ/events/ti7/hero_levelup_ti7_flash_hit_magic.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);

    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_LIFESTEAL_PERCENTAGE)
    CC_SPELL_LIFESTEAL_PERCENTAGE(): number {
        return this.spell_lifesteal;
    }

}
@registerModifier()
export class modifier_sect_black_art_base_b extends modifier_sect_black_art_base_a {
}
@registerModifier()
export class modifier_sect_black_art_base_c extends modifier_sect_black_art_base_a {
}

