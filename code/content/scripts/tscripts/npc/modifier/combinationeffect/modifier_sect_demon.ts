import { ResHelper } from "../../../helper/ResHelper";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_demon_base_a extends modifier_combination_effect {
    Init() {
        let damage_pect = this.getSpecialData("damage_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_demon || { damage_pect: 0 };
        t.damage_pect += damage_pect;
        parent.TempData().sect_demon = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_demon/sect_demon1.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_ON_ATTACK_LANDED(keys: ModifierAttackEvent) {
        if (!IsServer()) { return }
        if (keys.attacker == this.GetParentPlus()) {
            let parent = this.GetParentPlus();
            let target = keys.target;
            let t = parent.TempData().sect_demon || { damage_pect: 10 };
            let damageTable = {
                attacker: parent,
                victim: target,
                damage: keys.damage * t.damage_pect / 100,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
            }
            ApplyDamage(damageTable);
        }
    }

}
@registerModifier()
export class modifier_sect_demon_base_b extends modifier_combination_effect {
    public Init(params?: IModifierTable): void {
        let damage_pect = this.getSpecialData("damage_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_demon || { damage_pect: 0 };
        t.damage_pect += damage_pect;
        parent.TempData().sect_demon = t;
    }
}
@registerModifier()
export class modifier_sect_demon_base_c extends modifier_sect_demon_base_b {
}
