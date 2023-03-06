
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_cultic_hammer extends BaseItem_Plus {
    public aoe_particle_1: any;
    public aoe_particle_2: any;
    public aoe_particle_3: any;
    public aoe_particle_impact: any;
    public aoe_particle_impact_2: any;
    GetChannelAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_GENERIC_CHANNEL_1;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_cultic_hammer";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("wretched_radius");
    }
    OnSpellStart(): void {
        this.GetParentPlus().EmitSound("Imba.Curseblade");
        this.aoe_particle_1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate_ring.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.aoe_particle_1, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(this.aoe_particle_1, 1, Vector(this.GetSpecialValueFor("wretched_radius"), 0, 0));
        this.aoe_particle_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate_dmg_dark_core.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.aoe_particle_2, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(this.aoe_particle_2, 1, Vector(this.GetSpecialValueFor("wretched_radius") * 0.5, 0, 0));
        this.aoe_particle_3 = ResHelper.CreateParticleEx("particles/item/cultic_hammer/cultic_hammer_channel_hammers.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.aoe_particle_3, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(this.aoe_particle_3, 1, Vector(this.GetSpecialValueFor("wretched_radius"), 0, 0));
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_GENERIC_CHANNEL_1);
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("wretched_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_cultic_pull", {
                duration: this.GetChannelTime(),
                pos_x: this.GetCursorPosition().x,
                pos_y: this.GetCursorPosition().y,
                pos_z: this.GetCursorPosition().z
            });
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        this.GetParentPlus().StopSound("Imba.Curseblade");
        ParticleManager.DestroyParticle(this.aoe_particle_1, true);
        ParticleManager.ReleaseParticleIndex(this.aoe_particle_1);
        ParticleManager.DestroyParticle(this.aoe_particle_2, true);
        ParticleManager.ReleaseParticleIndex(this.aoe_particle_2);
        ParticleManager.DestroyParticle(this.aoe_particle_3, true);
        ParticleManager.ReleaseParticleIndex(this.aoe_particle_3);
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_GENERIC_CHANNEL_1);
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false))) {
            if (enemy.FindModifierByNameAndCaster("modifier_item_imba_cultic_pull", this.GetCasterPlus())) {
                enemy.RemoveModifierByNameAndCaster("modifier_item_imba_cultic_pull", this.GetCasterPlus());
            }
        }
        if (!bInterrupted) {
            EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "DOTA_Imba_Item.Cultic_Hammer.Slam", this.GetCasterPlus());
            this.aoe_particle_impact = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/planeshift/void_spirit_planeshift_impact.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.aoe_particle_impact, 0, this.GetCursorPosition());
            ParticleManager.SetParticleControl(this.aoe_particle_impact, 1, Vector(this.GetSpecialValueFor("wretched_radius"), 0, 0));
            ParticleManager.ReleaseParticleIndex(this.aoe_particle_impact);
            this.aoe_particle_impact_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/dissimilate/void_spirit_dissimilate_dmg.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.aoe_particle_impact_2, 0, this.GetCursorPosition());
            ParticleManager.SetParticleControl(this.aoe_particle_impact_2, 1, Vector(this.GetSpecialValueFor("wretched_radius") * 0.5, 0, 0));
            ParticleManager.ReleaseParticleIndex(this.aoe_particle_impact_2);
            let health_loss = undefined;
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("wretched_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                health_loss = enemy.GetHealth() * this.GetSpecialValueFor("wretched_hp_damage_pct") * 0.01;
                enemy.SetHealth(math.max(enemy.GetHealth() - health_loss, 1));
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, enemy, health_loss, undefined);
                ApplyDamage({
                    victim: enemy,
                    damage: this.GetSpecialValueFor("wretched_base_damage"),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_cultic_status_resistance", {
                    duration: this.GetSpecialValueFor("wretched_status_duration")
                });
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_cultic_root", {
                    duration: this.GetSpecialValueFor("wretched_root_duration") * (1 - enemy.GetStatusResistance())
                });
            }
            GridNav.DestroyTreesAroundPoint(this.GetCursorPosition(), this.GetSpecialValueFor("wretched_radius"), true);
        }
    }
}
@registerModifier()
export class modifier_item_imba_cultic_hammer extends BaseModifier_Plus {
    public bonus_str: number;
    public bonus_damage: number;
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
        if (!this.GetItemPlus()) {
            return;
        }
        this.bonus_str = this.GetItemPlus().GetSpecialValueFor("bonus_str");
        this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_str;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("soul_drain_radius");
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
        return "modifier_item_imba_cultic_hammer_aura";
    }
}
@registerModifier()
export class modifier_item_imba_cultic_hammer_aura extends BaseModifier_Plus {
    public soul_drain_health: any;
    public soul_drain_mana: any;
    public soul_drain_health_illusions: any;
    public soul_drain_mana_illusions: any;
    public soul_drain_health_actual: any;
    public soul_drain_mana_actual: any;
    public heal_particle: any;
    GetEffectName(): string {
        return "particles/item/curseblade/imba_curseblade_curse_rope_pnt.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!this.GetItemPlus()) {
            return;
        }
        this.soul_drain_health = this.GetItemPlus().GetSpecialValueFor("soul_drain_health");
        this.soul_drain_mana = this.GetItemPlus().GetSpecialValueFor("soul_drain_mana");
        this.soul_drain_health_illusions = this.soul_drain_health * this.GetItemPlus().GetSpecialValueFor("soul_drain_illusion_efficiency") * 0.01;
        this.soul_drain_mana_illusions = this.soul_drain_mana * this.GetItemPlus().GetSpecialValueFor("soul_drain_illusion_efficiency") * 0.01;
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        if (!this.GetCasterPlus().IsIllusion()) {
            this.soul_drain_health_actual = this.soul_drain_health;
            this.soul_drain_mana_actual = this.soul_drain_mana;
        } else {
            this.soul_drain_health_actual = this.soul_drain_health_illusions;
            this.soul_drain_mana_actual = this.soul_drain_mana_illusions;
        }
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.soul_drain_health_actual,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
            attacker: this.GetCasterPlus(),
            ability: this.GetItemPlus()
        });
        this.heal_particle = ResHelper.CreateParticleEx("particles/items3_fx/octarine_core_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(this.heal_particle);
        this.GetCasterPlus().Heal(this.soul_drain_health_actual, this.GetItemPlus());
        if (this.GetParentPlus().GetMaxMana && this.GetParentPlus().GetMaxMana() > 0) {
            this.GetParentPlus().ReduceMana(this.soul_drain_mana_actual);
            this.GetCasterPlus().GiveMana(this.soul_drain_mana_actual);
        }
    }
}
@registerModifier()
export class modifier_item_imba_cultic_pull extends BaseModifier_Plus {
    public wretched_pull_speed: number;
    public pos: any;
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/curseblade/imba_curseblade_curse.vpcf";
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.wretched_pull_speed = this.GetItemPlus().GetSpecialValueFor("wretched_pull_speed");
        if (!IsServer()) {
            return;
        }
        this.pos = Vector(keys.pos_x, keys.pos_y, keys.pos_z);
        this.StartIntervalThink(FrameTime());
    }
    BeRefresh(keys: any): void {
        this.pos = Vector(keys.pos_x, keys.pos_y, keys.pos_z);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().SetAbsOrigin(this.GetParentPlus().GetAbsOrigin() + (this.pos - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized() * FrameTime() * this.wretched_pull_speed as Vector);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), true);
        this.GetParentPlus().StopSound("Imba.Curseblade");
    }
}
@registerModifier()
export class modifier_item_imba_cultic_status_resistance extends BaseModifier_Plus {
    public wretched_status_resistance: any;
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/curseblade/imba_hellblade_curse.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_abaddon_frostmourne.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.wretched_status_resistance = this.GetItemPlus().GetSpecialValueFor("wretched_status_resistance") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.wretched_status_resistance;
    }
}
@registerModifier()
export class modifier_item_imba_cultic_root extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/items2_fx/rod_of_atos.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
}
