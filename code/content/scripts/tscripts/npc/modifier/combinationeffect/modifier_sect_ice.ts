import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_ice_base_a extends modifier_combination_effect {

    Init() {
        let parent = this.GetParentPlus();
        let atk_speed = this.getSpecialData("atk_speed");
        let health_regen = this.getSpecialData("health_regen");
        if (IsServer()) {
            let allenemy = this.getAllEnemy();
            allenemy.forEach(enemy => {
                if (IsValid(enemy)) {
                    let t = enemy.TempData().sect_ice || {
                        atk_speed: 0,
                        health_regen: 0
                    };
                    t.atk_speed += atk_speed;
                    t.health_regen += health_regen;
                    enemy.TempData().sect_ice = t;
                    modifier_sect_ice_enemy_ice.applyOnly(enemy, parent);
                }
            })
        }
    }
}
@registerModifier()
export class modifier_sect_ice_base_b extends modifier_sect_ice_base_a {
}

@registerModifier()
export class modifier_sect_ice_base_c extends modifier_sect_ice_base_a {
}

@registerModifier()
export class modifier_sect_ice_enemy_ice extends BaseModifier_Plus {

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_drow_frost_arrow.vpcf";
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_ice || {
            atk_speed: 0,
            health_regen: 0
        };
        return t.atk_speed;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_ice || {
            atk_speed: 0,
            health_regen: 0
        };
        return t.health_regen;
    }

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    // attack_speed_reduction: number = 0;
}
