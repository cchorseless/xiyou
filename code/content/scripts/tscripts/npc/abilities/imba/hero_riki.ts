
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { AStarHelper } from "../../../helper/AStarHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_riki_smoke_screen extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "riki_smoke_screen";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel);
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("area_of_effect");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_point = this.GetCursorPosition();
            let smoke_particle = "particles/units/heroes/hero_riki/riki_smokebomb.vpcf";
            let duration = this.GetSpecialValueFor("duration");
            let aoe = this.GetSpecialValueFor("area_of_effect");
            let smoke_handler = "modifier_imba_smoke_screen_handler";
            let smoke_sound = "Hero_Riki.Smoke_Screen";
            EmitSoundOnLocationWithCaster(target_point, smoke_sound, caster);
            let thinker = BaseModifier_Plus.CreateBuffThinker(caster, this, smoke_handler, {
                duration: duration,
                target_point_x: target_point.x,
                target_point_y: target_point.y
            }, target_point, caster.GetTeamNumber(), false);
            let particle = ResHelper.CreateParticleEx(smoke_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, thinker);
            ParticleManager.SetParticleControl(particle, 0, thinker.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle, 1, Vector(aoe, 0, aoe));
            this.AddTimer(duration, () => {
                ParticleManager.DestroyParticle(particle, false);
                ParticleManager.ReleaseParticleIndex(particle);
            });
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_smoke_screen_handler extends BaseModifier_Plus {
    public area_of_effect: any;
    public target_point_x: any;
    public target_point_y: any;
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_smoke_screen_debuff_miss";
    }
    GetAuraRadius(): number {
        return this.area_of_effect;
    }
    BeCreated(keys: any): void {
        this.area_of_effect = this.GetSpecialValueFor("area_of_effect");
        if (IsServer()) {
            this.target_point_x = keys.target_point_x;
            this.target_point_y = keys.target_point_y;
            this.StartIntervalThink(0.1);
            this.GetParentPlus().TempData().afflicted = {}
        }
    }
    OnIntervalThink(): void {
        let ability = this.GetAbilityPlus();
        if (!ability) {
            this.StartIntervalThink(-1);
            return;
        }
        let caster = ability.GetCasterPlus();
        let parent = this.GetParentPlus();
        let afflicted = parent.TempData<{ [k: string]: any }>().afflicted;
        let aoe = this.GetSpecialValueFor("area_of_effect");
        let max_reduction = ability.GetSpecialValueFor("max_vision_reduction_pcnt");
        let remaining_duration = this.GetRemainingTime();
        if (caster.HasTalent("special_bonus_imba_riki_5")) {
            let allies = FindUnitsInRadius(parent.GetTeamNumber(), parent.GetAbsOrigin(), undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (ally == caster) {
                    let smoke_screen_invi = caster.AddNewModifier(caster, ability, "modifier_imba_smoke_screen_invi_indicator", {}) as modifier_imba_smoke_screen_invi_indicator;
                    if (smoke_screen_invi) {
                        smoke_screen_invi.thinker = this;
                        smoke_screen_invi.pos_x = this.target_point_x;
                        smoke_screen_invi.pos_y = this.target_point_y;
                    }
                }
            }
        }
        let targets = FindUnitsInRadius(parent.GetTeamNumber(), parent.GetAbsOrigin(), undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        for (const [_, unit] of GameFunc.iPair(targets)) {
            if (!afflicted[unit.entindex() + ""]) {
                let mod = unit.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_smoke_screen_vision", {
                    duration: remaining_duration
                });
                afflicted[unit.entindex() + ""] = mod;
            } else {
                if (!afflicted[unit.entindex() + ""]) {
                    let mod = unit.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_smoke_screen_vision", {
                        duration: remaining_duration
                    });
                    afflicted[unit.entindex() + ""] = mod;
                }
                let distance = CalcDistanceBetweenEntityOBB(parent, unit);
                let stacks = math.ceil(max_reduction * (100 - (distance * 100 / aoe)) / 100) + 1;
                let isStrongest = true;
                let duplicateMods = unit.FindAllModifiersByName("modifier_imba_smoke_screen_vision");
                for (const [_, modifier] of GameFunc.iPair(duplicateMods)) {
                    if (!modifier.IsNull()) {
                        if (modifier != afflicted[unit.entindex() + ""]) {
                            if (modifier.GetStackCount() >= stacks) {
                                if (!afflicted[unit.entindex() + ""].IsNull()) {
                                    afflicted[unit.entindex() + ""].SetStackCount(0);
                                    isStrongest = false;
                                }
                                return;
                            }
                        }
                    }
                }
                if (isStrongest && !afflicted[unit.entindex() + ""].IsNull()) {
                    afflicted[unit.entindex() + ""].SetStackCount(stacks);
                }
            }
        }
        for (const [index, modifier] of GameFunc.Pair(afflicted)) {
            let unit = EntIndexToHScript(GToNumber(index) as EntityIndex);
            let distance = CalcDistanceBetweenEntityOBB(parent, unit);
            if (!modifier.IsNull()) {
                if (distance > aoe) {
                    modifier.SetStackCount(0);
                }
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let afflicted = this.GetParentPlus().TempData<{ [k: string]: any }>().afflicted;
            if (afflicted) {
                for (const [_, modifier] of GameFunc.Pair(afflicted)) {
                    if (!modifier.IsNull()) {
                        modifier.Destroy();
                    }
                }
            }
            let ability = this.GetAbilityPlus();
            let caster = ability.GetCasterPlus();
            if (caster.HasModifier("modifier_imba_smoke_screen_invi_indicator")) {
                caster.RemoveModifierByName("modifier_imba_smoke_screen_invi_indicator");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_smoke_screen_invi_indicator extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public counter: number;
    public interval: number;
    public radius: number;
    public fade_time: number;
    public fade_delay: number;
    public distance: number;
    thinker: modifier_imba_smoke_screen_handler;
    pos_x: number;
    pos_y: number;
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.counter = 0;
            this.interval = 0.1;
            this.radius = this.ability.GetSpecialValueFor("area_of_effect");
            this.fade_time = this.caster.GetTalentValue("special_bonus_imba_riki_5");
            this.fade_delay = this.fade_time / this.interval;
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        if (this.thinker) {
            this.distance = (Vector(this.pos_x, this.pos_y, 0) - this.caster.GetAbsOrigin() as Vector).Length2D();
        }
        if (this.distance > this.radius) {
            this.Destroy();
            return;
        }
        if (this.caster.HasModifier("modifier_imba_smoke_screen_invi")) {
            this.counter = 0;
            this.SetDuration(-1, true);
        } else {
            if (this.counter == 0) {
                this.SetDuration(this.fade_time, true);
            }
            this.counter = this.counter + 1;
        }
        if (this.counter >= this.fade_delay) {
            this.caster.AddNewModifier(this.caster, this.ability, "modifier_imba_smoke_screen_invi", {});
        }
    }
}
@registerModifier()
export class modifier_imba_smoke_screen_invi extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_smoke_screen_debuff_miss extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silenced.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        let ability = this.GetAbilityPlus();
        let miss_chance = ability.GetSpecialValueFor("miss_chance");
        return miss_chance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        let ability = this.GetAbilityPlus();
        let turn_slow = ability.GetSpecialValueFor("turn_rate_slow") * -1;
        return turn_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let ability = this.GetAbilityPlus();
        let slow = ability.GetSpecialValueFor("slow") * -1;
        return slow;
    }
}
@registerModifier()
export class modifier_imba_smoke_screen_vision extends BaseModifier_Plus {
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return this.GetStackCount() * -1;
    }
}
@registerAbility()
export class imba_riki_smoke_screen_723 extends BaseAbility_Plus {
    public bUpgradeResponse: any;
    public uncommon_responses: any;
    public responses: any;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnUpgrade(): void {
        if (this.GetCasterPlus().HasAbility("imba_riki_blink_strike_723") && this.GetCasterPlus().findAbliityPlus<imba_riki_blink_strike_723>("imba_riki_blink_strike_723").GetLevel() == 1 && !this.bUpgradeResponse && this.GetCasterPlus().GetUnitName().includes("riki")) {
            this.GetCasterPlus().EmitSound("riki_riki_ability_invis_04");
            this.bUpgradeResponse = true;
        }
    }
    GetCooldown(level: number): number {
        if (this.GetAbilityName() == "imba_riki_smoke_screen_723") {
            return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_riki_smokescreen_cooldown");
        } else {
            return super.GetCooldown(level);
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Riki.Smoke_Screen");
        if (this.GetCasterPlus().GetUnitName().includes("riki")) {
            if (RollPercentage(15)) {
                if (!this.uncommon_responses) {
                    this.uncommon_responses = {
                        "1": "riki_riki_ability_smokescreen_03",
                        "2": "riki_riki_ability_smokescreen_05"
                    }
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.uncommon_responses));
            } else if (RollPercentage(75)) {
                if (!this.responses) {
                    this.responses = {
                        "1": "riki_riki_ability_smokescreen_01",
                        "2": "riki_riki_ability_smokescreen_02",
                        "3": "riki_riki_ability_smokescreen_04"
                    }
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
            }
        }
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_riki_smoke_screen_723_aura", {
            duration: this.GetSpecialValueFor("duration")
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_riki_smokescreen_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_riki_smokescreen_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_riki_smokescreen_cooldown"), "modifier_special_bonus_imba_riki_smokescreen_cooldown", {});
        }
    }
}


@registerModifier()
export class modifier_imba_riki_smoke_screen_723_aura extends BaseModifier_Plus {
    public radius: number;
    public smoke_particle: any;
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.smoke_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_riki/riki_smokebomb.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.smoke_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(this.smoke_particle, 1, Vector(this.radius, this.radius, this.radius));
        this.AddParticle(this.smoke_particle, false, false, -1, false, false);
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.radius || 0;
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
        return "modifier_imba_riki_smoke_screen_723";
    }
}
@registerModifier()
export class modifier_imba_riki_smoke_screen_723 extends BaseModifier_Plus {
    public miss_rate: any;
    public remnants_movespeed_slow: number;
    public remnants_vision: any;
    public solid_turn_rate_slow: any;
    public remnants_vision_reduction: any;
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silenced.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.miss_rate = this.GetSpecialValueFor("miss_rate");
            this.remnants_movespeed_slow = this.GetSpecialValueFor("remnants_movespeed_slow") * (-1);
            this.remnants_vision = this.GetSpecialValueFor("remnants_vision");
            this.solid_turn_rate_slow = this.GetSpecialValueFor("solid_turn_rate_slow") * (-1);
        } else {
            this.miss_rate = 0;
            this.remnants_movespeed_slow = 0;
            this.remnants_vision_reduction = 0;
            this.solid_turn_rate_slow = 0;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.FIXED_DAY_VISION,
            4: GPropertyConfig.EMODIFIER_PROPERTY.FIXED_NIGHT_VISION,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.miss_rate;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.remnants_movespeed_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.FIXED_DAY_VISION)
    CC_GetFixedDayVision(): number {
        return this.remnants_vision;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.FIXED_NIGHT_VISION)
    CC_GetFixedNightVision(): number {
        return this.remnants_vision;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.solid_turn_rate_slow;
    }
}
@registerModifier()
export class modifier_imba_riki_smoke_screen_723_aura_buff extends BaseModifier_Plus {
    public radius: number;
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.radius || 0;
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
        return "modifier_imba_riki_smoke_screen_723_buff";
    }
}
@registerModifier()
export class modifier_imba_riki_smoke_screen_723_buff extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
}
@registerAbility()
export class imba_riki_blink_strike extends BaseAbility_Plus {
    public hTarget: any;
    public thinker: any;
    public tMarkedTargets: IBaseNpc_Plus[];
    public tStoredTargets: IAStarNode[];
    public index: any;
    public trail_pfx: any;
    public hCaster: IBaseNpc_Plus;
    public damage: number;
    public duration: number;
    public jump_interval_frames: number;
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
    GetAbilityTextureName(): string {
        return "riki_blink_strike";
    }
    CastFilterResultTarget(hTarget: CDOTA_BaseNPC): UnitFilterResult {
        if (hTarget != this.GetCasterPlus()) {
            return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastErrorTarget(hTarget: CDOTA_BaseNPC): string {
        if (hTarget == this.GetCasterPlus()) {
            return "#dota_hud_error_cant_cast_on_self";
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsServer()) {
            if (this.thinker || this.tMarkedTargets) {
                if (this.tStoredTargets || this.tMarkedTargets) {
                    return 25000;
                }
            }
        }
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_riki_blink_strike_cast_range");
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus();
            this.hTarget = this.GetCursorTarget();
            let hTarget = this.hTarget;
            if (this.thinker) {
                if (!this.thinker.IsNull()) {
                    this.thinker.Destroy();
                }
                this.thinker = undefined;
            }
            if (hTarget == this.GetCasterPlus()) {
                return false;
            }
            let jump_interval_frames = this.GetSpecialValueFor("jump_interval_frames");
            let cast_range = super.GetCastRange(hCaster.GetAbsOrigin(), hTarget) + GPropertyCalculate.GetCastRangeBonus(hCaster);
            let current_distance = CalcDistanceBetweenEntityOBB(hCaster, hTarget);
            if ((this.GetTalentSpecialValueFor("max_jumps") >= 1) && (current_distance > cast_range) && this.tStoredTargets) {
                this.tMarkedTargets = []
                for (const target_entindex of (this.tStoredTargets)) {
                    if (!(target_entindex.IsCaster || target_entindex.IsTarget)) {
                        this.tMarkedTargets.push(EntIndexToHScript(target_entindex.entity_index) as IBaseNpc_Plus);
                    }
                }
            } else {
                this.tMarkedTargets = undefined;
            }
            this.tStoredTargets = undefined;
            let index = DoUniqueString("index");
            this.index = index;
            let counter = 0;
            let marked_counter = 1;
            let current_target: IBaseNpc_Plus;
            let last_position = hCaster.GetAbsOrigin();
            let tMarkedTargets: IBaseNpc_Plus[];
            if (this.tMarkedTargets) {
                tMarkedTargets = this.tMarkedTargets;
                current_target = tMarkedTargets[marked_counter];
            } else {
                marked_counter = 0;
                current_target = hTarget;
            }
            this.trail_pfx = undefined;
            this.trail_pfx = ParticleManager.CreateParticleForTeam("particles/hero/riki/blink_trail.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, hCaster, hCaster.GetTeamNumber());
            ParticleManager.SetParticleControl(this.trail_pfx, 0, last_position + Vector(0, 0, 35) as Vector);
            this.AddTimer(FrameTime(), () => {
                if (this.trail_pfx) {
                    if ((index == this.index && !current_target.IsNull())) {
                        ParticleManager.SetParticleControl(this.trail_pfx, 0, last_position + Vector(0, 0, 35) as Vector);
                        counter = counter + 1;
                        let target_loc = current_target.GetAbsOrigin();
                        let distance = (last_position - target_loc as Vector).Length2D();
                        let direction = (target_loc - last_position as Vector).Normalized();
                        last_position = last_position + (direction * (distance / jump_interval_frames) * counter) as Vector;
                        ParticleManager.SetParticleControl(this.trail_pfx, 0, last_position);
                        if (counter >= jump_interval_frames) {
                            if ((marked_counter == 0) || (marked_counter >= GameFunc.GetCount(tMarkedTargets) + 1)) {
                                ParticleManager.DestroyParticle(this.trail_pfx, false);
                                ParticleManager.ReleaseParticleIndex(this.trail_pfx);
                                return;
                            } else {
                                counter = 0;
                                marked_counter = marked_counter + 1;
                                if (marked_counter > GameFunc.GetCount(tMarkedTargets)) {
                                    current_target = hTarget;
                                } else {
                                    current_target = tMarkedTargets[marked_counter];
                                }
                            }
                        }
                    } else {
                        ParticleManager.DestroyParticle(this.trail_pfx, true);
                        ParticleManager.ReleaseParticleIndex(this.trail_pfx);
                        return;
                    }
                    return FrameTime();
                } else {
                    return;
                }
            });
            return true;
        }
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
            if (this.thinker) {
                let hCaster = this.GetCasterPlus();
                this.thinker.Destroy();
                this.thinker = undefined;
                this.tStoredTargets = undefined;
                this.tMarkedTargets = undefined;
                ParticleManager.DestroyParticle(this.trail_pfx, false);
                ParticleManager.ReleaseParticleIndex(this.trail_pfx);
                this.thinker = hCaster.AddNewModifier(hCaster, this, "modifier_imba_blink_strike_thinker", {
                    target: this.hTarget.entindex()
                });
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.hCaster = this.GetCasterPlus();
            this.hTarget = this.GetCursorTarget();
            let hTarget = this.hTarget;
            if (this.hTarget.TriggerSpellAbsorb(this)) {
                return;
            }
            this.damage = this.GetSpecialValueFor("bonus_damage") || this.GetSpecialValueFor("damage");
            this.duration = this.GetTalentSpecialValueFor("duration");
            let jump_duration = 0;
            let cast_sound = "Hero_Riki.Blink_Strike";
            this.hCaster.Stop();
            if (this.tMarkedTargets) {
                let tMarkedTargets = this.tMarkedTargets;
                this.jump_interval_frames = this.GetSpecialValueFor("jump_interval_frames");
                let jump_interval_time = this.jump_interval_frames * FrameTime();
                jump_duration = GameFunc.GetCount(tMarkedTargets) * jump_interval_time + jump_interval_time;
                this.hCaster.AddNewModifier(this.hCaster, this, "modifier_imba_blink_strike_cmd", {
                    duration: jump_duration
                });
                tMarkedTargets.push(hTarget);
                for (let i = 0; i < (GameFunc.GetCount(tMarkedTargets) - 1); i++) {
                    this.AddTimer(i * jump_interval_time, () => {
                        this.DoJumpAttack(tMarkedTargets[i], tMarkedTargets[(i + 1)]);
                    });
                }
            } else {
                this.hCaster.AddNewModifier(this.hCaster, this, "modifier_imba_blink_strike_cmd", {
                    duration: FrameTime()
                });
            }
            let damage_type = this.GetAbilityDamageType();
            this.AddTimer(jump_duration, () => {
                let target_loc_forward_vector = hTarget.GetForwardVector();
                let final_pos = hTarget.GetAbsOrigin() - target_loc_forward_vector * 100 as Vector;
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_riki/riki_blink_strike.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.hCaster);
                ParticleManager.SetParticleControl(particle, 1, final_pos);
                ParticleManager.ReleaseParticleIndex(particle);
                FindClearSpaceForUnit(this.hCaster, final_pos, true);
                this.hCaster.MoveToTargetToAttack(hTarget);
                if ((hTarget.GetTeamNumber() != this.hCaster.GetTeamNumber())) {
                    ApplyDamage({
                        victim: hTarget,
                        attacker: this.hCaster,
                        damage: this.damage,
                        damage_type: damage_type
                    });
                    hTarget.AddNewModifier(this.hCaster, this, "modifier_imba_blink_strike_debuff_turn", {
                        duration: this.duration * (1 - hTarget.GetStatusResistance())
                    });
                }
                this.hCaster.SetForwardVector(target_loc_forward_vector);
                EmitSoundOn("Hero_Riki.Blink_Strike", hTarget);
                if (this.hCaster.HasTalent("special_bonus_imba_riki_1")) {
                    let smokescreen_ability = this.hCaster.findAbliityPlus<imba_riki_smoke_screen>("imba_riki_smoke_screen");
                    if (smokescreen_ability.GetLevel() >= 1) {
                        let target_point = final_pos;
                        let smoke_particle = "particles/units/heroes/hero_riki/riki_smokebomb.vpcf";
                        let duration = this.hCaster.GetTalentValue("special_bonus_imba_riki_1");
                        let aoe = smokescreen_ability.GetSpecialValueFor("area_of_effect");
                        let smoke_handler = "modifier_imba_smoke_screen_handler";
                        let smoke_sound = "Hero_Riki.Smoke_Screen";
                        EmitSoundOnLocationWithCaster(target_point, smoke_sound, this.hCaster);
                        let thinker = BaseModifier_Plus.CreateBuffThinker(this.hCaster, smokescreen_ability, smoke_handler, {
                            duration: duration,
                            target_point_x: target_point.x,
                            target_point_y: target_point.y
                        }, target_point, this.hCaster.GetTeamNumber(), false);
                        let smoke_particle_fx = ResHelper.CreateParticleEx(smoke_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, thinker);
                        ParticleManager.SetParticleControl(smoke_particle_fx, 0, thinker.GetAbsOrigin());
                        ParticleManager.SetParticleControl(smoke_particle_fx, 1, Vector(aoe, 0, aoe));
                        this.AddTimer(duration, () => {
                            ParticleManager.DestroyParticle(smoke_particle_fx, false);
                            ParticleManager.ReleaseParticleIndex(smoke_particle_fx);
                            smoke_particle_fx = undefined;
                        });
                    }
                }
            });
            this.tStoredTargets = undefined;
            this.tMarkedTargets = undefined;
            this.hTarget = undefined;
        }
    }
    DoJumpAttack(hTarget: IBaseNpc_Plus, hNextTarget: IBaseNpc_Plus) {
        this.hCaster.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        this.hCaster.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
        EmitSoundOn("Hero_Riki.Blink_Strike", hTarget);
        let target_loc = hTarget.GetAbsOrigin();
        let next_target_loc = hNextTarget.GetAbsOrigin();
        if (this.hCaster.HasTalent("special_bonus_imba_riki_1")) {
            let smokescreen_ability = this.hCaster.findAbliityPlus<imba_riki_smoke_screen>("imba_riki_smoke_screen");
            if (smokescreen_ability.GetLevel() >= 1) {
                let target_point = target_loc;
                let smoke_particle = "particles/units/heroes/hero_riki/riki_smokebomb.vpcf";
                let duration = this.hCaster.GetTalentValue("special_bonus_imba_riki_1");
                let aoe = smokescreen_ability.GetSpecialValueFor("area_of_effect");
                let smoke_handler = "modifier_imba_smoke_screen_handler";
                let smoke_sound = "Hero_Riki.Smoke_Screen";
                EmitSoundOnLocationWithCaster(target_point, smoke_sound, this.hCaster);
                let thinker = BaseModifier_Plus.CreateBuffThinker(this.hCaster, smokescreen_ability, smoke_handler, {
                    duration: duration,
                    target_point_x: target_point.x,
                    target_point_y: target_point.y
                }, target_point, this.hCaster.GetTeamNumber(), false);
                let smoke_particle_fx = ResHelper.CreateParticleEx(smoke_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, thinker);
                ParticleManager.SetParticleControl(smoke_particle_fx, 0, thinker.GetAbsOrigin());
                ParticleManager.SetParticleControl(smoke_particle_fx, 1, Vector(aoe, 0, aoe));
                this.AddTimer(duration, () => {
                    ParticleManager.DestroyParticle(smoke_particle_fx, false);
                    ParticleManager.ReleaseParticleIndex(smoke_particle_fx);
                    smoke_particle_fx = undefined;
                });
            }
        }
        let direction = (target_loc - next_target_loc as Vector).Normalized();
        if ((hTarget.GetTeamNumber() == this.hCaster.GetTeamNumber())) {
            this.hCaster.SetForwardVector(direction);
            let start_loc = target_loc + Vector(0, 0, 100) as Vector;
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_riki/riki_blink_strike.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.hCaster);
            ParticleManager.SetParticleControl(particle, 1, start_loc);
            ParticleManager.ReleaseParticleIndex(particle);
            let distance = 200 / this.jump_interval_frames;
            this.hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
            for (let i = 0; i < (this.jump_interval_frames - 1); i++) {
                this.AddTimer(FrameTime() * i, () => {
                    let location = (start_loc - direction * distance * i) as Vector;
                    this.hCaster.SetAbsOrigin(location);
                    this.hCaster.SetForwardVector(direction);
                });
            }
        } else {
            this.hCaster.SetForwardVector(direction);
            let location = target_loc - (hTarget.GetForwardVector() * 100) as Vector;
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_riki/riki_blink_strike.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.hCaster);
            ParticleManager.SetParticleControl(particle, 1, location);
            ParticleManager.ReleaseParticleIndex(particle);
            this.hCaster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_ATTACK, 1.5);
            this.hCaster.AttackOnce(hTarget, true, true, true, false, false, false, false);
            ApplyDamage({
                victim: hTarget,
                attacker: this.hCaster,
                damage: this.damage,
                damage_type: this.GetAbilityDamageType()
            });
            hTarget.AddNewModifier(this.hCaster, this, "modifier_imba_blink_strike_debuff_turn", {
                duration: this.duration * (1 - hTarget.GetStatusResistance())
            });
            this.hCaster.SetAbsOrigin(location);
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_riki_blink_strike_cast_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_riki_blink_strike_cast_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_riki_blink_strike_cast_range"), "modifier_special_bonus_imba_riki_blink_strike_cast_range", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf(): boolean {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerAbility()
export class imba_riki_blink_strike_723 extends imba_riki_blink_strike {
    GetAbilityTextureName(): string {
        return "modifier_generic_charges";
    }
}
@registerModifier()
export class modifier_imba_blink_strike_thinker extends BaseModifier_Plus {
    public hCaster: any;
    public hTarget: any;
    public hAbility: imba_riki_blink_strike;
    public jump_range: number;
    public max_jumps: any;
    public jump_interval_time: number;
    public lagg_threshold: any;
    public cast_range: number;
    public max_range: number;
    public created_flag: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuns);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(params: ModifierUnitEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetCasterPlus() && this.created_flag) {
                let activity = params.unit.GetCurrentActiveAbility();
                if (activity) {
                    if (!(activity.GetAbilityName() == "imba_riki_blink_strike")) {
                        this.hAbility.tStoredTargets = undefined;
                        this.hAbility.tMarkedTargets = undefined;
                        this.hAbility.hTarget = undefined;
                        this.hAbility.thinker = undefined;
                        this.Destroy();
                    }
                }
            }
        }
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.hCaster = this.GetCasterPlus();
            if (params.target) {
                this.hTarget = EntIndexToHScript(params.target);
            } else {
                this.Destroy();
            }
            this.hAbility = this.GetAbilityPlus();
            this.jump_range = this.hAbility.GetSpecialValueFor("jump_range") + GPropertyCalculate.GetCastRangeBonus(this.hCaster);
            this.max_jumps = this.hAbility.GetTalentSpecialValueFor("max_jumps");
            this.jump_interval_time = this.hAbility.GetSpecialValueFor("jump_interval_time");
            this.lagg_threshold = this.hAbility.GetSpecialValueFor("lagg_threshold");
            this.cast_range = this.hAbility.GetCastRange(this.hCaster.GetAbsOrigin(), this.hTarget) + GPropertyCalculate.GetCastRangeBonus(this.hCaster);
            this.max_range = this.cast_range + this.max_jumps * this.jump_range;
            this.AddTimer(FrameTime(), () => {
                this.created_flag = true;
            });
            this.OnIntervalThink();
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if ((!this.hAbility.tStoredTargets)) {
                let current_distance = CalcDistanceBetweenEntityOBB(this.hCaster, this.hTarget);
                if ((current_distance <= this.max_range) || (current_distance < this.cast_range)) {
                    let tJumpableUnits = FindUnitsInRadius(this.hCaster.GetTeamNumber(), this.hCaster.GetAbsOrigin(), undefined, this.max_range, this.hAbility.GetAbilityTargetTeam(), this.hAbility.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_FARTHEST, false);
                    let graph: { [k: string]: any } = {}
                    let caster_index: number;
                    let target_index: number;
                    for (let i = 0; i < math.min(GameFunc.GetCount(tJumpableUnits), this.lagg_threshold); i++) {
                        let pos = tJumpableUnits[i].GetAbsOrigin();
                        graph[i + ""] = {}
                        graph[i + ""].x = pos.x;
                        graph[i + ""].y = pos.y;
                        graph[i + ""].entity_index = tJumpableUnits[i].entindex();
                        if ((tJumpableUnits[i] == this.hCaster)) {
                            caster_index = i;
                            graph[i + ""].IsCaster = true;
                        } else if ((tJumpableUnits[i] == this.hTarget)) {
                            target_index = i;
                            graph[i + ""].IsTarget = true;
                        }
                    }
                    if (caster_index != null) {
                        let pos = this.hCaster.GetAbsOrigin();
                        caster_index = 0;
                        graph[caster_index + ""] = {}
                        graph[caster_index + ""].x = pos.x;
                        graph[caster_index + ""].y = pos.y;
                        graph[caster_index + ""].IsCaster = true;
                    }
                    if (target_index != null) {
                        let pos = this.hTarget.GetAbsOrigin();
                        target_index = this.lagg_threshold + 1;
                        graph[target_index + ""] = {}
                        graph[target_index + ""].x = pos.x;
                        graph[target_index + ""].y = pos.y;
                        graph[target_index + ""].IsTarget = true;
                    }
                    let path = new AStarHelper.AStar().path(graph[caster_index + ""], graph[target_index + ""], graph, true, (node, neighbor) => {
                        if ((node.IsCaster && (AStarHelper.distance(node.x, node.y, neighbor.x, neighbor.y) < this.cast_range)) || (AStarHelper.distance(node.x, node.y, neighbor.x, neighbor.y) < this.jump_range)) {
                            return true;
                        }
                        return false;
                    });
                    if (path) {
                        if ((GameFunc.GetCount(path) <= this.max_jumps + 2) && (!(GameFunc.GetCount(path) == 2))) {
                            this.hAbility.tStoredTargets = path;
                            this.StartIntervalThink(-1);
                        }
                    }
                } else {
                    this.hAbility.tStoredTargets = undefined;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_blink_strike_debuff_turn extends BaseModifier_Plus {
    public slow_pct: number;
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.slow_pct = this.GetSpecialValueFor("turn_rate_slow_pct");
        } else {
            this.slow_pct = 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.slow_pct * (-1);
    }
}
@registerModifier()
export class modifier_imba_blink_strike_cmd extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let state = {
                [modifierstate.MODIFIER_STATE_MUTED]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_DISARMED]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
            }
            return state;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        // if (this.GetParentPlus().GetUnitName() .includes("riki")) {
        //     return "backstab";
        // }
        // return 0;
        return "backstab";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_riki_cloak_and_dagger extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "riki_permanent_invisibility";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_riki_3")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
        }
    }
    IsRefreshable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_riki_cloak_and_dagger";
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        this.EndCooldown();
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_riki_3") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_riki_3").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_riki_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_riki_3", {});
        }
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasTalent("special_bonus_imba_riki_3")) {
                let particle = ResHelper.CreateParticleEx("particles/hero/riki/riki_peek_a_boo_active.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                ParticleManager.SetParticleControlEnt(particle, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle, 2, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle, 3, caster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, "follow_hitloc", caster.GetAbsOrigin(), true);
                EmitSoundOn("Hero_Riki.Blink_Strike", caster);
                caster.AddNewModifier(caster, this, "modifier_imba_riki_peek_a_boo", {
                    duration: caster.GetTalentValue("special_bonus_imba_riki_3", "duration")
                });
            }
            this.EndCooldown();
            this.StartCooldown(caster.GetTalentValue("special_bonus_imba_riki_3", "duration"));
        }
    }
}

@registerModifier()
export class modifier_imba_riki_cloak_and_dagger extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_riki_invisibility")) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_riki_invisibility");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (!this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("hp_regen");
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer() && this.GetAbilityPlus() && this.GetAbilityPlus().IsTrained()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let fade_time = ability.GetTalentSpecialValueFor("fade_time");
            if (parent.PassivesDisabled()) {
                if (parent.HasModifier("modifier_imba_riki_invisibility")) {
                    parent.RemoveModifierByName("modifier_imba_riki_invisibility");
                }
                if (ability.GetCooldownTimeRemaining() < fade_time) {
                    ability.StartCooldown(fade_time);
                }
            } else if (ability.IsCooldownReady() || parent.HasModifier("modifier_imba_smoke_screen_invi")) {
                if (parent.HasModifier("modifier_imba_riki_peek_a_boo")) {
                    if (parent.HasModifier("modifier_imba_riki_invisibility")) {
                        parent.RemoveModifierByName("modifier_imba_riki_invisibility");
                    }
                    return;
                }
                if (!parent.HasModifier("modifier_imba_riki_invisibility")) {
                    parent.AddNewModifier(parent, ability, "modifier_imba_riki_invisibility", {});
                }
            } else if (parent.HasModifier("modifier_imba_riki_invisibility")) {
                parent.RemoveModifierByName("modifier_imba_riki_invisibility");
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target;
            let attacker = keys.attacker;
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if (parent == attacker) {
                let fade_time = ability.GetTalentSpecialValueFor("fade_time");
                let agility_multiplier = ability.GetSpecialValueFor("agility_damage_multiplier");
                let agility_multiplier_smoke = ability.GetSpecialValueFor("agility_damage_multiplier_smoke");
                let agility_multiplier_side = ability.GetSpecialValueFor("agility_damage_multiplier_side");
                let agility_multiplier_invis_break = ability.GetSpecialValueFor("invis_break_agility_multiplier");
                let backstab_sound = "Hero_Riki.Backstab";
                let backstab_invisbreak_sound = "Imba.RikiCritStab";
                let backstab_particle = "particles/units/heroes/hero_riki/riki_backstab.vpcf";
                let sucker_punch_particle = "particles/hero/riki/riki_sucker_punch.vpcf";
                let backbreak = false;
                if (!parent.HasModifier("modifier_imba_riki_tricks_of_the_trade_primary") && !target.IsBuilding() && !parent.PassivesDisabled()) {
                    if (ability.IsCooldownReady() && parent.IsInvisiblePlus()) {
                        agility_multiplier = agility_multiplier * agility_multiplier_invis_break;
                        agility_multiplier_smoke = agility_multiplier_smoke * agility_multiplier_invis_break;
                        agility_multiplier_side = agility_multiplier_side * agility_multiplier_invis_break;
                    }
                    if (parent.HasModifier("modifier_imba_riki_peek_a_boo")) {
                        agility_multiplier = agility_multiplier * parent.GetTalentValue("special_bonus_imba_riki_3");
                        agility_multiplier_smoke = agility_multiplier_smoke * parent.GetTalentValue("special_bonus_imba_riki_3");
                        agility_multiplier_side = agility_multiplier_side * parent.GetTalentValue("special_bonus_imba_riki_3");
                        backstab_particle = "particles/hero/riki/riki_peek_a_boo_stab.vpcf";
                    }
                    let victim_angle = target.GetAnglesAsVector().y;
                    let origin_difference = target.GetAbsOrigin() - attacker.GetAbsOrigin() as Vector;
                    let origin_difference_radian = math.atan2(origin_difference.y, origin_difference.x);
                    origin_difference_radian = origin_difference_radian * 180;
                    let attacker_angle = origin_difference_radian / math.pi;
                    attacker_angle = attacker_angle + 180.0 + 30.0;
                    let result_angle = attacker_angle - victim_angle;
                    result_angle = math.abs(result_angle);
                    let back_chance_success = false;
                    let back_chance = parent.GetTalentValue("special_bonus_imba_riki_8") || 0;
                    if (GFuncRandom.PRD(back_chance, this)) {
                        back_chance_success = true;
                    }
                    if (parent.HasTalent("special_bonus_imba_riki_8") && back_chance_success && target != this.GetParentPlus()) {
                        let blink_strike_ability = parent.findAbliityPlus<imba_riki_blink_strike>("imba_riki_blink_strike");
                        let turn_debuff_duration;
                        if (blink_strike_ability) {
                            turn_debuff_duration = blink_strike_ability.GetSpecialValueFor("duration");
                            target.AddNewModifier(parent, blink_strike_ability, "modifier_imba_blink_strike_debuff_turn", {
                                duration: turn_debuff_duration * (1 - target.GetStatusResistance())
                            });
                            ApplyDamage({
                                victim: target,
                                attacker: attacker,
                                damage: blink_strike_ability.GetSpecialValueFor("bonus_damage") || blink_strike_ability.GetSpecialValueFor("damage"),
                                damage_type: blink_strike_ability.GetAbilityDamageType()
                            });
                        }
                        EmitSoundOn("Hero_Riki.Blink_Strike", attacker);
                        let direction = target.GetForwardVector() * (-1);
                        let distance = parent.GetTalentValue("special_bonus_imba_riki_8", "distance");
                        let blink_point = target.GetAbsOrigin() + direction * distance as Vector;
                        attacker.SetAbsOrigin(blink_point);
                        attacker.SetForwardVector(-direction as Vector);
                        attacker.SetUnitOnClearGround();
                        let particle = ResHelper.CreateParticleEx(backstab_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                        ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(particle);
                        EmitSoundOn(backstab_sound, target);
                        if (parent.HasModifier("modifier_imba_riki_invisibility")) {
                            let sucker_particle = ResHelper.CreateParticleEx(sucker_punch_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                            ParticleManager.SetParticleControlEnt(sucker_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin() + Vector(0, 0, -100) as Vector, true);
                            ParticleManager.ReleaseParticleIndex(sucker_particle);
                            EmitSoundOn(backstab_invisbreak_sound, target);
                        }
                        if (!parent.IsIllusion()) {
                            ApplyDamage({
                                victim: target,
                                attacker: attacker,
                                damage: attacker.GetAgility() * agility_multiplier,
                                damage_type: ability.GetAbilityDamageType()
                            });
                            backbreak = true;
                        }
                        parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_riki_backstab_translation", {
                            duration: parent.GetAttackSpeed()
                        });
                        if (parent.HasTalent("special_bonus_imba_riki_1")) {
                            let smokescreen_ability = parent.findAbliityPlus<imba_riki_smoke_screen>("imba_riki_smoke_screen");
                            if (smokescreen_ability.GetLevel() >= 1) {
                                let target_point = target.GetAbsOrigin();
                                let smoke_particle = "particles/units/heroes/hero_riki/riki_smokebomb.vpcf";
                                let duration = parent.GetTalentValue("special_bonus_imba_riki_1");
                                let aoe = smokescreen_ability.GetSpecialValueFor("area_of_effect");
                                let smoke_handler = "modifier_imba_smoke_screen_handler";
                                let smoke_sound = "Hero_Riki.Smoke_Screen";
                                EmitSoundOnLocationWithCaster(target_point, smoke_sound, parent);
                                let thinker = BaseModifier_Plus.CreateBuffThinker(parent, smokescreen_ability, smoke_handler, {
                                    duration: duration,
                                    target_point_x: target_point.x,
                                    target_point_y: target_point.y
                                }, target_point, parent.GetTeamNumber(), false);
                                let smoke_particle_fx = ResHelper.CreateParticleEx(smoke_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, thinker);
                                ParticleManager.SetParticleControl(smoke_particle_fx, 0, thinker.GetAbsOrigin());
                                ParticleManager.SetParticleControl(smoke_particle_fx, 1, Vector(aoe, 0, aoe));
                                this.AddTimer(duration, () => {
                                    ParticleManager.DestroyParticle(smoke_particle_fx, false);
                                    ParticleManager.ReleaseParticleIndex(smoke_particle_fx);
                                    smoke_particle_fx = undefined;
                                });
                            }
                        }
                    } else if (result_angle >= (180 - (ability.GetSpecialValueFor("backstab_angle") / 2)) && result_angle <= (180 + (ability.GetSpecialValueFor("backstab_angle") / 2))) {
                        let particle = ResHelper.CreateParticleEx(backstab_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                        ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(particle);
                        EmitSoundOn(backstab_sound, target);
                        if (parent.HasModifier("modifier_imba_riki_invisibility")) {
                            let sucker_particle = ResHelper.CreateParticleEx(sucker_punch_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                            ParticleManager.SetParticleControlEnt(sucker_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin() + Vector(0, 0, -100) as Vector, true);
                            ParticleManager.ReleaseParticleIndex(sucker_particle);
                            EmitSoundOn(backstab_invisbreak_sound, target);
                        }
                        if (!parent.IsIllusion()) {
                            ApplyDamage({
                                victim: target,
                                attacker: attacker,
                                damage: attacker.GetAgility() * agility_multiplier,
                                damage_type: ability.GetAbilityDamageType()
                            });
                            backbreak = true;
                        }
                        parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_riki_backstab_translation", {
                            duration: parent.GetAttackSpeed()
                        });
                    } else if (target.HasModifier("modifier_imba_smoke_screen_debuff_miss")) {
                        let particle = ResHelper.CreateParticleEx(backstab_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                        ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(particle);
                        EmitSoundOn(backstab_sound, target);
                        if (parent.HasModifier("modifier_imba_riki_invisibility")) {
                            let sucker_particle = ResHelper.CreateParticleEx(sucker_punch_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                            ParticleManager.SetParticleControlEnt(sucker_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin() + Vector(0, 0, -100) as Vector, true);
                            ParticleManager.ReleaseParticleIndex(sucker_particle);
                            EmitSoundOn(backstab_invisbreak_sound, target);
                        }
                        if (!parent.IsIllusion()) {
                            ApplyDamage({
                                victim: target,
                                attacker: attacker,
                                damage: attacker.GetAgility() * agility_multiplier_smoke,
                                damage_type: ability.GetAbilityDamageType()
                            });
                            backbreak = true;
                        }
                        parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_riki_backstab_translation", {
                            duration: parent.GetAttackSpeed()
                        });
                    } else if (parent.HasTalent("special_bonus_imba_riki_4") && result_angle >= (180 - (parent.GetTalentValue("special_bonus_imba_riki_4", "sidestab_angle") / 2)) && result_angle <= (180 + (parent.GetTalentValue("special_bonus_imba_riki_4", "sidestab_angle") / 2))) {
                        let particle = ResHelper.CreateParticleEx(backstab_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                        ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(particle);
                        EmitSoundOn(backstab_sound, target);
                        if (parent.HasModifier("modifier_imba_riki_invisibility")) {
                            let sucker_particle = ResHelper.CreateParticleEx(sucker_punch_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                            ParticleManager.SetParticleControlEnt(sucker_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin() + Vector(0, 0, -100) as Vector, true);
                            ParticleManager.ReleaseParticleIndex(sucker_particle);
                            EmitSoundOn(backstab_invisbreak_sound, target);
                        }
                        if (!parent.IsIllusion()) {
                            ApplyDamage({
                                victim: target,
                                attacker: attacker,
                                damage: attacker.GetAgility() * agility_multiplier_side,
                                damage_type: ability.GetAbilityDamageType()
                            });
                            backbreak = true;
                        }
                        parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_riki_backstab_translation", {
                            duration: parent.GetAttackSpeed()
                        });
                    }
                    let backbreaker_mod = target.findBuff<modifier_imba_riki_backbreaker>("modifier_imba_riki_backbreaker");
                    if (backbreak) {
                        if (backbreaker_mod) {
                            backbreaker_mod.ForceRefresh();
                        } else {
                            backbreaker_mod = target.AddNewModifier(parent, ability, "modifier_imba_riki_backbreaker", {
                                duration: parent.GetTalentValue("special_bonus_imba_riki_7", "duration") * (1 - target.GetStatusResistance())
                            }) as modifier_imba_riki_backbreaker;
                        }
                    } else {
                        if (backbreaker_mod) {
                            backbreaker_mod.Destroy();
                        }
                    }
                }
                if (parent.HasModifier("modifier_imba_smoke_screen_invi")) {
                    parent.RemoveModifierByName("modifier_imba_smoke_screen_invi");
                }
                if (ability.GetCooldownTimeRemaining() < fade_time) {
                    ability.StartCooldown(fade_time);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_riki_invisibility extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        let particle = ResHelper.CreateParticleEx("particles/generic_hero_status/status_invisibility_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(particle);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        if (IsClient()) {
            return 1;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let state = {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: true
            }
            return state;
        }
    }
}
@registerModifier()
export class modifier_imba_riki_backstab_translation extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        // if (this.GetParentPlus().GetUnitName() .includes("riki")) {
        //     return "backstab";
        // }
        return "backstab";
    }
}
@registerModifier()
export class modifier_imba_riki_peek_a_boo extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_riki_backbreaker extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.SetStackCount(1);
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            this.IncrementStackCount();
            if (this.GetStackCount() >= caster.GetTalentValue("special_bonus_imba_riki_7")) {
                let backbreak_particle_fx = ResHelper.CreateParticleEx("particles/hero/riki/riki_backbreaker_slash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
                ParticleManager.SetParticleControlEnt(backbreak_particle_fx, 1, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(backbreak_particle_fx);
                EmitSoundOn("Imba.RikiCritStab", parent);
                parent.AddNewModifier(caster, ability, "modifier_imba_riki_backbroken", {
                    duration: caster.GetTalentValue("special_bonus_imba_riki_7", "break_duration") * (1 - parent.GetStatusResistance())
                });
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_riki_backbroken extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        };
    }
}
@registerAbility()
export class imba_riki_tricks_of_the_trade extends BaseAbility_Plus {
    public target: IBaseNpc_Plus;
    public channel_start_time: number;
    public TricksParticle: any;
    GetAbilityTextureName(): string {
        return "riki_tricks_of_the_trade";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetAbilityName() == "imba_riki_tricks_of_the_trade") {
            if (this.GetCasterPlus().HasScepter()) {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
            } else {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
            }
        } else if (this.GetAbilityName() == "imba_riki_tricks_of_the_trade_723") {
            if (this.GetCasterPlus().HasScepter()) {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
            } else {
                if (IsServer()) {
                    return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
                } else {
                    return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
                }
            }
        }
    }
    IsNetherWardStealable() {
        return false;
    }
    GetChannelTime(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_duration");
        } else {
            return this.GetSpecialValueFor("channel_duration");
        }
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_cast_range");
        }
        return this.GetSpecialValueFor("area_of_effect");
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("area_of_effect");
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().HasScepter() && this.GetCursorTarget() && this.GetCursorTarget() != this.GetCasterPlus()) {
            this.target = this.GetCursorTarget();
            this.GetCasterPlus().SetCursorCastTarget(this.GetCasterPlus());
        } else if (this.GetCursorTarget() && this.GetCursorTarget() == this.GetCasterPlus()) {
            this.GetCasterPlus().SetCursorCastTarget(undefined);
            this.GetCasterPlus().CastAbilityOnPosition(this.GetCasterPlus().GetAbsOrigin(), this, this.GetCasterPlus().GetPlayerID());
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        this.target = undefined;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let origin = caster.GetAbsOrigin();
        if (this.GetAbilityName() == "imba_riki_tricks_of_the_trade_723") {
            origin = this.GetCursorPosition();
            this.GetCasterPlus().SetAbsOrigin(origin);
        }
        let aoe = this.GetSpecialValueFor("area_of_effect");
        let target = this.GetCursorTarget();
        this.channel_start_time = GameRules.GetGameTime();
        if (caster.HasScepter() && this.target && !this.target.IsNull()) {
            origin = this.target.GetAbsOrigin();
        }
        caster.AddNewModifier(caster, this, "modifier_imba_riki_tricks_of_the_trade_primary", {});
        caster.AddNewModifier(caster, this, "modifier_imba_riki_tricks_of_the_trade_secondary", {});
        let cast_particle = "particles/units/heroes/hero_riki/riki_tricks_cast.vpcf";
        let tricks_particle = "particles/units/heroes/hero_riki/riki_tricks.vpcf";
        let cast_sound = "Hero_Riki.TricksOfTheTrade.Cast";
        let continous_sound = "Hero_Riki.TricksOfTheTrade";
        let buttsecks_sound = "Imba.RikiSurpriseButtsex";
        let heroes = FindUnitsInRadius(caster.GetTeamNumber(), origin, undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(heroes) >= PlayerResource.GetPlayerCount() * 0.35 && this.GetAbilityName() == "imba_riki_tricks_of_the_trade") {
            EmitSoundOn(buttsecks_sound, caster);
        }
        EmitSoundOnLocationWithCaster(origin, cast_sound, caster);
        EmitSoundOn(continous_sound, caster);
        let caster_loc = caster.GetAbsOrigin();
        let cast_particleid = ResHelper.CreateParticleEx(cast_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(cast_particleid, 0, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(cast_particleid);
        this.TricksParticle = ResHelper.CreateParticleEx(tricks_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(this.TricksParticle, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.TricksParticle, 1, Vector(aoe, 0, aoe));
        ParticleManager.SetParticleControl(this.TricksParticle, 2, Vector(aoe, 0, aoe));
        caster.AddNoDraw();
    }
    OnChannelThink(p_0: number,): void {
        let caster = this.GetCasterPlus();
        if (caster.HasScepter() && this.target && !this.target.IsNull()) {
            let origin = this.target.GetAbsOrigin();
            caster.SetAbsOrigin(origin);
            ParticleManager.SetParticleControl(this.TricksParticle, 0, origin);
            ParticleManager.SetParticleControl(this.TricksParticle, 3, origin);
        }
    }
    OnChannelFinish(p_0: boolean,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let backstab_ability = caster.findAbliityPlus<imba_riki_cloak_and_dagger>("imba_riki_cloak_and_dagger");
            FindClearSpaceForUnit(caster, caster.GetAbsOrigin(), true);
            caster.RemoveModifierByName("modifier_imba_riki_tricks_of_the_trade_primary");
            caster.RemoveModifierByName("modifier_imba_riki_tricks_of_the_trade_secondary");
            if (backstab_ability && backstab_ability.GetLevel() > 0) {
                backstab_ability.EndCooldown();
            }
            StopSoundEvent("Hero_Riki.TricksOfTheTrade", caster);
            if (this.GetAbilityName() == "imba_riki_tricks_of_the_trade") {
                StopSoundEvent("Imba.RikiSurpriseButtsex", caster);
            }
            ParticleManager.DestroyParticle(this.TricksParticle, false);
            ParticleManager.ReleaseParticleIndex(this.TricksParticle);
            this.TricksParticle = undefined;
            let target = this.GetCursorTarget();
            caster.RemoveNoDraw();
            let end_particle = "particles/units/heroes/hero_riki/riki_tricks_end.vpcf";
            let particle = ResHelper.CreateParticleEx(end_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.ReleaseParticleIndex(particle);
            if (caster.HasTalent("special_bonus_imba_riki_6")) {
                let channel_time = GameRules.GetGameTime() - this.channel_start_time;
                let portion_refunded = channel_time / this.GetChannelTime();
                let new_cooldown = this.GetCooldownTimeRemaining() * (portion_refunded);
                if (new_cooldown < caster.GetTalentValue("special_bonus_imba_riki_6") && new_cooldown != 0) {
                    new_cooldown = caster.GetTalentValue("special_bonus_imba_riki_6");
                }
                this.EndCooldown();
                this.StartCooldown(new_cooldown);
            }
            this.target = undefined;
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_riki_tricks_of_the_trade_primary extends BaseModifier_Plus {
    public area_of_effect: any;
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.area_of_effect;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let state;
            if (this.GetParentPlus().HasScepter() && this.GetAbilityPlus().GetCursorTarget() == this.GetParentPlus()) {
                state = {
                    [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                    [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
                    [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
                }
            } else {
                state = {
                    [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                    [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
                    [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
                    [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
                    [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
                }
            }
            return state;
        }
    }
    BeCreated(p_0: any,): void {
        this.area_of_effect = this.GetSpecialValueFor("area_of_effect");
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let interval = ability.GetSpecialValueFor("attack_interval");
            if (this.GetAbilityPlus().GetAbilityName() == "imba_riki_tricks_of_the_trade_723") {
                if (!this.GetCasterPlus().HasScepter()) {
                    interval = this.GetAbilityPlus().GetChannelTime() / ability.GetSpecialValueFor("attack_count");
                } else {
                    interval = this.GetAbilityPlus().GetChannelTime() / ability.GetSpecialValueFor("scepter_attacks");
                }
            }
            this.OnIntervalThink();
            this.StartIntervalThink(interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let caster = ability.GetCasterPlus();
            let origin = caster.GetAbsOrigin();
            if (caster.HasScepter() && ability.GetCursorTarget()) {
                let target = ability.GetCursorTarget();
                origin = target.GetAbsOrigin();
                caster.SetAbsOrigin(origin);
            }
            let aoe = ability.GetSpecialValueFor("area_of_effect");
            let backstab_ability = caster.findAbliityPlus<imba_riki_cloak_and_dagger>("imba_riki_cloak_and_dagger") || caster.FindAbilityByName("imba_riki_cloak_and_dagger_723");
            let backstab_particle = "particles/units/heroes/hero_riki/riki_backstab.vpcf";
            let backstab_sound = "Hero_Riki.Backstab";
            let targets = FindUnitsInRadius(caster.GetTeamNumber(), origin, undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(targets) == 0 || this.GetAbilityPlus().GetAbilityName() == "imba_riki_tricks_of_the_trade_723") {
                targets = FindUnitsInRadius(caster.GetTeamNumber(), origin, undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            }
            for (const [_, unit] of GameFunc.iPair(targets)) {
                if (unit.IsAlive() && !unit.IsAttackImmune()) {
                    if (this.GetAbilityPlus().GetAbilityName() == "imba_riki_tricks_of_the_trade_723") {
                        caster.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_riki_tricks_of_the_trade_723_damage_reduction", {});
                        caster.SetForwardVector(unit.GetForwardVector());
                        caster.AttackOnce(unit, true, true, true, false, false, false, false);
                        caster.RemoveModifierByName("modifier_imba_riki_tricks_of_the_trade_723_damage_reduction");
                    } else {
                        caster.AttackOnce(unit, true, true, true, false, false, false, false);
                        if (backstab_ability && backstab_ability.GetLevel() > 0 && !this.GetParentPlus().PassivesDisabled()) {
                            let agility_damage_multiplier = backstab_ability.GetSpecialValueFor("agility_damage_multiplier");
                            let particle = ResHelper.CreateParticleEx(backstab_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit);
                            ParticleManager.SetParticleControlEnt(particle, 1, unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", unit.GetAbsOrigin(), true);
                            ParticleManager.ReleaseParticleIndex(particle);
                            EmitSoundOn(backstab_sound, unit);
                            ApplyDamage({
                                victim: unit,
                                attacker: caster,
                                damage: caster.GetAgility() * agility_damage_multiplier,
                                damage_type: backstab_ability.GetAbilityDamageType()
                            });
                            if (caster.HasTalent("special_bonus_imba_riki_7")) {
                                let backbreaker_mod = unit.findBuff<modifier_imba_riki_backbreaker>("modifier_imba_riki_backbreaker");
                                if (backbreaker_mod) {
                                    backbreaker_mod.ForceRefresh();
                                } else {
                                    backbreaker_mod = unit.AddNewModifier(caster, backstab_ability, "modifier_imba_riki_backbreaker", {
                                        duration: caster.GetTalentValue("special_bonus_imba_riki_7", "duration") * (1 - unit.GetStatusResistance())
                                    }) as modifier_imba_riki_backbreaker;
                                }
                            }
                        }
                    }
                }
                return;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_riki_tricks_of_the_trade_secondary extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let aps = parent.GetAttacksPerSecond();
            this.StartIntervalThink((1 / aps) * (1 / (this.GetSpecialValueFor("martyr_aspd_pct") * 0.01)));
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let caster = ability.GetCasterPlus();
            let parent = this.GetParentPlus();
            let origin = caster.GetAbsOrigin();
            if (caster.HasScepter() && parent) {
                let target = ability.GetCursorTarget();
                origin = target.GetAbsOrigin();
                caster.SetAbsOrigin(origin);
            }
            let aoe = ability.GetSpecialValueFor("area_of_effect");
            let backstab_ability = caster.findAbliityPlus<imba_riki_cloak_and_dagger>("imba_riki_cloak_and_dagger") || caster.FindAbilityByName("imba_riki_cloak_and_dagger_723") as IBaseAbility_Plus;
            let backstab_particle = "particles/units/heroes/hero_riki/riki_backstab.vpcf";
            let backstab_sound = "Hero_Riki.Backstab";
            let targets = FindUnitsInRadius(caster.GetTeamNumber(), origin, undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(targets) == 0 || this.GetAbilityPlus().GetAbilityName() == "imba_riki_tricks_of_the_trade_723") {
                targets = FindUnitsInRadius(caster.GetTeamNumber(), origin, undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            }
            let martyrs_mark_targets: IBaseNpc_Plus[];
            if (caster.HasTalent("special_bonus_imba_riki_2")) {
                for (const [_, unit] of GameFunc.iPair(targets)) {
                    if (unit.IsAlive() && !unit.IsAttackImmune()) {
                        let martyrs_mark_mod = unit.findBuff<modifier_imba_martyrs_mark>("modifier_imba_martyrs_mark");
                        if (martyrs_mark_mod) {
                            if (!martyrs_mark_targets) {
                                martyrs_mark_targets = []
                            }
                            martyrs_mark_targets.push(unit);
                        }
                    }
                }
            }
            if (martyrs_mark_targets) {
                let martyrs_mark_stacks;
                let martyrs_mark_target = undefined;
                let martyrs_mark_checklist: IBaseNpc_Plus[] = []
                let highest_stack = 0;
                let martyrs_mark_checked = false;
                for (let i = 0; i < GameFunc.GetCount(martyrs_mark_targets); i++) {
                    for (const [_, target] of GameFunc.iPair(martyrs_mark_targets)) {
                        martyrs_mark_checked = false;
                        let martyrs_mark_mod = target.findBuff<modifier_imba_martyrs_mark>("modifier_imba_martyrs_mark");
                        if (martyrs_mark_mod) {
                            for (const check_target of (martyrs_mark_checklist)) {
                                if (check_target == target) {
                                    martyrs_mark_checked = true;
                                }
                            }
                            if (!martyrs_mark_checked) {
                                if (martyrs_mark_mod.GetStackCount() > highest_stack) {
                                    martyrs_mark_stacks = martyrs_mark_mod.GetStackCount();
                                    highest_stack = martyrs_mark_stacks;
                                    martyrs_mark_target = target;
                                }
                            }
                        }
                    }
                    let proc_chance = (1 / GameFunc.GetCount(targets)) * (1 + martyrs_mark_stacks * caster.GetTalentValue("special_bonus_imba_riki_2") * 0.01) * 100;
                    if (RollPercentage(proc_chance) || proc_chance >= 100) {
                        this.ProcTricks(caster, ability, martyrs_mark_target, backstab_ability, backstab_particle, backstab_sound, caster.GetTalentValue("special_bonus_imba_riki_2", "duration"));
                        let aps = parent.GetAttacksPerSecond();
                        this.StartIntervalThink((1 / aps) * (1 / (this.GetSpecialValueFor("martyr_aspd_pct") * 0.01)));
                        return;
                    }
                    martyrs_mark_checklist.push(martyrs_mark_target);
                }
            }
            for (const [_, unit] of GameFunc.iPair(targets)) {
                if (unit.IsAlive() && !unit.IsAttackImmune()) {
                    this.ProcTricks(caster, ability, unit, backstab_ability, backstab_particle, backstab_sound, caster.GetTalentValue("special_bonus_imba_riki_2", "duration"));
                    let aps = parent.GetAttacksPerSecond();
                    this.StartIntervalThink((1 / aps) * (1 / (this.GetSpecialValueFor("martyr_aspd_pct") * 0.01)));
                    return;
                }
            }
        }
    }
    ProcTricks(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, backstab_ability: IBaseAbility_Plus, backstab_particle: string, backstab_sound: string, talent_duration: number) {
        if (caster.HasTalent("special_bonus_imba_riki_2")) {
            let martyrs_mark_mod = target.findBuff<modifier_imba_martyrs_mark>("modifier_imba_martyrs_mark");
            if (martyrs_mark_mod) {
                martyrs_mark_mod.ForceRefresh();
            } else {
                martyrs_mark_mod = target.AddNewModifier(caster, ability, "modifier_imba_martyrs_mark", {
                    duration: talent_duration * (1 - target.GetStatusResistance())
                }) as modifier_imba_martyrs_mark;
            }
        }
        if (this.GetAbilityPlus().GetAbilityName() == "imba_riki_tricks_of_the_trade_723") {
            caster.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_riki_tricks_of_the_trade_723_damage_reduction", {});
            caster.AttackOnce(target, true, true, true, false, false, false, false);
            caster.RemoveModifierByName("modifier_imba_riki_tricks_of_the_trade_723_damage_reduction");
        } else {
            caster.AttackOnce(target, true, true, true, false, false, false, false);
        }
        if (backstab_ability && backstab_ability.GetLevel() > 0 && !this.GetParentPlus().PassivesDisabled()) {
            let agility_damage_multiplier = backstab_ability.GetSpecialValueFor("agility_damage_multiplier");
            let particle = ResHelper.CreateParticleEx(backstab_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(particle);
            EmitSoundOn(backstab_sound, target);
            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: caster.GetAgility() * agility_damage_multiplier,
                damage_type: backstab_ability.GetAbilityDamageType()
            });
            if (caster.HasTalent("special_bonus_imba_riki_7")) {
                let backbreaker_mod = target.findBuff<modifier_imba_riki_backbreaker>("modifier_imba_riki_backbreaker");
                if (backbreaker_mod) {
                    backbreaker_mod.ForceRefresh();
                } else {
                    backbreaker_mod = target.AddNewModifier(caster, backstab_ability, "modifier_imba_riki_backbreaker", {
                        duration: caster.GetTalentValue("special_bonus_imba_riki_7", "duration") * (1 - target.GetStatusResistance())
                    }) as modifier_imba_riki_backbreaker;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_martyrs_mark extends BaseModifier_Plus {
    public particle_mark_fx: any;
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            this.particle_mark_fx = ResHelper.CreateParticleEx("particles/hero/riki/riki_martyr_dagger_start_pos.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
            ParticleManager.SetParticleControlEnt(this.particle_mark_fx, 0, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.particle_mark_fx, 1, parent, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            this.AddParticle(this.particle_mark_fx, false, false, -1, false, true);
            this.SetStackCount(1);
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.IncrementStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_riki_tricks_of_the_trade_723_damage_reduction extends BaseModifier_Plus {
    public damage_pct: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.damage_pct = this.GetSpecialValueFor("damage_pct") - 100;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_pct;
    }
}
@registerAbility()
export class imba_riki_cloak_and_dagger_723 extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_riki_cloak_and_dagger_723";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_riki_cloak_and_dagger_invis")) {
            return super.GetBehavior();
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL;
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_riki_cloak_and_dagger_723")) {
            this.GetCasterPlus().findBuff<modifier_imba_riki_cloak_and_dagger_723>("modifier_imba_riki_cloak_and_dagger_723").SetDuration(-1, false);
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_riki_cloak_and_dagger_invis") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_riki_cloak_and_dagger_invis")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_riki_cloak_and_dagger_invis"), "modifier_special_bonus_imba_riki_cloak_and_dagger_invis", {});
        }
    }
    OnToggle(): void {
    }
}
@registerModifier()
export class modifier_imba_riki_cloak_and_dagger_723 extends BaseModifier_Plus {
    public bBackstab: any;
    public backstab_particle: any;
    DestroyOnExpire(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return this.GetDuration() > 0 || this.GetAbilityPlus().GetToggleState();
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetAbilityPlus().StartCooldown(this.GetSpecialValueFor("fade_delay"));
        this.SetDuration(this.GetSpecialValueFor("fade_delay"), true);
        this.StartIntervalThink(this.GetSpecialValueFor("fade_delay"));
    }
    OnIntervalThink(): void {
        this.SetDuration(-1, true);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: this.GetDuration() <= 0 && !this.GetParentPlus().PassivesDisabled() && this.GetAbilityPlus() && !this.GetAbilityPlus().GetToggleState() && this.GetAbilityPlus().GetLevel() >= 1,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP_FOR_ENEMIES]: this.GetDuration() <= 0 && !this.GetParentPlus().IsMoving() && !this.GetParentPlus().PassivesDisabled() && this.GetAbilityPlus() && !this.GetAbilityPlus().GetToggleState() && this.GetAbilityPlus().GetLevel() >= 1
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        if (!this.IsHidden() && !this.GetParentPlus().PassivesDisabled() && !this.GetAbilityPlus().GetToggleState() && this.GetAbilityPlus() && this.GetAbilityPlus().GetLevel() >= 1) {
            return 1;
        }
    }
    // 背刺伤害 todo
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    // CC_GetModifierPreAttack_BonusDamage(keys?: { attacker: IBaseNpc_Plus, target: IBaseNpc_Plus }): number {
    //     if (keys.attacker == this.GetParentPlus() && keys.target) {
    //         if (!this.GetParentPlus().PassivesDisabled() && !keys.target.IsBuilding() && !keys.target.IsOther() && math.abs(AngleDiff(VectorToAngles(keys.target.GetForwardVector()).y, VectorToAngles(this.GetParentPlus().GetForwardVector()).y)) <= this.GetSpecialValueFor("backstab_angle")) {
    //             this.bBackstab = true;
    //             if (!this.GetParentPlus().IsIllusion() && this.GetParentPlus().GetAgility) {
    //                 return this.GetParentPlus().GetAgility() * this.GetAbilityPlus().GetTalentSpecialValueFor("damage_multiplier");
    //             }
    //         } else {
    //             this.bBackstab = false;
    //         }
    //     }
    //     return 0
    // }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            if (this.bBackstab) {
                keys.target.EmitSound("Hero_Riki.Backstab");
                this.backstab_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_riki/riki_backstab.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.target);
                ParticleManager.SetParticleControlEnt(this.backstab_particle, 1, keys.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", keys.target.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(this.backstab_particle);
            }
            if (!this.GetCasterPlus().HasTalent("special_bonus_imba_riki_cloak_and_dagger_invis") && !this.GetParentPlus().HasModifier("modifier_imba_riki_tricks_of_the_trade_primary")) {
                this.GetAbilityPlus().StartCooldown(this.GetSpecialValueFor("fade_delay"));
                this.SetDuration(this.GetSpecialValueFor("fade_delay"), true);
                this.StartIntervalThink(this.GetSpecialValueFor("fade_delay"));
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        if (this.GetDuration() <= 0 && !this.GetParentPlus().IsMoving() && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().HasModifier("modifier_imba_riki_tricks_of_the_trade_primary")) {
            return this.GetSpecialValueFor("regards_health_regen_pct");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE)
    CC_GetModifierTotalPercentageManaRegen(): number {
        if (this.GetDuration() <= 0 && !this.GetParentPlus().IsMoving() && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().HasModifier("modifier_imba_riki_tricks_of_the_trade_primary")) {
            return this.GetSpecialValueFor("regards_mana_regen_pct");
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_riki_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_3 extends BaseModifier_Plus {

    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().findAbliityPlus<imba_riki_cloak_and_dagger>("imba_riki_cloak_and_dagger")) {
            this.GetParentPlus().findAbliityPlus<imba_riki_cloak_and_dagger>("imba_riki_cloak_and_dagger").GetBehavior();
        }
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
export class modifier_special_bonus_imba_riki_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_cloak_and_dagger_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_smokescreen_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_blink_strike_cast_range extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_tricks_of_the_trade_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_riki_cloak_and_dagger_invis extends BaseModifier_Plus {
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
