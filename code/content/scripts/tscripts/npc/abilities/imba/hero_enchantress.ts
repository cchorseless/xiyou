
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus, BaseOrbAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_enchantress_untouchable extends BaseAbility_Plus {
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_3;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_enchantress_untouchable";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let peace_on_earth_duration = this.GetSpecialValueFor("peace_on_earth_duration");
        let responses = {
            "1": "enchantress_ench_cast_02",
            "2": "enchantress_ench_move_18",
            "3": "enchantress_ench_move_19",
            "4": "enchantress_ench_move_20",
            "5": "enchantress_ench_laugh_06",
            "6": "enchantress_ench_rare_01"
        }
        let enemies;
        if (caster.HasScepter()) {
            enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
        } else {
            enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
        }
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsCourier()) {
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_5")) {
                    enemy.AddNewModifier(caster, this, "modifier_imba_enchantress_untouchable_peace_on_earth", {
                        duration: peace_on_earth_duration
                    });
                } else {
                    enemy.AddNewModifier(caster, this, "modifier_imba_enchantress_untouchable_peace_on_earth", {
                        duration: peace_on_earth_duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
        caster.AddNewModifier(caster, this, "modifier_imba_enchantress_untouchable_peace_on_earth", {
            duration: peace_on_earth_duration
        });
        EmitGlobalSound(GFuncRandom.RandomOne(Object.values(responses)));
        EmitGlobalSound("DOTA_Item.HeavensHalberd.Activate");
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_1") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enchantress_1")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enchantress_1"), "modifier_special_bonus_imba_enchantress_1", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_2") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enchantress_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enchantress_2"), "modifier_special_bonus_imba_enchantress_2", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_3") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enchantress_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enchantress_3"), "modifier_special_bonus_imba_enchantress_3", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enchantress_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enchantress_5"), "modifier_special_bonus_imba_enchantress_5", {});
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_untouchable extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public regret_stacks: number;
    IsHidden(): boolean {
        return this.GetCasterPlus() == this.GetParentPlus();
    }
    IsPurgable(): boolean {
        return this.GetCasterPlus() != this.GetParentPlus();
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.regret_stacks = this.ability.GetSpecialValueFor("regret_stacks");
    }
    BeRefresh(p_0: any,): void {
        this.regret_stacks = this.ability.GetSpecialValueFor("regret_stacks");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            2: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (this.parent == keys.target && !this.parent.PassivesDisabled() && !keys.attacker.IsOther() && !keys.attacker.IsBuilding() && keys.attacker.GetTeamNumber() != this.parent.GetTeamNumber()) {
            keys.attacker.AddNewModifier(this.parent, this.ability, "modifier_imba_enchantress_untouchable_slow", {});
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (this.caster == this.parent && this.caster == keys.target && !this.caster.PassivesDisabled() && !this.caster.IsIllusion() && this.caster != keys.attacker && !keys.attacker.IsBuilding()) {
            keys.attacker.AddNewModifier(this.caster, this.ability, "modifier_imba_enchantress_untouchable_slow", {}).SetStackCount(this.regret_stacks);
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_untouchable_slow extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public slow_attack_speed: number;
    public stopgap_bat_increase: any;
    public kindred_spirits_multiplier: any;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.slow_attack_speed = this.ability.GetSpecialValueFor("slow_attack_speed") + this.GetAbilityPlus().GetCaster().GetTalentValue("special_bonus_imba_enchantress_5");
        this.stopgap_bat_increase = this.ability.GetSpecialValueFor("stopgap_bat_increase");
        this.kindred_spirits_multiplier = this.ability.GetSpecialValueFor("kindred_spirits_multiplier");
        if (this.ability.GetCaster() != this.caster) {
            this.slow_attack_speed = this.slow_attack_speed * (this.kindred_spirits_multiplier * 0.01);
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_enchantress/enchantress_untouchable.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_enchantress_untouchable.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT,
            3: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.slow_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    CC_GetModifierBaseAttackTimeConstant(): number {
        return this.stopgap_bat_increase;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (this.parent == keys.attacker) {
            this.AddTimer(FrameTime(), () => {
                if ((keys.target != this.caster || this.caster.IsAlive()) && this && !this.IsNull()) {
                    if (this.GetStackCount() > 1) {
                        this.DecrementStackCount();
                    } else {
                        this.SetDuration(keys.attacker.GetAttackAnimationPoint(), false);
                    }
                }
            });
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_untouchable_peace_on_earth extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public particle: any;
    public particle2: any;
    public particle3: any;
    IsDebuff(): boolean {
        return true;
    }
    Init(p_0: any,): void {
        this.parent = this.GetParentPlus();
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/item/angelic_alliance/angelic_alliance_disarm.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle, 0, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.particle2 = ResHelper.CreateParticleEx("particles/units/unit_greevil/loot_greevil_tgt_end_sparks.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle2, 3, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle2, false, false, -1, false, false);
        this.particle3 = ResHelper.CreateParticleEx("particles/units/heroes/hero_enchantress/enchantress_natures_attendants_test.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        for (let wisp = 0; wisp < 4; wisp++) {
            ParticleManager.SetParticleControlEnt(this.particle3, wisp, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        }
        this.AddParticle(this.particle3, false, false, -1, false, false);
    }

    CheckState( /** keys */): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_enchantress_enchant extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public dominate_duration: number;
    public slow_movement_speed: number;
    public tooltip_duration: number;
    GetAbilityTargetTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        if (target.IsAncient() && caster.GetLevel() < 20) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        if (target.GetTeam() == caster.GetTeam() && !target.HasModifier("modifier_imba_enchantress_enchant_controlled")) {
            return UnitFilterResult.UF_FAIL_FRIENDLY;
        }
        let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
        return nResult;
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return "Ability Can't Target Ancients Until Level 20";
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.target = this.GetCursorTarget();
        this.dominate_duration = this.GetSpecialValueFor("dominate_duration");
        this.slow_movement_speed = this.GetSpecialValueFor("slow_movement_speed");
        this.tooltip_duration = this.GetSpecialValueFor("tooltip_duration") + this.caster.GetTalentValue("special_bonus_imba_enchantress_6");
        if (this.caster.HasTalent("special_bonus_imba_enchantress_6")) {
            this.dominate_duration = this.dominate_duration * this.caster.GetTalentValue("special_bonus_imba_enchantress_6");
        }
        if (this.target.TriggerSpellAbsorb(this)) {
            return undefined;
        }
        this.caster.EmitSound("Hero_Enchantress.EnchantCast");
        if ((!this.target.IsConsideredHero() || this.target.IsIllusion()) && !this.target.IsRoshan()) {
            this.target.Purge(true, true, false, false, false);
            if (string.find(this.target.GetUnitName(), "guys_")) {
                let lane_creep_name = this.target.GetUnitName();
                let new_lane_creep = BaseNpc_Plus.CreateUnitByName(this.target.GetUnitName(), this.target.GetAbsOrigin(), this.caster.GetTeamNumber(), false, this.caster, this.caster);
                new_lane_creep.SetBaseMaxHealth(this.target.GetMaxHealth());
                new_lane_creep.SetHealth(this.target.GetHealth());
                new_lane_creep.SetBaseDamageMin(this.target.GetBaseDamageMin());
                new_lane_creep.SetBaseDamageMax(this.target.GetBaseDamageMax());
                new_lane_creep.SetMinimumGoldBounty(this.target.GetGoldBounty());
                new_lane_creep.SetMaximumGoldBounty(this.target.GetGoldBounty());
                this.target.AddNoDraw();
                this.target.ForceKill(false);
                this.target = new_lane_creep;
            }
            this.target.SetOwner(this.caster);
            this.target.SetTeam(this.caster.GetTeam());
            this.target.SetControllableByPlayer(this.caster.GetPlayerID(), false);
            this.target.AddNewModifier(this.caster, this, "modifier_imba_enchantress_enchant_controlled", {
                duration: this.dominate_duration
            });
            this.target.AddNewModifier(this.caster, this, "modifier_kill", {
                duration: this.dominate_duration
            });
            this.target.Heal(this.target.GetMaxHealth(), this);
            if (this.GetCasterPlus().HasAbility("imba_enchantress_untouchable") && this.GetCasterPlus().findAbliityPlus<imba_enchantress_untouchable>("imba_enchantress_untouchable").IsTrained()) {
                this.target.AddNewModifier(this.caster, this.GetCasterPlus().findAbliityPlus<imba_enchantress_untouchable>("imba_enchantress_untouchable"), "modifier_imba_enchantress_untouchable", {});
            }
            if (this.caster.GetName().includes("enchantress")) {
                this.caster.EmitSound("enchantress_ench_ability_enchant_0" + math.random(1, 3));
            }
        } else {
            this.target.Purge(true, false, false, false, false);
            this.target.AddNewModifier(this.caster, this, "modifier_imba_enchantress_enchant_slow", {
                duration: this.tooltip_duration * (1 - this.target.GetStatusResistance())
            });
            if (this.caster.GetName().includes("enchantress")) {
                this.caster.EmitSound("enchantress_ench_ability_enchant_0" + math.random(4, 6));
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enchantress_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enchantress_4"), "modifier_special_bonus_imba_enchantress_4", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enchantress_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enchantress_6"), "modifier_special_bonus_imba_enchantress_6", {});
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_enchant_controlled extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public enchant_health: any;
    public enchant_damage: number;
    public enchant_armor: any;
    public remaining_hp: any;
    public particle: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.enchant_health = this.ability.GetSpecialValueFor("enchant_health");
        this.enchant_damage = this.ability.GetSpecialValueFor("enchant_damage");
        this.enchant_armor = this.ability.GetSpecialValueFor("enchant_armor");
        if (!IsServer()) {
            return;
        }
        this.remaining_hp = this.parent.GetHealth();
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_enchantress/enchantress_enchant.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle, 0, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.parent.EmitSound("Hero_Enchantress.EnchantCreep");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DOMINATED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE,
            5: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        return this.enchant_health;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.enchant_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.enchant_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage( /** keys */): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_enchantress_4");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus()) {
            if (keys.unit.IsAlive()) {
                this.remaining_hp = keys.unit.GetHealth();
            } else {
                let overkill_damage = keys.damage - this.remaining_hp;
                if (keys.attacker.IsBuilding()) {
                    return;
                }
                let damageTable = {
                    victim: keys.attacker,
                    damage: overkill_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL,
                    attacker: this.caster,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, keys.attacker, overkill_damage, undefined);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_enchant_slow extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public slow_movement_speed: number;
    public particle: any;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_enchantress_enchant_slow.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.slow_movement_speed = this.ability.GetSpecialValueFor("slow_movement_speed");
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_enchantress/enchantress_enchant_slow.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle, 0, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.parent.EmitSound("Hero_Enchantress.EnchantHero");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.StopSound("Hero_Enchantress.EnchantHero");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_enchantress_natures_attendants extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public duration: number;
    public type: number;
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_3;
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.duration = this.GetDuration();
        if (!this.type) {
            this.type = 1;
        } else {
            if (!this.caster.HasModifier("modifier_imba_enchantress_natures_attendants")) {
                this.type = this.type + 1;
                if (this.type > 5) {
                    this.type = 1;
                }
            }
        }
        this.caster.AddNewModifier(this.caster, this, "modifier_imba_enchantress_natures_attendants", {
            duration: this.duration
        });
        if (this.caster.GetName().includes("enchantress")) {
            this.caster.EmitSound("enchantress_ench_ability_nature_0" + math.random(1, 6));
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_8") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enchantress_8")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enchantress_8"), "modifier_special_bonus_imba_enchantress_8", {});
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_natures_attendants extends BaseModifier_Plus {
    public ability: imba_enchantress_natures_attendants;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public heal_interval: number;
    public heal: any;
    public radius: number;
    public wisp_count: number;
    public critical_health_pct: number;
    public base_damage_reduction_pct: number;
    public cyan_mana_restore: any;
    public green_heal_amp: any;
    public orange_day_vision: number;
    public orange_night_vision: number;
    public pink_movespeed_pct: number;
    public multiplier: any;
    public level: any;
    public particle_name: any;
    public particle: any;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.heal_interval = this.ability.GetSpecialValueFor("heal_interval");
        this.heal = this.ability.GetSpecialValueFor("heal");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.wisp_count = this.ability.GetSpecialValueFor("wisp_count");
        this.critical_health_pct = this.ability.GetSpecialValueFor("critical_health_pct");
        this.base_damage_reduction_pct = this.ability.GetSpecialValueFor("base_damage_reduction_pct");
        this.cyan_mana_restore = this.ability.GetSpecialValueFor("cyan_mana_restore");
        this.green_heal_amp = this.ability.GetSpecialValueFor("green_heal_amp");
        this.orange_day_vision = this.ability.GetSpecialValueFor("orange_day_vision");
        this.orange_night_vision = this.ability.GetSpecialValueFor("orange_night_vision");
        this.pink_movespeed_pct = this.ability.GetSpecialValueFor("pink_movespeed_pct");
        if (this.caster.HasTalent("special_bonus_imba_enchantress_8")) {
            this.multiplier = this.caster.GetTalentValue("special_bonus_imba_enchantress_8");
            this.heal = this.heal * this.multiplier;
            this.wisp_count = this.wisp_count * this.multiplier;
            this.critical_health_pct = this.critical_health_pct * this.multiplier;
            this.base_damage_reduction_pct = this.base_damage_reduction_pct * this.multiplier;
            this.cyan_mana_restore = this.cyan_mana_restore * this.multiplier;
            this.green_heal_amp = this.green_heal_amp * this.multiplier;
            this.orange_day_vision = this.orange_day_vision * this.multiplier;
            this.orange_night_vision = this.orange_night_vision * this.multiplier;
            this.pink_movespeed_pct = this.pink_movespeed_pct * this.multiplier;
        }
        this.level = this.ability.GetLevel();
        if (!IsServer()) {
            return;
        }
        if (this.ability.type) {
            this.SetStackCount(this.ability.type);
        }
        let cout3 = "particles/units/heroes/hero_enchantress/enchantress_natures_attendants_count3.vpcf";
        let cout8 = "particles/units/heroes/hero_enchantress/enchantress_natures_attendants_count8.vpcf";
        let cout14 = "particles/units/heroes/hero_enchantress/enchantress_natures_attendants_count14.vpcf";
        this.particle_name = cout3;
        if (this.level == 2) {
            this.particle_name = cout8;
        }
        else if (this.level >= 3) {
            this.particle_name = cout14;
        }
        this.particle = ResHelper.CreateParticleEx(this.particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        for (let wisp = 3; wisp <= 3 + (this.level * 2); wisp++) {
            ParticleManager.SetParticleControlEnt(this.particle, wisp, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        }
        if (this.GetStackCount() == 1) {
        } else {
            ParticleManager.SetParticleControl(this.particle, 61, Vector(1, 0, 0));
            if (this.GetStackCount() == 2) {
                ParticleManager.SetParticleControl(this.particle, 60, Vector(0, 255, 255));
            } else if (this.GetStackCount() == 3) {
                ParticleManager.SetParticleControl(this.particle, 60, Vector(50, 255, 50));
            } else if (this.GetStackCount() == 4) {
                ParticleManager.SetParticleControl(this.particle, 60, Vector(255, 140, 0));
            } else if (this.GetStackCount() == 5) {
                ParticleManager.SetParticleControl(this.particle, 60, Vector(255, 105, 180));
            }
        }
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.caster.EmitSound("Hero_Enchantress.NaturesAttendantsCast");
        this.StartIntervalThink(this.heal_interval);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let hurt_allies: IBaseNpc_Plus[] = []
        let allies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.GetHealthPercent() < 100) {
                hurt_allies.push(ally);
            }
        }
        if (GameFunc.GetCount(hurt_allies) == 0) {
            for (let wisp = 3; wisp <= 3 + (this.level * 2); wisp++) {
                ParticleManager.SetParticleControlEnt(this.particle, wisp, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            }
        } else {
            for (let wisp = 0; wisp < this.wisp_count; wisp++) {
                let selected_unit = RandomInt(0, GameFunc.GetCount(hurt_allies) - 1);
                ParticleManager.SetParticleControlEnt(this.particle, math.min(wisp + 2, 3 + (this.level * 2)), hurt_allies[selected_unit], ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hurt_allies[selected_unit].GetAbsOrigin(), true);
                hurt_allies[selected_unit].Heal(this.heal, this.ability);
                if (this.GetStackCount() == 2) {
                    hurt_allies[selected_unit].GiveMana(this.cyan_mana_restore);
                }
                if (hurt_allies[selected_unit].GetHealthPercent() < this.critical_health_pct && !hurt_allies[selected_unit].HasModifier("modifier_imba_enchantress_natures_attendants_mini")) {
                    hurt_allies[selected_unit].AddNewModifier(this.caster, this.ability, "modifier_imba_enchantress_natures_attendants_mini", {
                        duration: this.ability.duration
                    });
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.caster.StopSound("Hero_Enchantress.NaturesAttendantsCast");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetStackCount() == 5) {
            return {
                [modifierstate.MODIFIER_STATE_FLYING]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetStackCount() == 1) {
            return this.base_damage_reduction_pct;
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        if (this.GetStackCount() == 3) {
            return this.green_heal_amp;
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        if (this.GetStackCount() == 4) {
            return this.orange_day_vision;
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        if (this.GetStackCount() == 4) {
            return this.orange_night_vision;
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetStackCount() == 5) {
            return this.pink_movespeed_pct;
        } else {
            return 0;
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_natures_attendants_mini extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public heal_interval: number;
    public heal: any;
    public wisp_count_mini: number;
    public particle_name: any;
    public particle: any;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.heal_interval = this.ability.GetSpecialValueFor("heal_interval");
        this.heal = this.ability.GetSpecialValueFor("heal");
        this.wisp_count_mini = this.ability.GetSpecialValueFor("wisp_count_mini");
        if (!IsServer()) {
            return;
        }
        this.particle_name = "particles/units/heroes/hero_enchantress/enchantress_natures_attendants_lvl1.vpcf";
        if (this.wisp_count_mini >= 5) {
            this.particle_name = "particles/units/heroes/hero_enchantress/enchantress_natures_attendants_lvl2.vpcf";
        }
        this.particle = ResHelper.CreateParticleEx(this.particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        for (let wisp = 3; wisp <= 7; wisp++) {
            ParticleManager.SetParticleControlEnt(this.particle, wisp, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        }
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.parent.EmitSound("Hero_Enchantress.NaturesAttendantsCast");
        this.StartIntervalThink(this.heal_interval);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        for (let wisp = 0; wisp < this.wisp_count_mini; wisp++) {
            this.parent.Heal(this.heal, this.ability);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.StopSound("Hero_Enchantress.NaturesAttendantsCast");
    }
}
@registerAbility()
export class imba_enchantress_natura_shift extends BaseAbility_Plus {
    public modifier: any;
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_enchantress_natura_shift";
    }
    OnSpellStart(): void {
        this.modifier = this.GetCasterPlus().findBuff<modifier_imba_enchantress_natura_shift>("modifier_imba_enchantress_natura_shift");
        if (!this.modifier || this.modifier.GetStackCount() == 1) {
            this.modifier.SetStackCount(2);
        } else if (this.modifier.GetStackCount() == 2) {
            this.modifier.SetStackCount(3);
        } else if (this.modifier.GetStackCount() == 3) {
            this.modifier.SetStackCount(1);
        }
    }
    GetAbilityTextureName(): string {
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_enchantress_natura_shift")) {
            let state = caster.findBuffStack("modifier_imba_enchantress_natura_shift", caster);
            if (state == 1) {
                return "natura_shift_inactive";
            } else if (state == 2) {
                return "natura_shift_fast";
            } else if (state == 3) {
                return "natura_shift_slow";
            } else {
                return "natura_shift_inactive";
            }
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_natura_shift extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public speed_fast: number;
    public speed_slow: number;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.SetStackCount(1);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS)
    CC_GetModifierProjectileSpeedBonus(): number {
        this.ability = this.GetAbilityPlus();
        this.speed_fast = this.ability.GetSpecialValueFor("speed_fast");
        this.speed_slow = this.ability.GetSpecialValueFor("speed_slow");
        if (this.GetStackCount() == 1) {
            return 0;
        } else if (this.GetStackCount() == 2) {
            return this.speed_fast;
        } else if (this.GetStackCount() == 3) {
            return this.speed_slow;
        } else {
            return 0;
        }
    }
}
@registerAbility()
export class imba_enchantress_impetus extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_enchantress_impetus";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enchantress_7") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enchantress_7")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enchantress_7"), "modifier_special_bonus_imba_enchantress_7", {});
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_impetus extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public impetus_orb: any;
    public base_attack: any;
    public impetus_attack: any;
    public attack_queue: boolean[];
    public impetus_start: any;
    public impetus_damage: string;
    public distance_damage_pct: number;
    public bonus_attack_range_scepter: number;
    public attack_cast_stack: number;
    public huntmastery_grace_period: any;
    public armament_spell_amp_pct: number;
    public armament_attack_dmg_pct: number;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.impetus_orb = false;
        this.base_attack = "particles/units/heroes/hero_enchantress/enchantress_base_attack.vpcf";
        this.impetus_attack = "particles/units/heroes/hero_enchantress/enchantress_impetus.vpcf";
        this.attack_queue = [];
        this.impetus_start = "Hero_Enchantress.Impetus";
        this.impetus_damage = "Hero_Enchantress.ImpetusDamage";
        this.distance_damage_pct = this.ability.GetSpecialValueFor("distance_damage_pct");
        this.bonus_attack_range_scepter = this.ability.GetSpecialValueFor("bonus_attack_range_scepter");
        this.attack_cast_stack = this.ability.GetSpecialValueFor("attack_cast_stack");
        this.huntmastery_grace_period = this.ability.GetSpecialValueFor("huntmastery_grace_period");
    }
    BeRefresh(p_0: any,): void {
        this.distance_damage_pct = this.ability.GetSpecialValueFor("distance_damage_pct");
        this.bonus_attack_range_scepter = this.ability.GetSpecialValueFor("bonus_attack_range_scepter");
        this.attack_cast_stack = this.ability.GetSpecialValueFor("attack_cast_stack");
        this.huntmastery_grace_period = this.ability.GetSpecialValueFor("huntmastery_grace_period");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            4: Enum_MODIFIER_EVENT.ON_ATTACK,
            5: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            6: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
            7: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    CC_GetModifierCastRangeBonusStacking(p_0: ModifierAbilityEvent,): number {
        let cast_range = this.GetStackCount() * this.attack_cast_stack;
        if (this.parent.HasScepter()) {
            cast_range = cast_range + this.bonus_attack_range_scepter;
        }
        return cast_range;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        let attack_range = this.GetStackCount() * this.attack_cast_stack;
        if (this.parent.HasScepter()) {
            attack_range = attack_range + this.bonus_attack_range_scepter;
        }
        return attack_range;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.caster && this.ability.IsFullyCastable() && !this.caster.IsSilenced() && !keys.target.IsBuilding() && !keys.target.IsOther() && (this.ability.GetAutoCastState() || this.impetus_orb)) {
            this.parent.SetRangedProjectileName(this.impetus_attack);
        } else {
            this.parent.SetRangedProjectileName(this.base_attack);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.caster) {
            if (!this.caster.IsIllusion() && this.ability.IsFullyCastable() && !this.caster.IsSilenced() && !keys.target.IsBuilding() && !keys.target.IsOther() && (this.ability.GetAutoCastState() || this.impetus_orb)) {
                this.attack_queue.push(true);
                this.ability.UseResources(true, false, false);
                this.caster.EmitSound(this.impetus_start);
                this.impetus_orb = false;
            } else {
                this.attack_queue.push(false);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.caster && GameFunc.GetCount(this.attack_queue) > 0) {
            if (this.attack_queue[0] && !keys.target.IsBuilding() && keys.target.IsAlive()) {
                keys.target.AddNewModifier(this.caster, this.ability, "modifier_imba_enchantress_impetus_huntmastery_timer", {
                    duration: this.huntmastery_grace_period
                });
                let distance = (this.caster.GetAbsOrigin() - keys.target.GetAbsOrigin() as Vector).Length();
                let impetus_damage = distance * ((this.distance_damage_pct + this.caster.GetTalentValue("special_bonus_imba_enchantress_9")) / 100);
                let damageTable = {
                    victim: keys.target,
                    damage: impetus_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.caster,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, impetus_damage, undefined);
                keys.target.EmitSound(this.impetus_damage);
                if (this.caster.HasTalent("special_bonus_imba_enchantress_7")) {
                    if (!this.armament_spell_amp_pct || !this.armament_attack_dmg_pct) {
                        this.armament_spell_amp_pct = this.caster.GetTalentValue("special_bonus_imba_enchantress_7", "spell_amp_pct") / 100;
                        this.armament_attack_dmg_pct = this.caster.GetTalentValue("special_bonus_imba_enchantress_7", "attack_dmg_pct") / 100;
                    }
                    let phys_damage = impetus_damage * keys.target.GetSpellAmplification(false) * this.armament_spell_amp_pct;
                    let magic_damage = impetus_damage * (keys.target.GetAverageTrueAttackDamage(this.caster) / 100) * this.armament_attack_dmg_pct;
                    damageTable.damage = phys_damage;
                    damageTable.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL;
                    ApplyDamage(damageTable);
                    this.AddTimer(0.2, () => {
                        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, phys_damage, undefined);
                    });
                    damageTable.damage = magic_damage;
                    damageTable.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                    ApplyDamage(damageTable);
                    this.AddTimer(0.4, () => {
                        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, magic_damage, undefined);
                    });
                }
            }
            this.attack_queue.shift();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.caster && GameFunc.GetCount(this.attack_queue) > 0) {
            this.attack_queue.shift();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.caster) {
            if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET && keys.ability.GetName() == this.ability.GetName()) {
                this.impetus_orb = true;
            } else {
                this.impetus_orb = false;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_enchantress_impetus_huntmastery_timer extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    IgnoreTenacity() {
        return true;
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.unit.IsRealUnit() && (keys.unit.IsReincarnating && !keys.unit.IsReincarnating())) {
            if (this.GetAbilityPlus().GetName() == "imba_enchantress_impetus_723") {
                if (!this.GetCasterPlus().HasModifier("modifier_imba_enchantress_impetus_723")) {
                    let impetus_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_enchantress_impetus_723", {});
                    if (impetus_modifier) {
                        impetus_modifier.IncrementStackCount();
                    }
                } else {
                    this.GetCasterPlus().findBuff<modifier_imba_enchantress_impetus_723>("modifier_imba_enchantress_impetus_723").IncrementStackCount();
                }
            } else {
                this.caster = this.GetCasterPlus();
                let impetus_modifier = this.caster.findBuff<modifier_imba_enchantress_impetus>("modifier_imba_enchantress_impetus");
                if (impetus_modifier) {
                    impetus_modifier.IncrementStackCount();
                }
            }
            if (this.GetCasterPlus().GetName().includes("enchantress")) {
                this.GetCasterPlus().EmitSound("enchantress_ench_ability_impetus_0" + math.random(1, 7));
            }
        }
    }
}
@registerAbility()
export class imba_enchantress_impetus_723 extends BaseOrbAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    OnUpgrade(): void {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_enchantress_impetus_723")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_enchantress_impetus_723", {});
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_generic_orb_effect_lua";
    }
    GetProjectileName() {
        return "particles/units/heroes/hero_enchantress/enchantress_impetus.vpcf";
    }
    OnOrbFire() {
        this.GetCasterPlus().EmitSound("Hero_Enchantress.Impetus");
    }
    OnOrbImpact(keys: ModifierAttackEvent) {
        if (!keys.target.IsMagicImmune() && keys.target.IsAlive()) {
            keys.target.EmitSound("Hero_Enchantress.ImpetusDamage");
            keys.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_enchantress_impetus_huntmastery_timer", {
                duration: this.GetSpecialValueFor("huntmastery_grace_period")
            });
            let distance = (this.GetCasterPlus().GetAbsOrigin() - keys.target.GetAbsOrigin() as Vector).Length();
            let impetus_damage = distance * this.GetTalentSpecialValueFor("distance_damage_pct") / 100;
            ApplyDamage({
                victim: keys.target,
                damage: impetus_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, impetus_damage, undefined);
            return 1
        }
        return 0
    }
}
@registerModifier()
export class modifier_imba_enchantress_impetus_723 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    CC_GetModifierCastRangeBonusStacking(p_0: ModifierAbilityEvent,): number {
        if (this.GetAbilityPlus()) {
            let cast_range = this.GetStackCount() * this.GetSpecialValueFor("attack_cast_stack");
            return cast_range;
        } else {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetAbilityPlus()) {
            let attack_range = this.GetStackCount() * this.GetSpecialValueFor("attack_cast_stack");
            return attack_range;
        } else {
            this.Destroy();
        }
    }
}

@registerModifier()
export class modifier_special_bonus_imba_enchantress_3 extends BaseModifier_Plus {
    public damage: number;
    public spell_amp: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.damage = this.GetCasterPlus().GetTalentValue("special_bonus_imba_enchantress_3", "damage");
        this.spell_amp = this.GetCasterPlus().GetTalentValue("special_bonus_imba_enchantress_3", "spell_amp");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.spell_amp;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_4 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_5 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_6 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_7 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_8 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_9 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_1 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetParentPlus().Script_GetAttackRange();
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_special_bonus_imba_enchantress_1_aura";
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_1_aura extends BaseModifier_Plus {
    public value: any;
    GetTexture(): string {
        return "enchantress_enchant";
    }
    BeCreated(p_0: any,): void {
        this.value = this.GetCasterPlus().GetTalentValue("special_bonus_imba_enchantress_1");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.value;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_2 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetParentPlus().Script_GetAttackRange();
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_special_bonus_imba_enchantress_2_aura";
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enchantress_2_aura extends BaseModifier_Plus {
    public value: any;
    GetTexture(): string {
        return "enchantress_enchant";
    }
    BeCreated(p_0: any,): void {
        this.value = this.GetCasterPlus().GetTalentValue("special_bonus_imba_enchantress_2");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.value;
    }
}
