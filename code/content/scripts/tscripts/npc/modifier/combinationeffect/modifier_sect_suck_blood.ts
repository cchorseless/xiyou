import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_suck_blood_base_a extends modifier_combination_effect {

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_AMPLIFY_PERCENTAGE)
    lifesteal_pect: number;
    Init(kv: any) {
        this.lifesteal_pect = this.getSpecialData("lifesteal_pect");
        let parent = this.GetParentPlus();
        EmitSoundOn("hero_bloodseeker.bloodRage", parent);
    }

    GetEffectName(): string {
        return "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_eztzhok.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_bloodrage.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 4;
    }

}
@registerModifier()
export class modifier_sect_suck_blood_base_b extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_AMPLIFY_PERCENTAGE)
    lifesteal_pect: number;
    Init(kv: any) {
        this.lifesteal_pect = this.getSpecialData("lifesteal_pect");
    }
}
@registerModifier()
export class modifier_sect_suck_blood_base_c extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_AMPLIFY_PERCENTAGE)
    lifesteal_pect: number;
    Init(kv: any) {
        this.lifesteal_pect = this.getSpecialData("lifesteal_pect");
    }
}