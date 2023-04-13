
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 自定义
@registerAbility()
export class item_imba_lifesteal_boots extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_lifesteal_boots";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "DOTA_Item.PhaseBoots.Activate";
        let modifier_boost = "modifier_imba_lifesteal_boots_buff";
        let phase_duration = ability.GetSpecialValueFor("phase_duration");
        EmitSoundOn(sound_cast, caster);
        caster.AddNewModifier(caster, this, modifier_boost, {
            duration: phase_duration
        });
        caster.AddNewModifier(caster, this, "modifier_imba_lifesteal_boots_unslowable", {
            duration: phase_duration
        });
    }
}
@registerModifier()
export class modifier_imba_lifesteal_boots extends BaseModifier_Plus {
    GetTexture(): string {
        return "imba_lifesteal_boots";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetCasterPlus());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetCasterPlus());
        }
    }
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Special_Boots(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_movement_speed");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("armor");
        }
    }
    GetModifierLifesteal() {
        if (this.GetItemPlus() && this.GetParentPlus().FindAllModifiersByName(this.GetName())[0] == this) {
            return this.GetItemPlus().GetSpecialValueFor("lifesteal_pct");
        }
    }
}
@registerModifier()
export class modifier_imba_lifesteal_boots_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public particle_boost: any;
    public particle_drain: any;
    public phase_ms: any;
    public ms_limit: any;
    public drain_damage: number;
    public drain_radius: number;
    public drained_units: { [k: string]: EntityIndex };
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
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.particle_boost = "particles/item/boots/lifesteal_boots_speed_boost.vpcf";
        this.particle_drain = "particles/item/boots/lifesteal_boots_drain.vpcf";
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
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!this.drained_units[enemy.entindex() + ""]) {
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
                        this.caster.ApplyHeal(actual_damage, this.GetItemPlus());
                    }
                    this.drained_units[enemy.entindex() + ""] = enemy.entindex();
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.phase_ms;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        if (!this.GetParentPlus().HasModifier("modifier_imba_thirst_passive") && !(this.GetParentPlus().HasModifier("modifier_brewmaster_primal_split_duration") && this.GetParentPlus().HasScepter()) && !(this.GetParentPlus().HasModifier("modifier_broodmother_spin_web") && this.GetParentPlus().HasScepter()) && !(this.GetParentPlus().HasModifier("modifier_clinkz_wind_walk") && this.GetParentPlus().HasScepter()) && !(this.GetParentPlus().HasModifier("modifier_imba_skeleton_walk_invis") && this.GetParentPlus().HasScepter()) && !(this.GetParentPlus().HasModifier("modifier_imba_clinkz_wind_walk_723") && this.GetParentPlus().HasScepter()) && !this.GetParentPlus().HasModifier("modifier_dark_seer_surge") && !this.GetParentPlus().HasModifier("modifier_imba_dark_seer_surge") && !this.GetParentPlus().HasModifier("modifier_wisp_tether_haste") && !this.GetParentPlus().HasModifier("modifier_imba_wisp_tether") && !this.GetParentPlus().HasModifier("modifier_slardar_sprint_river") && !this.GetParentPlus().HasModifier("modifier_imba_guardian_sprint_river") && !this.GetParentPlus().HasModifier("modifier_spirit_breaker_charge_of_darkness") && !this.GetParentPlus().HasModifier("modifier_imba_spirit_breaker_charge_of_darkness") && !(this.GetParentPlus().HasModifier("modifier_windrunner_windrun") && this.GetParentPlus().HasScepter()) && !(this.GetParentPlus().HasModifier("modifier_imba_windranger_windrun") && this.GetParentPlus().HasScepter()) && !(this.GetParentPlus().HasModifier("modifier_imba_hunter_in_the_night") && !this.GetParentPlus().PassivesDisabled() && !GameRules.IsDaytimePlus())) {
            return this.ms_limit;
        }
    }
}
@registerModifier()
export class modifier_imba_lifesteal_boots_unslowable extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_UNSLOWABLE]: true
        };
    }
}
