import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_assault_base_a extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phyarm = this.getSpecialData("phyarm");

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    magicarm_pct = this.getSpecialData("magicarm_pct");
}

@registerModifier()
export class modifier_sect_assault_base_b extends modifier_sect_assault_base_a {
}
@registerModifier()
export class modifier_sect_assault_base_c extends modifier_sect_assault_base_a {
}
@registerModifier()
export class modifier_sect_assault_centaur_stampede_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_centaur_stampede_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_earth_spirit_rolling_boulder_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_earth_spirit_rolling_boulder_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_magnataur_skewer_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_magnataur_skewer_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_marci_companion_run_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_marci_companion_run_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_phantom_lancer_phantom_edge_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_phantom_lancer_phantom_edge_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_primal_beast_onslaught_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_primal_beast_onslaught_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_slark_pounce_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_slark_pounce_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_snapfire_firesnap_cookie_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_snapfire_firesnap_cookie_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_spirit_breaker_charge_of_darkness_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_spirit_breaker_charge_of_darkness_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_tusk_snowball_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_tusk_snowball_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_ursa_earthshock_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_assault_ursa_earthshock_c extends modifier_combination_effect {
}