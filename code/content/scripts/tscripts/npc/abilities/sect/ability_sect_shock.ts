
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 闪电流
@registerAbility()
export class ability_sect_shock extends BaseAbility_Plus {


    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        this.GetCasterPlus().EmitSound("Hero_Zuus.ArcLightning.Cast");
        if (!target.TriggerSpellAbsorb(this)) {
            let head_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_arc_lightning_head.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(head_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(head_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(head_particle, 62, Vector(2, 0, 2));
            ParticleManager.ReleaseParticleIndex(head_particle);
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_ability_sect_shock_arc_lightning", {
                starting_unit_entindex: target.entindex()
            });
        }
    }





}
@registerModifier()
export class modifier_ability_sect_shock_arc_lightning extends BaseModifier_Plus {
    public arc_damage: number;
    public radius: number;
    public jump_count: number;
    public jump_delay: number;
    public starting_unit_entindex: any;
    public units_affected: { [k: string]: number };
    public current_unit: IBaseNpc_Plus;
    public unit_counter: number;
    public zapped: any;
    public lightning_particle: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(keys: any): void {
        if (!IsServer() || !this.GetAbilityPlus()) {
            return;
        }
        let t = this.GetCasterPlus().TempData().sect_shock || {
            shock_pect: 0,
            shock_damage: 0,
            shock_count: 0,
        };
        this.arc_damage = t.shock_damage;
        this.jump_count = t.shock_count;
        this.jump_delay = 0.25;
        this.radius = 500;
        this.starting_unit_entindex = keys.starting_unit_entindex;
        this.units_affected = {}
        if (this.starting_unit_entindex && EntIndexToHScript(this.starting_unit_entindex)) {
            this.current_unit = EntIndexToHScript(this.starting_unit_entindex) as IBaseNpc_Plus;
            this.units_affected[this.current_unit.GetEntityIndex() + ""] = 1;
            ApplyDamage({
                victim: this.current_unit,
                damage: this.arc_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
        } else {
            this.Destroy();
            return;
        }
        this.unit_counter = 0;
        this.StartIntervalThink(this.jump_delay);
    }
    OnIntervalThink(): void {
        this.zapped = false;
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.current_unit.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!this.units_affected[enemy.GetEntityIndex() + ""]) {
                enemy.EmitSound("Hero_Zuus.ArcLightning.Target");
                this.lightning_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_arc_lightning_.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.current_unit);
                ParticleManager.SetParticleControlEnt(this.lightning_particle, 0, this.current_unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.current_unit.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.lightning_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(this.lightning_particle, 62, Vector(2, 0, 2));
                ParticleManager.ReleaseParticleIndex(this.lightning_particle);
                this.unit_counter = this.unit_counter + 1;
                this.current_unit = enemy;
                this.units_affected[this.current_unit.GetEntityIndex() + ""] = 1;
                this.zapped = true;
                ApplyDamage({
                    victim: enemy,
                    damage: this.arc_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
                break;
            }
        }
        if ((this.unit_counter >= this.jump_count && this.jump_count > 0) || !this.zapped) {
            this.StartIntervalThink(-1);
            this.Destroy();
        }
    }
}
