
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_earth_spirit_stone_caller extends BaseAbility_Plus {
    public handler: modifier_imba_earth_spirit_remnant_handler;
    IsNetherWardStealable() {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetManaCost(p_0: number,): number {
        return this.GetSpecialValueFor("overdraw_base_cost") * ((this.GetCasterPlus().findBuffStack("modifier_imba_earth_spirit_remnant_handler", this.GetCasterPlus()) - 1) ^ this.GetSpecialValueFor("overdraw_cost_multiplier"));
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (IsServer()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET;
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            if (!this.handler) {
                this.handler = this.GetCasterPlus().findBuff<modifier_imba_earth_spirit_remnant_handler>("modifier_imba_earth_spirit_remnant_handler");
            }
            return true;
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_earth_spirit_remnant_handler";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorPosition();
            let unit = this.GetCursorTarget();
            if (this.handler) {
                this.handler.BeCreated({});
            } else {
                this.handler = caster.findBuff<modifier_imba_earth_spirit_remnant_handler>("modifier_imba_earth_spirit_remnant_handler");
            }
            let remnantDuration = this.GetSpecialValueFor("duration");
            let effectRadius = this.GetSpecialValueFor("radius");
            let visionDuration = this.GetSpecialValueFor("vision_duration");
            if (unit == caster) {
                target = caster.GetAbsOrigin() + caster.GetForwardVector() * 100 as Vector;
            }
            let dummy = BaseNpc_Plus.CreateUnitByName("npc_imba_dota_earth_spirit_stone", target, caster, false);
            dummy.AddNewModifier(caster, this, "modifier_imba_stone_remnant", {
                duration: remnantDuration
            });
            EmitSoundOn("Hero_EarthSpirit.StoneRemnant.Impact", dummy);
            this.handler.NewRemnant(dummy.GetEntityIndex());
            if (caster.HasTalent("special_bonus_imba_earth_spirit_1")) {
                dummy.SetDayTimeVisionRange(caster.GetTalentValue("special_bonus_imba_earth_spirit_1"));
                dummy.SetNightTimeVisionRange(caster.GetTalentValue("special_bonus_imba_earth_spirit_1"));
            } else {
                this.CreateVisibilityNode(target, effectRadius, visionDuration);
            }
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target, undefined, effectRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let mark = enemy.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
                if (mark) {
                    mark.IncrementStackCount();
                } else {
                    enemy.AddNewModifier(caster, this, "modifier_imba_earths_mark", {});
                }
            }
        }
    }
    OnUpgrade(): void {
        if (IsServer()) {
            this.CheckScepter();
        }
    }
    OnInventoryContentsChanged(): void {
        if (IsServer()) {
            this.CheckScepter();
        }
    }
    CheckScepter() {
        let caster = this.GetCasterPlus();
        let petrify = caster.findAbliityPlus<imba_earth_spirit_petrify>("imba_earth_spirit_petrify");
        if (petrify) {
            if (caster.HasScepter()) {
                petrify.SetHidden(false);
                petrify.SetActivated(true);
            } else {
                petrify.SetHidden(true);
                petrify.SetActivated(false);
            }
        }
    }
    KillRemnant(remnantID: EntityIndex) {
        if (IsServer()) {
            this.handler.KillRemnant(remnantID);
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_earth_spirit_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_earth_spirit_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_earth_spirit_4"), "modifier_special_bonus_imba_earth_spirit_4", {});
        }
    }
}
@registerModifier()
export class modifier_imba_earth_spirit_remnant_handler extends BaseModifier_Plus {
    public overdrawCooldown: any;
    public noCostRemnants: any;
    public parent: IBaseNpc_Plus;
    public overdrawTimer: any;
    public remnants: EntityIndex[];
    RemoveOnDeath(): boolean {
        return false;
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        if (this.GetStackCount() > 1) {
            return false;
        }
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.overdrawCooldown = this.GetSpecialValueFor("overdraw_cooldown");
            this.noCostRemnants = this.GetSpecialValueFor("no_cost_remnants");
            this.overdrawCooldown = this.GetSpecialValueFor("overdraw_cooldown");
            this.parent = this.GetParentPlus();
            this.overdrawTimer = this.overdrawTimer || 0;
            this.remnants = this.remnants || []
            this.StartIntervalThink(FrameTime() * 3);
            if (this.GetParentPlus().HasTalent("special_bonus_imba_earth_spirit_5")) {
                this.overdrawCooldown = this.overdrawCooldown + this.GetCasterPlus().GetTalentValue("special_bonus_imba_earth_spirit_5");
            }
            if (this.GetParentPlus().HasTalent("special_bonus_imba_earth_spirit_6")) {
                this.noCostRemnants = this.noCostRemnants + this.GetCasterPlus().GetTalentValue("special_bonus_imba_earth_spirit_6");
            }
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_earth_spirit_stone_caller_charge_counter", {});
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.overdrawTimer > 0) {
                this.overdrawTimer = this.overdrawTimer - FrameTime() * 3;
            }
            let length = GameFunc.GetCount(this.remnants);
            for (let i = length - 1; i >= 0; i--) {
                if (this.remnants[i]) {
                    if (!EntIndexToHScript(this.remnants[i])) {
                        this.remnants.splice(i, 1);
                    }
                }
            }
            if (GameFunc.GetCount(this.remnants) <= this.noCostRemnants && this.overdrawTimer <= 0) {
                this.SetStackCount(1);
            }
        }
    }
    NewRemnant(remnantID: EntityIndex) {
        if (IsServer()) {
            if (GameFunc.GetCount(this.remnants) >= this.noCostRemnants) {
                this.overdrawTimer = this.overdrawCooldown;
                this.SetDuration(this.overdrawCooldown, true);
                this.IncrementStackCount();
                this.KillRemnant(this.remnants[0]);
            } else if (this.overdrawTimer > 0) {
                this.overdrawTimer = this.overdrawCooldown;
                this.SetDuration(this.overdrawCooldown, true);
            }
            this.remnants.push(remnantID);
        }
    }
    KillRemnant(remnantID: EntityIndex) {
        if (IsServer()) {
            for (const id of (this.remnants)) {
                if (id == remnantID) {
                    this.remnants.splice(this.remnants.indexOf(remnantID), 1);
                    let remnant = EntIndexToHScript(id) as IBaseNpc_Plus;
                    if (remnant) {
                        let remnantModifier = remnant.findBuff<modifier_imba_stone_remnant>("modifier_imba_stone_remnant");
                        if (remnantModifier) {
                            remnantModifier.Destroy();
                        }
                    }
                    return;
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.attacker == this.parent && keys.target.GetTeamNumber() != this.parent.GetTeamNumber()) {
                let mark = keys.target.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
                if (mark) {
                    mark.IncrementStackCount();
                } else {
                    keys.target.AddNewModifier(this.parent, this.GetAbilityPlus(), "modifier_imba_earths_mark", {});
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_stone_remnant extends BaseModifier_Plus {
    public remnantParticle: any;
    public exploded: any;
    public explodedParticle: any;
    public PetrifyHandler: imba_earth_spirit_petrify;
    IsHidden(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (this.GetParentPlus().GetUnitName() == "npc_imba_dota_earth_spirit_stone") {
                let particle = "particles/units/heroes/hero_earth_spirit/espirit_stoneremnant.vpcf";
                this.remnantParticle = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControl(this.remnantParticle, 1, this.GetParentPlus().GetAbsOrigin());
            }
            this.exploded = false;
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_earth_spirit_petrify.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.explodedParticle) {
                ParticleManager.DestroyParticle(this.explodedParticle, false);
                ParticleManager.ReleaseParticleIndex(this.explodedParticle);
            }
            EmitSoundOn("Hero_EarthSpirit.StoneRemnant.Destroy", this.GetParentPlus());
            if (this.GetParentPlus().GetUnitName() == "npc_imba_dota_earth_spirit_stone") {
                ParticleManager.DestroyParticle(this.remnantParticle, false);
                ParticleManager.ReleaseParticleIndex(this.remnantParticle);
                GFuncEntity.SafeDestroyUnit(this.GetParentPlus());
                if (this.GetAbilityPlus() && !this.GetAbilityPlus().IsNull()) {
                    this.GetAbilityPlus<imba_earth_spirit_stone_caller>().KillRemnant(this.GetParentPlus().GetEntityIndex());
                }
            } else {
                FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
                if (this.PetrifyHandler) {
                    let damage = this.PetrifyHandler.GetSpecialValueFor("damage");
                    let damageRadius = this.PetrifyHandler.GetSpecialValueFor("aoe");
                    let units = FindUnitsInRadius(this.PetrifyHandler.GetCaster().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, damageRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                    for (const [_, unit] of GameFunc.iPair(units)) {
                        ApplyDamage({
                            victim: unit,
                            attacker: this.PetrifyHandler.GetCaster(),
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this.GetAbilityPlus()
                        });
                    }
                }
            }
        }
    }
    Explode() {
        if (IsServer()) {
            let particle = "particles/units/heroes/hero_earth_spirit/espirit_stoneismagnetized_xpld.vpcf";
            this.explodedParticle = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            this.exploded = true;
        }
    }
    SetPetrify(petrify: imba_earth_spirit_petrify) {
        if (IsServer()) {
            this.PetrifyHandler = petrify;
        }
    }
}
@registerModifier()
export class modifier_imba_earth_spirit_stone_caller_charge_counter extends BaseModifier_Plus {
    public handler: any;
    public no_cost: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.handler = this.GetParentPlus().findBuff<modifier_imba_earth_spirit_remnant_handler>("modifier_imba_earth_spirit_remnant_handler");
        this.no_cost = this.GetSpecialValueFor("no_cost_remnants");
        if (this.handler && this.handler.remnants) {
            this.SetStackCount(this.no_cost - GameFunc.GetCount(this.handler.remnants));
            this.StartIntervalThink(FrameTime() * 3);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.no_cost - GameFunc.GetCount(this.handler.remnants));
    }
}
@registerModifier()
export class modifier_imba_earths_mark extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public duration: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetTexture(): string {
        return "brewmaster_earth_spell_immunity";
    }
    GetEffectName(): string {
        return "particles/hero/earth_spirit/earth_mark.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    DestroyOnExpire(): boolean {
        if (this.caster.HasTalent("special_bonus_imba_earth_spirit_8")) {
            return false;
        }
        return true;
    }
    IsPurgable(): boolean {
        if (this.caster.HasTalent("special_bonus_imba_earth_spirit_7")) {
            return false;
        }
        return true;
    }
    IsPurgeException(): boolean {
        if (this.caster.HasTalent("special_bonus_imba_earth_spirit_7")) {
            return false;
        }
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        let stone_caller = this.caster.findAbliityPlus<imba_earth_spirit_stone_caller>("imba_earth_spirit_stone_caller");
        this.duration = stone_caller.GetSpecialValueFor("earths_mark_duration") * (1 - this.GetParentPlus().GetStatusResistance());
        this.SetDuration(this.duration, true);
        this.SetStackCount(1);
        if (IsServer()) {
            if (this.caster.HasTalent("special_bonus_imba_earth_spirit_7") || this.caster.HasTalent("special_bonus_imba_earth_spirit_8")) {
                this.StartIntervalThink(FrameTime() * 3);
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetRemainingTime() > 0) {
                if (this.caster.HasTalent("special_bonus_imba_earth_spirit_7")) {
                    if (this.GetParentPlus().IsMagicImmune()) {
                        this.SetDuration(this.GetRemainingTime() + FrameTime() * 3, true);
                    }
                }
            } else {
                if (this.caster.HasTalent("special_bonus_imba_earth_spirit_8")) {
                    if (this.GetStackCount() > 1) {
                        this.DecrementStackCount();
                        this.RefreshDuration(true);
                    } else {
                        this.Destroy();
                    }
                } else {
                    this.Destroy();
                }
            }
        }
    }
    OnStackCountChanged(oldStacks: number): void {
        if (IsServer()) {
            if (oldStacks == this.GetStackCount()) {
                return;
            }
            if (this.GetStackCount() > oldStacks) {
                this.RefreshDuration();
                let max_stacks = this.caster.findAbliityPlus<imba_earth_spirit_stone_caller>("imba_earth_spirit_stone_caller").GetSpecialValueFor("max_stacks");
                this.SetStackCount(math.min(this.GetStackCount(), max_stacks));
            }
        }
    }
    RefreshDuration(talentRefresh = false) {
        if (IsServer()) {
            if (talentRefresh || !this.caster.HasTalent("special_bonus_imba_earth_spirit_8")) {
                let newDuration = this.duration * (1 - this.GetParentPlus().GetStatusResistance());
                this.SetDuration(newDuration, true);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus() && !this.GetCasterPlus().IsNull() && this.GetCasterPlus().HasTalent("special_bonus_imba_earth_spirit_4")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_earth_spirit_4") * this.GetStackCount() * (-1);
        }
    }
}
@registerModifier()
export class modifier_imba_earth_spirit_layout_fix extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABILITY_LAYOUT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABILITY_LAYOUT)
    CC_GetModifierAbilityLayout(): number {
        return 6;
    }
}
@registerAbility()
export class imba_earth_spirit_boulder_smash extends BaseAbility_Plus {
    GetAssociatedSecondaryAbilities(): string {
        return "imba_earth_spirit_stone_caller";
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (IsClient()) {
            return this.GetSpecialValueFor("rock_search_aoe");
        } else {
            return this.GetSpecialValueFor("rock_distance");
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (caster == target) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else if (target.IsBuilding()) {
            return UnitFilterResult.UF_FAIL_BUILDING;
        } else if (target.IsInvulnerable()) {
            return UnitFilterResult.UF_FAIL_INVULNERABLE;
        } else if (target.IsAncient()) {
            return UnitFilterResult.UF_FAIL_ANCIENT;
        } else if (target.IsMagicImmune()) {
            return UnitFilterResult.UF_FAIL_MAGIC_IMMUNE_ENEMY;
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (this.GetCasterPlus() == target) {
            return "#dota_hud_error_cant_cast_on_self";
        }
        return "";
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let pointTarget = this.GetCursorPosition();
            let target = this.GetCursorTarget();
            let caster = this.GetCasterPlus();
            let searchRadius = this.GetSpecialValueFor("rock_search_aoe") + GPropertyCalculate.GetCastRangeBonus(caster);
            caster.RemoveModifierByName("modifier_imba_boulder_smash_cast_thinker");
            if (target) {
                if (target.GetTeam() != caster.GetTeam()) {
                    if (target.TriggerSpellAbsorb(this)) {
                        return undefined;
                    }
                }
                if (CalcDistanceBetweenEntityOBB(caster, target) <= searchRadius) {
                    let RemnantAroundCaster = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, searchRadius + 1, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
                    for (const [_, r] of GameFunc.iPair(RemnantAroundCaster)) {
                        if (r.HasModifier("modifier_imba_stone_remnant")) {
                            r.RemoveModifierByName("modifier_imba_boulder_smash_push");
                            r.RemoveModifierByName("modifier_imba_geomagnetic_grip_pull");
                            let mod = r.AddNewModifier(r, this, "modifier_imba_boulder_smash_push", {}) as modifier_imba_boulder_smash_push;
                            let dir = (this.GetCursorPosition() - caster.GetAbsOrigin() as Vector).Normalized();
                            mod.PassData(caster, dir);
                            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_caster.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                            ParticleManager.SetParticleControl(particle, 1, caster.GetAbsOrigin());
                            ParticleManager.ReleaseParticleIndex(particle);
                            EmitSoundOn("Hero_EarthSpirit.BoulderSmash.Target", r);
                            return true;
                        }
                    }
                    target.RemoveModifierByName("modifier_imba_boulder_smash_push");
                    target.RemoveModifierByName("modifier_imba_geomagnetic_grip_pull");
                    target.AddNewModifier(caster, this, "modifier_imba_boulder_smash_push", {});
                    if (caster.GetTeamNumber() != target.GetTeamNumber()) {
                        ApplyDamage({
                            victim: target,
                            attacker: caster,
                            damage: this.GetSpecialValueFor("rock_damage"),
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this
                        });
                    }
                    let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_caster.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                    ParticleManager.SetParticleControl(particle, 1, caster.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle);
                    EmitSoundOn("Hero_EarthSpirit.BoulderSmash.Target", target);
                    return true;
                } else {
                    let RemnantAroundCaster = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, searchRadius + 1, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
                    for (const [_, r] of GameFunc.iPair(RemnantAroundCaster)) {
                        if (r.HasModifier("modifier_imba_stone_remnant")) {
                            r.RemoveModifierByName("modifier_imba_boulder_smash_push");
                            r.RemoveModifierByName("modifier_imba_geomagnetic_grip_pull");
                            let mod = r.AddNewModifier(r, this, "modifier_imba_boulder_smash_push", {}) as modifier_imba_boulder_smash_push;
                            let dir = (this.GetCursorPosition() - caster.GetAbsOrigin() as Vector).Normalized();
                            mod.PassData(caster, dir);
                            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_caster.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                            ParticleManager.SetParticleControl(particle, 1, caster.GetAbsOrigin());
                            ParticleManager.ReleaseParticleIndex(particle);
                            EmitSoundOn("Hero_EarthSpirit.BoulderSmash.Target", r);
                            return true;
                        }
                    }
                    let orderTbl = {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET,
                        TargetIndex: target.entindex()
                    }
                    ExecuteOrderFromTable(orderTbl);
                    this.AddTimer(FrameTime(), () => {
                        let castMod = caster.AddNewModifier(caster, this, "modifier_imba_boulder_smash_cast_thinker", {}) as modifier_imba_boulder_smash_cast_thinker;
                        castMod.PassTarget(target, "unit");
                    });
                    return false;
                }
            } else {
                let RemnantAroundCaster = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, searchRadius + 1, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
                for (const [_, r] of GameFunc.iPair(RemnantAroundCaster)) {
                    if (r.HasModifier("modifier_imba_stone_remnant")) {
                        r.RemoveModifierByName("modifier_imba_boulder_smash_push");
                        r.RemoveModifierByName("modifier_imba_geomagnetic_grip_pull");
                        let mod = r.AddNewModifier(r, this, "modifier_imba_boulder_smash_push", {}) as modifier_imba_boulder_smash_push;
                        let dir = (this.GetCursorPosition() - caster.GetAbsOrigin() as Vector).Normalized();
                        mod.PassData(caster, dir);
                        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_caster.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                        ParticleManager.SetParticleControl(particle, 1, caster.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(particle);
                        EmitSoundOn("Hero_EarthSpirit.BoulderSmash.Target", r);
                        return true;
                    }
                }
                let RemnantAroundCursor = FindUnitsInRadius(caster.GetTeamNumber(), pointTarget, undefined, searchRadius + 1, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
                for (const [_, r] of GameFunc.iPair(RemnantAroundCursor)) {
                    if (r.HasModifier("modifier_imba_stone_remnant")) {
                        let orderTbl = {
                            UnitIndex: caster.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
                            Position: r.GetAbsOrigin()
                        }
                        ExecuteOrderFromTable(orderTbl);
                        this.AddTimer(FrameTime(), () => {
                            let castMod = caster.AddNewModifier(caster, this, "modifier_imba_boulder_smash_cast_thinker", {}) as modifier_imba_boulder_smash_cast_thinker;
                            castMod.PassTarget(r, "remnant");
                        });
                        return false;
                    }
                }
            }
        }
        return false;
    }
}
@registerModifier()
export class modifier_imba_boulder_smash_push extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public direction: any;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public casterTeam: any;
    public hitRadius: any;
    public damage: number;
    public velocity: any;
    public debuff_duration: number;
    public markStackDamage: any;
    public distance: number;
    public traveled: any;
    public hitTargets: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_target.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    PassData(rc: IBaseNpc_Plus, dir: Vector) {
        if (IsServer()) {
            this.caster = rc;
            this.direction = dir;
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.GetParentPlus().InterruptMotionControllers(false);
            this.AddTimer(FrameTime(), () => {
                this.ability = this.GetAbilityPlus();
                this.parent = this.GetParentPlus();
                this.caster = this.caster || this.GetCasterPlus();
                this.casterTeam = this.caster.GetTeamNumber();
                this.hitRadius = this.ability.GetSpecialValueFor("radius");
                this.damage = this.ability.GetSpecialValueFor("rock_damage");
                this.velocity = this.ability.GetSpecialValueFor("speed");
                this.debuff_duration = this.ability.GetSpecialValueFor("duration");
                let remnantDistance = this.ability.GetSpecialValueFor("rock_distance");
                let unitDistance = this.ability.GetSpecialValueFor("unit_distance");
                this.markStackDamage = this.ability.GetSpecialValueFor("mark_stack_damage");
                this.distance = (this.parent.HasModifier("modifier_imba_stone_remnant") && remnantDistance) || unitDistance;
                this.direction = this.direction || (this.ability.GetCursorPosition() - this.caster.GetAbsOrigin() as Vector).Normalized();
                this.traveled = 0;
                this.hitTargets = {}
                this.hitTargets[this.parent.GetEntityIndex()] = true;
                this.StartIntervalThink(FrameTime());
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.HorizontalMotion(FrameTime());
            GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), this.hitRadius, false);
            let targets = FindUnitsInRadius(this.casterTeam, this.parent.GetAbsOrigin(), undefined, this.hitRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            for (const [_, target] of GameFunc.iPair(targets)) {
                if (!this.hitTargets[target.GetEntityIndex()]) {
                    this.hitTargets[target.GetEntityIndex()] = true;
                    let damage = this.damage;
                    EmitSoundOn("Hero_EarthSpirit.BoulderSmash.Damage", target);
                    if (this.parent.HasModifier("modifier_imba_stone_remnant")) {
                        target.AddNewModifier(this.caster, this.ability, "modifier_imba_rolling_boulder_slow", {
                            duration: this.debuff_duration * (1 - target.GetStatusResistance())
                        });
                        EmitSoundOn("Hero_EarthSpirit.BoulderSmash.Silence", target);
                        let mark = target.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
                        if (mark) {
                            damage = damage + this.markStackDamage * mark.GetStackCount();
                            mark.IncrementStackCount();
                        } else {
                            target.AddNewModifier(this.caster, this.ability, "modifier_imba_earths_mark", {});
                        }
                    }
                    ApplyDamage({
                        victim: target,
                        attacker: this.caster,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.GetAbilityPlus()
                    });
                }
            }
        }
    }
    HorizontalMotion(dt: number) {
        if (IsServer()) {
            if (this.traveled < this.distance) {
                this.parent.SetAbsOrigin(this.parent.GetAbsOrigin() + this.direction * this.velocity * dt as Vector);
                this.traveled = this.traveled + this.velocity * dt;
                this.parent.SetAbsOrigin(Vector(this.parent.GetAbsOrigin().x, this.parent.GetAbsOrigin().y, GetGroundHeight(this.parent.GetAbsOrigin(), this.parent)));
            } else {
                if (!this.parent.HasModifier("modifier_imba_stone_remnant")) {
                    FindClearSpaceForUnit(this.parent, this.parent.GetAbsOrigin(), false);
                }
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_boulder_smash_cast_thinker extends BaseModifier_Plus {
    public ignoredOrders: any;
    public caster: IBaseNpc_Plus;
    public castRange: any;
    public target: IBaseNpc_Plus;
    public targetType: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.ignoredOrders = {}
            this.ignoredOrders[dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE] = true;
            this.ignoredOrders[dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY] = true;
            this.ignoredOrders[dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM] = true;
            this.ignoredOrders[dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM] = true;
            this.ignoredOrders[dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM] = true;
            this.ignoredOrders[dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO] = true;
            this.ignoredOrders[dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH] = true;
            this.caster = this.GetParentPlus();
            this.castRange = this.GetSpecialValueFor("rock_search_aoe") + GPropertyCalculate.GetCastRangeBonus(this.caster) - 20;
            this.AddTimer(FrameTime(), () => {
                if (!this.IsNull()) {
                    this.StartIntervalThink(FrameTime() * 3);
                }
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.target) {
                if (this.targetType == "remnant") {
                    if (CalcDistanceBetweenEntityOBB(this.caster, this.target) <= this.castRange) {
                        this.caster.Interrupt();
                        if (this.target.HasModifier("modifier_imba_stone_remnant")) {
                            this.caster.CastAbilityOnPosition(this.caster.GetAbsOrigin() + this.caster.GetForwardVector() * 10 as Vector, this.GetAbilityPlus(), this.caster.GetPlayerOwnerID());
                        } else {
                            this.caster.CastAbilityOnTarget(this.target, this.GetAbilityPlus(), this.caster.GetPlayerOwnerID());
                        }
                        this.Destroy();
                    }
                } else if (this.targetType == "unit") {
                    if (CalcDistanceBetweenEntityOBB(this.caster, this.target) <= this.castRange) {
                        this.caster.Interrupt();
                        if (this.target.HasModifier("modifier_imba_stone_remnant")) {
                            this.caster.CastAbilityOnPosition(this.caster.GetAbsOrigin() + this.caster.GetForwardVector() * 10 as Vector, this.GetAbilityPlus(), this.caster.GetPlayerOwnerID());
                        } else {
                            this.caster.CastAbilityOnTarget(this.target, this.GetAbilityPlus(), this.caster.GetPlayerOwnerID());
                        }
                        this.Destroy();
                    }
                } else {
                    this.Destroy();
                    return;
                }
            } else {
                this.Destroy();
                return;
            }
        }
    }
    PassTarget(target: IBaseNpc_Plus, type: string) {
        if (IsServer()) {
            this.target = target;
            this.targetType = type || "none";
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(kv: ModifierUnitEvent): void {
        if (IsServer()) {
            if (kv.unit == this.caster) {
                if (!this.ignoredOrders[kv.order_type]) {
                    this.Destroy();
                }
            }
        }
    }
}
@registerAbility()
export class imba_earth_spirit_rolling_boulder extends BaseAbility_Plus {
    IsNetherWardStealable() {
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_earth_spirit_stone_caller";
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (IsClient()) {
            return this.GetSpecialValueFor("distance");
        } else {
            return 30000;
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            EmitSoundOn("Hero_EarthSpirit.RollingBoulder.Cast", this.GetCasterPlus());
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rolling_boulder", {});
        }
    }
}
@registerModifier()
export class modifier_imba_rolling_boulder extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public casterTeam: any;
    public delay: number;
    public hitRadius: any;
    public damage: number;
    public stunDuration: any;
    public normalDistance: any;
    public normalVelocity: any;
    public remnantDistance: any;
    public remnantVelocity: any;
    public distanceOppositeToTarget: number;
    public disarmDurationPerMark: any;
    public hitRemnant: any;
    public traveled: any;
    public direction: any;
    public hitEnemies: any;
    public enchanted_hero: any;
    IsHidden(): boolean {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_earth_spirit/espirit_rollingboulder.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            if (this.delay <= 0 && this.caster.HasTalent("special_bonus_imba_earth_spirit_2")) {
                return {
                    [modifierstate.MODIFIER_STATE_ROOTED]: true,
                    [modifierstate.MODIFIER_STATE_DISARMED]: true,
                    [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
                };
            } else {
                return {
                    [modifierstate.MODIFIER_STATE_ROOTED]: true,
                    [modifierstate.MODIFIER_STATE_DISARMED]: true
                };
            }
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.ability = this.GetAbilityPlus();
            this.caster = this.GetCasterPlus();
            this.casterTeam = this.caster.GetTeamNumber();
            this.delay = this.ability.GetSpecialValueFor("delay");
            this.hitRadius = this.ability.GetSpecialValueFor("radius");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.stunDuration = this.ability.GetSpecialValueFor("stun_duration");
            this.normalDistance = this.ability.GetSpecialValueFor("distance");
            this.normalVelocity = this.ability.GetSpecialValueFor("speed");
            this.remnantDistance = this.ability.GetSpecialValueFor("rock_distance");
            this.remnantVelocity = this.ability.GetSpecialValueFor("rock_speed");
            this.distanceOppositeToTarget = this.ability.GetSpecialValueFor("opposite_to_enemy_distance");
            this.disarmDurationPerMark = this.ability.GetSpecialValueFor("disarm_duration_per_mark");
            this.hitRemnant = false;
            this.traveled = 0;
            this.direction = (this.caster.GetCursorPosition() - this.caster.GetAbsOrigin() as Vector).Normalized();
            this.hitEnemies = {}
            this.caster.EmitSound("Hero_EarthSpirit.RollingBoulder.Loop");
            this.caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL_START);
            this.AddTimer(this.delay, () => {
                this.caster.RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL_START);
                this.caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL);
                if (this.caster.HasTalent("special_bonus_imba_earth_spirit_2")) {
                    ProjectileHelper.ProjectileDodgePlus(this.caster);
                }
            });
            this.ability.SetActivated(false);
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.caster.SetForwardVector(this.direction);
            if (this.delay > 0) {
                this.delay = this.delay - FrameTime();
            } else {
                this.HorizontalMotion(FrameTime());
                GridNav.DestroyTreesAroundPoint(this.caster.GetAbsOrigin(), this.hitRadius, false);
                if (!this.hitRemnant) {
                    let RemnantFinder = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.hitRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
                    for (const [_, r] of GameFunc.iPair(RemnantFinder)) {
                        if (r.HasModifier("modifier_imba_stone_remnant")) {
                            if (r.IsRealUnit()) {
                                this.enchanted_hero = r;
                            }
                            let remnantModifier = r.findBuff<modifier_imba_stone_remnant>("modifier_imba_stone_remnant");
                            if (remnantModifier) {
                                remnantModifier.Destroy();
                            }
                            EmitSoundOn("Hero_EarthSpirit.RollingBoulder.Stone", this.caster);
                            this.hitRemnant = true;
                            this.stunDuration = this.stunDuration + this.ability.GetSpecialValueFor("rock_bonus_duration");
                            return;
                        }
                    }
                }
                let nonHeroes = FindUnitsInRadius(this.casterTeam, this.caster.GetAbsOrigin(), undefined, this.hitRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                for (const [_, nonHero] of GameFunc.iPair(nonHeroes)) {
                    if (!this.hitEnemies[nonHero.GetEntityIndex()] && !nonHero.IsRealUnit() && !nonHero.IsClone() && !nonHero.IsTempestDouble()) {
                        this.hitEnemies[nonHero.GetEntityIndex()] = true;
                        ApplyDamage({
                            victim: nonHero,
                            attacker: this.caster,
                            damage: this.damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this.GetAbilityPlus()
                        });
                    }
                }
                let heroes = FindUnitsInRadius(this.casterTeam, this.caster.GetAbsOrigin(), undefined, this.hitRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_CLOSEST, false);
                for (const [i, hero] of GameFunc.iPair(heroes)) {
                    if (!this.enchanted_hero || hero != this.enchanted_hero) {
                        ApplyDamage({
                            victim: hero,
                            attacker: this.caster,
                            damage: this.damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this.GetAbilityPlus()
                        });
                        let mark = hero.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
                        if (mark) {
                            mark.IncrementStackCount();
                            hero.AddNewModifier(this.caster, this.ability, "modifier_imba_rolling_boulder_disarm", {
                                duration: (mark.GetStackCount() * this.disarmDurationPerMark) * (1 - hero.GetStatusResistance())
                            });
                        } else {
                            hero.AddNewModifier(this.caster, this.ability, "modifier_imba_earths_mark", {});
                        }
                        let magnetizedFinder = FindUnitsInRadius(this.casterTeam, Vector(0, 0, 0), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                        for (const [_, unit] of GameFunc.iPair(magnetizedFinder)) {
                            if (unit.FindModifierByNameAndCaster("modifier_imba_magnetize", this.caster)) {
                                let mark = unit.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
                                if (mark) {
                                    mark.IncrementStackCount();
                                    unit.AddNewModifier(this.caster, this.ability, "modifier_imba_rolling_boulder_disarm", {
                                        duration: (mark.GetStackCount() * this.disarmDurationPerMark) * (1 - unit.GetStatusResistance())
                                    });
                                } else {
                                    unit.AddNewModifier(this.caster, this.ability, "modifier_imba_earths_mark", {});
                                }
                            }
                        }
                        if (this.hitRemnant) {
                            for (const [_, unit] of GameFunc.iPair(magnetizedFinder)) {
                                if (unit.FindModifierByNameAndCaster("modifier_imba_magnetize", this.caster)) {
                                    unit.AddNewModifier(this.caster, this.ability, "modifier_imba_rolling_boulder_slow", {
                                        duration: this.stunDuration * (1 - unit.GetStatusResistance())
                                    });
                                }
                            }
                        }
                        hero.AddNewModifier(this.caster, this.ability, "modifier_stunned", {
                            duration: this.stunDuration * (1 - hero.GetStatusResistance())
                        });
                        if (i == 0) {
                            EmitSoundOn("Hero_EarthSpirit.RollingBoulder.Target", hero);
                            FindClearSpaceForUnit(this.caster, hero.GetAbsOrigin() + this.direction * this.distanceOppositeToTarget as Vector, false);
                        }
                        if (i == GameFunc.GetCount(heroes)) {
                            this.Destroy();
                            return;
                        }
                    }
                }
                this.HorizontalMotion(FrameTime());
            }
        }
    }
    HorizontalMotion(dt: number) {
        if (IsServer()) {
            if (this.hitRemnant) {
                if (this.traveled < this.remnantDistance) {
                    this.caster.SetAbsOrigin(this.caster.GetAbsOrigin() + this.direction * this.remnantVelocity * dt as Vector);
                    this.traveled = this.traveled + this.remnantVelocity * dt;
                    this.caster.SetAbsOrigin(Vector(this.caster.GetAbsOrigin().x, this.caster.GetAbsOrigin().y, GetGroundHeight(this.caster.GetAbsOrigin(), this.caster)));
                } else {
                    FindClearSpaceForUnit(this.caster, this.caster.GetAbsOrigin(), false);
                    EmitSoundOn("Hero_EarthSpirit.RollingBoulder.Destroy", this.caster);
                    this.Destroy();
                }
            } else {
                if (this.traveled < this.normalDistance) {
                    this.caster.SetAbsOrigin(this.caster.GetAbsOrigin() + this.direction * this.normalVelocity * dt as Vector);
                    this.traveled = this.traveled + this.normalVelocity * dt;
                    this.caster.SetAbsOrigin(Vector(this.caster.GetAbsOrigin().x, this.caster.GetAbsOrigin().y, GetGroundHeight(this.caster.GetAbsOrigin(), this.caster)));
                } else {
                    FindClearSpaceForUnit(this.caster, this.caster.GetAbsOrigin(), false);
                    EmitSoundOn("Hero_EarthSpirit.RollingBoulder.Destroy", this.caster);
                    this.Destroy();
                }
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.caster.StopSound("Hero_EarthSpirit.RollingBoulder.Loop");
            this.caster.RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL_START);
            this.caster.RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL);
            this.caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL_END);
            this.ability.SetActivated(true);
            this.AddTimer(0.6, () => {
                this.caster.RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_ES_ROLL_END);
            });
        }
    }
}
@registerModifier()
export class modifier_imba_rolling_boulder_slow extends BaseModifier_Plus {
    public slowPcnt: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/status_fx/status_effect_earth_spirit_boulderslow.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    BeCreated(p_0: any,): void {
        this.slowPcnt = this.GetSpecialValueFor("move_slow") * -1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slowPcnt;
    }
}
@registerModifier()
export class modifier_imba_rolling_boulder_disarm extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_disarm.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
}
@registerAbility()
export class imba_earth_spirit_geomagnetic_grip extends BaseAbility_Plus {
    GetAssociatedSecondaryAbilities(): string {
        return "imba_earth_spirit_stone_caller";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (caster == target) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else if (target.IsBuilding()) {
            return UnitFilterResult.UF_FAIL_BUILDING;
        } else if (target.IsInvulnerable()) {
            return UnitFilterResult.UF_FAIL_INVULNERABLE;
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (this.GetCasterPlus() == target) {
            return "#dota_hud_error_cant_cast_on_self";
        }
        return "";
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            let remnantSearchRadius = this.GetSpecialValueFor("radius");
            let target = this.GetCursorTarget();
            let pointTarget = this.GetCursorPosition();
            let caster = this.GetCasterPlus();
            let RemnantFinder = FindUnitsInRadius(caster.GetTeamNumber(), pointTarget, undefined, remnantSearchRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
            for (const [_, r] of GameFunc.iPair(RemnantFinder)) {
                if (r.HasModifier("modifier_imba_stone_remnant")) {
                    r.RemoveModifierByName("modifier_imba_boulder_smash_push");
                    r.RemoveModifierByName("modifier_imba_geomagnetic_grip_pull");
                    let mod = r.AddNewModifier(r, this, "modifier_imba_geomagnetic_grip_pull", {}) as modifier_imba_geomagnetic_grip_pull;
                    mod.SetRealCaster(caster);
                    EmitSoundOn("Hero_EarthSpirit.GeomagneticGrip.Cast", caster);
                    EmitSoundOn("Hero_EarthSpirit.GeomagneticGrip.Target", r);
                    return true;
                }
            }
            if (target && target.GetTeamNumber() == caster.GetTeamNumber() && !target.IsBuilding() && !target.IsInvulnerable() && !target.IsPlayer()) {
                target.RemoveModifierByName("modifier_imba_boulder_smash_push");
                target.AddNewModifier(caster, this, "modifier_imba_geomagnetic_grip_pull", {});
                EmitSoundOn("Hero_EarthSpirit.GeomagneticGrip.Cast", caster);
                EmitSoundOn("Hero_EarthSpirit.GeomagneticGrip.Target", target);
                return true;
            }
        }
        return false;
    }
}
@registerModifier()
export class modifier_imba_geomagnetic_grip_pull extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public casterTeam: any;
    public hitRadius: any;
    public damage: number;
    public silenceDuration: any;
    public normalVelocity: any;
    public rootTimePerMark: any;
    public isRemnant: any;
    public direction: any;
    public distance: number;
    public traveled: any;
    public hitTargets: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_earth_spirit/espirit_geomagentic_grip_target.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    SetRealCaster(rc: IBaseNpc_Plus) {
        if (IsServer()) {
            this.caster = rc;
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.GetParentPlus().InterruptMotionControllers(false);
            this.AddTimer(FrameTime(), () => {
                this.ability = this.GetAbilityPlus();
                this.parent = this.GetParentPlus();
                this.caster = this.caster || this.GetCasterPlus();
                this.casterTeam = this.caster.GetTeamNumber();
                this.hitRadius = this.ability.GetSpecialValueFor("radius");
                this.damage = this.ability.GetSpecialValueFor("rock_damage");
                this.silenceDuration = this.ability.GetSpecialValueFor("duration");
                this.normalVelocity = this.ability.GetSpecialValueFor("speed");
                this.rootTimePerMark = this.ability.GetSpecialValueFor("root_time_per_mark");
                this.isRemnant = this.parent.HasModifier("modifier_imba_stone_remnant");
                this.direction = (this.caster.GetAbsOrigin() - this.parent.GetAbsOrigin() as Vector).Normalized();
                this.distance = CalcDistanceBetweenEntityOBB(this.parent, this.caster) - 100;
                this.traveled = 0;
                this.hitTargets = {}
                this.hitTargets[this.parent.GetEntityIndex()] = true;
                this.StartIntervalThink(FrameTime());
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.HorizontalMotion(FrameTime());
            GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), this.hitRadius, false);
            let targets = FindUnitsInRadius(this.casterTeam, this.parent.GetAbsOrigin(), undefined, this.hitRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            for (const [_, target] of GameFunc.iPair(targets)) {
                if (!this.hitTargets[target.GetEntityIndex()]) {
                    this.hitTargets[target.GetEntityIndex()] = true;
                    target.AddNewModifier(this.caster, this.ability, "modifier_imba_geomagnetic_grip_silence", {
                        duration: this.silenceDuration * (1 - target.GetStatusResistance())
                    });
                    EmitSoundOn("Hero_EarthSpirit.GeomagneticGrip.Stun", target);
                    if (this.parent.HasModifier("modifier_imba_stone_remnant")) {
                        ApplyDamage({
                            victim: target,
                            attacker: this.caster,
                            damage: this.damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this.GetAbilityPlus()
                        });
                        EmitSoundOn("Hero_EarthSpirit.GeomagneticGrip.Cast", this.caster);
                        let mark = target.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
                        if (mark) {
                            target.AddNewModifier(this.caster, this.ability, "modifier_imba_geomagnetic_grip_root", {
                                duration: (this.rootTimePerMark * mark.GetStackCount()) * (1 - target.GetStatusResistance())
                            });
                            mark.IncrementStackCount();
                        } else {
                            target.AddNewModifier(this.caster, this.ability, "modifier_imba_earths_mark", {});
                        }
                    }
                    let magnetizedFinder = FindUnitsInRadius(this.casterTeam, Vector(0, 0, 0), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                    for (const [_, unit] of GameFunc.iPair(magnetizedFinder)) {
                        if (unit.FindModifierByNameAndCaster("modifier_imba_magnetize", this.caster)) {
                            unit.AddNewModifier(this.caster, this.ability, "modifier_imba_geomagnetic_grip_silence", {
                                duration: this.silenceDuration * (1 - unit.GetStatusResistance())
                            });
                        }
                        let mark = unit.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
                        if (mark) {
                            unit.AddNewModifier(this.caster, this.ability, "modifier_imba_geomagnetic_grip_root", {
                                duration: (this.rootTimePerMark * mark.GetStackCount()) * (1 - unit.GetStatusResistance())
                            });
                            mark.IncrementStackCount();
                        } else {
                            unit.AddNewModifier(this.caster, this.ability, "modifier_imba_earths_mark", {});
                        }
                    }
                }
            }
        }
    }
    HorizontalMotion(dt: number) {
        if (IsServer()) {
            if (this.traveled < this.distance) {
                this.parent.SetAbsOrigin(this.parent.GetAbsOrigin() + this.direction * this.normalVelocity * dt as Vector);
                this.traveled = this.traveled + this.normalVelocity * dt;
                this.parent.SetAbsOrigin(Vector(this.parent.GetAbsOrigin().x, this.parent.GetAbsOrigin().y, GetGroundHeight(this.parent.GetAbsOrigin(), this.parent)));
            } else {
                if (!this.isRemnant) {
                    FindClearSpaceForUnit(this.parent, this.parent.GetAbsOrigin(), false);
                }
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_geomagnetic_grip_silence extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silenced.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_geomagnetic_grip_root extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_lone_druid/lone_druid_bear_entangle_body.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
}
@registerAbility()
export class imba_earth_spirit_magnetize extends BaseAbility_Plus {
    GetAssociatedSecondaryAbilities(): string {
        return "imba_earth_spirit_stone_caller";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let searchRadius = this.GetSpecialValueFor("rock_search_radius");
            let debuffDuration = this.GetSpecialValueFor("damage_duration");
            let caster = this.GetCasterPlus();
            EmitSoundOn("Hero_EarthSpirit.Magnetize.Cast", caster);
            let magnetize_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_earth_spirit/espirit_magnetize_pulse.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControl(magnetize_particle, 2, Vector(searchRadius, 0, 0));
            ParticleManager.ReleaseParticleIndex(magnetize_particle);
            let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, searchRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_CLOSEST, false);
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit.HasModifier("modifier_imba_magnetize")) {
                    unit.findBuff<modifier_imba_magnetize>("modifier_imba_magnetize").SetDuration(debuffDuration, true);
                } else {
                    unit.AddNewModifier(caster, this, "modifier_imba_magnetize", {
                        duration: debuffDuration
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_magnetize extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public tickInterval: any;
    public tickDamge: any;
    public refreshRadius: any;
    public remnantSearchRadius: any;
    public baseDration: any;
    public remnantNewLifespan: any;
    public markTickDamagePerSecPerStack: any;
    public markedStunDuration: any;
    public marked_damage_pct: number;
    public counter: number;
    public overhead_particle: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return !this.GetCasterPlus().HasTalent("special_bonus_imba_earth_spirit_magnetize_unpurgable");
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            this.ability = this.GetAbilityPlus();
            this.caster = this.ability.GetCaster();
            this.tickInterval = this.ability.GetSpecialValueFor("tick_cooldown");
            this.tickDamge = this.ability.GetSpecialValueFor("damage_per_second") * this.tickInterval;
            this.refreshRadius = this.ability.GetSpecialValueFor("rock_explosion_radius");
            this.remnantSearchRadius = this.ability.GetSpecialValueFor("rock_search_radius");
            this.baseDration = this.ability.GetSpecialValueFor("damage_duration");
            this.remnantNewLifespan = this.ability.GetSpecialValueFor("rock_explosion_delay");
            this.markTickDamagePerSecPerStack = this.ability.GetSpecialValueFor("mark_damage_per_sec_per_stack") * this.tickInterval;
            this.markedStunDuration = this.ability.GetSpecialValueFor("marked_stun_duration");
            this.marked_damage_pct = this.ability.GetSpecialValueFor("marked_damage_pct");
            this.counter = 0;
            this.StartIntervalThink(this.tickInterval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.counter = this.counter + 1;
            if ((this.GetParentPlus().IsRealUnit() || this.GetParentPlus().IsCreep()) && this.counter % 2 == 1) {
                this.overhead_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_visage/visage_stoneform_overhead_timer.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetCasterPlus().GetTeamNumber());
                ParticleManager.SetParticleControl(this.overhead_particle, 1, Vector(0, math.ceil(this.GetRemainingTime()), 0));
                ParticleManager.SetParticleControl(this.overhead_particle, 2, Vector(1, 0, 0));
                ParticleManager.ReleaseParticleIndex(this.overhead_particle);
            }
            let damage = this.tickDamge;
            let mark = this.parent.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
            if (mark) {
                mark.RefreshDuration();
                damage = damage + this.markTickDamagePerSecPerStack * mark.GetStackCount();
                if (this.caster.HasTalent("special_bonus_imba_earth_spirit_3")) {
                    let heal = this.caster.GetTalentValue("special_bonus_imba_earth_spirit_3") * mark.GetStackCount();
                    this.caster.Heal(heal, this.GetAbilityPlus());
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.caster, heal, undefined);
                }
            }
            ApplyDamage({
                victim: this.parent,
                attacker: this.caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.GetAbilityPlus()
            });
            EmitSoundOn("Hero_EarthSpirit.Magnetize.Debris", this.parent);
            if (this.parent.IsRealUnit()) {
                EmitSoundOn("Hero_EarthSpirit.Magnetize.Target.Tick", this.parent);
            }
            let tickParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_earth_spirit/espirit_magnetize_target.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(tickParticle, 1, Vector(this.remnantSearchRadius, this.remnantSearchRadius, this.remnantSearchRadius));
            ParticleManager.SetParticleControl(tickParticle, 2, Vector(this.remnantSearchRadius, this.remnantSearchRadius, this.remnantSearchRadius));
            ParticleManager.ReleaseParticleIndex(tickParticle);
            let remnantFinder = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.remnantSearchRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
            for (const [_, r] of GameFunc.iPair(remnantFinder)) {
                let remnantModifier = r.findBuff<modifier_imba_stone_remnant>("modifier_imba_stone_remnant");
                if (remnantModifier && !remnantModifier.exploded) {
                    let units = FindUnitsInRadius(this.caster.GetTeamNumber(), r.GetAbsOrigin(), undefined, this.refreshRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_CLOSEST, false);
                    for (const [_, unit] of GameFunc.iPair(units)) {
                        let debuff = unit.findBuff<modifier_imba_magnetize>("modifier_imba_magnetize");
                        EmitSoundOn("Hero_EarthSpirit.Magnetize.StoneBolt", this.parent);
                        let zapParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_earth_spirit/espirit_magnet_arclightning.vpcf", ParticleAttachment_t.PATTACH_POINT, this.caster);
                        ParticleManager.SetParticleControl(zapParticle, 0, r.GetAbsOrigin());
                        ParticleManager.SetParticleControlEnt(zapParticle, 1, unit, ParticleAttachment_t.PATTACH_POINT, "attach_hitloc", r.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(zapParticle);
                        if (debuff) {
                            debuff.SetDuration((debuff.GetRemainingTime() % this.tickInterval) + this.baseDration, true);
                        } else {
                            unit.AddNewModifier(this.caster, this.ability, "modifier_imba_magnetize", {
                                duration: this.baseDration
                            });
                        }
                        if (this.ability.GetAutoCastState() && this.caster.HasScepter()) {
                            FindClearSpaceForUnit(unit, r.GetAbsOrigin(), false);
                        }
                        let unitMark = unit.findBuff<modifier_imba_earths_mark>("modifier_imba_earths_mark");
                        if (unitMark) {
                            unitMark.IncrementStackCount();
                        } else {
                            unit.AddNewModifier(unit, this.ability, "modifier_imba_earths_mark", {});
                        }
                    }
                    if (mark) {
                        mark.IncrementStackCount();
                    } else {
                        mark = this.parent.AddNewModifier(this.parent, this.ability, "modifier_imba_earths_mark", {}) as modifier_imba_earths_mark;
                    }
                    remnantModifier.SetDuration(math.min(this.remnantNewLifespan, remnantModifier.GetRemainingTime()), true);
                    remnantModifier.Explode();
                    return;
                }
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            EmitSoundOn("Hero_EarthSpirit.Magnetize.End", this.parent);
        }
    }
}
@registerAbility()
export class imba_earth_spirit_petrify extends BaseAbility_Plus {
    IsNetherWardStealable() {
        return false;
    }
    IsStealable(): boolean {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (caster == target) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else if (target.IsBuilding()) {
            return UnitFilterResult.UF_FAIL_BUILDING;
        } else if (target.IsInvulnerable()) {
            return UnitFilterResult.UF_FAIL_INVULNERABLE;
        } else if (target.IsAncient()) {
            return UnitFilterResult.UF_FAIL_ANCIENT;
        } else if (target.IsMagicImmune()) {
            return UnitFilterResult.UF_FAIL_MAGIC_IMMUNE_ENEMY;
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (this.GetCasterPlus() == target) {
            return "#dota_hud_error_cant_cast_on_self";
        }
        return "";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let target = this.GetCursorTarget();
            let duration = this.GetSpecialValueFor("duration");
            EmitSoundOn("Hero_EarthSpirit.Petrify", target);
            let mod = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_stone_remnant", {
                duration: duration
            }) as modifier_imba_stone_remnant;
            mod.SetPetrify(this);
            if (target.HasModifier("modifier_imba_magnetize")) {
                target.findBuff<modifier_imba_magnetize>("modifier_imba_magnetize").SetDuration(target.FindModifierByName("modifier_imba_magnetize").GetDuration(), true);
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_earth_spirit_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_earth_spirit_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_earth_spirit_geomagnetic_grip_silence_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_earth_spirit_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_earth_spirit_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_earth_spirit_4 extends BaseModifier_Plus {
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
