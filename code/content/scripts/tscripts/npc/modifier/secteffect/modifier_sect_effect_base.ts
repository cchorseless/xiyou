import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { ChessVector } from "../../../rules/Components/ChessControl/ChessVector";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { EnemyConfig } from "../../../shared/EnemyConfig";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_chess_jump } from "../move/modifier_chess_jump";

export class modifier_sect_effect_base extends BaseModifier_Plus {
    IsPassive(): boolean {
        return true;
    }

    IsBuff() {
        return true;
    }

    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
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


// 秒杀流
@registerModifier()
export class modifier_sect_seckill_base_a extends modifier_sect_effect_base {
    prop_pect: number;
    damage_hp_pect: number;
    caster: IBaseNpc_Plus;
    ability: IBaseAbility_Plus;
    helix_pfx_1: ParticleID;
    radius: number;
    Init() {
        this.caster = this.GetParentPlus();
        this.ability = this.GetAbilityPlus();
        this.damage_hp_pect = this.getSpecialData("damage_hp_pect")
        this.prop_pect = this.getSpecialData("prop_pect")
        this.radius = this.GetAbilityPlus().GetCastRangePlus()
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_shield/sect_shield1.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED, false, true)
    CC_ON_ATTACK_LANDED(keys: ModifierAttackEvent) {
        if (this.ability && !this.caster.PassivesDisabled() &&
            (keys.target == this.GetParentPlus() && !keys.attacker.IsBuilding() && !keys.attacker.IsOther() && keys.attacker.GetTeamNumber() != keys.target.GetTeamNumber())) {
            if (!this.ability.IsCooldownReady()) {
                return
            }
            if (GFuncRandom.PRD(this.prop_pect, this)) {
                this.Spin();
            }
        }

    }
    Spin(repeat_allowed: boolean = true) {
        this.ability.UseResources(false, false, false, true);
        this.helix_pfx_1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_axe/axe_attack_blur_counterhelix.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster, this.caster);
        ParticleManager.SetParticleControl(this.helix_pfx_1, 0, this.caster.GetAbsOrigin());
        // if (Battlepass && Battlepass.HasArcana(this.caster.GetPlayerID(), "axe")) {
        ParticleManager.SetParticleControlEnt(this.helix_pfx_1, 1, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.helix_pfx_1, 2, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.helix_pfx_1, 3, this.caster.GetAbsOrigin());
        // }
        ParticleManager.ReleaseParticleIndex(this.helix_pfx_1);
        this.caster.EmitSound("Hero_Axe.CounterHelix");
        let damage = this.caster.GetMaxHealth() * this.damage_hp_pect * 0.01;
        let alldamage = 0;
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            alldamage = alldamage + ApplyDamage({
                attacker: this.caster,
                victim: enemy,
                ability: this.ability,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, enemy, damage, undefined);
        }
        const buff = modifier_sect_seckill_base_c.findIn(this.caster)
        if (buff) {
            this.caster.ApplyHeal(alldamage * buff.damage_suck_pect * 0.01, this.ability)
        }
    }
}
@registerModifier()
export class modifier_sect_seckill_base_b extends modifier_sect_seckill_base_a {

}
@registerModifier()
export class modifier_sect_seckill_base_c extends modifier_sect_effect_base {
    damage_suck_pect: number;
    Init(): void {
        this.damage_suck_pect = this.getSpecialData("damage_suck_pect")
    }


}
// 反伤流
@registerModifier()
export class modifier_sect_thorns_base_a extends modifier_sect_effect_base {
    Init() {
        let thorns_pect = this.getSpecialData("thorns_pect")
        let hpmax_pect = this.getSpecialData("hpmax_pect")
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_thorns || { thorns_pect: 0, hpmax_pect: 0 };
        t.thorns_pect += thorns_pect;
        t.hpmax_pect += hpmax_pect;
        parent.TempData().sect_thorns = t;
        modifier_sect_thorns_blade_mail_active.applyOnly(parent, parent, this.GetAbilityPlus())
    }

}
@registerModifier()
export class modifier_sect_thorns_base_b extends modifier_sect_effect_base {
    Init() {
        let thorns_pect = this.getSpecialData("thorns_pect")
        let hpmax_pect = this.getSpecialData("hpmax_pect")
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_thorns || { thorns_pect: 0, hpmax_pect: 0 };
        t.thorns_pect += thorns_pect;
        t.hpmax_pect += hpmax_pect;
        parent.TempData().sect_thorns = t;
    }
}
@registerModifier()
export class modifier_sect_thorns_base_c extends modifier_sect_effect_base {
    Init() {
        this.strength_get = this.getSpecialData("strength_get")
        // let hpmax_pect = this.getSpecialData("hpmax_pect")
        // let parent = this.GetParentPlus();
        // let t = parent.TempData().sect_thorns || { thorns_pect: 0, hpmax_pect: 0 };
        // t.thorns_pect += thorns_pect;
        // t.hpmax_pect += hpmax_pect;
        // parent.TempData().sect_thorns = t;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    strength_get: number;
}
@registerModifier()
export class modifier_sect_thorns_blade_mail_active extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_centaur/centaur_return_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        if (this.attach_attack1 == null) {
            return this.attach_attack1
        }
    }
    attach_attack1: number;
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.attach_attack1 = this.GetParentPlus().ScriptLookupAttachment("attach_attack1")
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let attacker = keys.attacker;
            let target = keys.unit;
            let particle_return = "particles/units/heroes/hero_centaur/centaur_return.vpcf";
            let t = parent.TempData().sect_thorns || { thorns_pect: 0, hpmax_pect: 0 };
            let apply_damage = keys.damage * t.thorns_pect * 0.01;
            apply_damage += GPropertyCalculate.GetStrength(parent) * t.hpmax_pect * 0.01;
            if (!target.IsRealUnit()) {
                return;
            }
            if (parent.PassivesDisabled()) {
                return;
            }
            if (attacker.GetTeamNumber() != parent.GetTeamNumber() && parent == target) {
                let particle_return_fx = ResHelper.CreateParticleEx(particle_return, ParticleAttachment_t.PATTACH_ABSORIGIN, parent);
                ParticleManager.SetParticleControlEnt(particle_return_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle_return_fx, 1, attacker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", attacker.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(particle_return_fx);
                ApplyDamage({
                    victim: attacker,
                    attacker: parent,
                    damage: apply_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION,
                    ability: ability
                });

            }
        }
    }
}
// 治疗流
@registerModifier()
export class modifier_sect_treatment_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/econ/items/huskar/huskar_ti8/huskar_ti8_shoulder_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let health_regen = this.getSpecialData("health_regen");
        let heal_amount = this.getSpecialData("heal_amount");
        let damage_amount = this.getSpecialData("damage_amount");
        // let damage_per_sec = this.getSpecialData("damage_per_sec");
        // let damage_maxhp_pect = this.getSpecialData("damage_maxhp_pect");
        let t = parent.TempData().sect_treatment || { health_regen: 0, heal_amount: 0, damage_amount: 0 };
        t.health_regen += health_regen;
        t.heal_amount += heal_amount;
        t.damage_amount += damage_amount;
        parent.TempData().sect_treatment = t;
        if (IsServer()) {
            let buff = modifier_sect_treatment_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.health_regen);
        }
    }




}
@registerModifier()
export class modifier_sect_treatment_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let health_regen = this.getSpecialData("health_regen");
        let heal_amount = this.getSpecialData("heal_amount");
        let damage_amount = this.getSpecialData("damage_amount");
        let t = parent.TempData().sect_treatment || { health_regen: 0, heal_amount: 0, damage_amount: 0 };
        t.health_regen += health_regen;
        t.heal_amount += heal_amount;
        t.damage_amount += damage_amount;
        parent.TempData().sect_treatment = t;
        if (IsServer()) {
            let buff = modifier_sect_treatment_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.health_regen);
        }
    }

}
@registerModifier()
export class modifier_sect_treatment_base_c extends modifier_sect_effect_base {

    public Init(params?: IModifierTable): void {
        let parent = this.GetParentPlus();
        let health_regen = this.getSpecialData("health_regen");
        let t = parent.TempData().sect_treatment || { health_regen: 0, heal_amount: 0, damage_amount: 0 };
        t.health_regen += health_regen;
        parent.TempData().sect_treatment = t;
        let health_pect_damage = this.getSpecialData("health_pect_damage");
        if (IsServer()) {
            this.SetStackCount(health_pect_damage);
        }
    }
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
export class modifier_sect_treatment_aura extends BaseModifier_Plus {
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
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_sect_treatment_aura_hp_regen";
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetCastRangePlus();
    }
}
@registerModifier()
export class modifier_sect_treatment_aura_hp_regen extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT() {
        let caster = this.GetCasterPlus();
        if (caster) {
            return caster.findBuffStack("modifier_sect_treatment_aura")
        }
    }
}

@registerModifier()
export class modifier_sect_treatment_radiance_burn extends BaseModifier_Plus {
    public particle: any;
    // public base_damage: number;
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
        this.damage_maxhp_pect = caster.findBuffStack("modifier_sect_treatment_base_c");
        // let t = caster.TempData().sect_treatment || { damage_per_sec: 0, damage_maxhp_pect: 0 };
        if (IsServer()) {
            this.particle = ResHelper.CreateParticleEx("particles/econ/events/ti6/radiance_ti6.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
            // ParticleManager.SetParticleControl(this.particle, 1, this.GetCasterPlus().GetAbsOrigin());
            // this.base_damage = t.damage_per_sec;
            // this.damage_maxhp_pect = t.damage_maxhp_pect;
            this.OnIntervalThink();
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
            let damage = this.GetParentPlus().GetHealth() * this.damage_maxhp_pect * 0.01;
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: caster,
                ability: this.GetAbilityPlus(),
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
            });
        }
    }
}
// 减抗流
@registerModifier()
export class modifier_sect_magarm_down_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let incoming_magic_pect = this.getSpecialData("incoming_magic_pect");
        let damage = this.getSpecialData("damage");
        let t = parent.TempData().sect_magarm_down || { damage: 0, incoming_magic_pect: 0 };
        t.incoming_magic_pect += incoming_magic_pect;
        t.damage += damage;
        parent.TempData().sect_magarm_down = t;
        if (IsServer()) {
            this.SetStackCount(t.incoming_magic_pect);
        }
    }
    public rot_radius: number;
    public rot_tick: any;
    public damage_per_tick: number;
    public pfx: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_magarm_down || { damage: 0 };
        this.rot_radius = 300;
        this.rot_tick = 0.5;
        this.damage_per_tick = t.damage * this.rot_tick;
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_pudge/pudge_rot.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.pfx, 1, Vector(this.rot_radius, 0, 0));
        this.AddParticle(this.pfx, false, false, -1, false, false);
        this.StartIntervalThink(this.rot_tick);
        EmitSoundOn("Hero_Pudge.Rot", this.GetParentPlus());
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        if (this.pfx) {
            ParticleManager.SetParticleControl(this.pfx, 1, Vector(this.rot_radius, 0, 0));
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.rot_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const enemy of enemies) {
            ApplyDamage({
                victim: enemy,
                damage: this.damage_per_tick,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        StopSoundOn("Hero_Pudge.Rot", this.GetParentPlus());
        // this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_2);
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetCastRangePlus();
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_sect_magarm_magarm_down";
    }
}
@registerModifier()
export class modifier_sect_magarm_down_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let incoming_magic_pect = this.getSpecialData("incoming_magic_pect");
        let damage = this.getSpecialData("damage");
        let t = parent.TempData().sect_magarm_down || { damage: 0, incoming_magic_pect: 0 };
        t.incoming_magic_pect += incoming_magic_pect;
        t.damage += damage;
        parent.TempData().sect_magarm_down = t;
        if (IsServer()) {
            let buff = modifier_sect_magarm_down_base_a.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.incoming_magic_pect);
        }
    }
}
@registerModifier()
export class modifier_sect_magarm_down_base_c extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let incoming_magic_pect = this.getSpecialData("incoming_magic_pect");
        let damage = this.getSpecialData("damage");
        let outgonging_damage_pect = this.getSpecialData("outgonging_damage_pect");
        let t = parent.TempData().sect_magarm_down || { damage: 0, incoming_magic_pect: 0 };
        t.incoming_magic_pect += incoming_magic_pect;
        t.damage += damage;
        parent.TempData().sect_magarm_down = t;
        if (IsServer()) {
            this.SetStackCount(outgonging_damage_pect);
            let buff = modifier_sect_magarm_down_base_a.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.incoming_magic_pect);
        }
    }
}

@registerModifier()
export class modifier_sect_magarm_magarm_down extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
    CC_INCOMING_MAGICAL_DAMAGE_PERCENTAGE() {
        let caster = this.GetCasterPlus();
        if (caster) {
            return caster.findBuffStack("modifier_sect_magarm_down_base_a")
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_TOTALDAMAGEOUTGOING_PERCENTAGE() {
        let caster = this.GetCasterPlus();
        if (caster && caster.HasModifier("modifier_sect_magarm_down_base_c")) {
            return -1 * caster.findBuffStack("modifier_sect_magarm_down_base_c")
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_omniknight/omniknight_degen_aura_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
// 溅射流
@registerModifier()
export class modifier_sect_splash_base_a extends modifier_sect_effect_base {
    Init() {
        let splash_damage_pct = this.getSpecialData("splash_damage_pct");
        let splash_distance = this.getSpecialData("splash_distance");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_splash || { splash_damage_pct: 0, splash_distance: 0 };
        t.splash_damage_pct += splash_damage_pct;
        t.splash_distance += splash_distance;
        parent.TempData().sect_splash = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_empower.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        EmitSoundOn("Hero_Magnataur.Empower.Target", parent);
    }
    cleave_radius_start: number = 150;
    cleave_radius_end: number = 360;

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            if (params.attacker == parent && (!parent.IsIllusion()) && params.attacker.GetTeamNumber() != params.target.GetTeamNumber()) {
                let cleave_particle = "particles/units/heroes/hero_magnataur/magnataur_empower_cleave_effect.vpcf";
                let cleave_splash_particle = "particles/hero/magnataur/magnataur_empower_cleave_splash_effect.vpcf";
                let t = parent.TempData().sect_splash || { splash_damage_pct: 0, splash_distance: 0 };
                let splash_damage_pct = t.splash_damage_pct;
                let splash_distance = (t.splash_distance + 0.5) * ChessControlConfig.Gird_Height;
                let cleave_radius_start = this.cleave_radius_start;
                let cleave_radius_end = this.cleave_radius_end;
                let cleave_splash_pfx = ResHelper.CreateParticleEx(cleave_splash_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, params.target);
                ParticleManager.SetParticleControl(cleave_splash_pfx, 0, params.target.GetAbsOrigin());
                ParticleManager.SetParticleControl(cleave_splash_pfx, 1, Vector(splash_distance, 0, 0));
                ParticleManager.ReleaseParticleIndex(cleave_splash_pfx);
                DoCleaveAttack(params.attacker, params.target, ability, (params.damage * splash_damage_pct * 0.01), cleave_radius_start, cleave_radius_end, splash_distance, cleave_particle);
            }
        }
    }
}
@registerModifier()
export class modifier_sect_splash_base_b extends modifier_sect_effect_base {
    Init() {
        let splash_damage_pct = this.getSpecialData("splash_damage_pct");
        let splash_distance = this.getSpecialData("splash_distance");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_splash || { splash_damage_pct: 0, splash_distance: 0 };
        t.splash_damage_pct += splash_damage_pct;
        t.splash_distance += splash_distance;
        parent.TempData().sect_splash = t;
    }
}
@registerModifier()
export class modifier_sect_splash_base_c extends modifier_sect_splash_base_b { }

// 分裂流
@registerModifier()
export class modifier_sect_cleave_base_a extends modifier_sect_effect_base {
    Init() {
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_medusa/medusa_bow_split_shot.vpcf",
            resNpc: this.GetParentPlus(),
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: this.GetParentPlus()
        });
        ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_top", this.GetParentPlus().GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_bottom", this.GetParentPlus().GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bow_mid", this.GetParentPlus().GetAbsOrigin(), true)
        this.AddParticle(iParticleID, false, false, -1, false, false)
        let cleave_damage_pct = this.getSpecialData("cleave_damage_pct");
        let cleave_count = this.getSpecialData("cleave_count");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_count: 0 };
        t.cleave_damage_pct += cleave_damage_pct;
        t.cleave_count += cleave_count;
        parent.TempData().sect_cleave = t;

    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && keys.target && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !keys.no_attack_cooldown && !this.GetParentPlus().PassivesDisabled() && this.GetAbilityPlus().IsTrained()) {
            let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().GetAttackRangePlus(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false);
            let target_number = 0;
            let t = this.GetParentPlus().TempData().sect_cleave || { cleave_damage_pct: 0, cleave_count: 0 };
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != keys.target) {
                    this.split_shot_target = true;
                    this.GetParentPlus().AttackOnce(enemy, false, true, true, true, true, false, false);
                    this.split_shot_target = false;
                    target_number = target_number + 1;
                    if (target_number >= t.cleave_count) {
                        return;
                    }
                }
            }
        }
    }
    split_shot_target: boolean;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (!IsServer()) {
            return;
        }
        if (this.split_shot_target) {
            let t = this.GetParentPlus().TempData().sect_cleave || { cleave_damage_pct: 0, cleave_count: 0 };
            return t.cleave_damage_pct - 100;
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "split_shot";
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.damage_category == 1 && keys.damage_type == 1) {
            let rpath = "particles/econ/items/antimage/antimage_weapon_basher_ti5/am_manaburn_basher_ti_5.vpcf";
            let manaburn_particle = ResHelper.CreateParticleEx(rpath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.unit);
            ParticleManager.ReleaseParticleIndex(manaburn_particle);
        }
    }
}
@registerModifier()
export class modifier_sect_cleave_base_b extends modifier_sect_effect_base {
    Init() {
        let cleave_damage_pct = this.getSpecialData("cleave_damage_pct");
        let cleave_count = this.getSpecialData("cleave_count");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cleave || { cleave_damage_pct: 0, cleave_count: 0 };
        t.cleave_damage_pct += cleave_damage_pct;
        t.cleave_count += cleave_count;
        parent.TempData().sect_cleave = t;
    }
}
@registerModifier()
export class modifier_sect_cleave_base_c extends modifier_sect_effect_base {


    headshot_records: { [key: string]: boolean } = {};
    knock_out_pect: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    atk_range: number;
    Init() {
        this.atk_range = this.getSpecialData("atk_range") * ChessControlConfig.Gird_Height;
        this.knock_out_pect = this.getSpecialData("knock_out_pct");
        // let parent = this.GetParentPlus();
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_archer/sect_archer2.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (!this.GetParentPlus().IsIllusion() && keys.target && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (GFuncRandom.PRD(this.knock_out_pect, this)) {
                this.headshot_records[keys.record + ""] = true;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(keys: ModifierAttackEvent): void {
        if (this.headshot_records[keys.record + ""]) {
            delete this.headshot_records[keys.record + ""];
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.headshot_records[keys.record + ""]) {
            let pos = this.GetParentPlus().GetAbsOrigin();
            let offset = keys.target.GetAbsOrigin() - pos as Vector;
            let buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_archer/sect_archer3.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, keys.target);
            // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
            ParticleManager.ReleaseParticleIndex(buff_fx);
            EmitSoundOn("Damage_Projectile.Player", keys.target)
            keys.target.ApplyKnockBack(this.GetAbilityPlus(), this.GetCasterPlus(), {
                duration: 0.3,
                distance: 100,
                IsStun: true,
                direction_x: offset.x,
                direction_y: offset.y,
            })
        }
    }
}
// 中毒流
@registerModifier()
export class modifier_sect_poision_base_a extends modifier_sect_effect_base {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_generic_poison: string;
    public poison_duration: number;
    Init(p_0: any,): void {
        let parent = this.GetParentPlus();
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_generic_poison = "modifier_sect_poision_finale_poison";
        this.poison_duration = 3;
        let atkspeed = this.getSpecialData("atkspeed");
        let damage = this.getSpecialData("damage");
        let t = parent.TempData().sect_poision || { atkspeed: 0, damage: 0, };
        t.atkspeed += atkspeed;
        t.damage += damage;
        parent.TempData().sect_poision = t;
    }

    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker == this.caster) {
                this.ApplyCausticFinale(attacker, target);
            }
        }
    }
    ApplyCausticFinale(attacker: IBaseNpc_Plus, target: IBaseNpc_Plus) {
        if (this.caster.PassivesDisabled()) {
            return;
        }
        if (attacker.IsIllusion()) {
            return;
        }
        if (target.HasModifier(this.modifier_generic_poison)) {
            return;
        }
        if (target.IsBuilding() || target.IsOther()) {
            return;
        }
        if (target.GetTeamNumber() == this.caster.GetTeamNumber()) {
            return;
        }

        target.AddNewModifier(this.caster, this.ability, this.modifier_generic_poison, {
            duration: this.poison_duration
        });
    }
}
@registerModifier()
export class modifier_sect_poision_base_b extends modifier_sect_effect_base {
    Init(p_0: any,): void {
        let parent = this.GetParentPlus();
        let atkspeed = this.getSpecialData("atkspeed");
        let damage = this.getSpecialData("damage");
        let t = parent.TempData().sect_poision || { atkspeed: 0, damage: 0, };
        t.atkspeed += atkspeed;
        t.damage += damage;
        parent.TempData().sect_poision = t;
    }
}
@registerModifier()
export class modifier_sect_poision_base_c extends modifier_sect_poision_base_b {
}
@registerModifier()
export class modifier_sect_poision_finale_poison extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_explode: any;
    public particle_explode: any;
    public particle_debuff: any;
    public modifier_generic_poison: any;
    public damage: number;
    public radius: number;
    public particle_debuff_fx: any;
    public particle_explode_fx: any;
    Init(p_0: IModifierTable): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_explode = "Ability.SandKing_CausticFinale";
        this.particle_explode = "particles/units/heroes/hero_sandking/sandking_caustic_finale_explode.vpcf";
        this.particle_debuff = "particles/units/heroes/hero_sandking/sandking_caustic_finale_debuff.vpcf";
        this.modifier_generic_poison = "modifier_sect_poision_finale_poison";
        this.radius = 300;
        if (IsServer()) {
            let t = this.caster.TempData().sect_poision || { atkspeed: 0, damage: 0, };
            this.damage = t.damage;
            this.SetStackCount(math.abs(t.atkspeed));
            if (p_0.IsOnCreated) {
                this.AddTimer(0.3, () => {
                    if (!this.IsNull()) {
                        this.particle_debuff_fx = ResHelper.CreateParticleEx(this.particle_debuff, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
                        ParticleManager.SetParticleControlEnt(this.particle_debuff_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                        this.AddParticle(this.particle_debuff_fx, false, false, -1, false, false);
                    }
                });
            }
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetRemainingTime() <= 0 || !IsValid(this.caster)) { return }
            EmitSoundOn(this.sound_explode, this.parent);
            this.particle_explode_fx = ResHelper.CreateParticleEx(this.particle_explode, ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
            ParticleManager.SetParticleControl(this.particle_explode_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.particle_explode_fx);
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                if (enemy.IsAlive() && !enemy.IsMagicImmune() && !enemy.HasModifier(this.modifier_generic_poison)) {
                    enemy.AddNewModifier(this.caster, this.ability, this.modifier_generic_poison, {
                        duration: this.GetDuration()
                    });
                }
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT(): number {
        return -this.GetStackCount();
    }

}

// 物暴流
@registerModifier()
export class modifier_sect_phycrit_base_a extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE)
    crit_chance: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE)
    crit_damage: number;

    GetEffectName(): string {
        return "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_eztzhok.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_bloodrage.vpcf";
    }
    Init() {
        let parent = this.GetParentPlus();
        // "particles/generic_gameplay/rune_doubledamage_owner.vpcf"
        // "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_ground_eztzhok.vpcf"
        // "particles/econ/events/fall_2022/bottle/bottle_fall2022.vpcf"
        // "particles/econ/events/fall_2021/bottle_fall_2021.vpcf"
        // this.buff_fx = ResHelper.CreateParticleEx("particles/econ/items/bloodseeker/2022_taunt/bloodseeker_taunt_sparks_glow.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
        this.crit_chance = this.getSpecialData("crit_chance")
        this.crit_damage = this.getSpecialData("crit_damage")
        if (IsServer()) {
            this.blinkChessX()

        }
    }
    blinkChessX() {
        let domain = this.GetParentPlus();
        let playerid = domain.GetPlayerID();
        let randomX = RandomFloat(2, 5);
        let randomY = RandomFloat(8, 10);
        if (randomY > 9) {
            if (randomX > 3 && randomX < 4) {
                randomX -= 1
            }
            else if (randomX > 4 && randomX < 5) {
                randomX += 1
            }
        }
        let pos = new ChessVector(randomX, randomY, playerid);
        let v = GChessControlSystem.GetInstance().GetBoardGirdVector3(pos);
        domain.Stop();
        domain.SetForwardVector(((v - domain.GetAbsOrigin()) as Vector).Normalized());
        domain.MoveToPosition(v);
        modifier_chess_jump.applyOnly(domain, domain, null, {
            vx: v.x,
            vy: v.y,
        });
    }
    // @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target as IBaseNpc_Plus;
            let attacker = keys.attacker;
            if (attacker == this.GetParentPlus() && RollPercentage(this.crit_chance)) {
                // let blood_pfx = ResHelper.CreateParticleEx("particles/hero/phantom_assassin/screen_blood_splatter.vpcf", ParticleAttachment_t.PATTACH_EYES_FOLLOW, target, attacker);
                // ParticleManager.ReleaseParticleIndex(blood_pfx);
                // target.EmitSound("Hero_PhantomAssassin.CoupDeGrace");
                // this.GetCasterPlus().EmitSound("Imba.PhantomAssassinFatality");
                // let coup_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, attacker);
                // ParticleManager.SetParticleControlEnt(coup_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                // ParticleManager.SetParticleControl(coup_pfx, 1, target.GetAbsOrigin());
                // ParticleManager.SetParticleControlOrientation(coup_pfx, 1, this.GetParentPlus().GetForwardVector() * (-1) as Vector, this.GetParentPlus().GetRightVector(), this.GetParentPlus().GetUpVector());
                // ParticleManager.ReleaseParticleIndex(coup_pfx);
                let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControlEnt(nFXIndex, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetOrigin(), true);
                ParticleManager.SetParticleControl(nFXIndex, 1, target.GetOrigin());
                ParticleManager.SetParticleControlForward(nFXIndex, 1, -this.GetCasterPlus().GetForwardVector() as Vector);
                ParticleManager.SetParticleControlEnt(nFXIndex, 10, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, target.GetOrigin(), true);
                ParticleManager.ReleaseParticleIndex(nFXIndex);
                EmitSoundOn("Hero_PhantomAssassin.Spatter", target);
                let damage = keys.damage * this.crit_damage / 100;
                SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, target, damage, null)
                ApplyDamage({
                    victim: target,
                    attacker: this.GetParentPlus(),
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    ability: undefined,
                });

            }
        }
    }
}
@registerModifier()
export class modifier_sect_phycrit_base_b extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE)
    crit_chance: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE)
    crit_damage: number;
    Init() {
        let parent = this.GetParentPlus();
        this.crit_chance = this.getSpecialData("crit_chance")
        this.crit_damage = this.getSpecialData("crit_damage")

    }
}
@registerModifier()
export class modifier_sect_phycrit_base_c extends modifier_sect_effect_base {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_CHANCE)
    crit_chance: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE)
    crit_damage: number;
    Init() {
        let parent = this.GetParentPlus();
        this.crit_chance = this.getSpecialData("crit_chance")
        this.crit_damage = this.getSpecialData("crit_damage")
        this.atk_speed_add = this.getSpecialData("atk_speed_add")
        this.duration = this.getSpecialData("duration")
        this.count = this.getSpecialData("count")
        this.stack_table = [];
        if (IsServer()) {
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        this.stack_table = this.stack_table.filter(info => {
            return info.apply_game_time && GameRules.GetDOTATime(true, true) - info.apply_game_time <= this.duration;
        });
        let length = this.stack_table.length;
        if (length * this.atk_speed_add != this.GetStackCount()) {
            this.SetStackCount(length * this.atk_speed_add);
        }
    }

    atk_speed_add: number;
    duration: number;
    count: number;
    stack_table: { apply_game_time: number }[];
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_CRIT)
    CC_ON_ATTACK_CRIT(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker == this.GetParentPlus()) {
                this.stack_table.push({ apply_game_time: GameRules.GetDOTATime(true, true) });
                if (this.stack_table.length > this.count) {
                    this.stack_table.shift();
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT() {
        return this.GetStackCount()
    }
}




// 护盾流
@registerModifier()
export class modifier_sect_shield_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let block_value = this.getSpecialData("block_value");
        let t = parent.TempData().sect_shield || { block_value: 0 };
        t.block_value += block_value;
        parent.TempData().sect_shield = t;
        if (IsServer()) {
            this.SetStackCount(t.block_value)
        }
    }

}
@registerModifier()
export class modifier_sect_shield_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let block_value = this.getSpecialData("block_value");
        let t = parent.TempData().sect_shield || { block_value: 0 };
        t.block_value += block_value;
        parent.TempData().sect_shield = t;
        if (IsServer()) {
            let buff = modifier_sect_shield_base_a.applyOnly(parent, parent)
            buff.SetStackCount(t.block_value)
        }
    }
}
@registerModifier()
export class modifier_sect_shield_base_c extends modifier_sect_shield_base_b {
    // Init() {
    // let parent = this.GetParentPlus();
    // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_shield/sect_shield2.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
    // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
    // this.AddParticle(this.buff_fx, false, false, -1, false, false);
    // }
}


// 复制流
@registerModifier()
export class modifier_sect_copy_base_a extends modifier_sect_effect_base {

    Init() {
        let count = this.getSpecialData("count");
        let copy_pect = this.getSpecialData("copy_pect");
        let duration = this.getSpecialData("duration");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_copy || { count: 0, copy_pect: 0, duration: 0 };
        t.count += count;
        t.copy_pect += copy_pect;
        t.duration += duration;
        parent.TempData().sect_copy = t;
        modifier_sect_copy_createillusion.applyOnly(parent, parent, this.GetAbilityPlus());
    }

}
@registerModifier()
export class modifier_sect_copy_base_b extends modifier_sect_effect_base {
    Init() {
        let count = this.getSpecialData("count");
        let copy_pect = this.getSpecialData("copy_pect");
        let duration = this.getSpecialData("duration");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_copy || { count: 0, copy_pect: 0, duration: 0 };
        t.count += count;
        t.copy_pect += copy_pect;
        t.duration += duration;
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
export class modifier_sect_copy_createillusion extends BaseModifier_Plus {
    public directional_vectors: any;
    public owner: IBaseNpc_Plus;
    public spawn_particle: any;
    public confusion_positions: Vector[];
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.directional_vectors = {
            1: Vector(72, 0, 0),
            2: Vector(0, -72, 0),
            3: Vector(-72, 0, 0),
            4: Vector(0, 72, 0)
        }
        if (!IsServer()) {
            return;
        }
        this.owner = this.GetParentPlus();
        if (this.GetParentPlus().IsIllusion() && this.GetParentPlus().GetOwnerPlus()) {
            this.owner = this.GetParentPlus().GetOwnerPlus();
        }
        if (this.owner.TempData().juxtapose_table == null) {
            this.owner.TempData().juxtapose_table = []
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && IsValid(this.owner) && this.owner.TempData().juxtapose_table && !this.owner.PassivesDisabled()) {
            let t = this.owner.TempData().sect_copy || { count: 0, copy_pect: 0, duration: 0 };
            const allillus = this.owner.TempData<EntityIndex[]>().juxtapose_table;
            if (allillus.length < t.count && GFuncRandom.PRD(t.copy_pect, this.owner)) {
                let illusions = this.owner.CreateIllusion(this.owner, {
                    duration: t.duration
                });
                for (const illusion of (illusions)) {
                    this.spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_lancer/phantom_lancer_spawn_illusion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, illusion);
                    ParticleManager.SetParticleControlEnt(this.spawn_particle, 0, illusion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", illusion.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(this.spawn_particle, 1, illusion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", illusion.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(this.spawn_particle);
                    // illusion.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_phantom_lancer_juxtapose_illusion", {});
                    illusion.SetAggroTarget(keys.target);
                    allillus.push(illusion.entindex());
                    if (this.owner.HasModifier("modifier_sect_copy_base_c")) {
                        modifier_sect_copy_createillusion.applyOnly(illusion, illusion, this.GetAbilityPlus());
                    }
                }
            }

        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && this.owner && !this.owner.IsNull() && this.owner.TempData().juxtapose_table) {
            const allillus = this.owner.TempData<EntityIndex[]>().juxtapose_table;
            let index = allillus.indexOf(this.GetParentPlus().entindex())
            if (index > -1) {
                allillus.splice(index, 1)
            }
        }
    }
}

// 召唤流
@registerModifier()
export class modifier_sect_summon_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_life_stealer/life_stealer_infested_unit.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let summon_atk_pect = this.getSpecialData("summon_atk_pect")
        let summonlevel = this.getSpecialData("summonlevel")
        let duration = this.getSpecialData("duration")
        let summon_hp_pect = this.getSpecialData("summon_hp_pect")
        let summon_atkspeed_pect = this.getSpecialData("summon_atkspeed_pect")
        let t = parent.TempData().sect_summon || { duration: 0, summonlevel: 1, summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        t.summon_atk_pect += summon_atk_pect;
        t.summon_hp_pect += summon_hp_pect;
        t.summon_atkspeed_pect += summon_atkspeed_pect;
        t.duration += duration;
        t.summonlevel = math.max(summonlevel, t.summonlevel);
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
export class modifier_sect_summon_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let summon_atk_pect = this.getSpecialData("summon_atk_pect")
        let summonlevel = this.getSpecialData("summonlevel")
        let duration = this.getSpecialData("duration")
        let summon_hp_pect = this.getSpecialData("summon_hp_pect")
        let summon_atkspeed_pect = this.getSpecialData("summon_atkspeed_pect")
        let t = parent.TempData().sect_summon || { duration: 0, summonlevel: 1, summon_atk_pect: 0, summon_hp_pect: 0, summon_atkspeed_pect: 0 };
        t.summon_atk_pect += summon_atk_pect;
        t.summon_hp_pect += summon_hp_pect;
        t.summon_atkspeed_pect += summon_atkspeed_pect;
        t.duration += duration;
        t.summonlevel = math.max(summonlevel, t.summonlevel);
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


// 战意流
@registerModifier()
export class modifier_sect_warpath_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/sect/sect_warpath/1.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_warpath/sect_warpath1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let atk_bonus_pect = this.getSpecialData("atk_bonus_pect");
        let t = parent.TempData().sect_warpath || { atk_bonus_pect: 0 };
        t.sect_warpath += atk_bonus_pect;
        parent.TempData().sect_warpath = t;
        EmitSoundOn("hero_bloodseeker.bloodRage", parent);
        if (IsServer()) {
            let buff = modifier_sect_warpath_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.sect_warpath);
        }
    }

    // @registerEvent(Enum_MODIFIER_EVENT.ON_SPAWN_SUMMONNED)
    // CC_ON_SPAWN_SUMMONNED(e: ModifierInstanceEvent) {
    //     let parent = this.GetParentPlus();
    //     let summon = e.unit;
    //     if (IsValid(summon)) {
    //         modifier_sect_warpath_base_a.apply(summon, parent)
    //     }
    // }
}
@registerModifier()
export class modifier_sect_warpath_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let atk_bonus_pect = this.getSpecialData("atk_bonus_pect");
        let t = parent.TempData().sect_warpath || { atk_bonus_pect: 0 };
        t.sect_warpath += atk_bonus_pect;
        parent.TempData().sect_warpath = t;
        if (IsServer()) {
            let buff = modifier_sect_warpath_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.sect_warpath);
        }
    }



}
@registerModifier()
export class modifier_sect_warpath_base_c extends modifier_sect_effect_base {
    public Init(params?: IModifierTable): void {
        this.atk_bonus_pect = this.getSpecialData("atk_bonus_pect");
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE)
    atk_bonus_pect: number;
}
@registerModifier()
export class modifier_sect_warpath_aura extends BaseModifier_Plus {
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
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_sect_warpath_aura_atkadd";
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetCastRangePlus();
    }
}

@registerModifier()
export class modifier_sect_warpath_aura_atkadd extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_PERCENTAGE)
    CC_ATTACK_DAMAGE_PERCENTAGE() {
        if (this.GetCasterPlus()) {
            return this.GetCasterPlus().findBuffStack("modifier_sect_warpath_aura")
        }
    }
}
// 减甲流
@registerModifier()
export class modifier_sect_phyarm_down_base_a extends modifier_sect_effect_base {

    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_skeletonking/wraith_king_ghosts_spirits_copy.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let phyarm_down = this.getSpecialData("phyarm_down");
        let t = parent.TempData().sect_phyarm_down || {
            phyarm_down: 0,
        };
        t.phyarm_down += phyarm_down;
        parent.TempData().sect_phyarm_down = t;
        if (IsServer()) {
            let buff = modifier_sect_phyarm_down_aura.applyOnly(parent, parent, this.GetAbilityPlus())
            buff.SetStackCount(math.abs(t.phyarm_down));
        }
    }

}
@registerModifier()
export class modifier_sect_phyarm_down_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let phyarm_down = this.getSpecialData("phyarm_down");
        let t = parent.TempData().sect_phyarm_down || {
            phyarm_down: 0,
        };
        t.phyarm_down += phyarm_down;
        parent.TempData().sect_phyarm_down = t;
        if (IsServer()) {
            let buff = modifier_sect_phyarm_down_aura.applyOnly(parent, parent, this.GetAbilityPlus())
            buff.SetStackCount(math.abs(t.phyarm_down));
        }
    }
}
@registerModifier()
export class modifier_sect_phyarm_down_base_c extends modifier_sect_effect_base {
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
            let buff = modifier_sect_phyarm_down_aura.applyOnly(parent, parent, this.GetAbilityPlus())
            buff.SetStackCount(math.abs(t.phyarm_down));
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
export class modifier_sect_phyarm_down_aura extends BaseModifier_Plus {
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
        return "modifier_sect_phyarm_down_enemy";
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetCastRangePlus();
    }
}
@registerModifier()
export class modifier_sect_phyarm_down_enemy extends BaseModifier_Plus {
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
        let caster = this.GetCasterPlus();
        if (IsValid(caster)) {
            return -1 * caster.findBuffStack("modifier_sect_phyarm_down_aura")
        }
    }

    GetEffectName(): string {
        return "particles/units/heroes/hero_dazzle/dazzle_armor_enemy.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }


}
// 攻速流
@registerModifier()
export class modifier_sect_atkspeed_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        // "particles/items2_fx/mask_of_madness.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx("particles/items2_fx/mask_of_madness.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.buff_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, parent.GetAbsOrigin(), true);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let atk_speed = this.getSpecialData("atk_speed");
        let ignore_evasion = this.getSpecialData("ignore_evasion");
        let t = parent.TempData().sect_atkspeed || {
            atk_speed: 0,
            ignore_evasion: 0
        };
        t.atk_speed += atk_speed;
        t.ignore_evasion += ignore_evasion;
        parent.TempData().sect_atkspeed = t;
        if (IsServer()) {
            let buff = modifier_sect_atkspeed_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(math.abs(t.atk_speed));
        }
    }


}
@registerModifier()
export class modifier_sect_atkspeed_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let atk_speed = this.getSpecialData("atk_speed");
        let ignore_evasion = this.getSpecialData("ignore_evasion");
        let t = parent.TempData().sect_atkspeed || {
            atk_speed: 0,
            ignore_evasion: 0
        };
        t.atk_speed += atk_speed;
        t.ignore_evasion += ignore_evasion;
        parent.TempData().sect_atkspeed = t;
        if (IsServer()) {
            let buff = modifier_sect_atkspeed_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(math.abs(t.atk_speed));
        }
    }

}
@registerModifier()
export class modifier_sect_atkspeed_base_c extends modifier_sect_effect_base {
    Init() {
        this.atk_speed = this.getSpecialData("atk_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    atk_speed: number;
}


@registerModifier()
export class modifier_sect_atkspeed_aura extends BaseModifier_Plus {
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
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_sect_atkspeed_aura_atkspeed";
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetCastRangePlus();
    }
}

@registerModifier()
export class modifier_sect_atkspeed_aura_atkspeed extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT(): number {
        if (this.GetCasterPlus()) {
            return this.GetCasterPlus().findBuffStack("modifier_sect_atkspeed_aura");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.NEGATIVE_EVASION_CONSTANT)
    CC_NEGATIVE_EVASION_CONSTANT(): number {
        let caster = this.GetCasterPlus();
        if (IsServer() && caster) {
            let t = caster.TempData().sect_atkspeed || {
                atk_speed: 0,
                ignore_evasion: 0
            };
            return t.ignore_evasion;
        }
    }
}



// 魅惑流
@registerModifier()
export class modifier_sect_betrayal_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let prop_pect = this.getSpecialData("prop_pect");
        let duration = this.getSpecialData("duration");
        let t = parent.TempData().sect_betrayal || {
            prop_pect: 0,
            duration: 0,
        };
        t.prop_pect += prop_pect;
        t.duration += duration;
        parent.TempData().sect_betrayal = t;
        let res = "particles/units/heroes/hero_enchantress/enchantress_shard_overhead.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx(res, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControl(this.buff_fx, 0, parent.GetAbsOrigin());
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.target != undefined && keys.target.IsAlive()) {
            if (keys.target.GetUnitLabel() == EnemyConfig.EEnemyUnitType.Tower) {
                return
            }
            if (keys.target.GetUnitLabel() == EnemyConfig.EEnemyUnitType.BOSS) {
                return
            }
            let parent = this.GetParentPlus();
            let target = keys.target;
            if (target.GetTeamNumber() == parent.GetTeamNumber()) {
                return
            }

            let t = parent.TempData().sect_betrayal || {
                prop_pect: 0,
                duration: 0,
            };
            let prop_pect = t.prop_pect;
            let duration = t.duration;
            if (RollPercentage(prop_pect)) {
                target.EmitSound("Hero_Chen.HolyPersuasionEnemy");
                target.Purge(true, true, false, false, false);
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chen/chen_holy_persuasion_a.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControl(particle, 1, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle);
                let new_lane_creep = this.GetCasterPlus().CreateSummon(target.GetUnitName(), target.GetAbsOrigin(), duration, false);
                new_lane_creep.SetBaseMaxHealth(target.GetMaxHealth());
                new_lane_creep.SetHealth(target.GetHealth());
                new_lane_creep.SetBaseDamageMin(target.GetBaseDamageMin());
                new_lane_creep.SetBaseDamageMax(target.GetBaseDamageMax());
                new_lane_creep.SetMana(target.GetMana());
                target.AddNoDraw();
                target.ForceKill(false);
            }
        }
    }


}
@registerModifier()
export class modifier_sect_betrayal_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let prop_pect = this.getSpecialData("prop_pect");
        let duration = this.getSpecialData("duration");
        let t = parent.TempData().sect_betrayal || {
            prop_pect: 0,
            duration: 0,
        };
        t.prop_pect += prop_pect;
        t.duration += duration;
        parent.TempData().sect_betrayal = t;
    }
}
@registerModifier()
export class modifier_sect_betrayal_base_c extends modifier_sect_betrayal_base_b { }
// 爆头流
@registerModifier()
export class modifier_sect_headshot_base_a extends modifier_sect_effect_base {

    Init() {
        let crit_pect = this.getSpecialData("crit_pect");
        let damage_pect = this.getSpecialData("damage_pect");
        let crit_radius = this.getSpecialData("crit_radius");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_headshot || {
            crit_pect: 0,
            damage_pect: 0,
            crit_radius: 0,
        };
        t.crit_pect += crit_pect;
        t.damage_pect += damage_pect;
        t.crit_radius += crit_radius;
        parent.TempData().sect_headshot = t;
        "particles/units/heroes/hero_gyrocopter/gyro_flak_cannon_overhead.vpcf"
        let res = "particles/units/heroes/hero_gyrocopter/gyro_flak_cannon_overhead_icon.vpcf";
        this.buff_fx = ResHelper.CreateParticleEx(res, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }

    attackRecord: { [k: string]: boolean } = {}
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_ON_ATTACK_START(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() &&
            !this.GetParentPlus().PassivesDisabled() && keys.target &&
            !keys.target.IsBuilding()) {
            let t = this.GetParentPlus().TempData().sect_headshot || {
                crit_pect: 0,
                damage_pect: 0,
                crit_radius: 0,
            };
            if (GFuncRandom.PRD(t.crit_pect, this)) {
                this.attackRecord[keys.record + ""] = true;
                this.SetStackCount(1)

            }
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.attackRecord[keys.record + ""] &&
            !this.GetParentPlus().PassivesDisabled() &&
            !this.GetParentPlus().IsIllusion() &&
            keys.attacker.GetTeam() != keys.target.GetTeam()) {
            let target = keys.target;
            let shift_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_hoodwink/hoodwink_hunters_boomrang_d.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, keys.target);
            ParticleManager.SetParticleControlEnt(shift_particle, 3, keys.target, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, keys.target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(shift_particle);
            let parent = this.GetParentPlus();
            let t = parent.TempData().sect_headshot || { crit_pect: 0, damage_pect: 0, crit_radius: 0 };
            let radius = (t.crit_radius + 0.5) * ChessControlConfig.Gird_Width;
            let damage = keys.damage * t.damage_pect * 0.01;
            let enemies = FindUnitsInRadius(
                keys.attacker.GetTeamNumber(),
                target.GetAbsOrigin(),
                undefined,
                radius,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const enemy of enemies) {
                let damageTable = {
                    victim: enemy,
                    attacker: keys.attacker,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
            }
            this.SetStackCount(0);
        }
        delete this.attackRecord[keys.record + ""];
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName(): string {
        if (this.GetStackCount() == 1) {
            return "particles/units/heroes/hero_sniper/sniper_assassinate.vpcf";
        }
    }
}
@registerModifier()
export class modifier_sect_headshot_base_b extends modifier_sect_effect_base {
    Init() {
        let crit_pect = this.getSpecialData("crit_pect");
        let damage_pect = this.getSpecialData("damage_pect");
        let crit_radius = this.getSpecialData("crit_radius");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_headshot || {
            crit_pect: 0,
            damage_pect: 0,
            crit_radius: 0,
        };
        t.crit_pect += crit_pect;
        t.damage_pect += damage_pect;
        t.crit_radius += crit_radius;
        parent.TempData().sect_headshot = t;
    }
}
@registerModifier()
export class modifier_sect_headshot_base_c extends modifier_sect_headshot_base_b { }

// 窃取流
@registerModifier()
export class modifier_sect_steal_base_a extends modifier_sect_effect_base {
    IsHidden(): boolean {
        return false;
    }
    Init() {
        let parent = this.GetParentPlus();
        let all_stat_per = this.getSpecialData("all_stat_per")
        let all_stat_death = this.getSpecialData("all_stat_death")
        let t = parent.TempData().sect_steal || {
            all_stat_per: 0,
            all_stat_death: 0
        };
        t.all_stat_per += all_stat_per;
        t.all_stat_death += all_stat_death;
        parent.TempData().sect_steal = t;
        this.stack_table = [];
        if (IsServer()) {
            this.StartIntervalThink(FrameTime());
        }
    }

    stack_table: { apply_game_time: number, duration: number }[];
    OnIntervalThink(): void {
        this.stack_table = this.stack_table.filter(info => {
            return info.apply_game_time && info.duration && GameRules.GetDOTATime(true, true) - info.apply_game_time <= info.duration;
        })
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_steal || {
            all_stat_per: 0,
        };
        let length = this.stack_table.length;
        if (length * t.all_stat_per != this.GetStackCount()) {
            this.SetStackCount(length * t.all_stat_per);
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetAbilityPlus().IsTrained() && keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion() && /** (keys.target.IsRealUnit() || keys.target.IsClone()) && **/ !keys.target.IsTempestDouble() && keys.attacker.GetTeam() != keys.target.GetTeam()) {
            let shift_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_essence_shift.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, keys.target);
            ParticleManager.ReleaseParticleIndex(shift_particle);
            let parent = this.GetParentPlus();
            this.stack_table.push({
                apply_game_time: GameRules.GetDOTATime(true, true),
                duration: 10,
            });
            modifier_sect_steal_statall_debuff_count.apply(keys.target, parent, this.GetAbilityPlus(), {
                duration: 10
            });
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_ON_DEATH(e: ModifierInstanceEvent) {
        if (!IsServer()) { return }
        let parent = this.GetParentPlus();
        let unit = e.unit;
        if (e.attacker != parent) {
            return
        }
        if (unit.HasModifier("modifier_sect_steal_statall_debuff_count") &&
            this.GetAbilityPlus().IsCooldownReady()) {
            let t = parent.TempData().sect_steal || {
                all_stat_per: 0,
                all_stat_death: 0
            };
            this.all_stat_death += t.all_stat_death;
            this.GetAbilityPlus().UseResources(false, false, false, true);
            let building = parent.GetOwner() as IBaseNpc_Plus;
            if (building && building.ETRoot && (building.ETRoot as IBuildingEntityRoot).IsBuilding()) {
                let buff = modifier_sect_steal_statall_count.applyOnly(building, building);
                buff.IncrementStackCount(t.all_stat_death);
                (building.ETRoot as IBuildingEntityRoot).BuffManagerComp().addRuntimeCloneBuff("modifier_sect_steal_statall_count");
            }
            // 货币奖励
            let playroot = parent.GetPlayerRoot();
            if (playroot) {
                playroot.PlayerDataComp().ModifyGold(this.getSpecialData("coin_prize"));
                let buff_b = modifier_sect_steal_base_b.findIn(parent);
                let buff_c = modifier_sect_steal_base_c.findIn(parent);
                if (buff_b) {
                    playroot.PlayerDataComp().ModifyWood(buff_b.getSpecialData("coin_prize"));
                }
                if (buff_c) {
                    playroot.PlayerDataComp().ModifySoulCrystal(buff_c.getSpecialData("coin_prize"));
                }
            }
        }


    }

    all_stat_death: number = 0;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BASE)
    CC_STATS_ALL_BASE(): number {
        return this.GetStackCount() + this.all_stat_death;
    }

}
@registerModifier()
export class modifier_sect_steal_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let all_stat_per = this.getSpecialData("all_stat_per")
        let all_stat_death = this.getSpecialData("all_stat_death")
        let t = parent.TempData().sect_steal || {
            all_stat_per: 0,
            all_stat_death: 0
        };
        t.all_stat_per += all_stat_per;
        t.all_stat_death += all_stat_death;
        parent.TempData().sect_steal = t;
    }
}
@registerModifier()
export class modifier_sect_steal_base_c extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let all_stat_per = this.getSpecialData("all_stat_per")
        let all_stat_death = this.getSpecialData("all_stat_death")
        let t = parent.TempData().sect_steal || {
            all_stat_per: 0,
            all_stat_death: 0
        };
        t.all_stat_per += all_stat_per;
        t.all_stat_death += all_stat_death;
        parent.TempData().sect_steal = t;
    }
}

@registerModifier()
export class modifier_sect_steal_statall_count extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BASE)
    CC_STATS_ALL_BASE(): number {
        return this.GetStackCount();
    }
}

@registerModifier()
export class modifier_sect_steal_statall_debuff_count extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BASE)
    CC_STATS_ALL_BASE(): number {
        return -1 * this.GetStackCount();
    }
    stack_table: { apply_game_time: number, duration: number }[];

    all_stat_per = 0;
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (!this.stack_table) {
            this.stack_table = []
        }
        this.stack_table.push({
            apply_game_time: GameRules.GetDOTATime(true, true),
            duration: this.GetDuration()
        });
        let parent = this.GetCasterPlus();
        let t = parent.TempData().sect_steal || {
            all_stat_per: 0,
        };
        this.all_stat_per = t.all_stat_per;
        this.IncrementStackCount(this.all_stat_per);
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.stack_table = this.stack_table.filter(info => {
            return info.apply_game_time && info.duration && GameRules.GetDOTATime(true, true) - info.apply_game_time <= info.duration;
        })
        let length = this.stack_table.length;
        if (length * this.all_stat_per != this.GetStackCount()) {
            this.SetStackCount(length * this.all_stat_per);
        }
    }
}

// 冷却流
@registerModifier()
export class modifier_sect_cd_down_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let cooldown_pect = this.getSpecialData("cooldown_pect");
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_song_debuff_b.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_cannibalism/sect_cannibalism1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
        if (IsServer()) {
            let buff = modifier_sect_cd_down_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.IncrementStackCount(cooldown_pect);
        }
    }



}
@registerModifier()
export class modifier_sect_cd_down_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let cooldown_pect = this.getSpecialData("cooldown_pect");
        // this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_cannibalism/sect_cannibalism1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        // this.AddParticle(this.buff_fx, false, false, -1, false, false);
        if (IsServer()) {
            let buff = modifier_sect_cd_down_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.IncrementStackCount(cooldown_pect);
        }
    }
}
@registerModifier()
export class modifier_sect_cd_down_base_c extends modifier_sect_cd_down_base_b {
}

@registerModifier()
export class modifier_sect_cd_down_aura extends BaseModifier_Plus {
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
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_sect_cd_down_cdreduce";
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetCastRangePlus();
    }

}

@registerModifier()
export class modifier_sect_cd_down_cdreduce extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_COOLDOWN_PERCENTAGE(): number {
        if (this.GetCasterPlus()) {

            return this.GetCasterPlus().findBuffStack("modifier_sect_cd_down_aura")
        }
    }
}


// 法师流
@registerModifier()
export class modifier_sect_magic_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let damage = this.getSpecialData("damage");
        let extra_damage_pect = this.getSpecialData("extra_damage_pect");
        let count = this.getSpecialData("count");
        let t = parent.TempData().sect_magic || {
            damage: 0,
            spell_damage_pect: 0,
            extra_damage_pect: 0,
            count: 0,
        };
        t.damage += damage;
        t.extra_damage_pect += extra_damage_pect;
        t.spell_damage_pect += spell_damage_pect;
        t.count += count;
        parent.TempData().sect_magic = t;
        this.SetStackCount(t.spell_damage_pect);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_PERCENTAGE)
    CC_OUTGOING_MAGICAL_DAMAGE_PERCENTAGE(): number {
        return this.GetStackCount();
    }

}
@registerModifier()
export class modifier_sect_magic_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let damage = this.getSpecialData("damage");
        let extra_damage_pect = this.getSpecialData("extra_damage_pect");
        let count = this.getSpecialData("count");
        let t = parent.TempData().sect_magic || {
            damage: 0,
            spell_damage_pect: 0,
            extra_damage_pect: 0,
            count: 0,
        };
        t.damage += damage;
        t.extra_damage_pect += extra_damage_pect;
        t.spell_damage_pect += spell_damage_pect;
        t.count += count;
        parent.TempData().sect_magic = t;
        if (IsServer()) {
            let buff = modifier_sect_magic_base_a.findIn(parent);
            buff && buff.SetStackCount(t.spell_damage_pect);
        }
    }

}
@registerModifier()
export class modifier_sect_magic_base_c extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let ice_duration = this.getSpecialData("ice_duration");
        let t = parent.TempData().sect_magic || {
            ice_duration: 0,
            spell_damage_pect: 0,
        };
        t.ice_duration = ice_duration;
        t.spell_damage_pect += spell_damage_pect;
        parent.TempData().sect_magic = t;
        if (IsServer()) {
            let buff = modifier_sect_magic_base_a.findIn(parent);
            buff && buff.SetStackCount(t.spell_damage_pect);
        }
    }
}



// 火焰流
@registerModifier()
export class modifier_sect_flame_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let damage = this.getSpecialData("damage");
        let max_stack = this.getSpecialData("max_stack");
        let t = parent.TempData().sect_flame || {
            damage: 0,
            max_stack: 0,
        };
        t.damage += damage;
        t.max_stack += max_stack;
        parent.TempData().sect_flame = t;
        "particles/hw_fx/candy_carrying_overhead_ember.vpcf"
        let res = "particles/econ/events/diretide_2020/high_five/high_five_lvl2_travel_overhead_flames.vpcf";
        this.buff_fx = ResHelper.CreateParticleEx(res, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker.GetTeam() != keys.target.GetTeam() && keys.target.IsAlive()) {
            let target = keys.target;
            modifier_sect_flame_burning.apply(target, this.GetParentPlus(), this.GetAbilityPlus(), {
                duration: 3
            })
        }

    }
}
@registerModifier()
export class modifier_sect_flame_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let damage = this.getSpecialData("damage");
        let max_stack = this.getSpecialData("max_stack");
        let t = parent.TempData().sect_flame || {
            damage: 0,
            max_stack: 0,
        };
        t.damage += damage;
        t.max_stack += max_stack;
        parent.TempData().sect_flame = t;
    }
}
@registerModifier()
export class modifier_sect_flame_base_c extends modifier_sect_flame_base_b {
}
@registerModifier()
export class modifier_sect_flame_burning extends BaseModifier_Plus {

    public IsHidden(): boolean {
        return false;
    }
    public IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_huskar/huskar_burning_spear_debuff.vpcf";
    }
    public burn_damage: number;
    public damage_type: number;
    public damageTable: ApplyDamageOptions;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
        let caster = this.GetCasterPlus();
        let t = caster.TempData().sect_flame || {
            damage: 0,
            max_stack: 0,
        };
        this.burn_damage = t.damage;
        this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
        this.damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        } as any;
        this.GetParentPlus().EmitSound("Hero_Huskar.Burning_Spear");
        this.StartIntervalThink(1);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let t = this.GetCasterPlus().TempData().sect_flame || {
            damage: 0,
            max_stack: 0,
        };
        if (this.GetStackCount() < t.max_stack) {
            this.IncrementStackCount();
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.damageTable.damage = this.GetStackCount() * this.burn_damage;
        this.damageTable.damage_type = this.damage_type;
        ApplyDamage(this.damageTable);
        let caster = this.GetCasterPlus();
        if (!IsValid(caster)) {
            return
        }
        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            this.GetParentPlus().GetAbsOrigin(),
            undefined,
            300,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const enemy of enemies) {
            if (!enemy.HasModifier("modifier_sect_flame_burning")) {
                let buff = enemy.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_sect_flame_burning", { duration: this.GetDuration() })
                buff.SetStackCount(this.GetStackCount())
            }
        }

    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Huskar.Burning_Spear");
    }



}


// 雷电流
@registerModifier()
export class modifier_sect_shock_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let shock_pect = this.getSpecialData("shock_pect");
        let shock_damage = this.getSpecialData("shock_damage");
        let shock_count = this.getSpecialData("shock_count");
        let t = parent.TempData().sect_shock || {
            shock_pect: 0,
            shock_damage: 0,
            shock_count: 0,
        };
        t.shock_pect += shock_pect;
        t.shock_damage += shock_damage;
        t.shock_count += shock_count;
        parent.TempData().sect_shock = t;
        "particles/units/heroes/hero_zeus/zeus_cloud_overhead_core.vpcf"
        let res = "particles/econ/items/disruptor/disruptor_2022_immortal/disruptor_2022_immortal_ambient_heads_game_gem_lightning_disolve.vpcf"
        this.buff_fx = ResHelper.CreateParticleEx(res, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        ParticleManager.SetParticleControl(this.buff_fx, 0, parent.GetAbsOrigin());
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker.GetTeam() != keys.target.GetTeam() && keys.target.IsAlive()) {
            let target = keys.target;
            let t = keys.attacker.TempData().sect_shock || {
                shock_pect: 0,
                shock_damage: 0,
            };
            if (GFuncRandom.PRD(t.shock_pect, this)) {
                let caster = keys.attacker;
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    AbilityIndex: this.GetAbilityPlus().entindex(),
                    TargetIndex: target.entindex()
                });
            }
        }
    }
}
@registerModifier()
export class modifier_sect_shock_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let shock_pect = this.getSpecialData("shock_pect");
        let shock_damage = this.getSpecialData("shock_damage");
        let shock_count = this.getSpecialData("shock_count");
        let t = parent.TempData().sect_shock || {
            shock_pect: 0,
            shock_damage: 0,
            shock_count: 0,
        };
        t.shock_pect += shock_pect;
        t.shock_damage += shock_damage;
        t.shock_count += shock_count;
        parent.TempData().sect_shock = t;
    }
}
@registerModifier()
export class modifier_sect_shock_base_c extends modifier_sect_shock_base_b { }

// 法爆流
@registerModifier()
export class modifier_sect_magcrit_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let spell_crit_pect = this.getSpecialData("spell_crit_pect");
        let spell_crit_damage_pect = this.getSpecialData("spell_crit_damage_pect");
        let t = parent.TempData().sect_magcrit || {
            spell_crit_pect: 0,
            spell_crit_damage_pect: 0,
        };
        t.spell_crit_pect += spell_crit_pect;
        t.spell_crit_damage_pect += spell_crit_damage_pect;
        parent.TempData().sect_magcrit = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_double_head/sect_double_head1.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControl(this.buff_fx, 0, parent.GetAbsOrigin());
        if (IsServer()) {
            modifier_sect_magcrit_aura.applyOnly(parent, parent, this.GetAbilityPlus())
        }
    }


}
@registerModifier()
export class modifier_sect_magcrit_base_b extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let spell_crit_pect = this.getSpecialData("spell_crit_pect");
        let spell_crit_damage_pect = this.getSpecialData("spell_crit_damage_pect");
        let t = parent.TempData().sect_magcrit || {
            spell_crit_pect: 0,
            spell_crit_damage_pect: 0,
        };
        t.spell_crit_pect += spell_crit_pect;
        t.spell_crit_damage_pect += spell_crit_damage_pect;
        parent.TempData().sect_magcrit = t;
    }
}
@registerModifier()
export class modifier_sect_magcrit_base_c extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let spell_crit_pect = this.getSpecialData("spell_crit_pect");
        let spell_crit_damage_pect = this.getSpecialData("spell_crit_damage_pect");
        let t = parent.TempData().sect_magcrit || {
            spell_crit_pect: 0,
            spell_crit_damage_pect: 0,
        };
        t.spell_crit_pect += spell_crit_pect;
        t.spell_crit_damage_pect += spell_crit_damage_pect;
        parent.TempData().sect_magcrit = t;
    }
}

@registerModifier()
export class modifier_sect_magcrit_aura extends BaseModifier_Plus {
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
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_sect_magcrit_aura_effect";
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetCastRangePlus();
    }
}

@registerModifier()
export class modifier_sect_magcrit_aura_effect extends BaseModifier_Plus {

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_CHANCE)
    CC_SPELL_CRITICALSTRIKE_CHANCE(): number {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_magcrit || {
            spell_crit_pect: 0,
            spell_crit_damage_pect: 0,
        };
        return t.spell_crit_pect;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE)
    CC_SPELL_CRITICALSTRIKE_DAMAGE(): number {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_magcrit || {
            spell_crit_pect: 0,
            spell_crit_damage_pect: 0,
        };
        return t.spell_crit_damage_pect;
    }
}

// 妖术流
@registerModifier()
export class modifier_sect_black_art_base_a extends modifier_sect_effect_base {

    // spell_lifesteal: number;
    // Init() {
    //     this.spell_lifesteal = this.getSpecialData("spell_lifesteal");
    //     let parent = this.GetParentPlus();
    //     this.buff_fx = ResHelper.CreateParticleEx("particles/econ/events/ti7/hero_levelup_ti7_flash_hit_magic.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
    //     // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
    //     this.AddParticle(this.buff_fx, false, false, -1, false, false);

    // }

    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_LIFESTEAL_PERCENTAGE)
    // CC_SPELL_LIFESTEAL_PERCENTAGE(): number {
    //     return this.spell_lifesteal;
    // }

}
@registerModifier()
export class modifier_sect_black_art_base_b extends modifier_sect_black_art_base_a {
}
@registerModifier()
export class modifier_sect_black_art_base_c extends modifier_sect_black_art_base_a {
}

// 钓鱼流
@registerModifier()
export class modifier_sect_fish_chess_base_a extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();

    }
}
@registerModifier()
export class modifier_sect_fish_chess_base_b extends modifier_sect_effect_base {

}
@registerModifier()
export class modifier_sect_fish_chess_base_c extends modifier_sect_effect_base {

}

// 守卫流
@registerModifier()
export class modifier_sect_guard_base_a extends modifier_sect_effect_base {

    Init() {
        if (IsServer()) {
            // 等待所有BUFF添加完成
            this.AddTimer(0.3, () => {
                let parent = this.GetParentPlus();
                let playerroot = parent.GetPlayerRoot();
                let runtimeunits = playerroot.BattleUnitManagerComp().GetAllBuildingRuntimeEntityRoot();
                let summability: IBaseAbility_Plus;
                for (let k of runtimeunits) {
                    let entity = k.GetDomain<IBaseNpc_Plus>();
                    if (entity) {
                        let ability = entity.FindAbilityByName("ability_sect_guard") as IBaseAbility_Plus;
                        if (ability && ability.IsCooldownReady()) {
                            summability = ability;
                            ability.UseResources(false, false, false, true);
                        }
                    }
                }
                if (summability) {
                    summability.OnSpellStart()
                }
            })
        }
    }
}
@registerModifier()
export class modifier_sect_guard_base_b extends modifier_sect_effect_base {
    Init() {
    }
}
@registerModifier()
export class modifier_sect_guard_base_c extends modifier_sect_effect_base {
    Init() {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_guard || { summonid_c: 0 };
        let summonid = this.getSpecialData("summonid");
        if (t.summonid_c == 0) {
            // parent.CreateSummon("npc_dota_creature_sect_guard", parent.GetAbsOrigin(), 60);
            // t.summonid_c = summonid;
            // parent.TempData().sect_guard = t;
        }

    }

}

// 变形流
@registerModifier()
export class modifier_sect_transform_base_a extends modifier_sect_effect_base {
    Init() {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let mana = this.getSpecialData("mana");
            let maxmana = parent.GetMaxMana();
            let curmana = parent.GetMana();
            parent.SetMana(math.min(mana + curmana, maxmana));
            this.buff_fx = ResHelper.CreateParticleEx("particles/hero/lion/aura_manadrain.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
            ParticleManager.SetParticleControl(this.buff_fx, 0, parent.GetAbsOrigin());
        }

    }

}
@registerModifier()
export class modifier_sect_transform_base_b extends modifier_sect_transform_base_a {
    Init() {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let mana = this.getSpecialData("mana");
            let maxmana = parent.GetMaxMana();
            let curmana = parent.GetMana();
            parent.SetMana(math.min(mana + curmana, maxmana));
        }

    }
}
@registerModifier()
export class modifier_sect_transform_base_c extends modifier_sect_effect_base {

    Init() {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let mana = this.getSpecialData("mana");
            let mana_regen = this.getSpecialData("mana_regen");
            let maxmana = parent.GetMaxMana();
            let curmana = parent.GetMana();
            parent.SetMana(math.min(mana + curmana, maxmana));
            this.SetStackCount(mana_regen);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_MANA_REGEN_CONSTANT(): number {
        return this.GetStackCount();
    }
}

// 恶魔流
@registerModifier()
export class modifier_sect_demon_base_a extends modifier_sect_effect_base {
    Init() {
        let damage_pect = this.getSpecialData("damage_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_demon || { damage_pect: 0 };
        t.damage_pect += damage_pect;
        parent.TempData().sect_demon = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_demon/sect_demon1.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        if (IsServer()) {
            let buff = modifier_sect_demon_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.damage_pect);
        }
    }


}
@registerModifier()
export class modifier_sect_demon_base_b extends modifier_sect_effect_base {
    public Init(params?: IModifierTable): void {
        let damage_pect = this.getSpecialData("damage_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_demon || { damage_pect: 0 };
        t.damage_pect += damage_pect;
        parent.TempData().sect_demon = t;
        if (IsServer()) {
            let buff = modifier_sect_demon_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.damage_pect);
            parent.SetUnitCanRespawn(true);
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(event: ModifierInstanceEvent): void {
        let parent = this.GetParentPlus();
        if (IsServer() && parent.ETRoot) {
            let playerroot = parent.GetPlayerRoot();
            let runtimeunits = playerroot.BattleUnitManagerComp().GetAllBuildingRuntimeEntityRoot();
            let allbuilding = runtimeunits.map(v => v.GetDomain<IBaseNpc_Plus>()).filter(v => v && v.IsAlive() && v.HasModifier("modifier_sect_demon_base_a") == false);
            if (allbuilding.length == 0) {
                parent.SetUnitCanRespawn(false);
            }
            else {
                let killedUnit = GFuncRandom.RandomOne(allbuilding);
                let runningBuild = parent.ETRoot as IBuildingRuntimeEntityRoot;
                if (runningBuild.IsRuntimeBuilding() || runningBuild.IsEnemy()) {
                    (parent.ETRoot as IBattleUnitEntityRoot).ReSpawn();
                    killedUnit.Kill(this.GetAbilityPlus(), parent);
                    let clonenpc = runningBuild.CloneSelf(parent.GetAbsOrigin() + RandomVector(100) as Vector, 60);
                    clonenpc && [
                        "modifier_sect_demon_base_a",
                        "modifier_sect_demon_base_b",
                        "modifier_sect_demon_base_c",
                    ].forEach(buffname => {
                        let buff_a = parent.findBuff(buffname)
                        if (buff_a) {
                            clonenpc.addOnlyBuff(buffname, clonenpc, buff_a.GetAbilityPlus())
                        }
                    })

                }
            }
        }
    }
}
@registerModifier()
export class modifier_sect_demon_base_c extends modifier_sect_effect_base {
    public Init(params?: IModifierTable): void {
        let damage_pect = this.getSpecialData("damage_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_demon || { damage_pect: 0 };
        t.damage_pect += damage_pect;
        parent.TempData().sect_demon = t;
        if (IsServer()) {
            let buff = modifier_sect_demon_aura.applyOnly(parent, parent, this.GetAbilityPlus());
            buff.SetStackCount(t.damage_pect);
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_OnDeath(event: ModifierInstanceEvent): void {
        let parent = this.GetParentPlus();
        if (IsServer() && parent == event.attacker && event.unit.IsFriendly(parent) == false) {
            let ability = this.GetAbilityPlus();
            let cast_response = {
                "1": "nevermore_nev_ability_shadow_07",
                "2": "nevermore_nev_ability_shadow_18",
                "3": "nevermore_nev_ability_shadow_21"
            }
            let sound_raze = "Hero_Nevermore.Shadowraze";
            EmitSoundOn(GFuncRandom.RandomValue(cast_response), parent);
            EmitSoundOn(sound_raze, parent);
            let raze_point = event.unit.GetAbsOrigin();;
            this.CastShadowRazeOnPoint(ability, raze_point);

        }
    }
    CastShadowRazeOnPoint(ability: IBaseAbility_Plus, point: Vector) {
        let parent = this.GetParentPlus();
        let radius = 275;
        let pure_damage_pect = this.getSpecialData("pure_damage_pect") * 0.01
        let particle_raze = "particles/units/heroes/hero_nevermore/nevermore_shadowraze.vpcf";
        let particle_raze_fx = ResHelper.CreateParticleEx(particle_raze, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(particle_raze_fx, 0, point);
        ParticleManager.SetParticleControl(particle_raze_fx, 1, Vector(radius, 1, 1));
        ParticleManager.ReleaseParticleIndex(particle_raze_fx);
        let enemies = FindUnitsInRadius(parent.GetTeamNumber(), point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const enemy of (enemies)) {
            if (!enemy.IsMagicImmune()) {
                ApplyDamage({
                    victim: enemy,
                    damage: GPropertyCalculate.GetAttackDamage(parent) * pure_damage_pect,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    attacker: parent,
                    ability: ability
                });
            }
        }
    }
}

@registerModifier()
export class modifier_sect_demon_aura extends BaseModifier_Plus {
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
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_sect_demon_aura_damage";
    }
    GetAuraRadius(): number {
        return this.GetAbilityPlus().GetCastRangePlus();
    }
}

@registerModifier()
export class modifier_sect_demon_aura_damage extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_COOLDOWN_PERCENTAGE(): number {
        if (this.GetCasterPlus()) {
            return this.GetCasterPlus().findBuffStack("modifier_sect_demon_aura")
        }
    }
}



// 食人流
@registerModifier()
export class modifier_sect_cannibalism_base_a extends modifier_sect_effect_base {
    Init() {
        let prop_pect = this.getSpecialData("prop_pect");
        let count = this.getSpecialData("count");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cannibalism || { prop_pect: 0, count: 0 };
        t.prop_pect += prop_pect;
        t.count += count;
        parent.TempData().sect_cannibalism = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_cannibalism/sect_cannibalism1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_sect_cannibalism_base_b extends modifier_sect_effect_base {
    Init() {
        let prop_pect = this.getSpecialData("prop_pect");
        let count = this.getSpecialData("count");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cannibalism || { prop_pect: 0, count: 0 };
        t.prop_pect += prop_pect;
        t.count += count;
        parent.TempData().sect_cannibalism = t;
    }
}
@registerModifier()
export class modifier_sect_cannibalism_base_c extends modifier_sect_cannibalism_base_b {
}

// 发明流
@registerModifier()
export class modifier_sect_invent_base_a extends modifier_sect_effect_base {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }


}
@registerModifier()
export class modifier_sect_invent_base_b extends modifier_sect_effect_base {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }
}
@registerModifier()
export class modifier_sect_invent_base_c extends modifier_sect_effect_base {
    prize_pool: number;
    Init() {
        let parent = this.GetParentPlus();
        this.prize_pool = this.getSpecialData("prize_pool");
    }
}