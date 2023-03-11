
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function CheckExceptions(ability: CDOTABaseAbility) {
    let exceptions = ["imba_silencer_glaives_of_wisdom",
        "imba_drow_ranger_frost_arrows",
        "imba_clinkz_searing_arrows",
        "imba_obsidian_destroyer_arcane_orb"
    ]
    if (exceptions.includes(ability.GetAbilityName())) {
        return true;
    }
    if (ability.GetManaCost(-1) == 0) {
        return true;
    }
    return false;
}
@registerAbility()
export class imba_silencer_arcane_curse extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "silencer_curse_of_the_silent";
    }
    OnSpellStart(): void {
        let point = this.GetCursorPosition();
        let caster = this.GetCasterPlus();
        let radius = this.GetSpecialValueFor("radius");
        let base_duration = this.GetSpecialValueFor("base_duration");
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), point, undefined, radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), 0, 0, false);
        let aoe = ResHelper.CreateParticleEx("particles/units/heroes/hero_silencer/silencer_curse_aoe.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
        ParticleManager.SetParticleControl(aoe, 0, point);
        ParticleManager.SetParticleControl(aoe, 1, Vector(radius, radius, radius));
        EmitSoundOn("Hero_Silencer.Curse.Cast", caster);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.AddNewModifier(caster, this, "modifier_imba_arcane_curse_debuff", {
                duration: base_duration * (1 - enemy.GetStatusResistance())
            });
            EmitSoundOn("Hero_Silencer.Curse.Impact", enemy);
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_silencer_arcane_curse_slow") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_silencer_arcane_curse_slow")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_silencer_arcane_curse_slow"), "modifier_special_bonus_imba_silencer_arcane_curse_slow", {});
        }
    }
}
@registerModifier()
export class modifier_imba_arcane_curse_debuff extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public tick_rate: any;
    public curse_slow: any;
    public curse_damage: number;
    public penalty_duration: number;
    public damage_per_stack: number;
    public talent_learned: any;
    public aghs_upgraded: any;
    BeCreated(kv: any): void {
        this.parent = this.GetParentPlus();
        this.caster = this.GetAbilityPlus().GetCasterPlus();
        this.tick_rate = this.GetSpecialValueFor("tick_rate");
        this.curse_slow = this.GetAbilityPlus().GetTalentSpecialValueFor("curse_slow");
        this.curse_damage = this.GetSpecialValueFor("damage_per_second");
        this.penalty_duration = this.GetSpecialValueFor("penalty_duration");
        this.damage_per_stack = this.GetSpecialValueFor("damage_per_stack");
        this.talent_learned = this.caster.HasTalent("special_bonus_imba_silencer_1");
        if (IsServer()) {
            this.penalty_duration = this.penalty_duration;
            this.curse_slow = this.curse_slow;
            if (this.caster.HasScepter()) {
                this.aghs_upgraded = true;
            } else {
                this.aghs_upgraded = false;
            }
            this.StartIntervalThink(this.tick_rate);
        }
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_silencer/silencer_curse.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetTexture(): string {
        return "silencer_curse_of_the_silent";
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let target = this.parent;
            if (target.IsAlive()) {
                if (target.IsSilenced() || target.HasModifier("modifier_imba_silencer_global_silence") || target.HasModifier("modifier_imba_silencer_global_silence_v2")) {
                    this.SetDuration(this.GetRemainingTime() + this.tick_rate, true);
                }
                if ((!target.IsSilenced() || !target.findBuff<modifier_imba_silencer_global_silence>("modifier_imba_silencer_global_silence") || !target.HasModifier("modifier_imba_silencer_global_silence_v2")) || this.aghs_upgraded) {
                    let damage_dealt = this.curse_damage * this.tick_rate;
                    let stack_count = this.GetStackCount();
                    if (stack_count) {
                        damage_dealt = damage_dealt + (this.damage_per_stack * stack_count);
                    }
                    let damage_table = {
                        victim: target,
                        attacker: this.caster,
                        damage: damage_dealt,
                        damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                        ability: this.GetAbilityPlus()
                    }
                    let actual_Damage = ApplyDamage(damage_table);
                    if (this.talent_learned) {
                        let heal_amount = actual_Damage * this.caster.GetTalentValue("special_bonus_imba_silencer_1") * 0.01;
                        this.caster.Heal(heal_amount, this.GetAbilityPlus());
                        let particle_lifesteal = "particles/generic_gameplay/generic_lifesteal.vpcf";
                        let particle_lifesteal_fx = ResHelper.CreateParticleEx(particle_lifesteal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
                        ParticleManager.SetParticleControl(particle_lifesteal_fx, 0, this.caster.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(particle_lifesteal_fx);
                    }
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(params: ModifierAbilityEvent): void {
        if (IsServer()) {
            if (params.ability) {
                if ((!params.ability.IsItem()) && (params.unit == this.parent) && params.ability.GetAbilityName() != "ability_capture") {
                    if (params.ability.IsToggle()) {
                        return;
                    }
                    if (!params.ability.ProcsMagicStick()) {
                        return;
                    }
                    let uneffected_spells = {
                        "1": "monkey_king_tree_dance",
                        "2": "monkey_king_primal_spring_early",
                        "3": "monkey_king_mischief",
                        "4": "monkey_king_untransform",
                        "5": "naga_siren_song_of_the_siren_cancel",
                        "6": "nyx_assassin_burrow",
                        "7": "nyx_assassin_unburrow",
                        "8": "shadow_demon_shadow_poison_release",
                        "9": "imba_techies_minefield_sign",
                        "10": "techies_focused_detonate",
                        "11": "imba_drow_ranger_frost_arrows",
                        "12": "imba_jakiro_liquid_fire",
                        "13": "imba_obsidian_destroyer_arcane_orb",
                        "14": "imba_sniper_take_aim",
                        "15": "imba_kunkka_ebb_and_flow",
                        "16": "imba_kunkka_tidebringer",
                        "17": "imba_outworld_devourer_astral_imprisonment_movement"
                    }
                    for (const [_, spell] of GameFunc.Pair(uneffected_spells)) {
                        if (params.ability.GetAbilityName() == spell) {
                            return;
                        }
                    }
                    this.SetDuration(this.GetRemainingTime() + this.penalty_duration, true);
                    this.IncrementStackCount();
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage( /** params */): number {
        return -this.curse_slow;
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.IsAlive()) {
                let ability = this.GetAbilityPlus();
                let caster = ability.GetCasterPlus();
                let AoE = caster.GetTalentValue("special_bonus_imba_silencer_2");
                if (AoE > 0  /**&& parent.IsRealUnit()*/ && !parent.IsClone()) {
                    let base_duration = ability.GetSpecialValueFor("base_duration");
                    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), parent.GetAbsOrigin(), undefined, AoE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, ability.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, unit] of GameFunc.iPair(enemies)) {
                        unit.AddNewModifier(caster, ability, "modifier_imba_arcane_curse_debuff", {
                            duration: base_duration
                        });
                        EmitSoundOn("Hero_Silencer.Curse.Impact", unit);
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_glaives_of_wisdom_buff extends BaseModifier_Plus {
    public duration: number;
    public stack_table: number[];
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus()) {
            this.Destroy();
        }
        this.duration = this.GetSpecialValueFor("int_steal_duration");
        this.stack_table = []
        this.StartIntervalThink(1);
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            this.ForceRefresh();
            // this.GetParentPlus().CalculateStatBonus(true);
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_silencer_glaives_of_wisdom_debuff extends BaseModifier_Plus {
    public duration: number;
    public stack_table: number[];
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus()) {
            this.Destroy();
        }
        this.duration = this.GetSpecialValueFor("int_steal_duration");
        this.stack_table = []
        this.StartIntervalThink(1);
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            this.ForceRefresh();
            // this.GetParentPlus().CalculateStatBonus(true);
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_silencer_glaives_of_wisdom extends BaseAbility_Plus {
    public force_glaive: any;
    GetAbilityTextureName(): string {
        return "silencer_glaives_of_wisdom";
    }
    IsNetherWardStealable() {
        return false;
    }
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_silencer_glaives_of_wisdom";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.force_glaive = true;
            this.GetCasterPlus().MoveToTargetToAttack(this.GetCursorTarget());
            this.RefundManaCost();
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_glaives_of_wisdom extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_silencer_glaives_of_wisdom;
    public sound_cast: any;
    public sound_hit: any;
    public modifier_int_damage: string;
    public modifier_hit_counter: string;
    public scepter_damage_multiplier: number;
    public intellect_damage_pct: number;
    public hits_to_silence: any;
    public hit_count_duration: number;
    public silence_duration: number;
    public int_reduction_pct: number;
    public int_reduction_duration: number;
    public attack_table: any;
    public auto_cast: any;
    public current_mana: any;
    public mana_cost: any;
    public glaive_attack: any;
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
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            4: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    BeCreated(p_0: any,): void {
        this.caster = this.GetParentPlus();
        this.ability = this.GetAbilityPlus();
        this.sound_cast = "Hero_Silencer.GlaivesOfWisdom";
        this.sound_hit = "Hero_Silencer.GlaivesOfWisdom.Damage";
        this.modifier_int_damage = "modifier_imba_silencer_glaives_int_damage";
        this.modifier_hit_counter = "modifier_imba_silencer_glaives_hit_counter";
        this.scepter_damage_multiplier = this.ability.GetSpecialValueFor("scepter_damage_multiplier");
    }
    SetGlaiveAttackProjectile(caster: IBaseNpc_Plus, is_glaive_attack = false) {
        let skadi_modifier = "modifier_item_imba_skadi_unique";
        let deso_modifier = "modifier_item_imba_desolator_unique";
        let morbid_modifier = "modifier_item_mask_of_death";
        let mom_modifier = "modifier_imba_mask_of_madness";
        let satanic_modifier = "modifier_item_satanic";
        let vladimir_modifier = "modifier_item_imba_vladmir";
        let vladimir_2_modifier = "modifier_item_imba_vladmir_blood";
        let skadi_projectile = "particles/items2_fx/skadi_projectile.vpcf";
        let deso_projectile = "particles/items_fx/desolator_projectile.vpcf";
        let deso_skadi_projectile = "particles/item/desolator/desolator_skadi_projectile_2.vpcf";
        let lifesteal_projectile = "particles/item/lifesteal_mask/lifesteal_particle.vpcf";
        let base_attack = "particles/units/heroes/hero_silencer/silencer_base_attack.vpcf";
        let glaive_attack = "particles/units/heroes/hero_silencer/silencer_glaives_of_wisdom.vpcf";
        let glaive_lifesteal_projectile = "particles/hero/silencer/lifesteal_glaives/silencer_lifesteal_glaives_of_wisdom.vpcf";
        let glaive_skadi_projectile = "particles/hero/silencer/skadi_glaives/silencer_skadi_glaives_of_wisdom.vpcf";
        let glaive_deso_projectile = "particles/hero/silencer/deso_glaives/silencer_deso_glaives_of_wisdom.vpcf";
        let glaive_deso_skadi_projectile = "particles/hero/silencer/deso_skadi_glaives/silencer_deso_skadi_glaives_of_wisdom.vpcf";
        let glaive_lifesteal_skadi_projectile = "particles/hero/silencer/lifesteal_skadi_glaives/silencer_lifesteal_skadi_glaives_of_wisdom.vpcf";
        let glaive_lifesteal_deso_projectile = "particles/hero/silencer/lifesteal_deso_glaives/silencer_lifesteal_deso_glaives_of_wisdom.vpcf";
        let glaive_lifesteal_deso_skadi_projectile = "particles/hero/silencer/lifesteal_deso_skadi_glaives/silencer_lifesteal_deso_skadi_glaives_of_wisdom.vpcf";
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
        if (is_glaive_attack) {
            if (has_desolator && has_skadi && has_lifesteal) {
                caster.SetRangedProjectileName(glaive_lifesteal_deso_skadi_projectile);
            } else if (has_desolator && has_lifesteal) {
                caster.SetRangedProjectileName(glaive_lifesteal_deso_projectile);
            } else if (has_skadi && has_desolator) {
                caster.SetRangedProjectileName(glaive_deso_skadi_projectile);
            } else if (has_lifesteal && has_skadi) {
                caster.SetRangedProjectileName(glaive_lifesteal_skadi_projectile);
            } else if (has_skadi) {
                caster.SetRangedProjectileName(glaive_skadi_projectile);
            } else if (has_lifesteal) {
                caster.SetRangedProjectileName(glaive_lifesteal_projectile);
            } else if (has_desolator) {
                caster.SetRangedProjectileName(glaive_deso_projectile);
                return;
            } else {
                caster.SetRangedProjectileName(glaive_attack);
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
                caster.SetRangedProjectileName(base_attack);
                return;
            }
        }
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
                this.intellect_damage_pct = this.ability.GetSpecialValueFor("intellect_damage_pct");
                this.hits_to_silence = this.ability.GetSpecialValueFor("hits_to_silence");
                this.hit_count_duration = this.ability.GetSpecialValueFor("hit_count_duration");
                this.silence_duration = this.ability.GetSpecialValueFor("silence_duration");
                this.int_reduction_pct = this.ability.GetSpecialValueFor("int_reduction_pct");
                this.int_reduction_duration = this.ability.GetSpecialValueFor("int_reduction_duration");
                let glaive_attack = true;
                if (!this.attack_table) {
                    this.attack_table = {}
                }
                this.auto_cast = this.ability.GetAutoCastState();
                this.current_mana = this.caster.GetMana();
                this.mana_cost = this.ability.GetManaCost(-1);
                if (this.caster.IsSilenced()) {
                    glaive_attack = false;
                }
                if (target.IsBuilding()) {
                    glaive_attack = false;
                }
                if (target.IsMagicImmune() && !attacker.HasScepter()) {
                    glaive_attack = false;
                }
                if (!this.ability.force_glaive && !this.auto_cast) {
                    glaive_attack = false;
                }
                if (this.current_mana < this.mana_cost) {
                    glaive_attack = false;
                }
                if (glaive_attack) {
                    this.glaive_attack = true;
                    this.SetGlaiveAttackProjectile(this.caster, true);
                } else {
                    this.glaive_attack = false;
                    this.SetGlaiveAttackProjectile(this.caster, false);
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
                this.ability.force_glaive = undefined;
                if (!this.glaive_attack) {
                    return undefined;
                }
                EmitSoundOn(this.sound_cast, this.caster);
                this.caster.SpendMana(this.mana_cost, this.ability);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.caster == attacker) {
                if (target.IsAlive() && this.glaive_attack) {
                    if (keys.target.IsRealHero && (keys.target.IsRealUnit() || keys.target.IsTempestDouble()) && !keys.target.IsClone()) {
                        let modifier_buff = this.caster.findBuff<modifier_imba_silencer_glaives_of_wisdom_buff>("modifier_imba_silencer_glaives_of_wisdom_buff");
                        if (!modifier_buff) {
                            modifier_buff = this.caster.AddNewModifier(this.caster, this.ability, "modifier_imba_silencer_glaives_of_wisdom_buff", {
                                duration: this.ability.GetSpecialValueFor("int_steal_duration") * (1 - target.GetStatusResistance())
                            }) as modifier_imba_silencer_glaives_of_wisdom_buff;
                            modifier_buff.SetStackCount(this.ability.GetSpecialValueFor("int_steal"));
                        } else {
                            modifier_buff.SetStackCount(modifier_buff.GetStackCount() + this.ability.GetSpecialValueFor("int_steal"));
                        }
                        let modifier_debuff = target.findBuff<modifier_imba_silencer_glaives_of_wisdom_debuff>("modifier_imba_silencer_glaives_of_wisdom_debuff");
                        if (!modifier_debuff) {
                            modifier_debuff = target.AddNewModifier(this.caster, this.ability, "modifier_imba_silencer_glaives_of_wisdom_debuff", {
                                duration: this.ability.GetSpecialValueFor("int_steal_duration") * (1 - target.GetStatusResistance())
                            }) as modifier_imba_silencer_glaives_of_wisdom_debuff;
                            modifier_debuff.SetStackCount(this.ability.GetSpecialValueFor("int_steal"));
                        } else {
                            modifier_debuff.SetStackCount(modifier_debuff.GetStackCount() + this.ability.GetSpecialValueFor("int_steal"));
                        }
                    }
                    let glaive_pure_damage = attacker.GetIntellect() * this.intellect_damage_pct / 100;
                    let damage_table = {
                        victim: target,
                        attacker: attacker,
                        damage: glaive_pure_damage,
                        damage_type: this.ability.GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        ability: this.ability
                    }
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, target, glaive_pure_damage, undefined);
                    ApplyDamage(damage_table);
                    let hit_counter = target.FindModifierByName(this.modifier_hit_counter);
                    if (!hit_counter) {
                        hit_counter = target.AddNewModifier(attacker, this.ability, this.modifier_hit_counter, {
                            req_hits: this.hits_to_silence,
                            silence_dur: this.silence_duration
                        });
                    }
                    if (hit_counter) {
                        hit_counter.IncrementStackCount();
                        hit_counter.SetDuration(this.hit_count_duration, true);
                    }
                    EmitSoundOn(this.sound_hit, target);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        let order_type = keys.order_type;
        if (order_type != dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET && this.ability) {
            this.ability.force_glaive = undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_glaives_hit_counter extends BaseModifier_Plus {
    public hits_to_silence: any;
    public target: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public silence_duration: number;
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (this.GetAbilityPlus() && IsClient()) {
            this.hits_to_silence = this.GetSpecialValueFor("hits_to_silence");
        }
        if (IsServer()) {
            this.target = this.GetParentPlus();
            this.caster = this.GetAbilityPlus().GetCasterPlus();
            this.hits_to_silence = kv.req_hits;
            this.silence_duration = kv.silence_dur;
        }
    }
    OnStackCountChanged(old_stack_count: number): void {
        if (IsServer()) {
            if (this.GetStackCount() >= this.hits_to_silence) {
                this.GetParentPlus().AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_silence", {
                    duration: this.silence_duration * (1 - this.GetParentPlus().GetStatusResistance())
                });
                this.SetStackCount(0);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        if (this.hits_to_silence) {
            return this.hits_to_silence;
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_glaives_int_damage extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public int_reduction_pct: number;
    public total_int_reduced: any;
    public target_intelligence: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetParentPlus().IsRealUnit()) {
                return;
            }
            this.caster = this.GetCasterPlus();
            this.int_reduction_pct = kv.int_reduction;
            this.total_int_reduced = 0;
            this.target_intelligence = this.GetParentPlus().GetIntellect();
        }
    }
    OnStackCountChanged(old_stack_count: number): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target.IsRealUnit() && target.GetIntellect() > 1) {
                let int_to_steal = math.max(1, math.floor(this.target_intelligence * this.int_reduction_pct / 100));
                let int_taken;
                if (((this.target_intelligence - int_to_steal) >= 1)) {
                    int_taken = int_to_steal;
                } else {
                    int_taken = -(1 - this.target_intelligence);
                }
                this.total_int_reduced = this.total_int_reduced + int_taken;
                // target.CalculateStatBonus(true);
            }
        }
    }
    GetTexture(): string {
        return "silencer_glaives_of_wisdom";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return -this.total_int_reduced;
    }
}
@registerModifier()
export class modifier_imba_silencer_glaives_talent_effect extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    GetTexture(): string {
        return "silencer_glaives_of_wisdom";
    }
    OnStackCountChanged(oldStacks: number): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (parent.GetIntellect() <= 1) {
                let ability = this.GetAbilityPlus();
                let caster = ability.GetCasterPlus();
                let damage = caster.GetIntellect() + this.GetStackCount();
                let damageTable = {
                    victim: parent,
                    attacker: caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    ability: ability
                }
                ApplyDamage(damageTable);
                parent.AddNewModifier(caster, ability, "modifier_imba_silencer_glaives_talent_effect_procced", {
                    duration: caster.GetTalentValue("special_bonus_imba_silencer_6", "noIntDuration") * (1 - parent.GetStatusResistance())
                });
                parent.RemoveModifierByName("modifier_imba_silencer_glaives_talent_effect");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_glaives_talent_effect_procced extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    GetTexture(): string {
        return "silencer_glaives_of_wisdom";
    }
    BeCreated(p_0: any,): void {
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_silencer/silencer_last_word_dmg.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(particle);
    }
    BeRemoved(): void {
        if (IsServer()) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_silencer_glaives_int_damage");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return -9999999999;
    }
}
@registerAbility()
export class imba_silencer_last_word extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "silencer_last_word";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetBehavior();
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        }
    }
    GetAOERadius(): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return 0;
        } else {
            return this.GetSpecialValueFor("scepter_radius");
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let caster = this.GetCasterPlus();
        EmitSoundOn("Hero_Silencer.LastWord.Cast", caster);
        if (!this.GetCasterPlus().HasScepter()) {
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            target.AddNewModifier(caster, this, "modifier_imba_silencer_last_word_debuff", {
                duration: this.GetDuration()
            });
        } else {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(caster.GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("scepter_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                enemy.AddNewModifier(caster, this, "modifier_imba_silencer_last_word_debuff", {
                    duration: this.GetDuration()
                });
            }
        }
    }
    GetIntrinsicModifierName(): string {
        return "imba_silencer_last_word_aura";
    }
}
@registerAbility()
export class imba_silencer_last_word_aura extends BaseAbility_Plus {
    public aura_radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.aura_radius = this.GetSpecialValueFor("aura_radius");
    }
    IsAura(): boolean {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_silencer_8")) {
            return true;
        } else {
            return false;
        }
        return false;
    }
    GetModifierAura(): string {
        return "modifier_imba_silencer_last_word_silence_aura";
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        return this.GetCasterPlus().HasModifier("imba_silencer_last_word_aura_prevent");
    }
}
@registerAbility()
export class imba_silencer_last_word_aura_prevent extends BaseAbility_Plus {
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_silencer_last_word_silence_aura extends BaseModifier_Plus {
    public silence_duration: number;
    public prevention_duration: number;
    public modifier_prevention: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.silence_duration = this.GetSpecialValueFor("aura_silence");
        this.prevention_duration = this.GetCasterPlus().GetTalentValue("special_bonus_imba_silencer_8");
        this.modifier_prevention = "imba_silencer_last_word_aura_prevent";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(params: ModifierAbilityEvent): void {
        if (IsServer()) {
            if ((!params.ability.IsItem()) && (params.unit == this.GetParentPlus()) && (!this.GetParentPlus().IsMagicImmune()) && params.ability.GetAbilityName() != "ability_capture") {
                if (CheckExceptions(params.ability)) {
                    return;
                }
                if (params.ability.IsToggle() && params.ability.GetToggleState()) {
                    return;
                }
                if (this.GetCasterPlus().HasModifier(this.modifier_prevention)) {
                    return undefined;
                }
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.modifier_prevention, {
                    duration: this.prevention_duration
                });
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_silence", {
                    duration: this.silence_duration * (1 - this.GetParentPlus().GetStatusResistance())
                });
            }
        }
    }
    GetTexture(): string {
        return "silencer_last_word";
    }
}
@registerModifier()
export class modifier_imba_silencer_last_word_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public m_regen_reduct_pct: number;
    public int_multiplier: any;
    public damage: number;
    public silence_duration: number;
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.caster = this.GetCasterPlus();
        this.m_regen_reduct_pct = this.GetSpecialValueFor("m_regen_reduct_pct") * (-1);
        this.int_multiplier = this.GetSpecialValueFor("int_multiplier");
        if (IsServer()) {
            EmitSoundOn("Hero_Silencer.LastWord.Target", this.GetParentPlus());
            this.damage = this.GetAbilityPlus().GetAbilityDamage();
            this.silence_duration = this.GetSpecialValueFor("silence_duration");
            this.StartIntervalThink(this.GetAbilityPlus().GetDuration());
        }
    }
    BeDestroy( /** kv */): void {
        if (!this.GetParentPlus().IsMagicImmune()) {
            if (IsServer()) {
                EmitSoundOn("Hero_Silencer.LastWord.Damage", this.GetParentPlus());
                let target_intellect = 0;
                let intellect_difference = 0;
                if (this.GetRemainingTime() <= 0 && this.GetParentPlus().GetIntellect && this.GetParentPlus().GetIntellect()) {
                    target_intellect = this.GetParentPlus().GetIntellect();
                    if (this.GetCasterPlus().GetIntellect && this.GetCasterPlus().GetIntellect()) {
                        intellect_difference = math.max(this.GetCasterPlus().GetIntellect() - target_intellect, 0);
                    }
                }
                ApplyDamage({
                    victim: this.GetParentPlus(),
                    attacker: this.caster,
                    damage: this.damage + (intellect_difference * this.int_multiplier),
                    damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                    ability: this.GetAbilityPlus()
                });
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(params: ModifierAbilityEvent): void {
        if (IsServer()) {
            if ((!params.ability.IsItem()) && (params.unit == this.GetParentPlus()) && params.ability.GetAbilityName() != "ability_capture") {
                if (CheckExceptions(params.ability)) {
                    return;
                }
                if (params.ability.IsToggle() && params.ability.GetToggleState()) {
                    return;
                }
                this.GetParentPlus().AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_imba_silencer_last_word_repeat_thinker", {
                    duration: this.silence_duration * (1 - this.GetParentPlus().GetStatusResistance())
                });
                this.Destroy();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE)
    CC_GetModifierTotalPercentageManaRegen( /** params */): number {
        return this.m_regen_reduct_pct;
    }
    OnIntervalThink(): void {
        let target = this.GetParentPlus();
        if (IsServer()) {
            target.AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_silence", {
                duration: this.silence_duration * (1 - target.GetStatusResistance())
            });
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_silencer/silencer_last_word_status.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_silencer_last_word_repeat_thinker extends BaseModifier_Plus {
    public duration: number;
    public modifier: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.duration = this.GetSpecialValueFor("duration");
        this.modifier = "modifier_imba_silencer_last_word_debuff";
    }
    BeDestroy( /** kv */): void {
        if (IsServer()) {
            if (!this.GetParentPlus().IsMagicImmune()) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.modifier, {
                    duration: this.duration
                });
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_silencer_arcane_supremacy extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "arcane_supremacy";
    }
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_silencer_arcane_supremacy";
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_silencer_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_silencer_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_silencer_4"), "modifier_special_bonus_imba_silencer_4", {});
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_arcane_supremacy extends BaseModifier_Plus {
    public steal_range: number;
    public steal_amount: number;
    public global_silence_steal: any;
    public silence_reduction_pct: number;
    public caster: IBaseNpc_Plus;
    AllowIllusionDuplicate(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "arcane_supremacy";
    }
    BeCreated(kv: any): void {
        this.steal_range = this.GetSpecialValueFor("int_steal_range");
        this.steal_amount = this.GetSpecialValueFor("int_steal_amount");
        this.global_silence_steal = this.GetSpecialValueFor("global_silence_steal");
        this.silence_reduction_pct = this.GetSpecialValueFor("silence_reduction_pct");
        this.caster = this.GetCasterPlus();
        if (!IsServer()) {
            return;
        }
        if (this.caster.GetUnitName().includes("silencer")) {
            this.StartIntervalThink(FrameTime());
        } else {
            print("Arcane Supremacy was stolen. Do not enter think function.");
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.caster.HasModifier("modifier_silencer_int_steal")) {
            this.caster.RemoveModifierByName("modifier_silencer_int_steal");
            print("Silencer: Vanilla intelligence steal modifier removed.");
            this.StartIntervalThink(-1);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {}
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_silencer_4") && !this.GetCasterPlus().PassivesDisabled()) {
            state[modifierstate.MODIFIER_STATE_SILENCED] = false;
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: Enum_MODIFIER_EVENT.ON_RESPAWN
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            this.steal_amount = this.GetAbilityPlus().GetTalentSpecialValueFor("int_steal_amount");
            this.global_silence_steal = this.GetAbilityPlus().GetTalentSpecialValueFor("global_silence_steal");
            if (this.caster.GetUnitName().includes("silencer") && this.caster.IsRealUnit()) {
                if (params.unit.IsRealUnit() && params.unit != this.caster && params.unit.GetTeam() != this.caster.GetTeam()/** && !params.reincarnate */) {
                    let stealType = undefined;
                    let distance = (this.caster.GetAbsOrigin() - params.unit.GetAbsOrigin() as Vector).Length2D();
                    if (distance <= this.steal_range || params.attacker == this.caster) {
                        stealType = "full";
                    } else if (params.unit.HasModifier("modifier_imba_silencer_global_silence") || params.unit.HasModifier("modifier_imba_silencer_global_silence_v2")) {
                        stealType = "underUlt";
                    }
                    if (stealType) {
                        let enemy_min_int = 1;
                        let enemy_intelligence = GPropertyCalculate.GetBaseIntellect(params.unit)
                        let enemy_intelligence_taken = 0;
                        let steal_amount = this.steal_amount;
                        if (stealType == "underUlt") {
                            steal_amount = this.global_silence_steal;
                        }
                        if (enemy_intelligence > enemy_min_int) {
                            if (((enemy_intelligence - steal_amount) >= enemy_min_int)) {
                                enemy_intelligence_taken = steal_amount;
                            } else {
                                enemy_intelligence_taken = -(enemy_min_int - enemy_intelligence);
                            }
                            // params.unit.SetBaseIntellect(enemy_intelligence - enemy_intelligence_taken);
                            // params.unit.CalculateStatBonus(true);
                            // this.caster.SetBaseIntellect(this.caster.GetBaseIntellect() + enemy_intelligence_taken);
                            this.SetStackCount(this.GetStackCount() + enemy_intelligence_taken);
                            // this.caster.CalculateStatBonus(true);
                            let life_time = 2.0;
                            let digits = string.len(math.floor(enemy_intelligence_taken) + "") + 1;
                            let numParticle = ResHelper.CreateParticleEx("particles/msg_fx/msg_miss.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.caster);
                            ParticleManager.SetParticleControl(numParticle, 1, Vector(10, enemy_intelligence_taken, 0));
                            ParticleManager.SetParticleControl(numParticle, 2, Vector(life_time, digits, 0));
                            ParticleManager.SetParticleControl(numParticle, 3, Vector(100, 100, 255));
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(params: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.unit == this.caster && this.caster.HasModifier("modifier_silencer_int_steal")) {
            this.caster.RemoveModifierByName("modifier_silencer_int_steal");
        }
    }
}
@registerAbility()
export class imba_silencer_global_silence extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAbilityTextureName(): string {
        return "silencer_global_silence";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.IsStolen() && this.GetLevel() == 1) {
                let caster = this.GetCasterPlus();
                let lastWord = caster.findAbliityPlus<imba_silencer_last_word>("imba_silencer_last_word");
                if (lastWord && !lastWord.IsStolen()) {
                    return;
                }
                caster.RemoveAbility("imba_silencer_last_word");
                let origCaster = caster.TempData().spellStealTarget as IBaseNpc_Plus;
                if (!origCaster) return;
                let origLastWord = origCaster.findAbliityPlus<imba_silencer_last_word>("imba_silencer_last_word");
                if (origLastWord && origLastWord.IsTrained()) {
                    lastWord = caster.AddAbility("imba_silencer_last_word") as imba_silencer_last_word;
                    lastWord.SetLevel(origLastWord.GetLevel());
                    lastWord.SetHidden(true);
                    lastWord.SetStolen(true);
                }
            }
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_silencer/silencer_global_silence.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            ParticleManager.SetParticleControl(particle, 0, caster.GetAbsOrigin());
            EmitSoundOn("Hero_Silencer.GlobalSilence.Cast", caster);
            if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(30)) {
                EmitSoundOn("Hero_Silencer.Penn", caster);
            }
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.AddNewModifier(caster, this, "modifier_imba_silencer_global_silence", {
                    duration: this.GetDuration() * (1 - enemy.GetStatusResistance())
                });
                if (enemy.IsRealUnit()) {
                    EmitSoundOnClient("Hero_Silencer.GlobalSilence.Effect", enemy.GetPlayerOwner());
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_global_silence extends BaseModifier_Plus {
    public tickInterval: any;
    public preSilenceParticle: any;
    public silenceParticle: any;
    public parent: IBaseNpc_Plus;
    public isDisabled: any;
    public spellCast: any;
    public particleState: any;
    public particle: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        if (this.tickInterval > 0) {
            return false;
        }
        return true;
    }
    IsPurgeException(): boolean {
        if (this.tickInterval > 0) {
            return false;
        }
        return true;
    }
    GetTexture(): string {
        return "silencer_global_silence";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.tickInterval = this.GetAbilityPlus().GetCasterPlus().GetTalentValue("special_bonus_imba_silencer_7");
            this.preSilenceParticle = "particles/generic_gameplay/generic_has_quest.vpcf";
            this.silenceParticle = "particles/generic_gameplay/generic_silence.vpcf";
            this.parent = this.GetParentPlus();
            this.isDisabled = false;
            this.spellCast = false;
            this.particleState = 0;
            if (this.tickInterval > 0) {
                this.StartIntervalThink(this.tickInterval);
            }
            if (this.parent.GetCurrentActiveAbility() && !this.parent.GetCurrentActiveAbility().IsItem() && this.parent.GetCurrentActiveAbility().GetAbilityName() != "item_tpscroll" && !string.find(this.parent.GetCurrentActiveAbility().GetAbilityName(), "item_travel_boots")) {
                this.particle = ResHelper.CreateParticleEx(this.silenceParticle, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
                this.particleState = 1;
                this.spellCast = true;
                this.LastWord();
            } else {
                this.particle = ResHelper.CreateParticleEx(this.preSilenceParticle, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.parent.IsMagicImmune()) {
                this.SetDuration(this.GetRemainingTime() + this.tickInterval, true);
                this.isDisabled = true;
                if (this.spellCast && this.particleState == 1) {
                    this.particleState = 0;
                    ParticleManager.DestroyParticle(this.particle, false);
                    ParticleManager.ReleaseParticleIndex(this.particle);
                    this.particle = ResHelper.CreateParticleEx(this.preSilenceParticle, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
                }
            } else {
                this.isDisabled = false;
                if (this.spellCast && this.particleState == 0) {
                    this.particleState = 1;
                    ParticleManager.DestroyParticle(this.particle, false);
                    ParticleManager.ReleaseParticleIndex(this.particle);
                    this.particle = ResHelper.CreateParticleEx(this.silenceParticle, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.isDisabled) {
            return {};
        }
        let state = {}
        if (this.spellCast) {
            state = {
                [modifierstate.MODIFIER_STATE_SILENCED]: true
            }
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.particle, false);
            ParticleManager.ReleaseParticleIndex(this.particle);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let victim = keys.unit;
            if (this.parent == victim) {
                if (keys.ability && !keys.ability.IsItem()) {
                    let order_type = keys.order_type;
                    if (order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION || order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET || order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE || order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET || order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE) {
                        if (!this.isDisabled) {
                            this.LastWord();
                        }
                        if (!this.spellCast) {
                            this.spellCast = true;
                            if (!this.isDisabled) {
                                this.particleState = 1;
                                ParticleManager.DestroyParticle(this.particle, false);
                                ParticleManager.ReleaseParticleIndex(this.particle);
                                this.particle = ResHelper.CreateParticleEx(this.silenceParticle, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, victim);
                            }
                        }
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus().GetCasterPlus().HasTalent("special_bonus_imba_silencer_10")) {
            return this.GetAbilityPlus().GetCasterPlus().GetTalentValue("special_bonus_imba_silencer_10");
        } else {
            return 0;
        }
    }
    LastWord() {
        if (IsServer()) {
            if (!this.isDisabled) {
                let caster = this.GetAbilityPlus().GetCasterPlus();
                if (caster) {
                    let lastWord = caster.findAbliityPlus<imba_silencer_last_word>("imba_silencer_last_word");
                    if (lastWord && lastWord.IsTrained()) {
                        this.parent.AddNewModifier(caster, lastWord, "modifier_imba_silencer_last_word_debuff", {
                            duration: lastWord.GetSpecialValueFor("duration")
                        });
                    }
                }
            }
        }
    }
}
@registerAbility()
export class imba_silencer_global_silence_v2 extends BaseAbility_Plus {
    OnSpellStart(): void {
        let silence_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_silencer/silencer_global_silence.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(silence_particle, 1, this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_attack2")));
        ParticleManager.ReleaseParticleIndex(silence_particle);
        this.GetCasterPlus().EmitSound("Hero_Silencer.GlobalSilence.Cast");
        if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(30)) {
            EmitSoundOn("Hero_Silencer.Penn", this.GetCasterPlus());
        }
        let hero_silence_particle = undefined;
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false))) {
            if (!enemy.IsCourier || !enemy.IsCourier()) {
                if (enemy.IsRealUnit()) {
                    hero_silence_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_silencer/silencer_global_silence_hero.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                    ParticleManager.SetParticleControlEnt(hero_silence_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(hero_silence_particle);
                }
                if (enemy.IsInvulnerable()) {
                    enemy.AddNewModifier(enemy, this, "modifier_imba_silencer_global_silence_v2", {
                        duration: this.GetDuration() * (1 - enemy.GetStatusResistance())
                    });
                } else {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_silencer_global_silence_v2", {
                        duration: this.GetDuration() * (1 - enemy.GetStatusResistance())
                    });
                }
                if (enemy.IsRealUnit()) {
                    EmitSoundOnClient("Hero_Silencer.GlobalSilence.Effect", enemy.GetPlayerOwner());
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_silencer_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_silencer_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_silencer_10"), "modifier_special_bonus_imba_silencer_10", {});
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_global_silence_v2 extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public max_mana_reduction_percentage: any;
    public max_mana_remainder_duration_multiplier: number;
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silenced.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetAbilityPlus().GetCasterPlus();
        this.max_mana_reduction_percentage = this.GetSpecialValueFor("max_mana_reduction_percentage");
        this.max_mana_remainder_duration_multiplier = this.GetSpecialValueFor("max_mana_remainder_duration_multiplier");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetRemainingTime() > 0) {
            if (this.GetParentPlus().IsInvulnerable()) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_silencer_global_silence_v2_mana_reduction", {
                    duration: this.GetRemainingTime() * this.max_mana_remainder_duration_multiplier,
                    max_mana_reduction_percentage: this.max_mana_reduction_percentage
                });
            } else {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_silencer_global_silence_v2_mana_reduction", {
                    duration: this.GetRemainingTime() * this.max_mana_remainder_duration_multiplier,
                    max_mana_reduction_percentage: this.max_mana_reduction_percentage
                });
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.caster) {
            return this.caster.GetTalentValue("special_bonus_imba_silencer_10");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(keys?: any/** keys */): number {
        if (keys.fail_type == 1) {
            return this.max_mana_remainder_duration_multiplier;
        } else if (keys.fail_type == 2) {
            return this.max_mana_reduction_percentage;
        }
    }
}
@registerModifier()
export class modifier_imba_silencer_global_silence_v2_mana_reduction extends BaseModifier_Plus {
    public max_mana_reduction_percentage: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/econ/items/silencer/silencer_ti6/silencer_last_word_status_ti6_ring_mist.vpcf";
    }
    BeCreated(keys: any): void {
        if (this.GetAbilityPlus()) {
            this.max_mana_reduction_percentage = this.GetSpecialValueFor("max_mana_reduction_percentage");
        } else if (keys) {
            this.max_mana_reduction_percentage = keys.max_mana_reduction_percentage;
        } else {
            this.max_mana_reduction_percentage = 80;
        }
        if (!IsServer()) {
            return;
        }
        let particle = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced_old.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        this.AddParticle(particle, false, false, -1, false, false);
        this.SetStackCount(this.GetParentPlus().GetMaxMana() * (this.max_mana_reduction_percentage) * 0.01 * (-1));
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_silencer_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_silencer_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_silencer_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_silencer_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_silencer_arcane_curse_slow extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_silencer_10 extends BaseModifier_Plus {
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
