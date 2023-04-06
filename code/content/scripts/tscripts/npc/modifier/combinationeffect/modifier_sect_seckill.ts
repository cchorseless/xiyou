import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_seckill_base_a extends modifier_combination_effect {
    prop_pect: number;
    damage_hp_pect: number;
    Init() {
        let parent = this.GetParentPlus();
        this.damage_hp_pect = this.getSpecialData("damage_hp_pect")
        this.prop_pect = this.getSpecialData("prop_pect")
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_shield/sect_shield1.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);

    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_ON_ATTACK_LANDED(keys: ModifierInstanceEvent) {
        if (keys.attacker == this.GetParentPlus() && RollPercentage(this.prop_pect)) {
            let target = keys.unit;
            let damage = target.GetMaxHealth() * this.damage_hp_pect / 100;
            ApplyDamage({
                victim: target,
                attacker: this.GetParentPlus(),
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                ability: undefined,
            })
        }

    }

}
@registerModifier()
export class modifier_sect_seckill_base_b extends modifier_sect_seckill_base_a {

}
@registerModifier()
export class modifier_sect_seckill_base_c extends modifier_sect_seckill_base_a {
}