import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tiny_grow = { "ID": "5109", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilitySound": "Tiny.Grow", "AbilityCastAnimation": "ACT_INVALID", "AbilityDraftUltShardAbility": "tiny_craggy_exterior", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_armor": "12 18 24" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "30 70 110", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_INTEGER", "attack_speed_reduction": "20 35 50" } } };

@registerAbility()
export class ability6_tiny_grow extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tiny_grow";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tiny_grow = Data_tiny_grow;
    Init() {
                this.SetDefaultSpecialValue("attack_times", [5,10,15,20,25,30]);
        this.SetDefaultSpecialValue("bonus_damage", [40,55,70,85,110,130]);
        this.SetDefaultSpecialValue("bonus_attack_range", 200);
        this.SetDefaultSpecialValue("splash_width", 300);
        this.SetDefaultSpecialValue("splash_range", 900);
        this.SetDefaultSpecialValue("splash_pct", [80,100,120,140,160,180]);
        this.SetDefaultSpecialValue("bomb_radius", 300);
        this.SetDefaultSpecialValue("bomb_attack_damage_pct", [100,200,300,400,500,600]);
        this.SetDefaultSpecialValue("radius", 300);

        }

    Init_old() {
                this.SetDefaultSpecialValue("bonus_base_damage", [50,200,350,500,650,800]);
        this.SetDefaultSpecialValue("attack_speed_reduction", [5,10,20,30,40,50]);
        this.SetDefaultSpecialValue("toss_duration", 1.3);
        this.SetDefaultSpecialValue("grab_radius", 700);
        this.SetDefaultSpecialValue("toss_radius", 275);
        this.SetDefaultSpecialValue("toss_range", 700);
        this.SetDefaultSpecialValue("toss_damage", [200,400,600,800,1000,1200]);
        this.SetDefaultSpecialValue("toss_health_damage", [20,25,30,35,40,45]);
        this.SetDefaultSpecialValue("bonus_toss_damage_pct", 30);

        }

}
