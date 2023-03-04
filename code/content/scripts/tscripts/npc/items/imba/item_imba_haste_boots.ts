
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_haste_boots extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_haste_boots";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "DOTA_Item.PhaseBoots.Activate";
        let modifier_boost = "modifier_imba_haste_boots_buff";
        let phase_duration = ability.GetSpecialValueFor("phase_duration");
        EmitSoundOn(sound_cast, caster);
        caster.AddNewModifier(caster, ability, modifier_boost, {
            duration: phase_duration
        });
    }
}
@registerModifier()
export class modifier_imba_haste_boots extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public bonus_movement_speed: number;
    public bonus_damage: number;
    public bonus_strength: number;
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
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.bonus_movement_speed = this.ability.GetSpecialValueFor("bonus_movement_speed");
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
        this.bonus_strength = this.ability.GetSpecialValueFor("bonus_strength");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Special_Boots(): number {
        return this.bonus_movement_speed;
    }
}
@registerModifier()
export class modifier_imba_haste_boots_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public particle_boost: any;
    public particle_drain: any;
    public phase_ms: any;
    public ms_limit: any;
    public drain_damage: number;
    public drain_radius: number;
    public drained_units: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.particle_boost = "particles/item/boots/haste_boots_speed_boost.vpcf";
        this.particle_drain = "particles/item/boots/haste_boots_drain.vpcf";
        this.phase_ms = this.ability.GetSpecialValueFor("phase_ms");
        this.ms_limit = this.ability.GetSpecialValueFor("ms_limit");
        this.drain_damage = this.ability.GetSpecialValueFor("drain_damage");
        this.drain_radius = this.ability.GetSpecialValueFor("drain_radius");
        if (IsServer()) {
            let particle_boost_fx = ResHelper.CreateParticleEx(this.particle_boost, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
            ParticleManager.SetParticleControl(particle_boost_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_boost_fx, 1, this.caster.GetAbsOrigin());
            this.AddParticle(particle_boost_fx, false, false, -1, false, false);
            this.drained_units = {}
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.drain_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(enemies)) {
                if (!this.drained_units[enemy.entindex()]) {
                    let damageTable = {
                        victim: enemy,
                        damage: this.drain_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        attacker: this.caster,
                        ability: this.ability
                    }
                    let actual_damage = ApplyDamage(damageTable);
                    let particle_drain_fx = ResHelper.CreateParticleEx(this.particle_drain, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                    ParticleManager.SetParticleControl(particle_drain_fx, 0, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_drain_fx, 1, enemy.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle_drain_fx);
                    if (actual_damage > 0) {
                        this.caster.Heal(actual_damage, this.GetItemPlus());
                    }
                    this.drained_units[enemy.entindex()] = enemy.entindex();
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.phase_ms;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
}
