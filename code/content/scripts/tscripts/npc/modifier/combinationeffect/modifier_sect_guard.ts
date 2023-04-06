import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";




@registerModifier()
export class modifier_sect_guard_base_a extends modifier_combination_effect {

    Init() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_guard || { summonid_a: 0 };
        let summonid = this.getSpecialData("summonid");
        if (t.summonid_a == 0) {
            parent.CreateSummon("npc_dota_creature_sect_guard", parent.GetAbsOrigin(), 60);
            t.summonid_a = summonid;
            parent.TempData().sect_guard = t;
        }

    }
}
@registerModifier()
export class modifier_sect_guard_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_guard || { summonid_b: 0 };
        let summonid = this.getSpecialData("summonid");
        if (t.summonid_b == 0) {
            parent.CreateSummon("npc_dota_creature_sect_guard", parent.GetAbsOrigin(), 60);
            t.summonid_b = summonid;
            parent.TempData().sect_guard = t;
        }

    }
}
@registerModifier()
export class modifier_sect_guard_base_c extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_guard || { summonid_c: 0 };
        let summonid = this.getSpecialData("summonid");
        if (t.summonid_c == 0) {
            parent.CreateSummon("npc_dota_creature_sect_guard", parent.GetAbsOrigin(), 60);
            t.summonid_c = summonid;
            parent.TempData().sect_guard = t;
        }

    }

}