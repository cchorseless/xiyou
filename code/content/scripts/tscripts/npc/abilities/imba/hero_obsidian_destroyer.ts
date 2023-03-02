
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
function SetArcaneOrbProjectile(caster: IBaseNpc_Plus, orb_attack: boolean = false) {
    let skadi_modifier = "modifier_item_imba_skadi_unique";
    let deso_modifier = "modifier_item_imba_desolator_unique";
    let morbid_modifier = "modifier_imba_morbid_mask";
    let mom_modifier = "modifier_imba_mask_of_madness";
    let satanic_modifier = "modifier_imba_satanic";
    let vladimir_modifier = "modifier_item_imba_vladmir";
    let vladimir_2_modifier = "modifier_item_imba_vladmir_blood";
    let skadi_projectile = "particles/items2_fx/skadi_projectile.vpcf";
    let deso_projectile = "particles/items_fx/desolator_projectile.vpcf";
    let deso_skadi_projectile = "particles/item/desolator/desolator_skadi_projectile_2.vpcf";
    let lifesteal_projectile = "particles/item/lifesteal_mask/lifesteal_particle.vpcf";
    let basic_attack = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_base_attack.vpcf";
    let arcane_orb = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_arcane_orb.vpcf";
    let lifesteal_arcane_orb_projectile = "particles/hero/outworld_devourer/lifesteal_orb/lifesteal_arcane_orb.vpcf";
    let skadi_arcane_orb_projectile = "particles/hero/outworld_devourer/skadi_orb/skadi_orb.vpcf";
    let desolator_arcane_orb_projectile = "particles/hero/outworld_devourer/desolator_orb/desolator_arcane_orb.vpcf";
    let deso_skadi_orb_projectile = "particles/hero/outworld_devourer/deso_skadi_orb/deso_skadi_arcane_orb.vpcf";
    let lifesteal_skadi_arcane_projectile = "particles/hero/outworld_devourer/lifesteal_skadi_orb/lifesteal_skadi_orb.vpcf";
    let lifesteal_deso_arcane_orb_projectile = "particles/hero/outworld_devourer/lifesteal_deso_orb/lifesteal_deso_arcane_orb.vpcf";
    let lifesteal_deso_skadi_arcane_projectile = "particles/hero/outworld_devourer/lifesteal_deso_skadi_orb/deso_skadi_orb/lifesteal_deso_skadi_arcane_orb.vpcf";
    let has_lifesteal;
    let has_skadi;
    let has_desolator;
    if (caster.HasModifier(morbid_modifier) || caster.HasModifier(mom_modifier) || caster.HasModifier(satanic_modifier) || caster.HasModifier(vladimir_modifier) || caster.HasModifier(vladimir_2_modifier)) {
        has_lifesteal = true;
    }
    if (caster.HasModifier(skadi_modifier)) {
        has_skadi = true;
    }
    if (caster.HasModifier(deso_modifier)) {
        has_desolator = true;
    }
    if (orb_attack) {
        if (has_desolator && has_skadi && has_lifesteal) {
            caster.SetRangedProjectileName(lifesteal_deso_skadi_arcane_projectile);
        } else if (has_desolator && has_lifesteal) {
            caster.SetRangedProjectileName(lifesteal_deso_arcane_orb_projectile);
        } else if (has_skadi && has_desolator) {
            caster.SetRangedProjectileName(deso_skadi_orb_projectile);
        } else if (has_lifesteal && has_skadi) {
            caster.SetRangedProjectileName(lifesteal_skadi_arcane_projectile);
        } else if (has_skadi) {
            caster.SetRangedProjectileName(skadi_arcane_orb_projectile);
        } else if (has_lifesteal) {
            caster.SetRangedProjectileName(lifesteal_arcane_orb_projectile);
        } else if (has_desolator) {
            caster.SetRangedProjectileName(desolator_arcane_orb_projectile);
            return;
        } else {
            caster.SetRangedProjectileName(arcane_orb);
            return;
        }
    } else {
        if (has_skadi && has_desolator) {
            caster.SetRangedProjectileName(deso_skadi_projectile);
            return;
        } else if (has_skadi) {
            caster.SetRangedProjectileName(skadi_projectile);
        } else if (has_desolator) {
            caster.SetRangedProjectileName(deso_projectile);
            return;
        } else if (has_lifesteal) {
            caster.SetRangedProjectileName(lifesteal_projectile);
        } else {
            caster.SetRangedProjectileName(basic_attack);
            return;
        }
    }
}

function ApplyIntelligenceSteal(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, stack_count: number, duration: number) {
    let mana_per_int = 12;
    let modifier_buff = "modifier_imba_arcane_orb_buff";
    let modifier_debuff = "modifier_imba_arcane_orb_debuff";
    if (!target.HasModifier(modifier_debuff)) {
        target.AddNewModifier(caster, ability, modifier_debuff, {
            duration: duration * (1 - target.GetStatusResistance())
        });
    }
    let modifier_debuff_handler = target.FindModifierByName(modifier_debuff);
    if (modifier_debuff_handler) {
        for (let i = 1; i <= stack_count; i += 1) {
            target.ReduceMana(mana_per_int);
            modifier_debuff_handler.IncrementStackCount();
            modifier_debuff_handler.ForceRefresh();
        }
    }
    if (!caster.HasModifier(modifier_buff)) {
        caster.AddNewModifier(caster, ability, modifier_buff, {
            duration: duration
        });
    }
    let modifier_buff_handler = caster.FindModifierByName(modifier_buff);
    if (modifier_buff_handler) {
        for (let i = 1; i <= stack_count; i += 1) {
            modifier_buff_handler.IncrementStackCount();
            modifier_buff_handler.ForceRefresh();
        }
    }
    if (caster.HasTalent("special_bonus_imba_obsidian_destroyer_2")) {
        let modifier_stack = "modifier_imba_arcane_orb_instance";
        if (!caster.HasModifier(modifier_stack)) {
            caster.AddNewModifier(caster, ability, modifier_stack, {
                duration: duration
            });
        }
        let modifier_stack_handler = caster.FindModifierByName(modifier_stack);
        if (modifier_stack_handler) {
            modifier_stack_handler.IncrementStackCount();
            modifier_stack_handler.ForceRefresh();
        }
    }
}

const particle_prison_end = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison_end.vpcf";

@registerAbility()
export class imba_obsidian_destroyer_arcane_orb extends BaseAbility_Plus {
    public force_arcane_orb: any;
    GetAbilityTextureName(): string {
        return "obsidian_destroyer_arcane_orb";
    }
    IsStealable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_arcane_orb_thinker";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let modifier = "modifier_imba_arcane_orb_thinker";
            let target = this.GetCursorTarget();
            this.force_arcane_orb = true;
            caster.MoveToTargetToAttack(target);
            ability.RefundManaCost();
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        return caster.Script_GetAttackRange();
    }
}
@registerModifier()
export class modifier_imba_arcane_orb_thinker extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_obsidian_destroyer_arcane_orb;
    public sound_cast: any;
    public particle_explosion: any;
    public particle_explosion_scatter: any;
    public modifier_buff: any;
    public modifier_debuff: any;
    public modifier_essence: any;
    public mana_per_int: any;
    public mana_pool_damage_pct: number;
    public illusion_bonus_dmg: number;
    public int_steal_duration: number;
    public int_steal_count: number;
    public splash_radius: number;
    public radius: number;
    public auto_cast: any;
    public current_mana: any;
    public arcane_orb_attack: any;
    public particle_explosion_fx: any;
    public particle_explosion_scatter_fx: any;
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFunc);
    } */
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.sound_cast = "Hero_ObsidianDestroyer.ArcaneOrb";
        this.particle_explosion = "particles/hero/outworld_devourer/arcane_orb_explosion.vpcf";
        this.particle_explosion_scatter = "particles/hero/outworld_devourer/arcane_orb_explosion_f.vpcf";
        this.modifier_buff = "modifier_imba_arcane_orb_buff";
        this.modifier_debuff = "modifier_imba_arcane_orb_debuff";
        this.modifier_essence = "modifier_imba_essence_aura_buff";
        this.mana_per_int = 12;
        this.mana_pool_damage_pct = this.ability.GetSpecialValueFor("mana_pool_damage_pct");
        this.illusion_bonus_dmg = this.ability.GetSpecialValueFor("illusion_bonus_dmg");
        this.int_steal_duration = this.ability.GetSpecialValueFor("int_steal_duration");
        this.int_steal_count = this.ability.GetSpecialValueFor("int_steal_count");
        this.splash_radius = this.ability.GetSpecialValueFor("splash_radius");
        this.radius = this.ability.GetSpecialValueFor("radius");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker.IsIllusion()) {
                return undefined;
            }
            if (this.caster == attacker) {
                let orb_attack = true;
                this.auto_cast = this.ability.GetAutoCastState();
                this.current_mana = this.caster.GetMana();
                if (this.caster.IsSilenced()) {
                    orb_attack = false;
                }
                if (target.IsBuilding() || target.IsMagicImmune()) {
                    orb_attack = false;
                }
                if (this.caster.GetTeamNumber() == target.GetTeamNumber()) {
                    orb_attack = false;
                }
                if (!this.ability.force_arcane_orb && !this.auto_cast) {
                    orb_attack = false;
                }
                if (!this.ability.IsFullyCastable()) {
                    orb_attack = false;
                }
                if (orb_attack) {
                    this.arcane_orb_attack = true;
                    SetArcaneOrbProjectile(this.caster, true);
                } else {
                    this.arcane_orb_attack = false;
                    SetArcaneOrbProjectile(this.caster, false);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.caster == keys.attacker) {
                this.ability.force_arcane_orb = undefined;
                if (!this.arcane_orb_attack) {
                    return undefined;
                }
                EmitSoundOn(this.sound_cast, this.caster);
                this.ability.UseResources(true, false, false);
                if (this.caster.HasModifier(this.modifier_essence)) {
                    let modifier_essence_handler = this.caster.FindModifierByName(this.modifier_essence) as modifier_imba_essence_aura_buff;
                    if (modifier_essence_handler) {
                        modifier_essence_handler.ProcEssenceAura();
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.caster == attacker) {
                if (target.IsAlive() && this.arcane_orb_attack) {
                    this.ApplyArcaneOrbAttack(target);
                }
            }
        }
    }

    ApplyArcaneOrbAttack(target: IBaseNpc_Plus) {
        if (!target.IsMagicImmune()) {
            let damage = this.caster.GetMana() * this.mana_pool_damage_pct * 0.01;
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(enemies)) {
                let damage_instance = damage;
                if (enemy.IsSummoned() || enemy.IsIllusion()) {
                    damage_instance = damage + this.illusion_bonus_dmg;
                }
                let damageTable = {
                    victim: enemy,
                    damage: damage_instance,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.caster,
                    ability: this.ability
                }
                let final_damage = ApplyDamage(damageTable);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, enemy, final_damage, undefined);
            }
            if (target.IsSummoned() || target.IsIllusion()) {
                this.AddTimer(FrameTime(), () => {
                    if (!target.IsAlive()) {
                        this.particle_explosion_fx = ResHelper.CreateParticleEx(this.particle_explosion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                        ParticleManager.SetParticleControl(this.particle_explosion_fx, 0, target.GetAbsOrigin());
                        ParticleManager.SetParticleControl(this.particle_explosion_fx, 1, target.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(this.particle_explosion_fx);
                        this.particle_explosion_scatter_fx = ResHelper.CreateParticleEx(this.particle_explosion_scatter, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
                        ParticleManager.SetParticleControl(this.particle_explosion_scatter_fx, 0, target.GetAbsOrigin());
                        ParticleManager.SetParticleControl(this.particle_explosion_scatter_fx, 3, Vector(this.splash_radius, 0, 0));
                        ParticleManager.ReleaseParticleIndex(this.particle_explosion_scatter_fx);
                        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, this.splash_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                        for (const [_, enemy] of ipairs(enemies)) {
                            let damageTable = {
                                victim: enemy,
                                damage: (damage - this.illusion_bonus_dmg),
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                                attacker: this.caster,
                                ability: this.ability
                            }
                            ApplyDamage(damageTable);
                            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, enemy, damage, undefined);
                        }
                    }
                });
            }
            if (!target.IsRealHero()) {
                return;
            }
            let int_steal_count = this.int_steal_count;
            this.int_steal_duration = this.ability.GetSpecialValueFor("int_steal_duration") + this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_9");
            ApplyIntelligenceSteal(this.caster, this.ability, target, int_steal_count, this.int_steal_duration);
            if (this.caster.HasTalent("special_bonus_imba_obsidian_destroyer_1") && this.caster.GetIntellect() > target.GetIntellect()) {
                this.AddTimer(FrameTime(), () => {
                    let damage = this.caster.GetIntellect() - target.GetIntellect();
                    this.particle_explosion_fx = ResHelper.CreateParticleEx(this.particle_explosion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                    ParticleManager.SetParticleControl(this.particle_explosion_fx, 0, Vector(this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_1"), 0, 0));
                    ParticleManager.SetParticleControl(this.particle_explosion_fx, 1, target.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(this.particle_explosion_fx);
                    let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_1"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of ipairs(enemies)) {
                        let damageTable = {
                            victim: enemy,
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                            attacker: this.caster,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                            ability: this.ability
                        }
                        ApplyDamage(damageTable);
                        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, enemy, damage, undefined);
                    }
                });
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.caster) {
            let order_type = keys.order_type;
            if (order_type != dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) {
                this.ability.force_arcane_orb = undefined;
            }
        }
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
}
@registerModifier()
export class modifier_imba_arcane_orb_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public int_steal_duration: number;
    public stacks_table: number[];
    GetTexture(): string {
        return "obsidian_destroyer_arcane_orb";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.int_steal_duration = this.ability.GetSpecialValueFor("int_steal_duration") + this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_9");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table); i >= 1; i += -1) {
                    if (this.stacks_table[i] + this.int_steal_duration < GameRules.GetGameTime()) {
                        table.remove(this.stacks_table, i);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
                // this.GetParentPlus().CalculateStatBonus(true);
            } else {
                this.Destroy();
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            table.insert(this.stacks_table, GameRules.GetGameTime());
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        let stacks = this.GetStackCount();
        return stacks;
    }
}
@registerModifier()
export class modifier_imba_arcane_orb_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public mana_per_int: any;
    public int_steal_duration: number;
    public stacks_table: number[];
    GetTexture(): string {
        return "obsidian_destroyer_arcane_orb";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.mana_per_int = 12;
            this.int_steal_duration = this.ability.GetSpecialValueFor("int_steal_duration") + this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_9");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table); i >= 1; i += -1) {
                    if (this.stacks_table[i] + this.int_steal_duration < GameRules.GetGameTime()) {
                        table.remove(this.stacks_table, i);
                        this.parent.GiveMana(this.mana_per_int);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
                // if (this.GetParentPlus().CalculateStatBonus) {
                //     this.GetParentPlus().CalculateStatBonus(true);
                // }
            } else {
                this.Destroy();
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            table.insert(this.stacks_table, GameRules.GetGameTime());
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        let stacks = this.GetStackCount();
        return stacks * (-1);
    }
}
@registerModifier()
export class modifier_imba_arcane_orb_instance extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public int_steal_duration: number;
    public stacks_table: number[];
    GetTexture(): string {
        return "obsidian_destroyer_sanity_eclipse";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.int_steal_duration = this.ability.GetSpecialValueFor("int_steal_duration") + this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_9");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table); i >= 1; i += -1) {
                    if (this.stacks_table[i] + this.int_steal_duration < GameRules.GetGameTime()) {
                        table.remove(this.stacks_table, i);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
                // this.GetParentPlus().CalculateStatBonus(true);
            } else {
                this.Destroy();
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            table.insert(this.stacks_table, GameRules.GetGameTime());
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_obsidian_destroyer_astral_imprisonment extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "obsidian_destroyer_astral_imprisonment";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        let modifier_self = "modifier_imba_astral_imprisonment_buff";
        if (caster.HasModifier(modifier_self)) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK;
    }
    GetCastPoint(): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_astral_imprisonment_buff")) {
            return 0;
        }
        return super.GetCastPoint();
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_astral_imprisonment_buff")) {
            return 25000;
        }
        let cast_range = this.GetSpecialValueFor("cast_range");
        return cast_range;
    }
    GetManaCost(level: number): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_astral_imprisonment_buff")) {
            return 0;
        }
        return super.GetManaCost(level);
    }
    GetCooldown(level: number): number {
        let prison_duration = this.GetSpecialValueFor("prison_duration");
        if (this.GetCasterPlus().HasModifier("modifier_imba_astral_imprisonment_buff")) {
            return 0;
        }
        if (IsServer()) {
            return super.GetCooldown(level) - prison_duration;
        }
        return super.GetCooldown(level);
    }
    IsHiddenWhenStolen(): boolean {
        let caster = this.GetCasterPlus();
        if (caster.HasAbility("imba_obsidian_destroyer_sanity_eclipse")) {
            return true;
        }
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let modifier_self = "modifier_imba_astral_imprisonment_buff";
        if (!caster.HasModifier(modifier_self)) {
            let target = this.GetCursorTarget();
            let sound_cast = "Hero_ObsidianDestroyer.AstralImprisonment.Cast";
            let modifier_prison = "modifier_imba_astral_imprisonment";
            let modifier_essence = "modifier_imba_essence_aura_buff";
            let prison_duration = this.GetSpecialValueFor("prison_duration");
            if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                prison_duration = prison_duration * (1 - target.GetStatusResistance());
            }
            EmitSoundOn(sound_cast, caster);
            if (!target) {
                return undefined;
            }
            if (caster.GetTeamNumber() != target.GetTeamNumber()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            this.EndCooldown();
            let prison_modifier = target.AddNewModifier(caster, this, modifier_prison, {
                duration: prison_duration
            });
            let modifier_self_handler = caster.AddNewModifier(caster, this, modifier_self, {
                duration: prison_modifier.GetRemainingTime()
            }) as modifier_imba_astral_imprisonment_buff;
            if (modifier_self_handler) {
                modifier_self_handler.target = target;
                modifier_self_handler.target_point = target.GetAbsOrigin();
            }
            if (caster.HasModifier(modifier_essence)) {
                let modifier_essence_handler = caster.FindModifierByName(modifier_essence) as modifier_imba_essence_aura_buff;
                if (modifier_essence_handler) {
                    modifier_essence_handler.ProcEssenceAura();
                }
            }
            this.UseResources(false, false, true);
        } else {
            let target_point = this.GetCursorPosition();
            let modifier_self_handler = caster.FindModifierByName(modifier_self) as modifier_imba_astral_imprisonment_buff;
            if (modifier_self_handler) {
                modifier_self_handler.target_point = target_point;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_astral_imprisonment extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_astral: any;
    public sound_end: any;
    public particle_prison: any;
    public modifier_prison_self: any;
    public scepter: any;
    public radius: number;
    public damage: number;
    public scepter_int_steal_count: number;
    public int_steal_duration: number;
    public particle_prison_fx: any;
    public particle_prison_end_fx: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.sound_astral = "Hero_ObsidianDestroyer.AstralImprisonment";
            this.sound_end = "Hero_ObsidianDestroyer.AstralImprisonment.End";
            this.particle_prison = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison.vpcf";
            this.modifier_prison_self = "modifier_imba_astral_imprisonment_buff";
            this.scepter = this.caster.HasScepter();
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.scepter_int_steal_count = this.ability.GetSpecialValueFor("scepter_int_steal_count");
            this.int_steal_duration = this.ability.GetSpecialValueFor("int_steal_duration");
            EmitSoundOn(this.sound_astral, this.parent);
            this.parent.AddNoDraw();
            if (this.scepter && this.parent.GetTeamNumber() != this.caster.GetTeamNumber() && ((this.parent.IsRealHero() && !this.parent.IsClone()) || this.parent.IsTempestDouble())) {
                ApplyIntelligenceSteal(this.caster, this.ability, this.parent, this.scepter_int_steal_count, this.int_steal_duration);
            }
            this.AddTimer(FrameTime(), () => {
                if (this.scepter && !this.caster.HasModifier(this.modifier_prison_self)) {
                    this.particle_prison_fx = ResHelper.CreateParticleEx(this.particle_prison, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.parent);
                    ParticleManager.SetParticleControl(this.particle_prison_fx, 0, this.parent.GetAbsOrigin());
                    ParticleManager.SetParticleControl(this.particle_prison_fx, 2, this.parent.GetAbsOrigin());
                    ParticleManager.SetParticleControl(this.particle_prison_fx, 3, this.parent.GetAbsOrigin());
                    this.AddParticle(this.particle_prison_fx, false, false, -1, false, false);
                }
            });
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state;
        if (this.parent == this.caster) {
            state = {
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true,
                [modifierstate.MODIFIER_STATE_DISARMED]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                [modifierstate.MODIFIER_STATE_STUNNED]: true
            }
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.parent.StopSound(this.sound_astral);
            EmitSoundOn(this.sound_end, this.parent);
            this.parent.RemoveNoDraw();
            this.AddTimer(FrameTime(), () => {
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const enemy of (enemies)) {
                    if (!enemy.IsMagicImmune() && !enemy.TempData().astral_imprisonment_immunity) {
                        this.particle_prison_end_fx = ResHelper.CreateParticleEx(particle_prison_end, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
                        ParticleManager.SetParticleControl(this.particle_prison_end_fx, 0, enemy.GetAbsOrigin());
                        let damageTable = {
                            victim: enemy,
                            damage: this.damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            attacker: this.caster,
                            ability: this.ability
                        }
                        ApplyDamage(damageTable);
                        enemy.TempData().astral_imprisonment_immunity = true;
                        this.AddTimer(0.2, () => {
                            enemy.TempData().astral_imprisonment_immunity = false;
                        });
                    }
                }
            });
            this.parent.AddNewModifier(this.parent, undefined, "modifier_phased", {
                duration: FrameTime()
            });
        }
    }
}
@registerModifier()
export class modifier_imba_astral_imprisonment_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public particle_prison: any;
    public prison_movespeed: number;
    public current_location: any;
    public particle_prison_fx: any;

    target: IBaseNpc_Plus;
    target_point: Vector;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.particle_prison = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_prison.vpcf";
            this.prison_movespeed = this.ability.GetSpecialValueFor("prison_movespeed");
            this.AddTimer(0.1, () => {
                this.current_location = this.target.GetAbsOrigin();
                if (this.target != this.GetCasterPlus() && this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                    this.prison_movespeed = this.prison_movespeed * 2;
                }
                this.particle_prison_fx = ResHelper.CreateParticleEx(this.particle_prison, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.target);
                ParticleManager.SetParticleControl(this.particle_prison_fx, 0, this.target.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_prison_fx, 2, this.target.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_prison_fx, 3, this.target.GetAbsOrigin());
                this.AddParticle(this.particle_prison_fx, false, false, -1, false, false);
                this.StartIntervalThink(FrameTime());
            });
        }
    }
    OnIntervalThink(): void {
        if (this.caster.HasTalent("special_bonus_imba_obsidian_destroyer_4")) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.target.GetAbsOrigin(), undefined, this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_4") + this.caster.GetIntellect(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(enemies)) {
                if (enemy == this.target) {
                } else {
                    if ((!enemy.HasModifier("modifier_imba_astral_imprisonment_sucked"))) {
                        let particle_prison_end_fx = ResHelper.CreateParticleEx(particle_prison_end, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
                        ParticleManager.SetParticleControl(particle_prison_end_fx, 0, enemy.GetAbsOrigin());
                        enemy.AddNoDraw();
                        enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_astral_imprisonment_sucked", {
                            duration: this.GetRemainingTime()
                        });
                    }
                }
            }
        }
        if (!this.target || !this.target_point) {
            return undefined;
        }
        if (this.current_location == this.target_point) {
            return undefined;
        }
        let distance = (this.target_point - this.current_location as Vector).Length2D();
        let direction = (this.target_point - this.current_location as Vector).Normalized();
        let new_point;
        if (distance < (this.prison_movespeed * FrameTime())) {
            new_point = this.current_location + direction * distance;
        } else {
            new_point = this.current_location + direction * this.prison_movespeed * FrameTime();
        }
        this.current_location = new_point;
        this.target.SetAbsOrigin(this.current_location);
        ParticleManager.SetParticleControl(this.particle_prison_fx, 0, this.target.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_prison_fx, 2, this.target.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_prison_fx, 3, this.target.GetAbsOrigin());
        if (this.caster.HasTalent("special_bonus_imba_obsidian_destroyer_4")) {
            let enemies_sucked = FindUnitsInRadius(this.caster.GetTeamNumber(), this.target.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(enemies_sucked)) {
                if (enemy.HasModifier("modifier_imba_astral_imprisonment_sucked")) {
                    enemy.SetAbsOrigin(this.current_location);
                }
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.ability.UseResources(false, false, true);
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_astral_imprisonment_sucked extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            let particle_prison_end_fx = ResHelper.CreateParticleEx(particle_prison_end, ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(particle_prison_end_fx, 0, this.GetParentPlus().GetAbsOrigin());
            this.GetParentPlus().RemoveNoDraw();
            ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), this.GetSpecialValueFor("radius"));
            this.GetParentPlus().SetUnitOnClearGround();
        }
    }
}
@registerAbility()
export class imba_obsidian_destroyer_essence_aura extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "obsidian_destroyer_essence_aura";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_essence_aura";
    }
}
@registerModifier()
export class modifier_imba_essence_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
        if (IsServer()) {
            if (this.caster.IsIllusion()) {
                let casters = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_DEAD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
                for (const [_, caster] of ipairs(casters)) {
                    if (caster.GetUnitName() == this.caster.GetUnitName()) {
                        let int = caster.GetIntellect();
                        this.SetStackCount(int);
                        return;
                    }
                }
                return undefined;
            }
            this.StartIntervalThink(0.5);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let int = this.caster.GetIntellect();
            this.SetStackCount(int);
        }
    }

    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_obsidian_destroyer_3")) {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
        } else {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
        }
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_essence_aura_buff";
    }
    IsAura(): boolean {
        if (IsServer()) {
            if (this.caster.PassivesDisabled()) {
                return false;
            }
            if (this.caster.IsIllusion()) {
                return false;
            }
            return true;
        }
    }
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_essence_aura_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_proc: any;
    public particle_essence: any;
    public modifier_proc: any;
    public modifier_overmana: any;
    public modifier_overmana_indicator: any;
    public restore_chance_pct: number;
    public restore_mana_pct: number;
    public bonus_int_on_proc: number;
    public int_proc_duration: number;
    public particle_essence_fx: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_proc = "Hero_ObsidianDestroyer.EssenceAura";
        this.particle_essence = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_essence_effect.vpcf";
        this.modifier_proc = "modifier_imba_essence_aura_proc";
        this.modifier_overmana = "modifier_imba_essence_aura_over_maximum";
        this.modifier_overmana_indicator = "modifier_imba_essence_aura_over_maximum_indicator";
        this.restore_chance_pct = this.ability.GetSpecialValueFor("restore_chance_pct");
        this.restore_mana_pct = this.ability.GetSpecialValueFor("restore_mana_pct");
        this.bonus_int_on_proc = this.ability.GetSpecialValueFor("bonus_int_on_proc");
        this.int_proc_duration = this.ability.GetSpecialValueFor("int_proc_duration");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        }
        return Object.values(decFunc);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let ability = keys.ability;
            let unit = keys.unit;
            if (unit == this.parent) {
                if (ability.GetManaCost(-1) == 0) {
                    return undefined;
                }
                if (ability.GetCooldown(-1) == 0) {
                    return undefined;
                }
                if (ability.IsItem()) {
                    return undefined;
                }
                this.ProcEssenceAura();
            }
        }
    }
    ProcEssenceAura() {
        if (IsServer()) {
            if (GFuncRandom.PRD(this.restore_chance_pct, this)) {
                if (this.parent.GetTeamNumber() == this.caster.GetTeamNumber()) {
                    let max_mana = this.parent.GetMaxMana();
                    let mana_restore = max_mana * (this.restore_mana_pct * 0.01);
                    if (this.caster.HasTalent("special_bonus_imba_obsidian_destroyer_5")) {
                        let heal_amount = this.caster.GetIntellect();
                        this.parent.Heal(heal_amount, this.GetAbilityPlus());
                    }
                    if (this.caster.HasTalent("special_bonus_imba_obsidian_destroyer_8") && this.caster == this.parent) {
                        let current_mana = this.caster.GetMana();
                        let excess_mana = (current_mana + mana_restore) - max_mana;
                        if (excess_mana > 0) {
                            if (!this.caster.HasModifier(this.modifier_overmana)) {
                                let overmana_duration = this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_8");
                                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_overmana, {
                                    duration: overmana_duration
                                });
                                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_overmana_indicator, {
                                    duration: overmana_duration
                                });
                            }
                            let modifier_overmana_handler = this.caster.FindModifierByName(this.modifier_overmana);
                            let modifier_overmana_indicator = this.caster.FindModifierByName(this.modifier_overmana_indicator);
                            if (modifier_overmana_handler) {
                                for (let i = 1; i <= excess_mana; i += 1) {
                                    modifier_overmana_handler.IncrementStackCount();
                                    modifier_overmana_handler.ForceRefresh();
                                }
                            }
                            if (modifier_overmana_indicator) {
                                modifier_overmana_indicator.IncrementStackCount();
                                modifier_overmana_indicator.ForceRefresh();
                            }
                        }
                    }
                    this.parent.GiveMana(mana_restore);
                    this.particle_essence_fx = ResHelper.CreateParticleEx(this.particle_essence, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
                    ParticleManager.SetParticleControl(this.particle_essence_fx, 0, this.parent.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(this.particle_essence_fx);
                } else {
                    this.particle_essence_fx = ResHelper.CreateParticleEx(this.particle_essence, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
                    ParticleManager.SetParticleControl(this.particle_essence_fx, 0, this.parent.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(this.particle_essence_fx);
                }
                if (this.caster != this.parent) {
                    if (!this.caster.HasModifier(this.modifier_proc)) {
                        this.caster.AddNewModifier(this.caster, this.ability, this.modifier_proc, {
                            duration: this.int_proc_duration
                        });
                    }
                    let modifier_proc_handler = this.caster.FindModifierByName(this.modifier_proc);
                    if (modifier_proc_handler) {
                        for (let i = 1; i <= this.bonus_int_on_proc; i += 1) {
                            modifier_proc_handler.IncrementStackCount();
                            modifier_proc_handler.ForceRefresh();
                        }
                    }
                }
            }
        }
    }

}
@registerModifier()
export class modifier_imba_essence_aura_proc extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public int_proc_duration: number;
    public stacks_table: number[];
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.int_proc_duration = this.ability.GetSpecialValueFor("int_proc_duration");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table); i >= 1; i += -1) {
                    if (this.stacks_table[i] + this.int_proc_duration < GameRules.GetGameTime()) {
                        table.remove(this.stacks_table, i);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
                // this.GetParentPlus().CalculateStatBonus(true);
            } else {
                this.Destroy();
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            table.insert(this.stacks_table, GameRules.GetGameTime());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        let stacks = this.GetStackCount();
        return stacks;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_essence_aura_over_maximum extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public overmana_duration: number;
    public stacks_table: number[];
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.overmana_duration = this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_8");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table); i >= 1; i += -1) {
                    if (this.stacks_table[i] + this.overmana_duration < GameRules.GetGameTime()) {
                        table.remove(this.stacks_table, i);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
                // this.GetParentPlus().CalculateStatBonus(true);
            } else {
                this.Destroy();
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            table.insert(this.stacks_table, GameRules.GetGameTime());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_MANA_BONUS
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_MANA_BONUS)
    CC_GetModifierExtraManaBonus(): number {
        let stacks = this.GetStackCount();
        return stacks;
    }
}
@registerModifier()
export class modifier_imba_essence_aura_over_maximum_indicator extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public overmana_duration: number;
    public stacks_table: number[];
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
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.overmana_duration = this.caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_8");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table); i >= 1; i += -1) {
                    if (this.stacks_table[i] + this.overmana_duration < GameRules.GetGameTime()) {
                        table.remove(this.stacks_table, i);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
                // this.GetParentPlus().CalculateStatBonus(true);
            } else {
                this.Destroy();
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            table.insert(this.stacks_table, GameRules.GetGameTime());
        }
    }
}
@registerAbility()
export class imba_obsidian_destroyer_sanity_eclipse extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "obsidian_destroyer_sanity_eclipse";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        let ability = this;
        let radius = ability.GetSpecialValueFor("radius");
        return radius;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_obsidian_destroyer_astral_imprisonment";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let sound_cast = "Hero_ObsidianDestroyer.SanityEclipse.Cast";
        let sound_target = "Hero_ObsidianDestroyer.SanityEclipse";
        let particle_area = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_sanity_eclipse_area.vpcf";
        let particle_damage = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_sanity_eclipse_damage.vpcf";
        let particle_burn = "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_sanity_eclipse_mana_loss.vpcf";
        let modifier_prison = "modifier_imba_astral_imprisonment";
        let scepter = caster.HasScepter();
        let radius = ability.GetSpecialValueFor("radius");
        let int_multiplier = ability.GetTalentSpecialValueFor("int_multiplier");
        let max_mana_burn_pct = ability.GetSpecialValueFor("max_mana_burn_pct");
        let int_steal_count = ability.GetSpecialValueFor("int_steal_count");
        let int_steal_duration = ability.GetSpecialValueFor("int_steal_duration");
        let prison_ability = caster.findAbliityPlus<imba_obsidian_destroyer_astral_imprisonment>("imba_obsidian_destroyer_astral_imprisonment");
        let prison_duration;
        if (prison_ability) {
            prison_duration = prison_ability.GetSpecialValueFor("prison_duration");
        }
        EmitSoundOn(sound_cast, caster);
        EmitSoundOnLocationWithCaster(target_point, sound_target, caster);
        let caster_int = caster.GetIntellect();
        let particle_area_fx = ResHelper.CreateParticleEx(particle_area, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(particle_area_fx, 0, target_point);
        ParticleManager.SetParticleControl(particle_area_fx, 1, Vector(radius, 1, 1));
        ParticleManager.SetParticleControl(particle_area_fx, 2, Vector(radius, 1, 1));
        ParticleManager.SetParticleControl(particle_area_fx, 3, target_point);
        ParticleManager.ReleaseParticleIndex(particle_area_fx);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of ipairs(enemies)) {
            if (caster.HasTalent("special_bonus_imba_obsidian_destroyer_7") || !enemy.IsMagicImmune()) {
                let particle_burn_fx = ResHelper.CreateParticleEx(particle_burn, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
                ParticleManager.SetParticleControl(particle_burn_fx, 0, enemy.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_burn_fx);
                if (enemy.GetMana() > 0) {
                    let max_mana = enemy.GetMaxMana();
                    let mana_burn = max_mana * (max_mana_burn_pct * 0.01);
                    if (caster.HasTalent("special_bonus_imba_obsidian_destroyer_6")) {
                        if (enemy.IsHero() && enemy.GetIntellect() < caster_int * caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_6") * 0.01) {
                            mana_burn = max_mana * (caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_6", "mana_burn") * 0.01);
                        }
                    }
                    enemy.ReduceMana(mana_burn);
                }
                if (enemy.IsIllusion() && (!GFuncEntity.Custom_bIsStrongIllusion(enemy))) {
                    enemy.Kill(ability, caster);
                } else {
                    let enemy_int;
                    if (enemy.IsHero()) {
                        enemy_int = enemy.GetIntellect();
                    } else {
                        enemy_int = 0;
                    }
                    let int_difference = caster_int - enemy_int;
                    let damage = 0;
                    if (int_difference > 0) {
                        damage = int_difference * int_multiplier;
                    }
                    if (caster.HasTalent("special_bonus_imba_obsidian_destroyer_6")) {
                        if (enemy_int < caster_int * caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_6") * 0.01) {
                            damage = damage * (1 + caster.GetTalentValue("special_bonus_imba_obsidian_destroyer_6", "bonus_incoming_damage") * 0.01);
                        }
                    }
                    if (damage > 0) {
                        let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                        if (caster.HasTalent("special_bonus_imba_obsidian_destroyer_7")) {
                            damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
                        }
                        let damageTable;
                        if (enemy.HasModifier(modifier_prison)) {
                            damageTable = {
                                victim: enemy,
                                damage: damage,
                                damage_type: damage_type,
                                attacker: caster,
                                ability: ability,
                                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY
                            }
                        } else {
                            damageTable = {
                                victim: enemy,
                                damage: damage,
                                damage_type: damage_type,
                                attacker: caster,
                                ability: ability
                            }
                        }
                        ApplyDamage(damageTable);
                        let particle_damage_fx = ResHelper.CreateParticleEx(particle_damage, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
                        ParticleManager.SetParticleControl(particle_damage_fx, 0, enemy.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(particle_damage_fx);
                    }
                    if (enemy.IsHero() && int_steal_count > 0) {
                        ApplyIntelligenceSteal(caster, ability, enemy, int_steal_count, int_steal_duration);
                    }
                    if (scepter && prison_ability && !enemy.HasModifier(modifier_prison)) {
                        enemy.AddNewModifier(caster, prison_ability, modifier_prison, {
                            duration: prison_duration
                        });
                    }
                }
            }
        }
        if (caster.HasTalent("special_bonus_imba_obsidian_destroyer_2")) {
            let talent_modifier = caster.findBuff<modifier_imba_arcane_orb_instance>("modifier_imba_arcane_orb_instance");
            if (talent_modifier) {
                let cooldown_remaining = ability.GetCooldownTimeRemaining();
                let new_cooldown = cooldown_remaining - talent_modifier.GetStackCount();
                if (talent_modifier.GetStackCount() > cooldown_remaining / 2) {
                    ability.EndCooldown();
                    ability.StartCooldown(cooldown_remaining / 2);
                } else {
                    ability.EndCooldown();
                    ability.StartCooldown(new_cooldown);
                }
            }
        }
    }
}
@registerAbility()
export class imba_obsidian_destroyer_equilibrium extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public duration: number;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_obsidian_destroyer_equilibrium";
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.duration = this.GetSpecialValueFor("duration");
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("Hero_ObsidianDestroyer.Equilibrium.Cast");
        this.caster.AddNewModifier(this.caster, this, "modifier_imba_obsidian_destroyer_equilibrium_active", {
            duration: this.duration
        });
    }
}
@registerModifier()
export class modifier_imba_obsidian_destroyer_equilibrium extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().HasModifier("modifier_imba_obsidian_destroyer_equilibrium_active")) {
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_matter_debuff_mana.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, keys.unit);
            ParticleManager.ReleaseParticleIndex(particle);
            this.GetParentPlus().GiveMana(keys.damage * (this.GetSpecialValueFor("mana_steal") / 100));
        }
    }
}
@registerModifier()
export class modifier_imba_obsidian_destroyer_equilibrium_active extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public mana_steal_active: any;
    public movement_slow: any;
    public slow_duration: number;
    public duration: number;
    public atk_speed_diff: number;
    public particle: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_matter_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_obsidian_matter.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.mana_steal_active = this.ability.GetSpecialValueFor("mana_steal_active");
        this.movement_slow = this.ability.GetSpecialValueFor("movement_slow");
        this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
        this.duration = this.ability.GetSpecialValueFor("duration");
        this.atk_speed_diff = this.ability.GetSpecialValueFor("atk_speed_diff");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.atk_speed_diff * this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.caster) {
            keys.unit.EmitSound("Hero_ObsidianDestroyer.Equilibrium.Damage");
            this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_loadout.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
            ParticleManager.ReleaseParticleIndex(this.particle);
            this.caster.GiveMana(keys.damage * (this.mana_steal_active / 100));
            keys.unit.AddNewModifier(this.caster, this.ability, "modifier_imba_obsidian_destroyer_equilibrium_debuff", {
                duration: this.slow_duration * (1 - keys.unit.GetStatusResistance())
            });
            this.IncrementStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_obsidian_destroyer_equilibrium_debuff extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public movement_slow: any;
    public slow_duration: number;
    public atk_speed_diff: number;
    public particle: any;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_obsidian_matter_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.movement_slow = this.ability.GetSpecialValueFor("movement_slow");
        this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
        this.atk_speed_diff = this.ability.GetSpecialValueFor("atk_speed_diff");
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_matter_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
        ParticleManager.SetParticleControl(this.particle, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle, 2, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle, false, false, -1, false, false);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetDuration(this.slow_duration * (1 - this.parent.GetStatusResistance()), true);
        this.IncrementStackCount();
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.atk_speed_diff * this.GetStackCount() * (-1);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_obsidian_destroyer_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_obsidian_destroyer_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_obsidian_destroyer_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_obsidian_destroyer_9 extends BaseModifier_Plus {
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
