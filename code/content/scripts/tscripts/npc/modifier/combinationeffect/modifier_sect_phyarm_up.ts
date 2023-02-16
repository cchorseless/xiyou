import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_phyarm_up_base_3 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base: number = this.getData("phyarm");
}
@registerModifier()
export class modifier_sect_phyarm_up_base_6 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base = this.getData("phyarm");
}
@registerModifier()
export class modifier_sect_phyarm_up_base_9 extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    phy_arm_base = this.getData("phyarm");
}

@registerModifier()
export class modifier_sect_phyarm_up_axe_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_axe_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_chen_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_chen_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_dragon_knight_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_dragon_knight_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_elder_titan_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_elder_titan_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_monkey_king_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_monkey_king_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_primal_beast_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_primal_beast_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_shredder_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_shredder_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_slardar_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_slardar_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_sven_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_sven_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_tiny_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_tiny_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_treant_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_treant_9 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_troll_warlord_6 extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_phyarm_up_troll_warlord_9 extends modifier_combination_effect {
}