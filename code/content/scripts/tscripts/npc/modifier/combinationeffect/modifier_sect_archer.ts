import { ResHelper } from "../../../helper/ResHelper";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_archer_base_a extends modifier_combination_effect {

    headshot_records: { [key: string]: boolean } = {};
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    atk_range: number;

    knock_out_pect: number;
    Init() {
        this.atk_range = this.getSpecialData("atk_range")
        this.knock_out_pect = this.getSpecialData("knock_out_pect");
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_archer/sect_archer2.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (!this.GetParentPlus().IsIllusion() && keys.target && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (GFuncRandom.PRD(this.knock_out_pect, this)) {
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
        if (this.headshot_records[keys.record + ""]) {
            let pos = this.GetParentPlus().GetAbsOrigin();
            let offset = keys.target.GetAbsOrigin() - pos as Vector;
            keys.target.ApplyKnockBack(this.GetAbilityPlus(), this.GetCasterPlus(), {
                duration: 0.3,
                distance: 100,
                IsStun: true,
                direction_x: offset.x,
                direction_y: offset.y,
            })
        }
    }
}
@registerModifier()
export class modifier_sect_archer_base_b extends modifier_sect_archer_base_a {
    Init(): void {
        this.atk_range = this.getSpecialData("atk_range")
        this.knock_out_pect = this.getSpecialData("knock_out_pect");
    }
}
@registerModifier()
export class modifier_sect_archer_base_c extends modifier_sect_archer_base_a {
    Init(): void {
        this.atk_range = this.getSpecialData("atk_range")
        this.knock_out_pect = this.getSpecialData("knock_out_pect");
    }
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
@registerModifier()
export class modifier_sect_archer_luna_eclipse_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_luna_eclipse_c extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_weaver_time_lapse_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_archer_weaver_time_lapse_c extends modifier_combination_effect {
}

