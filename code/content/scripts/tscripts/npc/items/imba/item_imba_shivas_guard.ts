
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 希瓦
@registerAbility()
export class item_imba_shivas_guard extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_shiva_handler";
    }


    OnSpellStart(): void {
        let blast_radius = this.GetSpecialValueFor("blast_radius");
        let blast_speed = this.GetSpecialValueFor("blast_speed");
        let damage = this.GetSpecialValueFor("damage");
        let slow_initial_stacks = this.GetSpecialValueFor("slow_initial_stacks");
        let blast_duration = blast_radius / blast_speed;
        let current_loc = this.GetCasterPlus().GetAbsOrigin();
        let bTrueSight = !this.GetCasterPlus().HasModifier("modifier_item_imba_shiva_truesight_null");
        let slow_duration_tooltip = this.GetSpecialValueFor("slow_duration_tooltip");
        let caster = this.GetCasterPlus();
        let ability = this;
        this.GetCasterPlus().EmitSound("DOTA_Item.ShivasGuard.Activate");
        let blast_pfx = ResHelper.CreateParticleEx("particles/items2_fx/shivas_guard_active.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(blast_pfx, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(blast_pfx, 1, Vector(blast_radius, blast_duration * 1.33, blast_speed));
        ParticleManager.ReleaseParticleIndex(blast_pfx);
        if (bTrueSight) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_shiva_truesight_null", {
                duration: math.max(this.GetEffectiveCooldown(this.GetLevel()), 0)
            });
        }
        let targets_hit: IBaseNpc_Plus[] = []
        let current_radius = 0;
        let tick_interval = 0.1;
        this.AddTimer(tick_interval, () => {
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), current_loc, current_radius, 0.1, false);
            current_radius = current_radius + blast_speed * tick_interval;
            current_loc = this.GetCasterPlus().GetAbsOrigin();
            let nearby_enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), current_loc, undefined, current_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
                let enemy_has_been_hit = false;
                for (const [_, enemy_hit] of GameFunc.iPair(targets_hit)) {
                    if (enemy == enemy_hit) {
                        enemy_has_been_hit = true;
                    }
                }
                if (!enemy_has_been_hit) {
                    let hit_pfx = ResHelper.CreateParticleEx("particles/items2_fx/shivas_guard_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.GetCasterPlus());
                    ParticleManager.SetParticleControl(hit_pfx, 0, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(hit_pfx, 1, enemy.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(hit_pfx);
                    ApplyDamage({
                        attacker: caster,
                        victim: enemy,
                        ability: ability,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                    });
                    enemy.AddNewModifier(caster, ability, "modifier_item_imba_shivas_blast_slow", {});
                    enemy.SetModifierStackCount("modifier_item_imba_shivas_blast_slow", caster, slow_initial_stacks);
                    if (bTrueSight) {
                        let true_sight_modifier = enemy.AddNewModifier(caster, ability, "modifier_item_imba_shivas_blast_true_sight", {
                            duration: slow_duration_tooltip
                        });
                        if (true_sight_modifier) {
                            true_sight_modifier.SetDuration(slow_duration_tooltip * (1 - enemy.GetStatusResistance()), true);
                        }
                    }
                    targets_hit[GameFunc.GetCount(targets_hit) + 1] = enemy;
                }
            }
            if (current_radius < blast_radius) {
                return tick_interval;
            }
        });
    }
}
@registerModifier()
export class modifier_imba_shiva_handler extends BaseModifier_Plus {
    public aura_radius: number;
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
        if (this.GetItemPlus()) {
            this.aura_radius = this.GetItemPlus().GetSpecialValueFor("aura_radius");
        } else {
            this.Destroy();
            return;
        }
        this.StartIntervalThink(1.0);
        this.OnIntervalThink();
        if (IsServer()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_shiva_aura", {});
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_armor");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_int");
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_shiva_aura")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_shiva_aura");
            }
        }
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_shiva_frost_goddess_breath";
    }
}
@registerModifier()
export class modifier_imba_shiva_aura extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    GetModifierAura(): string {
        return "modifier_imba_shiva_debuff";
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return this.GetItemPlus().GetAbilityTargetFlags();
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return this.GetItemPlus().GetAbilityTargetTeam();
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return this.GetItemPlus().GetAbilityTargetType();
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
}
@registerModifier()
export class modifier_imba_shiva_debuff extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_shivas_guard";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.parent = this.GetParentPlus();
        this.OnIntervalThink();
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(0);
        if (this.parent && this.GetItemPlus()) {
            let attack_speed_slow = (this.parent.GetAttacksPerSecond() * this.parent.GetBaseAttackTime() * 100) * (this.GetItemPlus().GetSpecialValueFor("aura_as_reduction") / 100);
            this.SetStackCount(attack_speed_slow);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return -this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_shivas_blast_slow extends BaseModifier_Plus {
    public slow_stack: number;
    GetTexture(): string {
        return "item_shivas_guard";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.slow_stack = this.GetItemPlus().GetSpecialValueFor("slow_stack");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(1 - this.GetParentPlus().GetStatusResistance());
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    OnIntervalThink(): void {
        if (IsClient()) {
            return;
        }
        let current_stacks = this.GetParentPlus().findBuffStack("modifier_item_imba_shivas_blast_slow", this.GetCasterPlus());
        if (current_stacks <= 1) {
            this.Destroy();
        } else {
            this.DecrementStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.slow_stack * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_stack * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_shivas_blast_true_sight extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/items2_fx/true_sight_debuff.vpcf";
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
}
@registerModifier()
export class modifier_item_imba_shiva_frost_goddess_breath extends BaseModifier_Plus {
    public aura_intellect: any;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
        this.aura_intellect = this.GetItemPlus().GetSpecialValueFor("aura_intellect");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.aura_intellect;
    }
}
@registerModifier()
export class modifier_item_imba_shiva_truesight_null extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
