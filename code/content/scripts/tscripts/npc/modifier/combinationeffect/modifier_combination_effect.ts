import { GameFunc } from "../../../GameFunc";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

export class modifier_combination_effect extends BaseModifier_Plus {

    public IsHidden(): boolean {
        return true;
    }
    buff_fx: ParticleID;

    config() {
        return GJSONConfig.BuffEffectConfig.get(this.GetName());
    }

    getSpecialData(prop: string) {
        let conf = this.config();
        if (conf && conf.propinfo.has(prop)) {
            return conf.propinfo.get(prop);
        }
        return 0;
    }
    BeDestroy(): void {
        if (this.buff_fx) {
            ParticleManager.ClearParticle(this.buff_fx);
            this.buff_fx = null;
        }
    }

    getAllEnemy(): IBaseNpc_Plus[] {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let selfteam = parent.GetTeam();
            let enemyteam = selfteam == DOTATeam_t.DOTA_TEAM_BADGUYS ? DOTATeam_t.DOTA_TEAM_GOODGUYS : DOTATeam_t.DOTA_TEAM_BADGUYS;;
            let enemyunits = parent.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAlive(enemyteam, true);
            return enemyunits.map((unit) => { return unit.GetDomain<IBaseNpc_Plus>() });
        }
    }

}



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

@registerModifier()
export class modifier_sect_thorns_base_a extends modifier_combination_effect {
    Init() {
        let thorns_pect = this.getSpecialData("thorns_pect")
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_thorns || { thorns_pect: 0 };
        t.thorns_pect += thorns_pect;
        parent.TempData().sect_thorns = t;
        modifier_sect_thorns_blade_mail_active.applyOnly(parent, parent)
    }

}
@registerModifier()
export class modifier_sect_thorns_base_b extends modifier_combination_effect {
    Init() {
        let thorns_pect = this.getSpecialData("thorns_pect")
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_thorns || { thorns_pect: 0 };
        t.thorns_pect += thorns_pect;
        parent.TempData().sect_thorns = t;
    }
}
@registerModifier()
export class modifier_sect_thorns_base_c extends modifier_sect_thorns_base_b {
}


@registerModifier()
export class modifier_sect_thorns_blade_mail_active extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items_fx/blademail.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_blademail.vpcf";
    }
    thorns_pect: number;
    public Init(params?: IModifierTable): void {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_thorns || { thorns_pect: 0 };
        this.thorns_pect = t.thorns_pect;
        if (IsServer()) {
            this.GetParentPlus().EmitSound("DOTA_Item.BladeMail.Activate");
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() &&
            keys.attacker.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() &&
            bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            if (!keys.unit.IsOther()) {
                EmitSoundOnClient("DOTA_Item.BladeMail.Damage", keys.attacker);
                let damageTable = {
                    victim: keys.attacker,
                    damage: keys.original_damage * this.thorns_pect * 0.01,
                    damage_type: keys.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    attacker: this.GetParentPlus(),
                }
                ApplyDamage(damageTable);
            }
        }
    }
}

@registerModifier()
export class modifier_sect_treatment_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/econ/items/huskar/huskar_ti8/huskar_ti8_shoulder_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let health_regen = this.getSpecialData("health_regen");
        let damage_per_sec = this.getSpecialData("damage_per_sec");
        let damage_maxhp_pect = this.getSpecialData("damage_maxhp_pect");
        let t = parent.TempData().sect_treatment || { health_regen: 0, damage_per_sec: 0, damage_maxhp_pect: 0 };
        t.health_regen += health_regen;
        t.damage_per_sec += damage_per_sec;
        t.damage_maxhp_pect += damage_maxhp_pect;
        parent.TempData().sect_treatment = t;
        modifier_sect_treatment_radiance_aura.applyOnly(parent, parent)
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_treatment || { health_regen: 0 };
        return t.health_regen;
    }
}

@registerModifier()
export class modifier_sect_treatment_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let health_regen = this.getSpecialData("health_regen");
        let damage_per_sec = this.getSpecialData("damage_per_sec");
        let damage_maxhp_pect = this.getSpecialData("damage_maxhp_pect");
        let t = parent.TempData().sect_treatment || { health_regen: 0, damage_per_sec: 0, damage_maxhp_pect: 0 };
        t.health_regen += health_regen;
        t.damage_per_sec += damage_per_sec;
        t.damage_maxhp_pect += damage_maxhp_pect;
        parent.TempData().sect_treatment = t;
    }

}

@registerModifier()
export class modifier_sect_treatment_base_c extends modifier_sect_treatment_base_b {
}

@registerModifier()
export class modifier_sect_treatment_radiance_aura extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_sect_treatment_radiance_burn";
    }
    GetAuraRadius(): number {
        return 500;
    }
}
@registerModifier()
export class modifier_sect_treatment_radiance_burn extends BaseModifier_Plus {
    public particle: any;
    public base_damage: number;
    public damage_maxhp_pect: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        });
    } */
    BeCreated(p_0: any,): void {
        let caster = this.GetCasterPlus();
        let t = caster.TempData().sect_treatment || { damage_per_sec: 0, damage_maxhp_pect: 0 };
        if (IsServer()) {
            this.particle = ResHelper.CreateParticleEx("particles/items2_fx/radiance.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle, 1, this.GetCasterPlus().GetAbsOrigin());
            this.base_damage = t.damage_per_sec;
            this.damage_maxhp_pect = t.damage_maxhp_pect;
            this.StartIntervalThink(1);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.ClearParticle(this.particle, false);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let damage = this.base_damage + this.GetParentPlus().GetHealth() * this.damage_maxhp_pect * 0.01;
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: caster,
                ability: null,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
}

@registerModifier()
export class modifier_sect_magarm_down_base_a extends modifier_combination_effect { }
@registerModifier()
export class modifier_sect_magarm_down_base_b extends modifier_combination_effect { }
@registerModifier()
export class modifier_sect_magarm_down_base_c extends modifier_combination_effect { }


@registerModifier()
export class modifier_sect_cleave_base_a extends modifier_combination_effect {
    Init() {
        let cleave_damage_pct = this.getSpecialData("cleave_damage_pct");
        let cleave_damage_ranged = this.getSpecialData("cleave_damage_ranged");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_damage_ranged: 0 };
        t.cleave_damage_pct += cleave_damage_pct;
        t.cleave_damage_ranged += cleave_damage_ranged;
        parent.TempData().sect_cleave = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_empower.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        EmitSoundOn("Hero_Magnataur.Empower.Target", parent);
    }
    cleave_radius_start: number = 150;
    cleave_radius_end: number = 360;
    cleave_distance: number = 650;
    splash_radius: number = 360;
    bonus_damage_pct: number = 30;

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    // CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
    //     return this.bonus_damage_pct;
    // }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            if (params.attacker == parent && (!parent.IsIllusion()) && params.attacker.GetTeamNumber() != params.target.GetTeamNumber()) {
                let cleave_particle = "particles/units/heroes/hero_magnataur/magnataur_empower_cleave_effect.vpcf";
                let splash_particle = "particles/hero/magnataur/magnataur_empower_splash.vpcf";
                let cleave_splash_particle = "particles/hero/magnataur/magnataur_empower_cleave_splash_effect.vpcf";
                let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_damage_ranged: 0 };
                let cleave_damage_pct = t.cleave_damage_pct;
                let cleave_damage_ranged = t.cleave_damage_ranged;
                if (params.attacker.IsRangedAttacker()) {
                    let splash_radius = this.splash_radius;
                    let enemies = parent.FindUnitsInRadiusPlus(splash_radius, params.target.GetAbsOrigin(), null, null, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        if (enemy != params.target && !enemy.IsAttackImmune()) {
                            ApplyDamage({
                                attacker: params.attacker,
                                victim: enemy,
                                ability: ability,
                                damage: (params.damage * cleave_damage_ranged),
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                            });
                        }
                    }
                    let cleave_pfx = ResHelper.CreateParticleEx(splash_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, params.target);
                    ParticleManager.SetParticleControl(cleave_pfx, 0, params.target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(cleave_pfx, 1, Vector(splash_radius, 0, 0));
                    ParticleManager.ReleaseParticleIndex(cleave_pfx);
                }
                else {
                    let cleave_radius_start = this.cleave_radius_start;
                    let cleave_radius_end = this.cleave_radius_end;
                    let cleave_distance = this.cleave_distance;
                    let cleave_splash_pfx = ResHelper.CreateParticleEx(cleave_splash_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, params.target);
                    ParticleManager.SetParticleControl(cleave_splash_pfx, 0, params.target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(cleave_splash_pfx, 1, Vector(cleave_distance, 0, 0));
                    ParticleManager.ReleaseParticleIndex(cleave_splash_pfx);
                    DoCleaveAttack(params.attacker, params.target, ability, (params.damage * cleave_damage_pct), cleave_radius_start, cleave_radius_end, cleave_distance, cleave_particle);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_sect_cleave_base_b extends modifier_combination_effect {
    cleave_damage_pct: number = 20;
    cleave_damage_ranged: number = 20;
    Init() {
        this.cleave_damage_pct = this.getSpecialData("cleave_damage_pct");
        this.cleave_damage_ranged = this.getSpecialData("cleave_damage_ranged");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_damage_ranged: 0 };
        t.cleave_damage_pct += this.cleave_damage_pct;
        t.cleave_damage_ranged += this.cleave_damage_ranged;
        parent.TempData().sect_cleave = t;
    }
}
@registerModifier()
export class modifier_sect_cleave_base_c extends modifier_sect_cleave_base_b {
}


@registerModifier()
export class modifier_sect_poision_base_a extends modifier_combination_effect {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_POISON_COUNT_PERCENTAGE)
    poision_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.POISON_ACTIVE_TIME_PERCENTAGE)
    poision_interval_pect: number;
    Init() {
        let parent = this.GetParentPlus();
        this.poision_pect = this.getSpecialData("poision_pect")
        this.poision_interval_pect = this.getSpecialData("poision_interval_pect")
    }
}
@registerModifier()
export class modifier_sect_poision_base_b extends modifier_sect_poision_base_a {

}
@registerModifier()
export class modifier_sect_poision_base_c extends modifier_sect_poision_base_a {

}


@registerModifier()
export class modifier_sect_phycrit_base_a extends modifier_combination_effect {
    crit_chance: number;
    crit_damage: number;
    Init() {
        let parent = this.GetParentPlus();
        "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_ground_eztzhok.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("effect/assassin_buff/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_ground_eztzhok.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.crit_chance = this.getSpecialData("crit_chance")
        this.crit_damage = this.getSpecialData("crit_damage")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target as IBaseNpc_Plus;
            let attacker = keys.attacker;
            if (attacker == this.GetParentPlus() && RollPercentage(this.crit_chance)) {
                let blood_pfx = ResHelper.CreateParticleEx("particles/hero/phantom_assassin/screen_blood_splatter.vpcf", ParticleAttachment_t.PATTACH_EYES_FOLLOW, target, attacker);
                ParticleManager.ReleaseParticleIndex(blood_pfx);
                target.EmitSound("Hero_PhantomAssassin.CoupDeGrace");
                this.GetCasterPlus().EmitSound("Imba.PhantomAssassinFatality");
                let coup_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, attacker);
                ParticleManager.SetParticleControlEnt(coup_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(coup_pfx, 1, target.GetAbsOrigin());
                ParticleManager.SetParticleControlOrientation(coup_pfx, 1, this.GetParentPlus().GetForwardVector() * (-1) as Vector, this.GetParentPlus().GetRightVector(), this.GetParentPlus().GetUpVector());
                ParticleManager.ReleaseParticleIndex(coup_pfx);
                let damage = keys.damage * this.crit_damage / 100;
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
}
@registerModifier()
export class modifier_sect_phycrit_base_b extends modifier_sect_phycrit_base_a {
}
@registerModifier()
export class modifier_sect_phycrit_base_c extends modifier_sect_phycrit_base_a {
}


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


@registerModifier()
export class modifier_sect_copy_base_a extends modifier_combination_effect {

    Init() {
        let damage = this.getSpecialData("damage");
        let copy_pect = this.getSpecialData("copy_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_copy || { damage: 0, copy_pect: 0 };
        t.damage += damage;
        t.copy_pect += copy_pect;
        parent.TempData().sect_copy = t;
        // this.buff_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
    // @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_ILLUSION)
    // CC_ON_SPAWN_ILLUSION(keys: ModifierInstanceEvent): void {
    //     if (!IsServer()) { return }
    //     let parent = this.GetParentPlus();
    //     if (!IsValid(parent)) { return }
    //     GLogHelper.print("CC_ON_SPAWN_ILLUSION ", parent.GetUnitName(), keys.unit.GetUnitName(), keys.unit.GetEntityIndex())
    // }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH_ILLUSION)
    CC_ON_DEATH_ILLUSION(keys: ModifierInstanceEvent): void {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        if (!IsValid(parent)) { return }
        let t = parent.TempData().sect_copy || { damage: 0, copy_pect: 0 };
        let particle_blast = "particles/sect/sect_copy/sect_copy2.vpcf"
        let particle_blast_fx = ResHelper.CreateParticleEx(particle_blast, ParticleAttachment_t.PATTACH_ABSORIGIN, keys.unit);
        ParticleManager.SetParticleControl(particle_blast_fx, 0, keys.unit.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_blast_fx, 1, Vector(400, 0, 0));
        ParticleManager.ReleaseParticleIndex(particle_blast_fx);
        let units = keys.unit.FindUnitsInRadiusPlus(400);
        units.forEach(unit => {
            ApplyDamage({
                victim: unit,
                attacker: parent,
                damage: t.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: null,
            })
        });
        if (GFuncRandom.PRD(t.copy_pect, this)) {
            parent.CreateIllusion(parent, {
                duration: 10,
                outgoing_damage: 100,
                incoming_damage: 100,
            }, 1, keys.unit.GetAbsOrigin())
        }
    }

}
@registerModifier()
export class modifier_sect_copy_base_b extends modifier_combination_effect {
    Init() {
        let damage = this.getSpecialData("damage");
        let copy_pect = this.getSpecialData("copy_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_copy || { damage: 0, copy_pect: 0 };
        t.damage += damage;
        t.copy_pect += copy_pect;
        parent.TempData().sect_copy = t;
        // this.buff_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_copy_base_c extends modifier_sect_copy_base_b {

}


@registerModifier()
export class modifier_sect_summon_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infested_unit.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let summon_atk_pect = this.getSpecialData("summon_atk_pect")
        let summon_hp_pect = this.getSpecialData("summon_hp_pect")
        let summon_atkspeed_pect = this.getSpecialData("summon_atkspeed_pect")
        let t = parent.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        t.summon_atk_pect += summon_atk_pect;
        t.summon_hp_pect += summon_hp_pect;
        t.summon_atkspeed_pect += summon_atkspeed_pect;
        parent.TempData().sect_summon = t;

    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    CC_ON_SPAWN_SUMMONNED(e: ModifierInstanceEvent) {
        let parent = this.GetParentPlus();
        let summon = e.unit;
        if (IsValid(summon)) {
            modifier_sect_summon_buff_active.apply(summon, parent)
        }
    }

}
@registerModifier()
export class modifier_sect_summon_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let summon_atk_pect = this.getSpecialData("summon_atk_pect")
        let summon_hp_pect = this.getSpecialData("summon_hp_pect")
        let summon_atkspeed_pect = this.getSpecialData("summon_atkspeed_pect")
        let t = parent.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        t.summon_atk_pect += summon_atk_pect;
        t.summon_hp_pect += summon_hp_pect;
        t.summon_atkspeed_pect += summon_atkspeed_pect;
        parent.TempData().sect_summon = t;
    }
}
@registerModifier()
export class modifier_sect_summon_base_c extends modifier_sect_summon_base_b {

}


@registerModifier()
export class modifier_sect_summon_buff_active extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE)
    summon_atk_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_PERCENTAGE)
    summon_hp_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_PERCENTAGE)
    summon_atkspeed_pect: number;

    buff_fx: ParticleID
    Init() {
        let parent = this.GetParentPlus();
        let caster = this.GetCasterPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_warpath/sect_warpath1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let t = caster.TempData().sect_summon || { summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        this.summon_atk_pect = t.summon_atk_pect;
        this.summon_hp_pect = t.summon_hp_pect;
        this.summon_atkspeed_pect = t.summon_atkspeed_pect;
    }


    public BeDestroy(): void {
        if (this.buff_fx) {
            ParticleManager.ClearParticle(this.buff_fx, true)
        }
    }
}



@registerModifier()
export class modifier_sect_warpath_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_warpath/sect_warpath1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.atk_bonus_pect = this.getSpecialData("atk_bonus_pect");
        EmitSoundOn("hero_bloodseeker.bloodRage", parent);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE)
    atk_bonus_pect: number;

    @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    CC_ON_SPAWN_SUMMONNED(e: ModifierInstanceEvent) {
        let parent = this.GetParentPlus();
        let summon = e.unit;
        if (IsValid(summon)) {
            modifier_sect_warpath_base_a.apply(summon, parent)
        }
    }
}



@registerModifier()
export class modifier_sect_warpath_base_b extends modifier_combination_effect {
}
@registerModifier()
export class modifier_sect_warpath_base_c extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_ursa/ursa_fury_swipes_debuff.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}


@registerModifier()
export class modifier_sect_phyarm_down_base_a extends modifier_combination_effect {

    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_skeletonking/wraith_king_ghosts_spirits_copy.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let phyarm_down = this.getSpecialData("phyarm_down");
        let duration = this.getSpecialData("duration");
        let t = parent.TempData().sect_phyarm_down || {
            phyarm_down: 0,
            duration: 0
        };
        t.phyarm_down += phyarm_down;
        t.duration += duration;
        parent.TempData().sect_phyarm_down = t;
        if (IsServer()) {
            let allenemy = this.getAllEnemy();
            allenemy.forEach(enemy => {
                if (IsValid(enemy)) {
                    let buff = modifier_sect_phyarm_down_enemy.applyOnly(enemy, parent);
                    buff.SetStackCount(math.abs(t.phyarm_down))
                }
            })
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_ON_DEATH(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let t = parent.TempData().sect_phyarm_down || { duration: 0 };
            if (t.duration > 0) {
                let summon = parent.CreateSummon(parent.GetUnitName(), parent.GetAbsOrigin(), t.duration);
                summon.AddNewModifier(parent, null, "modifier_skeleton_king_reincarnation_scepter_active", { duration: t.duration });
            }
        }
    }
}
@registerModifier()
export class modifier_sect_phyarm_down_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let phyarm_down = this.getSpecialData("phyarm_down");
        let duration = this.getSpecialData("duration");
        let t = parent.TempData().sect_phyarm_down || {
            phyarm_down: 0,
            duration: 0
        };
        t.phyarm_down += phyarm_down;
        t.duration += duration;
        parent.TempData().sect_phyarm_down = t;
        if (IsServer()) {
            let allenemy = this.getAllEnemy();
            allenemy.forEach(enemy => {
                if (IsValid(enemy)) {
                    let buff = modifier_sect_phyarm_down_enemy.applyOnly(enemy, parent);
                    buff.SetStackCount(math.abs(t.phyarm_down))
                }
            })
        }
    }
}
@registerModifier()
export class modifier_sect_phyarm_down_base_c extends modifier_sect_phyarm_down_base_b {
}


@registerModifier()
export class modifier_sect_phyarm_down_enemy extends BaseModifier_Plus {
    public particle: ParticleID;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_PHYSICAL_ARMOR_BONUS(): number {
        return -this.GetStackCount();
    }

    BeCreated(p_0: any,): void {
        // let caster = this.GetCasterPlus();
        // let t = caster.TempData().sect_phyarm_down || { phyarm_down: 0 };
        // this.phyarm = t.phyarm_down;
        if (IsServer()) {
            // todo 碎甲特效
            // this.particle = ResHelper.CreateParticleEx("particles/items2_fx/radiance.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            // ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
            // ParticleManager.SetParticleControl(this.particle, 1, this.GetCasterPlus().GetAbsOrigin());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.ClearParticle(this.particle, false);
        }
    }

}

@registerModifier()
export class modifier_sect_atkspeed_base_a extends modifier_combination_effect {
    atk_speed: number;
    Init() {
        this.atk_speed = this.getSpecialData("atk_speed");
        let parent = this.GetParentPlus();
        // "particles/items2_fx/mask_of_madness.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/items2_fx/mask_of_madness.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT(): number {
        return this.atk_speed;
    }
}
@registerModifier()
export class modifier_sect_atkspeed_base_b extends modifier_combination_effect {
    atk_speed: number;
    Init() {
        this.atk_speed = this.getSpecialData("atk_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT(): number {
        return this.atk_speed;
    }
}
@registerModifier()
export class modifier_sect_atkspeed_base_c extends modifier_sect_atkspeed_base_b {
}

@registerModifier()
export class modifier_sect_betrayal_base_a extends modifier_combination_effect { }

@registerModifier()
export class modifier_sect_betrayal_base_b extends modifier_combination_effect { }

@registerModifier()
export class modifier_sect_betrayal_base_c extends modifier_combination_effect { }

@registerModifier()
export class modifier_sect_steal_base_a extends modifier_combination_effect {
    gold_min: number;
    gold_max: number;
    prop_pect: number = 0;

    Init() {
        let parent = this.GetParentPlus();
        this.gold_min = this.getSpecialData("gold_min")
        this.gold_max = this.getSpecialData("gold_max")
        this.prop_pect = this.getSpecialData("prop_pect")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_ON_DEATH(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let target = e.unit;
        if (RollPercentage(this.prop_pect)) {
            let gold = RandomInt(this.gold_min, this.gold_max)
            parent.GetPlayerRoot().PlayerDataComp().ModifyGold(gold)
        }
    }


}
@registerModifier()
export class modifier_sect_steal_base_b extends modifier_combination_effect {
    wood_min: number;
    wood_max: number;
    prop_pect: number = 0;

    Init() {
        let parent = this.GetParentPlus();
        this.wood_min = this.getSpecialData("wood_min")
        this.wood_max = this.getSpecialData("wood_max")
        this.prop_pect = this.getSpecialData("prop_pect")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_ON_DEATH(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let target = e.unit;
        if (RollPercentage(this.prop_pect)) {
            let wood = RandomInt(this.wood_min, this.wood_max)
            parent.GetPlayerRoot().PlayerDataComp().ModifyGold(wood)
        }
    }
}
@registerModifier()
export class modifier_sect_steal_base_c extends modifier_combination_effect {
    gold_min: number;
    gold_max: number;
    wood_min: number;
    wood_max: number;
    prop_pect: number = 0;

    Init() {
        let parent = this.GetParentPlus();
        this.gold_min = this.getSpecialData("gold_min")
        this.gold_max = this.getSpecialData("gold_max")
        this.wood_min = this.getSpecialData("wood_min")
        this.wood_max = this.getSpecialData("wood_max")
        this.prop_pect = this.getSpecialData("prop_pect")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_ON_DEATH(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let target = e.unit;
        if (RollPercentage(this.prop_pect)) {
            let gold = RandomInt(this.gold_min, this.gold_max)
            parent.GetPlayerRoot().PlayerDataComp().ModifyGold(gold)
            let wood = RandomInt(this.wood_min, this.wood_max)
            parent.GetPlayerRoot().PlayerDataComp().ModifyWood(wood)
        }
    }
}


@registerModifier()
export class modifier_sect_cd_down_base_a extends modifier_combination_effect {
    Init() {
        this.cooldown_pect = this.getSpecialData("cooldown_pect");
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_song_debuff_b.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_cannibalism/sect_cannibalism1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);

    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    cooldown_pect: number;


}
@registerModifier()
export class modifier_sect_cd_down_base_b extends modifier_sect_cd_down_base_a {
}
@registerModifier()
export class modifier_sect_cd_down_base_c extends modifier_sect_cd_down_base_a {
}


@registerModifier()
export class modifier_sect_magic_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let magic_arm = this.getSpecialData("magic_arm");
        let t = parent.TempData().sect_magic || {
            magic_arm: 0,
        };
        t.magic_arm += magic_arm;
        parent.TempData().sect_magic = t;
        if (IsServer()) {
            let enemyunits = this.getAllEnemy()
            for (let i = 0; i < enemyunits.length; i++) {
                let unit = enemyunits[i];
                let buff = modifier_sect_magic_enemy_magic_down.applyOnly(unit, parent);
                buff.SetStackCount(math.abs(t.magic_arm))
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    spell_damage_pect: number;


}
@registerModifier()
export class modifier_sect_magic_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let magic_arm = this.getSpecialData("magic_arm");
        let t = parent.TempData().sect_magic || {
            magic_arm: 0,
        };
        t.magic_arm += magic_arm;
        parent.TempData().sect_magic = t;
        if (IsServer()) {
            let enemyunits = this.getAllEnemy()
            for (let i = 0; i < enemyunits.length; i++) {
                let unit = enemyunits[i];
                let buff = modifier_sect_magic_enemy_magic_down.applyOnly(unit, parent);
                buff.SetStackCount(math.abs(t.magic_arm))
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    spell_damage_pect: number;

}
@registerModifier()
export class modifier_sect_magic_base_c extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let magic_arm = this.getSpecialData("magic_arm");
        let t = parent.TempData().sect_magic || { magic_arm: 0, };
        t.magic_arm += magic_arm;
        parent.TempData().sect_magic = t;
        if (IsServer()) {
            let enemyunits = this.getAllEnemy()
            for (let i = 0; i < enemyunits.length; i++) {
                let unit = enemyunits[i];
                let buff = modifier_sect_magic_enemy_magic_down.applyOnly(unit, parent);
                buff.SetStackCount(math.abs(t.magic_arm))
            }
        }
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_ON_ABILITY_EXECUTED(e: ModifierAbilityEvent) {
        if (IsServer()) {
            let ability = e.ability as IBaseAbility_Plus;
            if (IsValid(ability)) {
                let parent = this.GetParentPlus();
                modifier_sect_magic_enemy_ice.applyOnly(e.target, parent, ability, {
                    duration: this.getSpecialData("duration") || 1,
                });
            }
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    spell_damage_pect: number;

}


@registerModifier()
export class modifier_sect_magic_enemy_magic_down extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    CC_MAGICAL_ARMOR_BONUS(): number {
        return this.GetStackCount() * -1;
    }

}


@registerModifier()
export class modifier_sect_magic_enemy_ice extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }

    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Crystal.Frostbite");
        }
    }
}


@registerModifier()
export class modifier_sect_flame_base_a extends modifier_combination_effect {

    Init() {
        let parent = this.GetParentPlus();
        this.spell_crit_pect = this.getSpecialData("spell_crit_pect");
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_CHANCE)
    spell_crit_pect: number;
}
@registerModifier()
export class modifier_sect_flame_base_b extends modifier_sect_flame_base_a {
}
@registerModifier()
export class modifier_sect_flame_base_c extends modifier_sect_flame_base_a {
}


@registerModifier()
export class modifier_sect_splash_base_a extends modifier_combination_effect { }

@registerModifier()
export class modifier_sect_splash_base_b extends modifier_combination_effect { }

@registerModifier()
export class modifier_sect_splash_base_c extends modifier_combination_effect { }


@registerModifier()
export class modifier_sect_invent_base_a extends modifier_combination_effect {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }


}
@registerModifier()
export class modifier_sect_invent_base_b extends modifier_combination_effect {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }
}
@registerModifier()
export class modifier_sect_invent_base_c extends modifier_combination_effect {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }
}


@registerModifier()
export class modifier_sect_shock_base_a extends modifier_combination_effect { }
@registerModifier()
export class modifier_sect_shock_base_b extends modifier_combination_effect { }
@registerModifier()
export class modifier_sect_shock_base_c extends modifier_combination_effect { }

@registerModifier()
export class modifier_sect_magcrit_base_a extends modifier_combination_effect { }
@registerModifier()
export class modifier_sect_magcrit_base_b extends modifier_combination_effect { }
@registerModifier()
export class modifier_sect_magcrit_base_c extends modifier_combination_effect { }


@registerModifier()
export class modifier_sect_black_art_base_a extends modifier_combination_effect {

    spell_lifesteal: number;
    Init() {
        this.spell_lifesteal = this.getSpecialData("spell_lifesteal");
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/econ/events/ti7/hero_levelup_ti7_flash_hit_magic.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);

    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_LIFESTEAL_PERCENTAGE)
    CC_SPELL_LIFESTEAL_PERCENTAGE(): number {
        return this.spell_lifesteal;
    }

}
@registerModifier()
export class modifier_sect_black_art_base_b extends modifier_sect_black_art_base_a {
}
@registerModifier()
export class modifier_sect_black_art_base_c extends modifier_sect_black_art_base_a {
}


@registerModifier()
export class modifier_sect_fish_chess_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();

    }
}
@registerModifier()
export class modifier_sect_fish_chess_base_b extends modifier_combination_effect {

}
@registerModifier()
export class modifier_sect_fish_chess_base_c extends modifier_combination_effect {

}


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


@registerModifier()
export class modifier_sect_transform_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let mana = this.getSpecialData("mana");
        parent.SetMana(mana);
    }
}
@registerModifier()
export class modifier_sect_transform_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let illusion_count = this.getSpecialData("illusion_count");
        parent.CreateIllusion(parent, {
            outgoing_damage: 100,
            incoming_damage: 100,
            outgoing_damage_structure: 100,
            duration: 60
        }, illusion_count)
    }

}
@registerModifier()
export class modifier_sect_transform_base_c extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let mana = this.getSpecialData("mana");
        parent.SetMana(mana);
    }

}



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


@registerModifier()
export class modifier_sect_cannibalism_base_a extends modifier_combination_effect {
    prop_pect: number;
    Init() {
        this.prop_pect = this.getSpecialData("prop_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cannibalism || { prop_pect: 0 };
        t.prop_pect += this.prop_pect;
        parent.TempData().sect_cannibalism = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_cannibalism/sect_cannibalism1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        modifier_sect_cannibalism_eatfriend.applyOnly(parent, parent)

    }
}
@registerModifier()
export class modifier_sect_cannibalism_base_b extends modifier_combination_effect {
    prop_pect: number;
    Init() {
        this.prop_pect = this.getSpecialData("prop_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cannibalism || { prop_pect: 0 };
        t.prop_pect += this.prop_pect;
        parent.TempData().sect_cannibalism = t;
    }
}
@registerModifier()
export class modifier_sect_cannibalism_base_c extends modifier_sect_cannibalism_base_b {
}

@registerModifier()
export class modifier_sect_cannibalism_eatfriend extends BaseModifier_Plus {
    atkadd: number = 0;

    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.AddTimer(0.1, () => {
                let parent = this.GetParentPlus();
                let t = parent.TempData().sect_cannibalism || { prop_pect: 0 };
                let prop_pect = t.prop_pect;
                if (parent.ETRoot) {
                    let enemyroot = parent.ETRoot as IBattleUnitEntityRoot;
                    if (enemyroot.ChessComp()) {
                        let chessnpc = enemyroot.ChessComp().FindAroundFriendChess();
                        let hpadd = 0;
                        let atkadd = 0;
                        for (let npc of chessnpc) {
                            if (npc.IsAlive() && npc.IsFriendly(parent) &&
                                npc.TempData().sect_cannibalism_eatfriend == null &&
                                !npc.HasModifier("modifier_sect_cannibalism_eatfriend")) {
                                npc.TempData().sect_cannibalism_eatfriend = true;
                                hpadd += npc.GetMaxHealth();
                                atkadd += npc.GetBaseDamageMax();
                                npc.ETRoot.Dispose();
                            }
                        }
                        hpadd = hpadd * prop_pect / 100;
                        atkadd = atkadd * prop_pect / 100;
                        parent.ModifyMaxHealth(hpadd);
                        this.atkadd = atkadd;
                        NetTablesHelper.SetDotaEntityData(parent.GetEntityIndex(), { atkadd: atkadd }, "sect_cannibalism")
                    }
                }
            })

        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_BASEATTACK_BONUSDAMAGE() {
        if (IsServer()) {
            return this.atkadd;
        }
        else {
            let data = NetTablesHelper.GetDotaEntityData(this.GetParentPlus().GetEntityIndex(), "sect_cannibalism") || {};
            return data.atkadd;
        }
    }


}