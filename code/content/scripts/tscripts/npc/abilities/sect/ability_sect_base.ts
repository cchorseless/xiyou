import { AI_ability } from "../../../ai/AI_ability";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

@registerAbility()
export class ability_sect_phyarm_up extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_health extends BaseAbility_Plus {
}
// 护盾流
@registerAbility()
export class ability_sect_shield extends BaseAbility_Plus {

    AutoSpellSelf() {
        let caster = this.GetCasterPlus();
        if (caster.HasCiTiao(this.GetSectCiTiaoName("a"))) {
            return AI_ability.TARGET_Self(this);
        }
        return false
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            caster.EmitSound("Hero_Abaddon.AphoticShield.Cast");
            let responses = [
                "abaddon_abad_aphoticshield_01",
                "abaddon_abad_aphoticshield_02",
                "abaddon_abad_aphoticshield_03",
                "abaddon_abad_aphoticshield_04",
                "abaddon_abad_aphoticshield_05",
                "abaddon_abad_aphoticshield_06",
                "abaddon_abad_aphoticshield_07"
            ];
            caster.EmitCasterSound(responses, 50, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, 20, "aphotic_shield");
            let modifier_name_aphotic_shield = "modifier_ability_sect_shield_buff_block";
            target.RemoveModifierByName(modifier_name_aphotic_shield);
            let duration = 5;
            target.AddNewModifier(caster, this, modifier_name_aphotic_shield, {
                duration: duration
            });
            if (caster.HasCiTiao(this.GetSectCiTiaoName("b"))) {
                // 给其他队友加护盾
                let range = this.GetCastRangePlus();
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                for (let unit of targets) {
                    if (unit != target && !unit.HasModifier("modifier_name_aphotic_shield")) {
                        target.AddNewModifier(caster, this, modifier_name_aphotic_shield, {
                            duration: duration
                        });
                    }
                };
            }
        }
    }



}
@registerModifier()
export class modifier_ability_sect_shield_buff_block extends BaseModifier_Plus {
    public shield_init_value: number;
    public shield_block: number;
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
        let caster = this.GetCasterPlus();
        this.shield_init_value = caster.findBuffStack(this.GetAbilityPlus().GetSectCiTiaoName("a"));
        this.shield_block = 0;
        if (IsServer()) {
            let target = this.GetParentPlus();
            let shield_size = target.GetModelRadius() * 0.7;
            let target_origin = target.GetAbsOrigin();
            let attach_hitloc = "attach_hitloc";
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            let common_vector = Vector(shield_size, 0, shield_size);
            ParticleManager.SetParticleControl(particle, 1, common_vector);
            ParticleManager.SetParticleControl(particle, 2, common_vector);
            ParticleManager.SetParticleControl(particle, 4, common_vector);
            ParticleManager.SetParticleControl(particle, 5, Vector(shield_size, 0, 0));
            ParticleManager.SetParticleControlEnt(particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach_hitloc, target_origin, true);
            this.AddParticle(particle, false, false, -1, false, false);
            this.StartIntervalThink(0.1);
        }
    }


    OnIntervalThink(): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            // 眩晕消失
            if (IsValid(target) && target.IsAlive() && target.IsStunned()) {
                this.Destroy();
            }
        }
    }


    BeDestroy(): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            if (!IsValid(ability)) { return }
            let target_vector = target.GetAbsOrigin();
            target.EmitSound("Hero_Abaddon.AphoticShield.Destroy");
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_abaddon/abaddon_aphotic_shield_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle, 0, target_vector);
            ParticleManager.ReleaseParticleIndex(particle);
            // 词条2才驱散治疗
            if (!caster.HasCiTiao(ability.GetSectCiTiaoName("b"))) {
                return
            }
            target.Purge(false, true, false, true, true);
            let heal = math.min(this.shield_init_value, this.shield_block);
            if (heal > 0) {
                target.ApplyHeal(heal, ability);
            }
            // let radius = 300;
            // let explode_target_team = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
            // let explode_target_type = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
            // let units = caster.FindUnitsInRadiusPlus(radius, target_vector, explode_target_team, explode_target_type, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            // let damage = math.min(this.shield_init_value, this.shield_block);
            // let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
            // for (const [_, unit] of GameFunc.iPair(units)) {
            //     ApplyDamage({
            //         victim: unit,
            //         attacker: caster,
            //         damage: damage,
            //         damage_type: damage_type,
            //         ability: ability,
            //     });

            // }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK)
    CC_GetModifierTotal_ConstantBlock(kv: ModifierAttackEvent): number {
        let r = 0;
        let target = this.GetParentPlus();
        let original_shield_amount = math.max(this.shield_init_value - this.shield_block, 0);
        if (kv.damage > 0 && bit.band(kv.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
            this.shield_block += kv.damage;
            if (kv.damage < original_shield_amount) {
                r = kv.damage;
            }
            else {
                r = original_shield_amount;
                this.Destroy();
            }
            if (IsServer()) {
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, target, r, undefined);
            }
        }
        return r;
    }
    ResetAndExtendBy(seconds: number) {
        this.shield_block = 0;
        this.SetDuration(this.GetRemainingTime() + seconds, true);
    }
}
@registerAbility()
export class ability_sect_warpath extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_miss extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_poision extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_shihua extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_treatment extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_tech extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_iceshield extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_jianren extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_lianjie extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_phycrit extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_beast extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_ghost extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_cleave extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_demon extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_assassinate extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_summon extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_magic extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_flame extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_transform extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_seckill extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_cannibalism extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_fusion extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_lucky extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_reduceinjury extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_cd_down extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_copy extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_guard extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_dazhao extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_fish_chess extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_assault extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_doublespell extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_steal extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_suck_blood extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_atkspeed extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_control extends BaseAbility_Plus {
}
@registerAbility()
export class ability_sect_betrayal extends BaseAbility_Plus {
}






