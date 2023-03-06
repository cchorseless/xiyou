
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_naga_siren_mirror_image extends BaseAbility_Plus {
    public illusions: IBaseNpc_Plus[];
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let image_count = this.GetSpecialValueFor("images_count") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_naga_siren");
        let image_out_dmg = this.GetSpecialValueFor("outgoing_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_naga_siren_4");
        let vRandomSpawnPos = [
            Vector(108, 0, 0),
            Vector(108, 108, 0),
            Vector(108, 0, 0),
            Vector(0, 108, 0),
            Vector(-108, 0, 0),
            Vector(-108, 108, 0),
            Vector(-108, -108, 0),
            Vector(0, -108, 0)
        ];
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_mirror_image.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_naga_siren_mirror_image_invulnerable", {
            duration: this.GetSpecialValueFor("invuln_duration")
        });
        if (this.illusions) {
            for (const [_, illusion] of GameFunc.iPair(this.illusions)) {
                if (IsValidEntity(illusion) && illusion.IsAlive()) {
                    illusion.ForceKill(false);
                }
            }
        }
        this.GetCasterPlus().SetContextThink(DoUniqueString("naga_siren_mirror_image"), () => {
            this.illusions = this.GetCasterPlus().CreateIllusion(this.GetCasterPlus(),
                {
                    outgoing_damage: image_out_dmg,
                    incoming_damage: this.GetSpecialValueFor("incoming_damage") - this.GetCasterPlus().GetTalentValue("special_bonus_imba_naga_siren_mirror_image_damage_taken"),
                    bounty_base: this.GetCasterPlus().GetIllusionBounty(),
                    bounty_growth: undefined,
                    outgoing_damage_structure: undefined,
                    outgoing_damage_roshan: undefined,
                    duration: undefined
                }, image_count);
            for (let i = 0; i < this.illusions.length; i++) {
                let illusion = this.illusions[i];
                let pos = this.GetCasterPlus().GetAbsOrigin() + vRandomSpawnPos[i] as Vector;
                FindClearSpaceForUnit(illusion, pos, true);
                let part2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_riptide_foam.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, illusion);
                ParticleManager.ReleaseParticleIndex(part2);
                illusion.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_naga_siren_mirror_image_perfect_image", {});
            }
            ParticleManager.DestroyParticle(pfx, false);
            ParticleManager.ReleaseParticleIndex(pfx);
            this.GetCasterPlus().Stop();
            return undefined;
        }, this.GetSpecialValueFor("invuln_duration"));
        this.GetCasterPlus().EmitSound("Hero_NagaSiren.MirrorImage");
    }
}
@registerModifier()
export class modifier_imba_naga_siren_mirror_image_invulnerable extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_naga_siren_mirror_image_perfect_image extends BaseModifier_Plus {
    public perfect_image_bonus_damage_incoming_pct: number;
    public perfect_image_bonus_damage_outgoing_pct: number;
    public perfect_image_max_stacks: number;
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.perfect_image_bonus_damage_incoming_pct = this.GetSpecialValueFor("perfect_image_bonus_damage_incoming_pct");
        this.perfect_image_bonus_damage_outgoing_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("perfect_image_bonus_damage_outgoing_pct");
        this.perfect_image_max_stacks = this.GetSpecialValueFor("perfect_image_max_stacks");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.perfect_image_bonus_damage_incoming_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.perfect_image_bonus_damage_outgoing_pct;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.attacker == this.GetParentPlus()) {
            if (params.unit.IsRealUnit()) {
                this.SetIllusionsStackCount(this.perfect_image_max_stacks);
            } else {
                this.SetIllusionsStackCount(math.min(this.GetStackCount() + 1, this.perfect_image_max_stacks));
            }
        }
    }
    SetIllusionsStackCount(iStackCount: number) {
        let ability = this.GetAbilityPlus<imba_naga_siren_mirror_image>()
        if (ability.illusions == undefined) {
            return;
        }
        for (const illusion of (ability.illusions)) {
            if (illusion && !illusion.IsNull()) {
                let modifier = illusion.FindModifierByName(this.GetName());
                if (modifier) {
                    modifier.SetStackCount(iStackCount);
                }
            }
        }
    }
}
@registerAbility()
export class imba_naga_siren_ensnare extends BaseAbility_Plus {
    public naga_sirens: IBaseNpc_Plus[];
    GetCooldown(iLevel: number): number {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_naga_siren_2");
    }
    OnAbilityPhaseInterrupted(): void {
        if (!IsServer()) {
            return;
        }
        let mirror_image = this.GetCasterPlus().findAbliityPlus<imba_naga_siren_mirror_image>("imba_naga_siren_mirror_image");
        if (mirror_image && mirror_image.illusions) {
            for (const [_, illusion] of GameFunc.iPair(mirror_image.illusions)) {
                if (IsValidEntity(illusion) && illusion.IsAlive()) {
                    illusion.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
                }
            }
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        let mirror_image = this.GetCasterPlus().findAbliityPlus<imba_naga_siren_mirror_image>("imba_naga_siren_mirror_image");
        this.naga_sirens = []
        if (mirror_image && mirror_image.illusions) {
            for (const illusion of (mirror_image.illusions)) {
                if (IsValidEntity(illusion) && illusion.IsAlive()) {
                    table.insert(this.naga_sirens, illusion);
                    illusion.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
                }
            }
        }
        return true;
    }
    OnSpellStart(): void {
        if (this.GetCursorTarget().TriggerSpellAbsorb(this)) {
            return;
        }
        if (!IsServer()) {
            return;
        }
        let net_speed = this.GetSpecialValueFor("net_speed");
        let distance = (this.GetCursorTarget().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D();
        let projectile_duration = distance / net_speed;
        this.LaunchProjectile(this.GetCasterPlus(), this.GetCursorTarget(), projectile_duration);
        if (GameFunc.GetCount(this.naga_sirens) > 0) {
            this.naga_sirens[RandomInt(1, GameFunc.GetCount(this.naga_sirens))].EmitSound("Hero_NagaSiren.Ensnare.Cast");
        } else {
            this.GetCasterPlus().EmitSound("Hero_NagaSiren.Ensnare.Cast");
        }
        for (const [_, naga] of GameFunc.iPair(this.naga_sirens)) {
            if (IsValidEntity(naga) && naga.IsAlive()) {
                let enemies = FindUnitsInRadius(naga.GetTeamNumber(), naga.GetAbsOrigin(), undefined, this.GetSpecialValueFor("fake_ensnare_distance"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false);
                if (GameFunc.GetCount(enemies) > 0) {
                    this.LaunchProjectile(naga, enemies[0], projectile_duration);
                }
            }
        }
    }
    LaunchProjectile(source: IBaseNpc_Plus, target: IBaseNpc_Plus, projectile_duration: number) {
        let net_speed = this.GetSpecialValueFor("net_speed");
        if (source.IsIllusion()) {
            net_speed = (target.GetAbsOrigin() - source.GetAbsOrigin() as Vector).Length2D() / projectile_duration;
        }
        let info = {
            Target: target,
            Source: source,
            Ability: this,
            bDodgeable: true,
            EffectName: "particles/units/heroes/hero_siren/siren_net_projectile.vpcf",
            iMoveSpeed: net_speed,
            ExtraData: {
                illusion: source.IsIllusion()
            }
        }
        ProjectileManager.CreateTrackingProjectile(info);
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, hExtraData: any): boolean | void {
        if (hTarget) {
            if (!hTarget.HasModifier("modifier_imba_naga_siren_ensnare")) {
                hTarget.EmitSound("Hero_NagaSiren.Ensnare.Target");
            }
            hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_naga_siren_ensnare", {
                duration: this.GetSpecialValueFor("duration") * (1 - hTarget.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_naga_siren_ensnare extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_siren/siren_net.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_naga_siren_rip_tide extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("radius");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_naga_siren_rip_tide";
    }

    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_naga_siren_rip_tide_armor") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_naga_siren_rip_tide_armor")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_naga_siren_rip_tide_armor"), "modifier_special_bonus_imba_naga_siren_rip_tide_armor", {});
        }
    }
}
@registerModifier()
export class modifier_imba_naga_siren_rip_tide extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.attacker == this.GetParentPlus() && GFuncRandom.PRD(this.GetSpecialValueFor("chance") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_naga_siren_rip_tide_proc_chance"), this)) {
            let caster_table: IBaseNpc_Plus[] = []
            let victim_table: EntityIndex[] = []
            table.insert(caster_table, this.GetCasterPlus());
            let units: IBaseNpc_Plus[] = this.GetCasterPlus().GetAdditionalOwnedUnitsPlus();
            for (const unit of (units)) {
                if (unit.GetUnitName() == this.GetCasterPlus().GetUnitName() && unit.IsIllusion()) {
                    table.insert(caster_table, unit);
                }
            }
            for (const [_, tide_caster] of GameFunc.iPair(caster_table)) {
                tide_caster.EmitSound("Hero_NagaSiren.Riptide.Cast");
                tide_caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
                let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_riptide.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, tide_caster);
                ParticleManager.SetParticleControl(pfx, 1, Vector(this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius")));
                ParticleManager.SetParticleControl(pfx, 3, Vector(this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius")));
                ParticleManager.ReleaseParticleIndex(pfx);
                let victims = FindUnitsInRadius(tide_caster.GetTeamNumber(), tide_caster.GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), this.GetAbilityPlus().GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                for (const [_, victim] of GameFunc.iPair(victims)) {
                    if (!victim_table.includes(victim.entindex())) {
                        let damage = this.GetSpecialValueFor("damage");
                        let mod = victim.findBuff<modifier_imba_naga_siren_rip_tide_debuff>("modifier_imba_naga_siren_rip_tide_debuff");
                        if (mod) {
                            let mod = victim.findBuff<modifier_imba_naga_siren_rip_tide_debuff>("modifier_imba_naga_siren_rip_tide_debuff");
                            mod.SetDuration(this.GetSpecialValueFor("duration") * (1 - victim.GetStatusResistance()), true);
                            mod.SetStackCount(mod.GetStackCount() + 1);
                            damage = damage + (this.GetSpecialValueFor("wet_bonus_damage") * mod.GetStackCount());
                        } else {
                            mod = victim.AddNewModifier(this.GetCasterPlus().GetPlayerOwner().GetAssignedHero(), this.GetAbilityPlus(), "modifier_imba_naga_siren_rip_tide_debuff", {
                                duration: this.GetSpecialValueFor("duration") * (1 - victim.GetStatusResistance())
                            }) as modifier_imba_naga_siren_rip_tide_debuff;
                            mod.SetStackCount(1);
                            damage = damage + this.GetSpecialValueFor("wet_bonus_damage");
                        }
                        let damageTable: ApplyDamageOptions = {
                            victim: victim,
                            attacker: tide_caster,
                            damage: damage,
                            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                            ability: this.GetAbilityPlus()
                        }
                        ApplyDamage(damageTable);
                        victim_table.push(victim.entindex());
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_naga_siren_rip_tide_debuff extends BaseModifier_Plus {
    public armor_reduction: any;
    public wet_bonus_armor: number;
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_siren/naga_siren_riptide_debuff.vpcf";
    }
    GetTexture(): string {
        return "naga_siren_rip_tide";
    }
    Init(p_0: any,): void {
        this.armor_reduction = this.GetSpecialValueFor("armor_reduction") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_naga_siren_rip_tide_armor");
        this.wet_bonus_armor = this.GetSpecialValueFor("wet_bonus_armor");
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return (this.wet_bonus_armor * this.GetStackCount()) + this.armor_reduction;
    }
}
@registerAbility()
export class imba_naga_siren_song_of_the_siren extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_siren_song_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        if (this.GetAutoCastState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_naga_siren_siren_temptation_aura", {
                duration: this.GetSpecialValueFor("duration")
            });
            ParticleManager.SetParticleControl(pfx, 61, Vector(1, 0, 0));
        } else {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_naga_siren_song_of_the_siren_aura", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
        if (this.GetCasterPlus().HasScepter()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_naga_siren_song_of_the_siren_heal_aura", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
        this.GetCasterPlus().EmitSound("Hero_NagaSiren.SongOfTheSiren");
        ParticleManager.ReleaseParticleIndex(pfx);
    }
}
@registerModifier()
export class modifier_imba_naga_siren_song_of_the_siren_aura extends BaseModifier_Plus {
    public pfx: any;
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraDuration(): number {
        return this.GetSpecialValueFor("aura_linger");
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL;
    }
    GetModifierAura(): string {
        return "modifier_imba_naga_siren_song_of_the_siren";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_song_aura.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        this.GetCasterPlus().SwapAbilities(this.GetAbilityPlus().GetAbilityName(), "imba_naga_siren_song_of_the_siren_cancel", false, true);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
        this.GetCasterPlus().EmitSound("Hero_NagaSiren.SongOfTheSiren.Cancel");
        this.GetCasterPlus().StopSound("Hero_NagaSiren.SongOfTheSiren");
        this.GetCasterPlus().SwapAbilities(this.GetAbilityPlus().GetAbilityName(), "imba_naga_siren_song_of_the_siren_cancel", true, false);
    }
}
@registerModifier()
export class modifier_imba_naga_siren_song_of_the_siren extends BaseModifier_Plus {
    public pfx: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_song_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NIGHTMARED]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
}
@registerAbility()
export class imba_naga_siren_song_of_the_siren_cancel extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_naga_siren_song_of_the_siren_aura");
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_naga_siren_song_of_the_siren_heal_aura");
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_naga_siren_siren_temptation_aura");
    }
}
@registerModifier()
export class modifier_imba_naga_siren_song_of_the_siren_heal_aura extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraDuration(): number {
        return this.GetSpecialValueFor("aura_linger");
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_naga_siren_song_of_the_siren_healing";
    }
}
@registerModifier()
export class modifier_imba_naga_siren_song_of_the_siren_healing extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        return this.GetSpecialValueFor("scepter_regen_rate");
    }
}
@registerModifier()
export class modifier_imba_naga_siren_siren_temptation_aura extends BaseModifier_Plus {
    public pfx: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraDuration(): number {
        return this.GetSpecialValueFor("aura_linger");
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL;
    }
    GetModifierAura(): string {
        return "modifier_imba_naga_siren_siren_temptation_debuff";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_song_aura.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.pfx, 61, Vector(1, 0, 0));
        this.GetCasterPlus().SwapAbilities(this.GetAbilityPlus().GetAbilityName(), "imba_naga_siren_song_of_the_siren_cancel", false, true);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
        this.GetCasterPlus().EmitSound("Hero_NagaSiren.SongOfTheSiren.Cancel");
        this.GetCasterPlus().StopSound("Hero_NagaSiren.SongOfTheSiren");
        this.GetCasterPlus().SwapAbilities(this.GetAbilityPlus().GetAbilityName(), "imba_naga_siren_song_of_the_siren_cancel", true, false);
    }
}
@registerModifier()
export class modifier_imba_naga_siren_siren_temptation_debuff extends BaseModifier_Plus {
    public pfx: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_siren/naga_siren_song_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.pfx, 61, Vector(1, 0, 0));
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetSpecialValueFor("siren_temptation_incoming_damage_pct");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_naga_siren_rip_tide_proc_chance extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_naga_siren_mirror_image_damage_taken extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_naga_siren_mirror_image_perfect_image extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_naga_siren_rip_tide_armor extends BaseModifier_Plus {
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
