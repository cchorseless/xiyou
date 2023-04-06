import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_shield_base_a extends modifier_combination_effect {
    prop_pect: number;
    block_value: number;
    Init() {
        let parent = this.GetParentPlus();
        let block_value = this.getSpecialData("block_value")
        let prop_pect = this.getSpecialData("prop_pect")
        this.prop_pect = prop_pect;
        this.block_value = block_value;
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_shield/sect_shield1.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
        if (IsServer()) {
            this.addShield();
            this.AddTimer(3, () => {
                this.addShield();
                return 3;
            })
        }
    }
    addShield() {
        if (RollPercentage(this.prop_pect)) {
            modifier_sect_shield_buff_block.apply(this.GetParentPlus(), this.GetParentPlus(), null, {
                block_value: this.block_value,
                duration: 3
            });
        }
    }

}
@registerModifier()
export class modifier_sect_shield_base_b extends modifier_sect_shield_base_a {
}
@registerModifier()
export class modifier_sect_shield_base_c extends modifier_sect_shield_base_a {
    // Init() {
    // let parent = this.GetParentPlus();
    // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_shield/sect_shield2.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
    // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
    // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    // }
}

@registerModifier()
export class modifier_sect_shield_buff_block extends BaseModifier_Plus {
    public shield_init_value: number;
    public shield_remaining: number;
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let shield_size = target.GetModelRadius() * 0.7;
            let target_origin = target.GetAbsOrigin();
            target.EmitSound("Hero_Abaddon.AphoticShield.Cast");
            let attach_hitloc = "attach_hitloc";
            this.shield_init_value = p_0.block_value || 100;
            this.shield_remaining = this.shield_init_value;
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            let common_vector = Vector(shield_size, 0, shield_size);
            ParticleManager.SetParticleControl(particle, 1, common_vector);
            ParticleManager.SetParticleControl(particle, 2, common_vector);
            ParticleManager.SetParticleControl(particle, 4, common_vector);
            ParticleManager.SetParticleControl(particle, 5, Vector(shield_size, 0, 0));
            ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach_hitloc, target_origin, true);
            this.AddParticle(particle, false, false, -1, false, false);
        }
    }

    public BeRefresh(p_0?: IModifierTable): void {
        if (IsServer()) {
            let block_value = p_0.block_value || 100;
            if (block_value >= this.shield_init_value) {
                this.shield_init_value = block_value;
                this.shield_remaining = this.shield_init_value;
            }
        }
    }

    BeDestroy(): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let radius = ability.GetSpecialValueFor("radius");
            let explode_target_team = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
            let explode_target_type = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
            let target_vector = target.GetAbsOrigin();
            target.EmitSound("Hero_Abaddon.AphoticShield.Destroy");
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle, 0, target_vector);
            ParticleManager.ReleaseParticleIndex(particle);
            let units = caster.FindUnitsInRadiusPlus(radius, target_vector, explode_target_team, explode_target_type, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let damage = this.shield_init_value;
            let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit.GetTeam() != caster.GetTeam()) {
                    ApplyDamage({
                        victim: unit,
                        attacker: caster,
                        damage: damage,
                        damage_type: damage_type
                    });
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK)
    CC_GetModifierTotal_ConstantBlock(kv: ModifierAttackEvent): number {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let original_shield_amount = this.shield_remaining;
            if (kv.damage > 0 && bit.band(kv.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
                this.shield_remaining = this.shield_remaining - kv.damage;
                if (kv.damage < original_shield_amount) {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, target, kv.damage, undefined);
                    return kv.damage;
                } else {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, target, original_shield_amount, undefined);
                    this.Destroy();
                    return original_shield_amount;
                }
            }
        }
    }

}