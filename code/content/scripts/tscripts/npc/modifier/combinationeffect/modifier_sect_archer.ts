import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_archer_base_a extends modifier_combination_effect {

    headshot_records: { [key: string]: boolean } = {};

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    atk_range = this.getSpecialData("atk_range");

    knock_out_pect = this.getSpecialData("knock_out_pect");


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (!this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion() && keys.target && !keys.target.IsBuilding() && !keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (this.GetStackCount() < this.GetSpecialValueFor("perfectshot_attacks") && GFuncRandom.PRD(this.knock_out_pect, this)) {
                this.headshot_records[keys.record + ""] = true;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(keys: ModifierAttackEvent): void {
        if (this.headshot_records[keys.record + ""]) {
            delete this.headshot_records[keys.record + ""];
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().IsIllusion() &&
            keys.target && !keys.target.IsBuilding() && !keys.target.IsOther() &&
            keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !keys.target.IsMagicImmune()) {
            if (this.headshot_records[keys.record + ""]) {
                if (!GFuncEntity.Custom_IsUnderForcedMovement(keys.target)) {
                    let pos = this.GetParentPlus().GetAbsOrigin();
                    keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_knockback", {
                        center_x: pos.x + 1,
                        center_y: pos.y + 1,
                        center_z: pos.z,
                        duration: 0.5,
                        knockback_duration: 0.5,
                        knockback_distance: 100,
                        knockback_height: 0,
                        should_stun: 0
                    });
                }
            }

        }
    }
}
@registerModifier()
export class modifier_sect_archer_base_b extends modifier_sect_archer_base_a {
}
@registerModifier()
export class modifier_sect_archer_base_c extends modifier_sect_archer_base_a {
}
@registerModifier()
export class modifier_sect_archer_ancient_apparition_chilling_touch_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_ancient_apparition_chilling_touch_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_clinkz_searing_arrows_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_clinkz_searing_arrows_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_dark_willow_shadow_realm_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_dark_willow_shadow_realm_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_drow_ranger_marksmanship_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_drow_ranger_marksmanship_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_enchantress_impetus_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_enchantress_impetus_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_furion_wrath_of_nature_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_furion_wrath_of_nature_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_gyrocopter_flak_cannon_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_gyrocopter_flak_cannon_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_hoodwink_sharpshooter_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_hoodwink_sharpshooter_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_medusa_stone_gaze_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_medusa_stone_gaze_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_mirana_starfall_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_mirana_starfall_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_morphling_morph_agi_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_morphling_morph_agi_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_snapfire_scatterblast_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_snapfire_scatterblast_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_sniper_take_aim_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_sniper_take_aim_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_windrunner_powershot_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_windrunner_powershot_c extends modifier_combination_effect {
}
