import { ResHelper } from "../../../helper/ResHelper";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_atkspeed_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/items2_fx/mask_of_madness.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/items2_fx/mask_of_madness.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_atkspeed_base_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_base_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_beastmaster_inner_beast_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_beastmaster_inner_beast_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_bloodseeker_bloodrage_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_bloodseeker_bloodrage_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_dark_willow_bedlam_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_dark_willow_bedlam_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_enchantress_untouchable_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_enchantress_untouchable_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_huskar_berserkers_blood_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_huskar_berserkers_blood_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_invoker_alacrity_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_invoker_alacrity_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_legion_commander_press_the_attack_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_legion_commander_press_the_attack_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_life_stealer_ghoul_frenzy_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_life_stealer_ghoul_frenzy_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_lina_fiery_soul_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_lina_fiery_soul_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_lone_druid_spirit_link_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_lone_druid_spirit_link_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_ogre_magi_bloodlust_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_ogre_magi_bloodlust_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_troll_warlord_fervor_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_troll_warlord_fervor_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_visage_grave_chill_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_visage_grave_chill_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_wisp_overcharge_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_atkspeed_wisp_overcharge_c extends modifier_combination_effect {
}