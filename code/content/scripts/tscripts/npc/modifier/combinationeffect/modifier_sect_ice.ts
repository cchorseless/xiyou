import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_ice_base_a extends modifier_combination_effect {

    Init() {
        let parent = this.GetParentPlus();
        // this.buff_fx = ResHelper.CreateParticleEx("particles/status_fx/status_effect_drow_frost_arrow.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_ice_base_b extends modifier_combination_effect {
}

@registerModifier()
export class modifier_sect_ice_base_c extends modifier_combination_effect {
}

@registerModifier()
export class modifier_sect_ice_enemy_ice extends BaseModifier_Plus {

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_drow_frost_arrow.vpcf";
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    attack_speed_reduction: number = 0;


    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    // attack_speed_reduction: number = 0;
}
