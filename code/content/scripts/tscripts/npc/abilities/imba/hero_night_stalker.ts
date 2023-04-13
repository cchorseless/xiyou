
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_night_stalker_stalker_in_the_night extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_stalker_in_the_night";
    }
    IsInnateAbility() {
        return true;
    }
}
@registerModifier()
export class modifier_imba_stalker_in_the_night extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public modifier_stalker: any;
    public vision_day_loss: any;
    public vision_night_gain: any;
    public is_day: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.modifier_stalker = "modifier_imba_stalker_in_the_night";
        this.vision_day_loss = this.GetSpecialValueFor("vision_day_loss");
        this.vision_night_gain = this.GetSpecialValueFor("vision_night_gain");
        if (IsServer()) {
            if (this.caster.IsIllusion()) {
                let heroes = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_DEAD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
                for (const [_, hero] of GameFunc.iPair(heroes)) {
                    if (hero.IsRealUnit() && hero.GetUnitName() == this.caster.GetUnitName()) {
                        let modifier_stalker_handler = hero.FindModifierByName(this.modifier_stalker);
                        if (modifier_stalker_handler) {
                            let stacks = modifier_stalker_handler.GetStackCount();
                            this.SetStackCount(stacks);
                            return;
                        }
                    }
                }
            }
            this.is_day = GameRules.IsDaytime();
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let current_daytime = GameRules.IsDaytime();
            if (!current_daytime) {
                if (current_daytime == this.is_day) {
                    return undefined;
                }
                this.IncrementStackCount();
            }
            this.is_day = current_daytime;
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
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let ability = keys.ability;
            let name_ability = ability.GetAbilityName();
            let night_inducing_spells = {
                "1": "imba_night_stalker_darkness",
                "2": "luna_eclipse"
            }
            let night_spell_used = false;
            if (GameRules.IsDaytime()) {
                return undefined;
            }
            for (const [_, spell_name] of GameFunc.Pair(night_inducing_spells)) {
                if (spell_name == name_ability) {
                    night_spell_used = true;
                }
            }
            if (night_spell_used) {
                this.IncrementStackCount();
            }
        }
    }
}
@registerAbility()
export class imba_night_stalker_void extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        } else {
            return super.GetBehavior();
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!this.GetCasterPlus().HasScepter() || IsClient()) {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("radius_scepter") - GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus());
        }
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level);
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let rare_cast_response = "night_stalker_nstalk_ability_dark_08";
        let cast_response = {
            "1": "night_stalker_nstalk_ability_void_01",
            "2": "night_stalker_nstalk_ability_void_02",
            "3": "night_stalker_nstalk_ability_void_03",
            "4": "night_stalker_nstalk_ability_void_04"
        }
        let sound_cast = "Hero_Nightstalker.Void";
        let modifier_ministun = "modifier_imba_void_ministun";
        let modifier_void = "modifier_imba_void_slow";
        let modifier_darkness = "modifier_imba_darkness_night";
        let damage = ability.GetSpecialValueFor("damage");
        let ministun_duration = ability.GetSpecialValueFor("ministun_duration");
        let day_duration = ability.GetSpecialValueFor("day_duration");
        let night_pull = ability.GetSpecialValueFor("night_pull");
        let night_duration = ability.GetSpecialValueFor("night_duration");
        let night_extend = ability.GetSpecialValueFor("night_extend");
        if (RollPercentage(5)) {
            EmitSoundOnLocationForAllies(caster.GetAbsOrigin(), rare_cast_response, caster);
        } else if (RollPercentage(25)) {
            EmitSoundOnLocationForAllies(caster.GetAbsOrigin(), GFuncRandom.RandomValue(cast_response), caster);
        }
        EmitSoundOn(sound_cast, caster);
        if (target) {
            if (caster.GetTeamNumber() != target.GetTeamNumber()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return undefined;
                }
            }
            let damageTable = {
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: ability
            }
            ApplyDamage(damageTable);
            target.AddNewModifier(caster, ability, modifier_ministun, {
                duration: ministun_duration * (1 - target.GetStatusResistance())
            });
            let duration;
            if (caster.HasModifier(modifier_darkness)) {
                duration = night_duration;
            } else {
                if (GameRules.IsDaytime()) {
                    duration = day_duration;
                } else {
                    duration = night_duration;
                }
            }
            target.AddNewModifier(caster, ability, modifier_void, {
                duration: duration * (1 - target.GetStatusResistance())
            });
        } else {
            let slow_duration = day_duration;
            let stun_duration = ministun_duration;
            if (!GameRules.IsDaytime()) {
                slow_duration = night_duration;
                stun_duration = this.GetSpecialValueFor("scepter_ministun");
            }
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius_scepter"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let hit_hero = false;
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_slow", {
                    duration: slow_duration * (1 - enemy.GetStatusResistance())
                });
                let damageTable = {
                    victim: enemy,
                    attacker: this.GetCasterPlus(),
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this
                }
                ApplyDamage(damageTable);
                let stun_modifier = enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_void_ministun", {
                    duration: stun_duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_void_ministun extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_void_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public ms_slow_pct: number;
    public as_slow: any;
    public vision_reduction: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
        this.vision_reduction = this.ability.GetSpecialValueFor("vision_reduction");
        this.vision_reduction = this.vision_reduction + this.caster.GetTalentValue("special_bonus_imba_night_stalker_1");
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
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_slow * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return this.vision_reduction * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.vision_reduction * (-1);
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_night_stalker/nightstalker_void.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_night_stalker_crippling_fear extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let cooldown = super.GetCooldown(level);
        cooldown = cooldown - caster.GetTalentValue("special_bonus_imba_night_stalker_8");
        return cooldown;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_night_stalker_8") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_night_stalker_8").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_night_stalker_8")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_night_stalker_8", {});
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let cast_response = {
            "1": "night_stalker_nstalk_ability_cripfear_01",
            "2": "night_stalker_nstalk_ability_cripfear_02",
            "3": "night_stalker_nstalk_ability_cripfear_03"
        }
        let sound_cast = "Hero_Nightstalker.Trickling_Fear";
        let modifier_fear = "modifier_imba_crippling_fear_silence";
        let day_duration = ability.GetSpecialValueFor("day_duration");
        let night_duration = ability.GetSpecialValueFor("night_duration");
        EmitSoundOn(sound_cast, caster);
        if (caster.GetTeamNumber() != target.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        let duration;
        if (GameRules.IsDaytime()) {
            duration = day_duration;
        } else {
            duration = night_duration;
        }
        target.AddNewModifier(caster, ability, modifier_fear, {
            duration: duration * (1 - target.GetStatusResistance())
        });
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_crippling_fear_silence extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_fear: any;
    public modifier_fear: any;
    public day_miss_chance_pct: number;
    public night_miss_chance_pct: number;
    public radius_fear: number;
    public fear_duartion: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_fear = "Imba.CripplingFearKill";
        this.modifier_fear = "modifier_imba_crippling_fear_silence";
        this.day_miss_chance_pct = this.ability.GetSpecialValueFor("day_miss_chance_pct");
        this.night_miss_chance_pct = this.ability.GetSpecialValueFor("night_miss_chance_pct");
        this.radius_fear = this.ability.GetSpecialValueFor("radius_fear");
        this.fear_duartion = this.ability.GetSpecialValueFor("fear_duartion");
        this.day_miss_chance_pct = this.day_miss_chance_pct + this.caster.GetTalentValue("special_bonus_imba_night_stalker_2");
        this.night_miss_chance_pct = this.night_miss_chance_pct + this.caster.GetTalentValue("special_bonus_imba_night_stalker_2");
        this.fear_duartion = this.fear_duartion + this.caster.GetTalentValue("special_bonus_imba_night_stalker_4");
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.caster.HasTalent("special_bonus_imba_night_stalker_6")) {
            let state = {
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true
            }
            return state;
        }
        let state = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_HERO_KILLED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        let is_day = GameRules.IsDaytime();
        if (is_day) {
            return this.day_miss_chance_pct;
        }
        return this.night_miss_chance_pct;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target;
            if (this.parent == target) {
                if (!this.parent.IsRealUnit()) {
                    return undefined;
                }
                this.caster.StartGesture(GameActivity_t.ACT_DOTA_VICTORY);
                this.AddTimer(1, () => {
                    this.caster.FadeGesture(GameActivity_t.ACT_DOTA_VICTORY);
                });
                EmitSoundOn(this.sound_fear, this.caster);
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius_fear, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (!enemy.IsMagicImmune()) {
                        enemy.AddNewModifier(this.caster, this.ability, this.modifier_fear, {
                            duration: this.fear_duartion * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
            }
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_night_stalker/nightstalker_crippling_fear.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_night_stalker_8 extends BaseModifier_Plus {
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
@registerAbility()
export class imba_night_stalker_hunter_in_the_night extends BaseAbility_Plus {
    nightTime: boolean = false;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_hunter_in_the_night_thinker";
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let modifier_hunter = "modifier_imba_hunter_in_the_night";
        if (caster.HasModifier(modifier_hunter)) {
            let modifier_hunter_handler = caster.FindModifierByName(modifier_hunter);
            if (modifier_hunter_handler) {
                modifier_hunter_handler.ForceRefresh();
            }
        }
    }
    GetManaCost(level: number): number {
        if (this.nightTime) {
            return super.GetManaCost(level);
        } else {
            return 0;
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_night_stalker_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_night_stalker_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_night_stalker_9"), "modifier_special_bonus_imba_night_stalker_9", {});
        }
    }
}
@registerModifier()
export class modifier_imba_hunter_in_the_night_thinker extends BaseModifier_Plus {
    public ability: imba_night_stalker_hunter_in_the_night;
    public caster: IBaseNpc_Plus;
    public modifier_hunter: any;
    public modifier_day: any;
    public night_transform_response: any;
    public night_rare_transform_response: any;
    public night_rarest_transform_response: any;
    public day_transform_response: any;
    public day_rare_transform_response: any;
    public day_rarest_transform_response: any;
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
        this.ability = this.GetAbilityPlus();
        this.ability.nightTime = false;
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.modifier_hunter = "modifier_imba_hunter_in_the_night";
            this.modifier_day = "modifier_imba_hunter_in_the_night_day_model";
            this.night_transform_response = {
                "1": "night_stalker_nstalk_ability_dark_01",
                "2": "night_stalker_nstalk_ability_dark_02",
                "3": "night_stalker_nstalk_ability_dark_04",
                "4": "night_stalker_nstalk_ability_dark_05",
                "5": "night_stalker_nstalk_ability_dark_06"
            }
            this.night_rare_transform_response = "night_stalker_nstalk_ability_dark_03";
            this.night_rarest_transform_response = "night_stalker_nstalk_ability_dark_07";
            this.day_transform_response = {
                "1": "night_stalker_nstalk_dayrise_01",
                "2": "night_stalker_nstalk_dayrise_02",
                "3": "night_stalker_nstalk_dayrise_03"
            }
            this.day_rare_transform_response = "night_stalker_nstalk_dayrise_05";
            this.day_rarest_transform_response = "night_stalker_nstalk_dayrise_04";
            this.StartIntervalThink(1);
        }
    }
    OnStackCountChanged(oldStacks: number): void {
        if (this.GetStackCount() == 1) {
            this.ability.nightTime = false;
        } else {
            this.ability.nightTime = true;
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if ((!GameRules.IsDaytime()) && (!this.caster.HasModifier(this.modifier_hunter)) && this.caster.IsAlive()) {
                if (RollPercentage(5)) {
                    EmitSoundOnLocationForAllies(this.caster.GetAbsOrigin(), this.night_rarest_transform_response, this.caster);
                } else if (RollPercentage(15)) {
                    EmitSoundOnLocationForAllies(this.caster.GetAbsOrigin(), this.night_rare_transform_response, this.caster);
                } else if (RollPercentage(75)) {
                    EmitSoundOnLocationForAllies(this.caster.GetAbsOrigin(), this.night_transform_response[math.random(1, GameFunc.GetCount(this.night_transform_response))], this.caster);
                }
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_hunter, {});
                this.SetStackCount(2);
            }
            if (GameRules.IsDaytime() && this.caster.HasModifier(this.modifier_hunter) && this.caster.IsAlive()) {
                if (RollPercentage(5)) {
                    EmitSoundOnLocationForAllies(this.caster.GetAbsOrigin(), this.day_rarest_transform_response, this.caster);
                } else if (RollPercentage(15)) {
                    EmitSoundOnLocationForAllies(this.caster.GetAbsOrigin(), this.day_rare_transform_response, this.caster);
                } else {
                    EmitSoundOnLocationForAllies(this.caster.GetAbsOrigin(), this.day_transform_response[math.random(1, GameFunc.GetCount(this.day_transform_response))], this.caster);
                }
                this.caster.RemoveModifierByName(this.modifier_hunter);
                this.SetStackCount(1);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_hunter_in_the_night extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public particle_change: any;
    public particle_buff: any;
    public modifier_stalker: any;
    public normal_model: any;
    public night_model: any;
    public base_bonus_ms_pct: number;
    public base_bonus_as: number;
    public ms_increase_per_stack: number;
    public as_increase_per_stack: number;
    public particle_change_fx: any;
    public particle_buff_fx: any;
    public wings: any;
    public legs: any;
    public tail: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.particle_change = "particles/units/heroes/hero_night_stalker/nightstalker_change.vpcf";
        this.particle_buff = "particles/units/heroes/hero_night_stalker/nightstalker_night_buff.vpcf";
        this.modifier_stalker = "modifier_imba_stalker_in_the_night";
        this.normal_model = "models/heroes/nightstalker/nightstalker.vmdl";
        this.night_model = "models/heroes/nightstalker/nightstalker_night.vmdl";
        this.base_bonus_ms_pct = this.ability.GetSpecialValueFor("base_bonus_ms_pct");
        this.base_bonus_as = this.ability.GetTalentSpecialValueFor("base_bonus_as");
        this.ms_increase_per_stack = this.ability.GetSpecialValueFor("ms_increase_per_stack");
        this.as_increase_per_stack = this.ability.GetSpecialValueFor("as_increase_per_stack");
        if (IsServer()) {
            this.AddTimer(FrameTime(), () => {
                if (this.caster.IsRealUnit()) {
                    this.particle_change_fx = ResHelper.CreateParticleEx(this.particle_change, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
                    ParticleManager.SetParticleControl(this.particle_change_fx, 0, this.caster.GetAbsOrigin());
                    ParticleManager.SetParticleControl(this.particle_change_fx, 1, this.caster.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(this.particle_change_fx);
                }
            });
            this.particle_buff_fx = ResHelper.CreateParticleEx(this.particle_buff, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.caster);
            ParticleManager.SetParticleControl(this.particle_buff_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_buff_fx, 1, Vector(1, 0, 0));
            this.AddParticle(this.particle_buff_fx, false, false, -1, false, false);
            if (!this.GetAbilityPlus().IsStolen()) {
                this.caster.SetModel(this.night_model);
                this.caster.SetOriginalModel(this.night_model);
                if (this.wings) {
                    UTIL_Remove(this.wings);
                    UTIL_Remove(this.legs);
                    UTIL_Remove(this.tail);
                }
                this.wings = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    model: "models/heroes/nightstalker/nightstalker_wings_night.vmdl"
                });
                this.legs = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    model: "models/heroes/nightstalker/nightstalker_legarmor_night.vmdl"
                });
                this.tail = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    model: "models/heroes/nightstalker/nightstalker_tail_night.vmdl"
                });
                this.wings.FollowEntity(this.GetCasterPlus(), true);
                this.legs.FollowEntity(this.GetCasterPlus(), true);
                this.tail.FollowEntity(this.GetCasterPlus(), true);
            }
            this.StartIntervalThink(0.5);
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetAbilityPlus() && this.GetAbilityPlus().GetLevel() >= 1 && !GameRules.IsDaytimePlus() && !this.GetParentPlus().HasModifier("modifier_imba_darkness_night") && !this.GetParentPlus().PassivesDisabled()) {
            return {
                [modifierstate.MODIFIER_STATE_FLYING]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        let stacks = this.caster.findBuffStack(this.modifier_stalker, undefined);
        return this.ms_increase_per_stack * stacks;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        let base_bonus_ms_pct = this.base_bonus_ms_pct + this.caster.GetTalentValue("special_bonus_imba_night_stalker_3", "ms_bonus_pct");
        return base_bonus_ms_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        let stacks = this.caster.findBuffStack(this.modifier_stalker, this.caster);
        let base_bonus_as = this.base_bonus_as + this.caster.GetTalentValue("special_bonus_imba_night_stalker_3", "as_bonus");
        return (base_bonus_as + this.as_increase_per_stack * stacks);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        if (!this.GetParentPlus().PassivesDisabled() && !GameRules.IsDaytimePlus()) {
            return 1;
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.particle_change_fx = ResHelper.CreateParticleEx(this.particle_change, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
            ParticleManager.SetParticleControl(this.particle_change_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_change_fx, 1, this.caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.particle_change_fx);
            if (!this.GetAbilityPlus().IsStolen()) {
                this.caster.SetModel(this.normal_model);
                this.caster.SetOriginalModel(this.normal_model);
                if (this.wings) {
                    UTIL_Remove(this.wings);
                    UTIL_Remove(this.legs);
                    UTIL_Remove(this.tail);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_hunter_in_the_night_flying extends BaseModifier_Plus {
    public scepter: any;
    public parent: IBaseNpc_Plus;
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
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        });
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.scepter = this.GetParentPlus().HasScepter();
            this.parent = this.GetParentPlus();
            this.StartIntervalThink(FrameTime() * 3);
        }
    }
    OnIntervalThink(): void {
        AddFOWViewer(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), this.parent.GetCurrentVisionRange(), FrameTime() * 4, false);
    }
    BeDestroy(): void {
        if (IsServer()) {
            GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), 200, false);
            FindClearSpaceForUnit(this.parent, this.parent.GetAbsOrigin(), false);
            GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), 200, false);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "hunter_night";
    }
}
@registerAbility()
export class imba_night_stalker_darkness extends BaseAbility_Plus {
    IsNetherWardStealable() {
        return false;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_night_stalker_10");
    }
    OnUpgrade(): void {
        if (this.IsStolen()) {
            this.AddTimer(FrameTime(), () => {
                let caster = this.GetCasterPlus();
                let has_darkness = caster.HasAbility("imba_night_stalker_darkness");
                let scepter = caster.HasScepter();
                let is_day = GameRules.IsDaytime();
                if (!has_darkness) {
                    return undefined;
                }
                if (scepter && !is_day) {
                    let night_vision = caster.GetNightTimeVisionRange();
                    AddFOWViewer(caster.GetTeamNumber(), caster.GetAbsOrigin(), night_vision, FrameTime(), false);
                }
                return FrameTime();
            });
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "Hero_Nightstalker.Darkness";
        let particle_darkness = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
        let modifier_night = "modifier_imba_darkness_night";
        let modifier_fogivison = "modifier_imba_darkness_fogvision";
        let duration = ability.GetSpecialValueFor("duration");
        let enemy_vision_duration = ability.GetSpecialValueFor("enemy_vision_duration");
        EmitSoundOn(sound_cast, caster);
        let particle_darkness_fx = ResHelper.CreateParticleEx(particle_darkness, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(particle_darkness_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_darkness_fx, 1, caster.GetAbsOrigin());
        caster.AddNewModifier(caster, ability, modifier_night, {
            duration: duration
        });
        let enemy_heroes = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy_hero] of GameFunc.iPair(enemy_heroes)) {
            enemy_hero.AddNewModifier(caster, ability, modifier_fogivison, {
                duration: enemy_vision_duration
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_night_stalker_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_night_stalker_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_night_stalker_10"), "modifier_special_bonus_imba_night_stalker_10", {});
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this)
    }
}
@registerModifier()
export class modifier_imba_darkness_night extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public bonus_damage: number;
    public game_mode: any;
    IsPurgable(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.ability = this.GetAbilityPlus();
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
        if (IsServer()) {
            this.game_mode = GameRules.GetGameModeEntity();
            GameRules.BeginNightstalkerNight(this.GetDuration());
            this.StartIntervalThink(FrameTime() * 3);
        }
    }

    OnIntervalThink(): void {
        AddFOWViewer(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), this.parent.GetCurrentVisionRange(), FrameTime() * 3, false);
    }
    BeDestroy(): void {
        if (IsServer()) {
            FindClearSpaceForUnit(this.parent, this.parent.GetAbsOrigin(), false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "hunter_night";
    }
}
@registerModifier()
export class modifier_imba_darkness_vision extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public vision_reduction_pct: number;
    public original_base_night_vision: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.vision_reduction_pct = this.ability.GetSpecialValueFor("vision_reduction_pct");
            this.original_base_night_vision = this.parent.GetBaseNightTimeVisionRange();
            this.parent.SetNightTimeVisionRange(this.original_base_night_vision * (100 - this.vision_reduction_pct) / 100);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.parent.SetNightTimeVisionRange(this.original_base_night_vision);
        }
    }
}
@registerModifier()
export class modifier_imba_darkness_fogvision extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
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
export class imba_night_stalker_crippling_fear_720 extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public duration_day: number;
    public duration_night: number;
    public radius: number;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_night_stalker_crippling_fear_720_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            if (this.GetCasterPlus().findBuffStack("modifier_imba_night_stalker_crippling_fear_720_handler", this.GetCasterPlus()) == 0) {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
            } else {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
            }
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        }
    }
    GetAbilityTargetTeam(): DOTA_UNIT_TARGET_TEAM {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
        } else {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE;
        }
    }
    GetAbilityTargetType(): DOTA_UNIT_TARGET_TYPE {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
        } else {
            return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus().findBuffStack("modifier_imba_night_stalker_crippling_fear_720_handler", this.GetCasterPlus()) == 1) {
            return this.GetSpecialValueFor("scepter_cast_range");
        } else {
            return super.GetCastRange(location, target);
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_night_stalker_crippling_fear_720_handler", this.GetCasterPlus()) == 0) {
            return 0;
        } else {
            return this.GetSpecialValueFor("radius");
        }
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.target = this.caster;
        if (this.GetCursorTarget() != undefined) {
            this.target = this.GetCursorTarget();
        }
        this.duration_day = this.GetSpecialValueFor("duration_day");
        this.duration_night = this.GetSpecialValueFor("duration_night");
        this.radius = this.GetSpecialValueFor("radius");
        if (!IsServer()) {
            return;
        }
        if (GameRules.IsDaytime()) {
            this.target.AddNewModifier(this.caster, this, "modifier_imba_night_stalker_crippling_fear_aura_720", {
                duration: this.duration_day
            });
        } else {
            this.target.AddNewModifier(this.caster, this, "modifier_imba_night_stalker_crippling_fear_aura_720", {
                duration: this.duration_night
            });
        }
        if (this.caster.GetUnitName().includes("night_stalker") && RollPercentage(75)) {
            this.caster.EmitSound("night_stalker_nstalk_ability_cripfear_0" + RandomInt(1, 3));
        }
        this.target.EmitSound("Hero_Nightstalker.Trickling_Fear");
        this.target.EmitSound("Hero_Nightstalker.Trickling_Fear_lp");
        this.AddTimer(1.0, () => {
            if (!this.IsNull() && !this.target.IsNull()) {
                this.target.StopSound("Hero_Nightstalker.Trickling_Fear_lp");
            }
        });
    }
}
@registerModifier()
export class modifier_imba_night_stalker_crippling_fear_720_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.SetStackCount(0);
        } else {
            this.SetStackCount(1);
        }
    }
}
@registerModifier()
export class modifier_imba_night_stalker_crippling_fear_aura_720 extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public duration_day: number;
    public duration_night: number;
    public radius: number;
    public refresh_time_pct: number;
    public particle: any;
    IsPurgable(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius") * this.GetStackCount();
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
        return "modifier_imba_night_stalker_crippling_fear_720";
    }
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.duration_day = this.ability.GetSpecialValueFor("duration_day");
        this.duration_night = this.ability.GetSpecialValueFor("duration_night");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.refresh_time_pct = this.ability.GetSpecialValueFor("refresh_time_pct");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(1);
        if (this.particle) {
            ParticleManager.DestroyParticle(this.particle, true);
            ParticleManager.ReleaseParticleIndex(this.particle);
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_night_stalker/nightstalker_crippling_fear_aura.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent, this.GetCasterPlus());
        this.AddParticle(this.particle, false, false, -1, false, false);
        ParticleManager.SetParticleControl(this.particle, 1, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle, 2, Vector(this.radius, this.radius, this.radius));
        ParticleManager.SetParticleControl(this.particle, 3, this.parent.GetAbsOrigin());
        this.StartIntervalThink(FrameTime());
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_HERO_KILLED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target.GetTeam() != this.parent.GetTeam() && (keys.target.GetAbsOrigin() - this.parent.GetAbsOrigin() as Vector).Length2D() <= this.radius * this.GetStackCount() && this.parent.IsAlive()) {
            if (this.GetStackCount() == 1) {
                this.IncrementStackCount();
            }
            let new_duration = math.min(this.GetRemainingTime() + (this.duration_night * this.refresh_time_pct / 100), this.duration_night);
            if (GameRules.IsDaytime()) {
                new_duration = math.min(this.GetRemainingTime() + (this.duration_day * this.refresh_time_pct / 100), this.duration_day);
            }
            this.SetDuration(new_duration, true);
            ParticleManager.DestroyParticle(this.particle, true);
            ParticleManager.ReleaseParticleIndex(this.particle);
            this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_night_stalker/nightstalker_crippling_fear_aura.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle, 2, Vector(this.radius * this.GetStackCount(), this.radius * this.GetStackCount(), this.radius * this.GetStackCount()));
            this.AddParticle(this.particle, false, false, -1, false, false);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.radius * this.GetStackCount();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.EmitSound("Hero_Nightstalker.Trickling_Fear_end");
    }
}
@registerModifier()
export class modifier_imba_night_stalker_crippling_fear_aura_positive_720 extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_night_stalker_crippling_fear_720 extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    GetEffectName(): string {
        return "particles/units/heroes/hero_night_stalker/nightstalker_crippling_fear.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.parent = this.GetParentPlus();
        if (!IsServer()) {
            return;
        }
        this.parent.EmitSound("Hero_Nightstalker.Trickling_Fear_lp");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_night_stalker_2");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {}
        if (this.GetCasterPlus().HasScepter()) {
            state = {
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_BLOCK_DISABLED]: true,
                [modifierstate.MODIFIER_STATE_EVADE_DISABLED]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_SILENCED]: true
            }
        }
        return state;
    }
    BeDestroy(): void {
        this.parent = this.GetParentPlus();
        if (!IsServer()) {
            return;
        }
        this.parent.StopSound("Hero_Nightstalker.Trickling_Fear_lp");
        this.parent.EmitSound("Hero_Nightstalker.Trickling_Fear_end");
    }
}
@registerModifier()
export class modifier_imba_night_stalker_crippling_fear_positive_720 extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_special_bonus_imba_night_stalker_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_night_stalker_10 extends BaseModifier_Plus {
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
