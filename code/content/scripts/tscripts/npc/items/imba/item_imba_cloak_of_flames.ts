
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 火焰斗篷
@registerAbility()
export class item_imba_cloak_of_flames extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_cloak_of_flames_basic";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_cloak_of_flames_aura")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_cloak_of_flames_aura");
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_cloak_of_flames_aura", {});
            }
        }
    }
}
@registerModifier()
export class modifier_imba_cloak_of_flames_basic extends BaseModifier_Plus {
    public particle: any;
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
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            if (!this.GetParentPlus().HasModifier("modifier_imba_cloak_of_flames_aura")) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_imba_cloak_of_flames_aura", {});
            }
            if (this.particle == undefined) {
                this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ember_spirit/ember_spirit_flameguard.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControl(this.particle, 0, Vector(0, 0, 0));
                ParticleManager.SetParticleControl(this.particle, 1, Vector(this.GetItemPlus().GetSpecialValueFor("aura_radius"), 1, 1));
            }
        }
    }
    BeDestroy( /** keys */): void {
        if (IsServer()) {
            if (!this.GetParentPlus().HasModifier("modifier_imba_cloak_of_flames_basic")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_cloak_of_flames_aura");
            }
        }
        if (this.particle != undefined) {
            ParticleManager.DestroyParticle(this.particle, false);
            ParticleManager.ReleaseParticleIndex(this.particle);
            this.particle = undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_cloak_of_flames_aura extends BaseModifier_Plus {
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
        return "modifier_imba_cloak_of_flames_burn";
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_radius");
    }
}
@registerModifier()
export class modifier_imba_cloak_of_flames_burn extends BaseModifier_Plus {
    public base_damage: number;
    public think_interval: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "modifiers/cloak_of_flames";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.base_damage = this.GetItemPlus().GetSpecialValueFor("base_damage");
        this.think_interval = this.GetItemPlus().GetSpecialValueFor("think_interval");
        if (IsServer()) {
            this.StartIntervalThink(this.think_interval);
        }
    }
    OnIntervalThink(): void {
        if (this.GetItemPlus() && !this.GetCasterPlus().HasItemInInventory("item_imba_radiance")) {
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetItemPlus(),
                damage: this.base_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
}
@registerAbility()
export class item_imba_radiance extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_radiance_basic";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_radiance_aura")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_radiance_aura");
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_radiance_aura", {});
            }
        }
    }
}
@registerModifier()
export class modifier_imba_radiance_basic extends BaseModifier_Plus {
    public bonus_damage: number;
    public particle: any;
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
        this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        if (IsServer()) {
            if (!this.GetParentPlus().HasModifier("modifier_imba_radiance_aura")) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_imba_radiance_aura", {});
            }
            if (this.GetParentPlus().HasModifier("modifier_imba_radiance_aura")) {
                this.particle = ResHelper.CreateParticleEx("particles/items2_fx/radiance_owner.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
                this.AddParticle(this.particle, false, false, -1, true, false);
            }
        }
        this.StartIntervalThink(1.0);
    }
    BeDestroy( /** keys */): void {
        if (IsServer()) {
            if (!this.GetParentPlus().HasModifier("modifier_imba_radiance_basic")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_radiance_aura");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
}
@registerModifier()
export class modifier_imba_radiance_aura extends BaseModifier_Plus {
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
        return "modifier_imba_radiance_burn";
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_radius");
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        let buffs = this.GetParentPlus().FindAllModifiersByName("modifier_imba_radiance_basic") as modifier_imba_radiance_basic[];
        for (const modifier of (buffs)) {
            if (!modifier.particle) {
                modifier.particle = ResHelper.CreateParticleEx("particles/items2_fx/radiance_owner.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
                modifier.AddParticle(modifier.particle, false, false, -1, true, false);
            }
        }
        this.StartIntervalThink(-1);
    }
    BeDestroy(): void {
        if (IsServer()) {
            let buffs = this.GetParentPlus().FindAllModifiersByName("modifier_imba_radiance_basic") as modifier_imba_radiance_basic[];
            for (const modifier of buffs) {
                if (modifier.particle) {
                    ParticleManager.DestroyParticle(modifier.particle, false);
                    ParticleManager.ReleaseParticleIndex(modifier.particle);
                    modifier.particle = undefined;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_radiance_burn extends BaseModifier_Plus {
    public particle: any;
    public base_damage: number;
    public extra_damage: number;
    public aura_radius: number;
    public miss_chance: number;
    public count_to_afterburn: number;
    public afterburner_counter: number;
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
        if (IsServer()) {
            this.particle = ResHelper.CreateParticleEx("particles/items2_fx/radiance.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle, 1, this.GetCasterPlus().GetAbsOrigin());
            this.StartIntervalThink(this.GetItemPlus().GetSpecialValueFor("think_interval"));
            let ability = this.GetItemPlus();
            this.base_damage = ability.GetSpecialValueFor("base_damage");
            this.extra_damage = ability.GetSpecialValueFor("extra_damage");
            this.aura_radius = ability.GetSpecialValueFor("aura_radius");
            this.miss_chance = ability.GetSpecialValueFor("miss_chance");
            this.count_to_afterburn = ability.GetSpecialValueFor("stack_decay");
            this.afterburner_counter = 0;
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.particle, false);
            ParticleManager.ReleaseParticleIndex(this.particle);
            let stacks = this.GetStackCount();
            if (stacks > 0) {
                let modifier_afterburn = this.GetParentPlus().findBuff<modifier_imba_radiance_afterburn>("modifier_imba_radiance_afterburn");
                if (!modifier_afterburn) {
                    modifier_afterburn = this.GetParentPlus().AddNewModifier(this.GetItemPlus().GetCasterPlus(), this.GetItemPlus(), "modifier_imba_radiance_afterburn", {}) as modifier_imba_radiance_afterburn;
                }
                if (modifier_afterburn) {
                    modifier_afterburn.SetStackCount(modifier_afterburn.GetStackCount() + stacks);
                }
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetItemPlus();
            let caster = this.GetCasterPlus();
            let damage = this.base_damage;
            let real_hero_nearby = false;
            if (caster.IsRealUnit()) {
                real_hero_nearby = true;
            } else {
                let real_hero_finder = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.aura_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, hero] of GameFunc.iPair(real_hero_finder)) {
                    if (hero.findBuff<modifier_imba_radiance_aura>("modifier_imba_radiance_aura")) {
                        real_hero_nearby = true;
                        return;
                    }
                }
            }
            if (real_hero_nearby) {
                damage = damage + this.extra_damage * this.GetParentPlus().GetHealth() * 0.01;
                this.afterburner_counter = this.afterburner_counter + 1;
                if (this.afterburner_counter >= this.count_to_afterburn) {
                    this.afterburner_counter = 0;
                    this.SetStackCount(this.GetStackCount() + 1);
                }
            }
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: caster,
                ability: ability,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        if (!IsServer()) {
            return;
        }
        return this.miss_chance * GameFunc.GetCount(this.GetCasterPlus().FindAllModifiersByName("modifier_imba_radiance_basic"));
    }
}
@registerModifier()
export class modifier_imba_radiance_afterburn extends BaseModifier_Plus {
    public base_damage: number;
    public extra_damage: number;
    public miss_chance: number;
    public particle: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            let ability = this.GetItemPlus();
            let think_interval = ability.GetSpecialValueFor("think_interval");
            this.base_damage = ability.GetSpecialValueFor("base_damage");
            this.extra_damage = ability.GetSpecialValueFor("extra_damage");
            this.miss_chance = ability.GetSpecialValueFor("miss_chance");
            this.particle = ResHelper.CreateParticleEx("particles/items2_fx/radiance.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle, 1, this.GetCasterPlus().GetAbsOrigin());
            this.StartIntervalThink(think_interval);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.particle, false);
            ParticleManager.ReleaseParticleIndex(this.particle);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.GetParentPlus().HasModifier("modifier_imba_radiance_burn")) {
                let ability = this.GetItemPlus();
                if (!ability) {
                    this.Destroy();
                    return undefined;
                }
                let caster = ability.GetCasterPlus();
                let stacks = this.GetStackCount();
                let damage = this.base_damage;
                damage = damage + this.extra_damage * this.GetParentPlus().GetHealth() * 0.01;
                ApplyDamage({
                    victim: this.GetParentPlus(),
                    attacker: caster,
                    ability: ability,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                this.SetStackCount(this.GetStackCount() - 1);
                if (this.GetStackCount() <= 0) {
                    this.Destroy();
                    return;
                }
                let parent_loc = this.GetParentPlus().GetAbsOrigin();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.miss_chance;
    }
}
