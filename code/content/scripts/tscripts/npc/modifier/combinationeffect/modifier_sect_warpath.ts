import { ResHelper } from "../../../helper/ResHelper";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_warpath_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_ursa/ursa_fury_swipes_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_warpath_base_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_base_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_abyssal_underlord_atrophy_aura_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_abyssal_underlord_atrophy_aura_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_bristleback_warpath_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_bristleback_warpath_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_earthshaker_enchant_totem_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_earthshaker_enchant_totem_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_legion_commander_duel_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_legion_commander_duel_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_life_stealer_rage_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_life_stealer_rage_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_luna_lunar_blessing_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_luna_lunar_blessing_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_lycan_feral_impulse_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_lycan_feral_impulse_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_omniknight_hammer_of_purity_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_omniknight_hammer_of_purity_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_spectre_desolate_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_spectre_desolate_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_tidehunter_anchor_smash_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_tidehunter_anchor_smash_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_ursa_fury_swipes_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_ursa_fury_swipes_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_vengefulspirit_command_aura_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_vengefulspirit_command_aura_c extends modifier_combination_effect {
}