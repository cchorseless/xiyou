
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus, BaseOrbAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_generic_orb_effect_lua } from "../../modifier/generic/modifier_generic_orb_effect_lua";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_drow_ranger_frost_arrows extends BaseAbility_Plus {
    public force_frost_arrow: boolean;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_frost_arrows_thinker";
    }
    GetCastRange(Location: Vector, Target: CDOTA_BaseNPC | undefined): number {
        return this.GetCasterPlus().Script_GetAttackRange();
    }
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let modifier = "modifier_imba_frost_arrows_thinker";
            let target = this.GetCursorTarget();
            this.force_frost_arrow = true;
            caster.MoveToTargetToAttack(target);
            ability.RefundManaCost();
        }
    }
}
@registerModifier()
export class modifier_imba_frost_arrows_thinker extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_drow_ranger_frost_arrows;
    public parent: IBaseNpc_Plus;
    public sound_cast: any;
    public modifier_slow: any;
    public hero_duration: number;
    public creep_duration: number;
    public attack_table: any;
    public auto_cast: any;
    public current_mana: any;
    public mana_cost: any;
    public frost_arrow_attack: any;
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
        2: Enum_MODIFIER_EVENT.ON_ATTACK,
        3: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
        4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
        5: Enum_MODIFIER_EVENT.ON_ORDER
    });
    } */
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_cast = "Hero_DrowRanger.FrostArrows";
        this.modifier_slow = "modifier_imba_frost_arrows_slow";
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
                this.hero_duration = this.ability.GetSpecialValueFor("hero_duration");
                this.creep_duration = this.ability.GetSpecialValueFor("creep_duration");
                let frost_attack = true;
                if (!this.attack_table) {
                    this.attack_table = {}
                }
                this.auto_cast = this.ability.GetAutoCastState();
                this.current_mana = this.caster.GetMana();
                this.mana_cost = this.ability.GetManaCost(-1);
                if (this.caster.IsSilenced()) {
                    frost_attack = false;
                }
                if (target.IsBuilding() || target.IsMagicImmune()) {
                    frost_attack = false;
                }
                if (!this.ability.force_frost_arrow && !this.auto_cast) {
                    frost_attack = false;
                }
                if (!this.ability.IsFullyCastable()) {
                    frost_attack = false;
                }
                if (frost_attack) {
                    this.frost_arrow_attack = true;
                    this.SetArrowAttackProjectile(this.caster, true);
                } else {
                    this.frost_arrow_attack = false;
                    this.SetArrowAttackProjectile(this.caster, false);
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
                this.ability.force_frost_arrow = undefined;
                if (!this.frost_arrow_attack) {
                    return undefined;
                }
                EmitSoundOn(this.sound_cast, this.caster);
                this.ability.UseResources(true, false, false);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.caster == attacker) {
                let instakill_chance = this.caster.GetTalentValue("special_bonus_imba_drow_ranger_2");
                if (target.IsCreep() && !target.IsAncient()) {
                    if (RollPercentage(instakill_chance)) {
                        target.Kill(this.ability, this.caster);
                    }
                }
                if (target.IsAlive() && this.frost_arrow_attack) {
                    this.ApplyFrostAttack(target);
                }
            }
        }
    }
    ApplyFrostAttack(target: IBaseNpc_Plus) {
        let duration;
        if (target.IsHero()) {
            duration = this.hero_duration;
        } else {
            duration = this.creep_duration;
        }
        if (!target.IsMagicImmune()) {
            if (!target.HasModifier(this.modifier_slow)) {
                let modifier_slow_handler = target.AddNewModifier(this.caster, this.ability, this.modifier_slow, {
                    duration: duration * (1 - target.GetStatusResistance())
                });
                if (modifier_slow_handler) {
                    modifier_slow_handler.IncrementStackCount();
                }
            } else {
                let modifier_slow_handler = target.FindModifierByName(this.modifier_slow);
                modifier_slow_handler.IncrementStackCount();
                modifier_slow_handler.SetDuration(modifier_slow_handler.GetDuration() * (1 - target.GetStatusResistance()), true);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.caster) {
            let order_type = keys.order_type;
            if (order_type != dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) {
                this.ability.force_frost_arrow = undefined;
            }
        }
    }
    SetArrowAttackProjectile(caster: IBaseNpc_Plus, frost_attack: boolean, marksmanship_attack: boolean = false) {
        if (marksmanship_attack) {
            let marksmanship_arrow = "particles/units/heroes/hero_drow/drow_marksmanship_attack.vpcf";
            if (frost_attack) {
                marksmanship_arrow = "particles/units/heroes/hero_drow/drow_marksmanship_frost_arrow.vpcf";
            }
            caster.SetRangedProjectileName(marksmanship_arrow);
            return;
        }
        let skadi_modifier = "modifier_item_imba_skadi";
        let deso_modifier = "modifier_item_imba_desolator";
        let deso_2_modifier = "modifier_item_imba_desolator_2";
        let morbid_modifier = "modifier_imba_morbid_mask";
        let mom_modifier = "modifier_imba_mask_of_madness";
        let satanic_modifier = "modifier_imba_satanic";
        let vladimir_modifier = "modifier_item_imba_vladmir";
        let vladimir_2_modifier = "modifier_item_imba_vladmir_blood";
        let skadi_projectile = "particles/items2_fx/skadi_projectile.vpcf";
        let deso_projectile = "particles/items_fx/desolator_projectile.vpcf";
        let deso_skadi_projectile = "particles/item/desolator/desolator_skadi_projectile_2.vpcf";
        let lifesteal_projectile = "particles/item/lifesteal_mask/lifesteal_particle.vpcf";
        let basic_arrow = "particles/units/heroes/hero_drow/drow_base_attack.vpcf";
        let frost_arrow = "particles/units/heroes/hero_drow/drow_frost_arrow.vpcf";
        let frost_lifesteal_projectile = "particles/hero/drow/lifesteal_arrows/drow_lifedrain_frost_arrow.vpcf";
        let frost_skadi_projectile = "particles/hero/drow/skadi_arrows/drow_skadi_frost_arrow.vpcf";
        let frost_deso_projectile = "particles/hero/drow/deso_arrows/drow_deso_frost_arrow.vpcf";
        let frost_deso_skadi_projectile = "particles/hero/drow/deso_skadi_arrows/drow_deso_skadi_frost_arrow.vpcf";
        let frost_lifesteal_skadi_projectile = "particles/hero/drow/lifesteal_skadi_arrows/drow_lifesteal_skadi_frost_arrow.vpcf";
        let frost_lifesteal_deso_projectile = "particles/hero/drow/lifesteal_deso_arrows/drow_lifedrain_deso_frost_arrow.vpcf";
        let frost_lifesteal_deso_skadi_projectile = "particles/hero/drow/lifesteal_deso_skadi_arrows/drow_lifesteal_deso_skadi_frost_arrow.vpcf";
        let has_lifesteal;
        let has_skadi;
        let has_desolator;
        if (caster.HasModifier(morbid_modifier) || caster.HasModifier(mom_modifier) || caster.HasModifier(satanic_modifier) || caster.HasModifier(vladimir_modifier) || caster.HasModifier(vladimir_2_modifier)) {
            has_lifesteal = true;
        }
        if (caster.HasModifier(skadi_modifier)) {
            has_skadi = true;
        }
        if (caster.HasModifier(deso_modifier) || caster.HasModifier(deso_2_modifier)) {
            has_desolator = true;
        }
        if (frost_attack) {
            if (has_desolator && has_skadi && has_lifesteal) {
                caster.SetRangedProjectileName(frost_lifesteal_deso_skadi_projectile);
            } else if (has_desolator && has_lifesteal) {
                caster.SetRangedProjectileName(frost_lifesteal_deso_projectile);
            } else if (has_skadi && has_desolator) {
                caster.SetRangedProjectileName(frost_deso_skadi_projectile);
            } else if (has_lifesteal && has_skadi) {
                caster.SetRangedProjectileName(frost_lifesteal_skadi_projectile);
            } else if (has_skadi) {
                caster.SetRangedProjectileName(frost_skadi_projectile);
            } else if (has_lifesteal) {
                caster.SetRangedProjectileName(frost_lifesteal_projectile);
            } else if (has_desolator) {
                caster.SetRangedProjectileName(frost_deso_projectile);
                return;
            } else {
                caster.SetRangedProjectileName(frost_arrow);
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
                caster.SetRangedProjectileName(basic_arrow);
                return;
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
export class modifier_imba_frost_arrows_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_freeze: any;
    public caster_modifier: any;
    public ms_slow_pct: number;
    public as_slow: any;
    public stacks_to_freeze: number;
    public freeze_duration: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier_freeze = "modifier_imba_frost_arrows_freeze";
        this.caster_modifier = "modifier_imba_frost_arrows_buff";
        if (this.GetAbilityPlus().GetName() == "imba_drow_ranger_frost_arrows_723") {
            this.ms_slow_pct = this.ability.GetSpecialValueFor("frost_arrows_movement_speed");
        } else {
            this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct") * (-1);
        }
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
        this.stacks_to_freeze = this.ability.GetSpecialValueFor("stacks_to_freeze");
        this.freeze_duration = this.ability.GetSpecialValueFor("freeze_duration");
    }
    OnRemoved(): void {
        if (IsServer()) {
            let target_stacks = this.GetStackCount();
            let stack_count = this.caster.findBuffStack(this.caster_modifier, this.caster);
            if (stack_count <= target_stacks) {
                this.caster.RemoveModifierByName(this.caster_modifier);
            } else {
                this.caster.SetModifierStackCount(this.caster_modifier, this.caster, stack_count - target_stacks);
            }
        }
    }
    GetTexture(): string {
        return "drow_ranger_frost_arrows";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }
    OnStackCountChanged(p_0: number,): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (stacks >= this.stacks_to_freeze) {
                this.SetStackCount(this.GetStackCount() - this.stacks_to_freeze);
                if (this.caster.HasTalent("special_bonus_imba_drow_ranger_4")) {
                    if ((this.caster.findBuffStack(this.caster_modifier, this.caster) <= this.stacks_to_freeze)) {
                        this.caster.RemoveModifierByName(this.caster_modifier);
                    } else {
                        let stack_count = this.caster.findBuffStack(this.caster_modifier, this.caster);
                        this.caster.SetModifierStackCount(this.caster_modifier, this.caster, stack_count - this.stacks_to_freeze);
                    }
                }
                this.parent.AddNewModifier(this.caster, this.ability, this.modifier_freeze, {
                    duration: this.freeze_duration * (1 - this.parent.GetStatusResistance())
                });
                EmitSoundOn("hero_Crystal.frostbite", this.parent);
            } else {
                if (this.caster.HasTalent("special_bonus_imba_drow_ranger_4") && !this.caster.HasModifier(this.caster_modifier)) {
                    this.caster.AddNewModifier(this.caster, this.ability, this.caster_modifier, {});
                    this.caster.SetModifierStackCount(this.caster_modifier, this.caster, 1);
                } else {
                    let stack_count = this.caster.findBuffStack(this.caster_modifier,);
                    this.caster.SetModifierStackCount(this.caster_modifier, this.caster, stack_count + 1);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_slow * (-1);
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
}
@registerModifier()
export class modifier_imba_frost_arrows_freeze extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN;
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
}
@registerModifier()
export class modifier_imba_frost_arrows_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public bonus_movespeed: number;
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
    });
    } */
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
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.bonus_movespeed = this.caster.GetTalentValue("special_bonus_imba_drow_ranger_4", "bonus_movespeed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.bonus_movespeed * this.GetStackCount();
    }
}
@registerAbility()
export class imba_drow_ranger_frost_arrows_723 extends BaseOrbAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_generic_orb_effect_lua";
    }
    GetProjectileName() {
        return "particles/units/heroes/hero_drow/drow_frost_arrow.vpcf";
    }
    OnOrbRecord() {
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_drow_ranger_frost_arrows_723_bonus_damage", {});
    }
    OnOrbFire() {
        this.GetCasterPlus().EmitSound("Hero_DrowRanger.FrostArrows");
    }
    OnOrbImpact(keys: ModifierAttackEvent) {
        if (!keys.target.IsMagicImmune()) {
            let modifier_slow_handler = keys.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_frost_arrows_slow", {
                duration: this.GetDuration() * (1 - keys.target.GetStatusResistance())
            });
            if (modifier_slow_handler) {
                modifier_slow_handler.IncrementStackCount();
            }
            return 1
        }
        return 0
    }
    OnOrbRecordDestroy() {
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_drow_ranger_frost_arrows_723_bonus_damage");
    }
}
@registerModifier()
export class modifier_imba_drow_ranger_frost_arrows_723_bonus_damage extends BaseModifier_Plus {
    public damage: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.damage = this.GetAbilityPlus().GetTalentSpecialValueFor("damage");
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.damage;
    }
}
@registerAbility()
export class imba_drow_ranger_deadeye extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_deadeye_aura";
    }
}
@registerModifier()
export class modifier_imba_deadeye_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public modifier_active: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.modifier_active = "modifier_imba_trueshot_active";
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            if (target == this.caster) {
                return false;
            }
            if (this.caster.HasTalent("special_bonus_imba_drow_ranger_7")) {
                if (target.IsHero()) {
                    return false;
                }
            }
            return true;
        }
    }
    GetAuraRadius(): number {
        return 25000;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_deadeye_vision";
    }
    IsAura(): boolean {
        if (this.caster.IsNull() || this.caster.PassivesDisabled()) {
            return false;
        }
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
export class modifier_imba_deadeye_vision extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public day_vision: any;
    public night_vision: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.day_vision = this.ability.GetSpecialValueFor("day_vision");
        this.night_vision = this.ability.GetSpecialValueFor("night_vision");
    }
    /** DeclareFunctions():modifierfunction[] {
    let decFunc = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
        2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
    }
    return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        let day_vision = this.day_vision;
        return day_vision;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        let night_vision = this.night_vision;
        return night_vision;
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
export class imba_drow_ranger_gust extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_drow_ranger_1")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("wave_distance") + (this.GetCasterPlus().GetTalentValue("special_bonus_imba_drow_ranger_9"));
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let target_point = this.GetCursorPosition();
        if (target_point == this.GetCasterPlus().GetAbsOrigin()) {
            target_point = this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector;
        }
        let modifier_movement = "modifier_imba_gust_movement";
        let sound_cast = "Hero_DrowRanger.Silence";
        let particle_gust = "particles/units/heroes/hero_drow/drow_silence_wave.vpcf";
        let wave_speed = ability.GetSpecialValueFor("wave_speed");
        let wave_distance = ability.GetSpecialValueFor("wave_distance") + caster.GetTalentValue("special_bonus_imba_drow_ranger_9");
        let wave_width = ability.GetSpecialValueFor("wave_width");
        let jump_speed = ability.GetSpecialValueFor("jump_speed");
        let leap_range = ability.GetSpecialValueFor("leap_range");
        EmitSoundOn(sound_cast, caster);
        if (caster.HasTalent("special_bonus_imba_drow_ranger_3")) {
            let buff_duration = caster.GetTalentValue("special_bonus_imba_drow_ranger_3", "buff_duration");
            caster.AddNewModifier(caster, ability, "modifier_imba_gust_buff", {
                duration: buff_duration
            });
        }
        if (caster == target && caster.HasTalent("special_bonus_imba_drow_ranger_1")) {
            let modifier_movement_handler = caster.AddNewModifier(caster, ability, modifier_movement, {}) as modifier_imba_gust_movement;
            if (modifier_movement_handler) {
                modifier_movement_handler.target_point = caster.GetAbsOrigin() + (caster.GetForwardVector() * wave_distance) as Vector;
            }
        }
        if (caster == target) {
            target_point = caster.GetAbsOrigin() + (caster.GetForwardVector() * wave_distance) as Vector;
        }
        this.AddTimer(FrameTime(), () => {
            let gust_projectile: CreateLinearProjectileOptions = {
                Ability: ability,
                EffectName: particle_gust,
                vSpawnOrigin: caster.GetAbsOrigin(),
                fDistance: wave_distance,
                fStartRadius: wave_width,
                fEndRadius: wave_width,
                Source: caster,
                bHasFrontalCone: false,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                // bDeleteOnHit: false,
                vVelocity: (((target_point - caster.GetAbsOrigin()) * Vector(1, 1, 0) as Vector).Normalized()) * wave_speed as Vector,
                bProvidesVision: false
            }
            ProjectileManager.CreateLinearProjectile(gust_projectile);
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let modifier_silence = "modifier_imba_gust_silence";
            let modifier_chill = "modifier_imba_frost_arrows_slow";
            let frost_arrow_ability = "imba_drow_ranger_frost_arrows";
            let knockback_duration = ability.GetSpecialValueFor("knockback_duration");
            let max_distance = ability.GetSpecialValueFor("max_distance") + caster.GetTalentValue("special_bonus_imba_drow_ranger_9");
            let silence_duration = ability.GetSpecialValueFor("silence_duration");
            let chill_duration = ability.GetSpecialValueFor("chill_duration");
            let chill_stacks = ability.GetSpecialValueFor("chill_stacks");
            let damage = ability.GetSpecialValueFor("damage");
            if (!target) {
                return undefined;
            }
            let distance = max_distance - ((target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D());
            if (distance < 0) {
                distance = 50;
            }
            let knockbackProperties = {
                center_x: caster.GetAbsOrigin().x + 1,
                center_y: caster.GetAbsOrigin().y + 1,
                center_z: caster.GetAbsOrigin().z,
                duration: knockback_duration * (1 - target.GetStatusResistance()),
                knockback_duration: knockback_duration,
                knockback_distance: distance,
                knockback_height: 0,
                should_stun: 0
            }
            target.AddNewModifier(caster, ability, "modifier_knockback", knockbackProperties);
            let damageTable = {
                victim: target,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                attacker: caster,
                ability: ability
            }
            ApplyDamage(damageTable);
            target.AddNewModifier(caster, ability, modifier_silence, {
                duration: silence_duration * (1 - target.GetStatusResistance())
            });
            if (caster.HasAbility(frost_arrow_ability) || caster.HasAbility("imba_drow_ranger_frost_arrows_723")) {
                let frost_ability = caster.FindAbilityByName(frost_arrow_ability) || caster.findAbliityPlus<imba_drow_ranger_frost_arrows_723>("imba_drow_ranger_frost_arrows_723");
                if (frost_ability.GetLevel() > 0) {
                    if (!target.HasModifier(modifier_chill)) {
                        let modifier = target.AddNewModifier(caster, frost_ability, modifier_chill, {
                            duration: chill_duration * (1 - target.GetStatusResistance())
                        });
                        if (modifier) {
                            modifier.SetStackCount(chill_stacks);
                        }
                    } else {
                        let modifier = target.FindModifierByName(modifier_chill);
                        modifier.SetStackCount(modifier.GetStackCount() + chill_stacks);
                        modifier.SetDuration(chill_duration * (1 - target.GetStatusResistance()), true);
                    }
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_drow_ranger_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_drow_ranger_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_drow_ranger_9"), "modifier_special_bonus_imba_drow_ranger_9", {});
        }
    }
}
@registerModifier()
export class modifier_imba_gust_silence extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_gust_movement extends BaseModifierMotionHorizontal_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public jump_speed: number;
    public time_elapsed: number;
    public leap_z: any;
    public direction: any;
    public distance: number;
    public jump_time: number;
    public frametime: number;
    public target_point: Vector;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.jump_speed = this.caster.GetTalentValue("special_bonus_imba_drow_ranger_1", "jump_speed");
            this.time_elapsed = 0;
            this.leap_z = 0;
            this.AddTimer(FrameTime(), () => {
                this.direction = (this.target_point - this.caster.GetAbsOrigin() as Vector).Normalized();
                this.distance = (this.caster.GetAbsOrigin() - this.target_point as Vector).Length2D();
                this.jump_time = this.distance / this.jump_speed;
            });
        }
    }
    ApplyHorizontalMotionController(): boolean {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return false;
        }
        return true;
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
    IgnoreTenacity() {
        return true;
    }

    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM;
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.time_elapsed = this.time_elapsed + dt;
            if (this.time_elapsed < this.jump_time) {
                let new_location = this.caster.GetAbsOrigin() + this.direction * this.jump_speed * dt as Vector;
                this.caster.SetAbsOrigin(new_location);
            } else {
                this.Destroy();
            }
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            this.caster.SetUnitOnClearGround();
        }
    }
}
@registerModifier()
export class modifier_imba_gust_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public duration: number;
    public knockback_duration: number;
    public knockback_distance: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    let decfunc = {
        1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    }
    return Object.values(decfunc);
    } */
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.duration = this.GetDuration();
        this.knockback_duration = this.caster.GetTalentValue("special_bonus_imba_drow_ranger_3", "knockback_duration");
        this.knockback_distance = this.caster.GetTalentValue("special_bonus_imba_drow_ranger_3", "knockback_distance");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            let sound_cast = "Hero_DrowRanger.Silence";
            let knockback_particle = "particles/units/heroes/hero_spirit_breaker/spirit_breaker_greater_bash.vpcf";
            let caster = this.caster;
            let ability = this.ability;
            let attacker = kv.attacker;
            let target = kv.target;
            let knockback_duration = this.knockback_duration;
            let distance = this.knockback_distance;
            let knockbackProperties = {
                center_x: caster.GetAbsOrigin().x + 1,
                center_y: caster.GetAbsOrigin().y + 1,
                center_z: caster.GetAbsOrigin().z,
                duration: knockback_duration * (1 - target.GetStatusResistance()),
                knockback_duration: knockback_duration,
                knockback_distance: distance,
                knockback_height: 0,
                should_stun: 0
            }
            if (attacker != caster) {
                return undefined;
            }
            EmitSoundOn(sound_cast, target);
            let knockback_particleid = ResHelper.CreateParticleEx(knockback_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, target);
            ParticleManager.SetParticleControl(knockback_particleid, 0, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(knockback_particleid, 1, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(knockback_particleid, 2, target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(knockback_particleid);
            if (target.HasModifier("modifier_knockback")) {
                target.RemoveModifierByName("modifier_knockback");
            }
            target.AddNewModifier(caster, ability, "modifier_knockback", knockbackProperties);
        }
    }
}
@registerAbility()
export class imba_drow_ranger_trueshot extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_trueshot_aura";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_active = "modifier_imba_trueshot_active";
        let talent_modifier = "modifier_imba_trueshot_talent_buff";
        let active_duration = ability.GetSpecialValueFor("active_duration");
        caster.AddNewModifier(caster, ability, modifier_active, {
            duration: active_duration
        });
        if (caster.HasTalent("special_bonus_imba_drow_ranger_6")) {
            caster.AddNewModifier(caster, ability, talent_modifier, {
                duration: active_duration
            });
        }
    }
}
@registerModifier()
export class modifier_imba_trueshot_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public modifier_active: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.modifier_active = "modifier_imba_trueshot_active";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target.IsHero()) {
            return false;
        }
        if (this.caster.HasModifier(this.modifier_active)) {
            return false;
        }
        return true;
    }
    GetAuraDuration(): number {
        return 5;
    }
    GetAuraRadius(): number {
        return 25000;
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
        return "modifier_imba_trueshot";
    }
    IsAura(): boolean {
        if (this.caster.PassivesDisabled()) {
            return false;
        }
        if (this.caster.IsIllusion()) {
            return false;
        }
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
export class modifier_imba_trueshot extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_active: any;
    public agi_to_damage_pct: number;
    public melee_reduction_pct: number;
    public active_bonus_agi_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier_active = "modifier_imba_trueshot_active";
        this.agi_to_damage_pct = this.ability.GetSpecialValueFor("agi_to_damage_pct");
        this.melee_reduction_pct = this.ability.GetSpecialValueFor("melee_reduction_pct");
        this.active_bonus_agi_pct = this.ability.GetSpecialValueFor("active_bonus_agi_pct");
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let drow_agility = this.caster.GetAgility();
            if (this.parent.IsHero()) {
                this.parent.CalculateStatBonus(true);
            }
            // CustomNetTables.SetTableValue("player_table", "precision_aura_drow_agility" + tostring(this.parent.GetPlayerOwnerID()), {
            //     precision_aura_drow_agility: drow_agility
            // });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        let drow_agility = this.caster.GetAgility()
        let bonus_damage = drow_agility * (this.agi_to_damage_pct / 100);
        if (!this.parent.IsRangedAttacker()) {
            bonus_damage = bonus_damage * (this.melee_reduction_pct / 100);
        }
        return bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.caster.HasModifier(this.modifier_active)) {
            if (this.parent.IsHero()) {
                if (this.parent != this.caster) {
                    let drow_agility = this.caster.GetAgility()
                    let bonus_agility = drow_agility * (this.active_bonus_agi_pct / 100);
                    return bonus_agility;
                }
            }
        }
        return 0;
    }
    IsHidden(): boolean {
        return this.GetAbilityPlus().GetLevel() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_trueshot_active extends BaseModifier_Plus {
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
export class modifier_imba_trueshot_talent_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public current_total_agility: any;
    public agility_bonus_percent: number;
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
    });
    } */
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.current_total_agility = 0;
        this.agility_bonus_percent = this.caster.GetTalentValue("special_bonus_imba_drow_ranger_6", "agility_bonus_percent");
        if (IsServer()) {
            this.OnIntervalThink();
            this.StartIntervalThink(0.1);
        }
    }
    GetTotalAgilityOfTeam() {
        let total_agility = 0;
        if (IsServer()) {
            for (const [_, ally] of GameFunc.iPair(FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false))) {
                if (ally.GetAgility) {
                    total_agility = total_agility + ally.GetAgility();
                }
            }
            return total_agility;
        }
    }
    OnIntervalThink(): void {
        this.SetStackCount(this.GetTotalAgilityOfTeam() * (this.agility_bonus_percent / 100));
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetStackCount();
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_drow_ranger_multishot extends BaseAbility_Plus {
    public targets_hit: any;
    OnSpellStart(): void {
        this.targets_hit = {}
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_drow_ranger_multishot", {
            duration: this.GetChannelTime()
        });
    }
    OnChannelFinish(bInterrupted: boolean): void {
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_drow_ranger_multishot");
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (!this.targets_hit[ExtraData.volley_index]) {
            this.targets_hit[ExtraData.volley_index] = {}
        }
        if (target && !this.targets_hit[ExtraData.volley_index][target.entindex()]) {
            target.EmitSound("Hero_DrowRanger.ProjectileImpact");
            if (this.GetCasterPlus().HasAbility("imba_drow_ranger_frost_arrows_723") && this.GetCasterPlus().findAbliityPlus<imba_drow_ranger_frost_arrows_723>("imba_drow_ranger_frost_arrows_723").IsTrained()) {
                if (!target.IsMagicImmune()) {
                    let frost_modifier = target.AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus<imba_drow_ranger_frost_arrows_723>("imba_drow_ranger_frost_arrows_723"), "modifier_imba_frost_arrows_slow", {
                        duration: this.GetSpecialValueFor("arrow_slow_duration") * (1 - target.GetStatusResistance())
                    });
                    if (frost_modifier) {
                        frost_modifier.IncrementStackCount();
                    }
                }
            }
            ApplyDamage({
                victim: target,
                damage: ((this.GetCasterPlus().GetBaseDamageMax() + this.GetCasterPlus().GetBaseDamageMin()) / 2) * this.GetSpecialValueFor("arrow_damage_pct") * 0.01,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_BLOCK,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            this.targets_hit[ExtraData.volley_index][target.entindex()] = true;
            return true;
        }
    }
}
@registerModifier()
export class modifier_imba_drow_ranger_multishot extends BaseModifier_Plus {
    public arrow_count: number;
    public arrow_damage_pct: number;
    public arrow_slow_duration: number;
    public arrow_width: any;
    public arrow_speed: number;
    public arrow_range_multiplier: number;
    public arrow_angle: any;
    public volley_interval: number;
    public arrow_interval: number;
    public initial_delay: number;
    public arrows_per_salvo: any;
    public angle_per_arrow: any;
    public adjusted_angle: any;
    public num_arrow_in_salvo: any;
    public volley_index: any;
    public first_salvo: any;
    BeCreated(p_0: any,): void {
        this.arrow_count = this.GetSpecialValueFor("arrow_count");
        this.arrow_damage_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("arrow_damage_pct");
        this.arrow_slow_duration = this.GetSpecialValueFor("arrow_slow_duration");
        this.arrow_width = this.GetSpecialValueFor("arrow_width");
        this.arrow_speed = this.GetSpecialValueFor("arrow_speed");
        this.arrow_range_multiplier = this.GetSpecialValueFor("arrow_range_multiplier");
        this.arrow_angle = this.GetSpecialValueFor("arrow_angle");
        this.volley_interval = this.GetSpecialValueFor("volley_interval");
        this.arrow_interval = this.GetSpecialValueFor("arrow_interval");
        this.initial_delay = this.GetSpecialValueFor("initial_delay");
        if (!IsServer()) {
            return;
        }
        this.arrows_per_salvo = math.floor(this.arrow_count / 3);
        this.angle_per_arrow = (this.arrow_angle / 6) / 2;
        this.adjusted_angle = (this.angle_per_arrow * this.arrows_per_salvo);
        this.num_arrow_in_salvo = 1;
        this.volley_index = 1;
        this.GetParentPlus().EmitSound("Hero_DrowRanger.Multishot.Channel");
        this.first_salvo = true;
        this.StartIntervalThink(this.initial_delay);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().EmitSound("Hero_DrowRanger.Multishot.Attack");
        ProjectileManager.CreateLinearProjectile({
            Ability: this.GetAbilityPlus(),
            EffectName: "particles/units/heroes/hero_drow/drow_multishot_proj_linear_proj.vpcf",
            vSpawnOrigin: this.GetParentPlus().GetAttachmentOrigin(this.GetParentPlus().ScriptLookupAttachment("attach_attack1")),
            fDistance: this.GetParentPlus().Script_GetAttackRange() * this.arrow_range_multiplier,
            fStartRadius: this.arrow_width,
            fEndRadius: this.arrow_width,
            Source: this.GetParentPlus(),
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            // bDeleteOnHit: true,
            vVelocity: RotatePosition(Vector(0, 0, 0), QAngle(0, -this.adjusted_angle + (this.angle_per_arrow * this.num_arrow_in_salvo * 2), 0), this.GetParentPlus().GetForwardVector()) * this.arrow_speed as Vector,
            bProvidesVision: true,
            iVisionRadius: 100,
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                volley_index: this.volley_index
            }
        });
        if (this.num_arrow_in_salvo < this.arrows_per_salvo) {
            this.StartIntervalThink(this.arrow_interval);
        } else {
            this.StartIntervalThink(math.max((this.volley_interval - (this.arrow_interval * (this.arrows_per_salvo - 1))), 0));
            this.volley_index = this.volley_index + 1;
        }
        this.num_arrow_in_salvo = (this.num_arrow_in_salvo % this.arrows_per_salvo) + 1;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_DrowRanger.Multishot.Channel");
    }
}
@registerAbility()
export class imba_drow_ranger_marksmanship extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        if (!IsClient()) {
            return;
        }
        if (!this.GetCasterPlus().TempData().arcana_style) {
            return "drow_ranger_marksmanship";
        }
        return "drow_ranger_marksmanship_ti9";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_marksmanship";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let modifier_markx = "modifier_imba_marksmanship";
            if (caster.HasModifier(modifier_markx)) {
                caster.RemoveModifierByName(modifier_markx);
                caster.AddNewModifier(caster, ability, modifier_markx, {});
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_drow_ranger_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_drow_ranger_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_drow_ranger_5"), "modifier_special_bonus_imba_drow_ranger_5", {});
        }
    }
}
@registerModifier()
export class modifier_imba_marksmanship extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public particle_start: any;
    public particle_marksmanship: any;
    public talent_aura: any;
    public range_bonus: number;
    public radius: number;
    public damage_reduction_scepter: number;
    public splinter_radius_scepter: number;
    public marksmanship_enabled: any;
    public particle_start_fx: any;
    public particle_marksmanship_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.particle_start = "particles/units/heroes/hero_drow/drow_marksmanship_start.vpcf";
        this.particle_marksmanship = "particles/units/heroes/hero_drow/drow_marksmanship.vpcf";
        this.talent_aura = "modifier_imba_markmanship_aura";
        this.range_bonus = this.ability.GetSpecialValueFor("range_bonus");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.damage_reduction_scepter = this.ability.GetSpecialValueFor("damage_reduction_scepter");
        this.splinter_radius_scepter = this.ability.GetSpecialValueFor("splinter_radius_scepter");
        if (IsServer()) {
            this.marksmanship_enabled = false;
            this.StartIntervalThink(0.25);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.caster.HasTalent("special_bonus_imba_drow_ranger_5")) {
                if (this.marksmanship_enabled && !this.caster.HasModifier(this.talent_aura)) {
                    this.caster.AddNewModifier(this.caster, this.ability, this.talent_aura, {});
                } else if (!this.marksmanship_enabled && this.caster.HasModifier(this.talent_aura)) {
                    this.caster.RemoveModifierByName(this.talent_aura);
                }
            }
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            if (!this.caster.HasTalent("special_bonus_imba_drow_ranger_8")) {
                if (GameFunc.GetCount(enemies) > 0 && this.marksmanship_enabled) {
                    ParticleManager.DestroyParticle(this.particle_marksmanship_fx, false);
                    ParticleManager.ReleaseParticleIndex(this.particle_marksmanship_fx);
                    this.marksmanship_enabled = false;
                }
            }
            if (!this.marksmanship_enabled && (GameFunc.GetCount(enemies) == 0 || this.caster.HasTalent("special_bonus_imba_drow_ranger_8"))) {
                this.particle_start_fx = ResHelper.CreateParticleEx(this.particle_start, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
                ParticleManager.SetParticleControl(this.particle_start_fx, 0, this.caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(this.particle_start_fx);
                this.particle_marksmanship_fx = ResHelper.CreateParticleEx(this.particle_marksmanship, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
                ParticleManager.SetParticleControl(this.particle_marksmanship_fx, 0, this.caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_marksmanship_fx, 2, Vector(2, 0, 0));
                ParticleManager.SetParticleControl(this.particle_marksmanship_fx, 3, this.caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_marksmanship_fx, 5, this.caster.GetAbsOrigin());
                this.marksmanship_enabled = true;
            }
            // this.caster.CalculateStatBonus(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
        3: Enum_MODIFIER_EVENT.ON_ATTACK_START,
        4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
        5: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY,
        6: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        if (this.marksmanship_enabled == false) {
            return undefined;
        }
        return this.range_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName(): string {
        if (this.GetStackCount() == 1) {
            return "particles/units/heroes/hero_drow/drow_marksmanship_attack.vpcf";
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target;
            let attacker = keys.attacker;
            if (this.caster == attacker) {
                if (this.GetAbilityPlus() && this.GetAbilityPlus().IsTrained() && !this.caster.IsIllusion() && RandomInt(1, 100) < this.GetSpecialValueFor("proc_chance") && this.marksmanship_enabled && !this.caster.PassivesDisabled() && (!target.IsBuilding() && !target.IsOther() && attacker.GetTeamNumber() != target.GetTeamNumber())) {
                    this.SetStackCount(1);
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(params: ModifierAttackEvent): number {
        if (IsServer()) {
            if (!this.caster.IsIllusion() && params.target && !params.inflictor && this.GetStackCount() == 1) {
                let target = params.target as IBaseNpc_Plus;
                if (params.target.IsBuilding() || params.target.IsOther() || params.attacker.GetTeamNumber() == params.target.GetTeamNumber()) {
                }
                else if (params.target.IsConsideredHero() || target.IsRoshan()) {
                    if (params.target.GetHealthPercent() <= this.GetSpecialValueFor("instakill_threshold") && !params.target.HasModifier("modifier_oracle_false_promise_timer")) {
                        if (!target.IsRoshan()) {
                            params.target.Kill(this.GetAbilityPlus(), params.attacker);
                        }
                    } else {
                        let damageTable = {
                            victim: params.target,
                            damage: this.GetSpecialValueFor("bonus_damage"),
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL,
                            attacker: this.caster,
                            ability: this.GetAbilityPlus()
                        }
                        ApplyDamage(damageTable);
                    }
                } else {
                    params.target.Kill(this.GetAbilityPlus(), params.attacker);
                }
                this.SetStackCount(0);
                params.target.EmitSound("Hero_DrowRanger.Marksmanship.Target");
            }
            return 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.caster.IsNull()) {
                return;
            }
            let scepter = this.caster.HasScepter();
            let target = keys.target;
            let attacker = keys.attacker;
            let modifier_frost = "modifier_imba_frost_arrows_thinker";
            if (this.caster == attacker) {
                if (this.GetStackCount() == 1) {
                    keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_drow_ranger_marksmanship_proc_armor", {
                        duration: 0.01
                    });
                }
                if (scepter) {
                    let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, this.splinter_radius_scepter, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
                    if (GameFunc.GetCount(enemies) > 0) {
                        for (const [_, enemy] of GameFunc.iPair(enemies)) {
                            if (enemy != target) {
                                let arrow_projectile = {
                                    hTarget: enemy,
                                    hCaster: target,
                                    hAbility: this.ability,
                                    iMoveSpeed: this.caster.GetProjectileSpeed(),
                                    EffectName: this.caster.GetRangedProjectileName(),
                                    SoundName: "",
                                    flRadius: 1,
                                    bDodgeable: true,
                                    bDestroyOnDodge: true,
                                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                                    OnProjectileHitUnit: GHandler.create(this, (params, projectileID) => {
                                        this.SplinterArrowHit(params, projectileID,);
                                    })
                                }
                                ProjectileHelper.TrackingProjectiles.Projectile(arrow_projectile);
                            }
                        }
                    }
                }
            }
        }
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeDestroy(): void {
        if (this.particle_marksmanship_fx) {
            ParticleManager.DestroyParticle(this.particle_marksmanship_fx, false);
            ParticleManager.ReleaseParticleIndex(this.particle_marksmanship_fx);
        }
    }

    SplinterArrowHit(keys: ITrackingProjectile, projectileID: ITrackingProjectileInfo) {
        let caster = this.caster;
        let target = keys.hTarget;
        let modifier_reduction = "modifier_imba_marksmanship_scepter_dmg_reduction";
        caster.AddNewModifier(this.caster, this.ability, modifier_reduction, {});
        caster.PerformAttack(target, false, false, true, true, false, false, false);
        caster.RemoveModifierByName(modifier_reduction);
        if (this.caster.HasModifier("modifier_imba_frost_arrows_thinker")) {
            let modifier_frost = this.caster.FindModifierByName("modifier_imba_frost_arrows_thinker") as modifier_imba_frost_arrows_thinker;
            modifier_frost.ApplyFrostAttack(target);
        }
    }
}
@registerModifier()
export class modifier_imba_marksmanship_scepter_dmg_reduction extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public damage_reduction_scepter: number;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.damage_reduction_scepter = this.ability.GetSpecialValueFor("damage_reduction_scepter");
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction_scepter * (-1);
    }
}
@registerModifier()
export class modifier_imba_markmanship_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
    }
    // GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
    //     if (target.IsHero() && !target.IsIllusion()) {
    //         return false;
    //     }
    //     return true;
    // }
    GetAuraRadius(): number {
        return this.caster.GetTalentValue("special_bonus_imba_drow_ranger_5", "aura_radius");
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
        return "modifier_imba_markmanship_buff";
    }
    IsAura(): boolean {
        if (this.caster.PassivesDisabled()) {
            return false;
        }
        if (this.caster.IsIllusion()) {
            return false;
        }
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
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        return !this.GetAbilityPlus() || !this.GetAbilityPlus().IsTrained();
    }
}
@registerModifier()
export class modifier_imba_markmanship_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier: any;
    public duration: number;
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    });
    } */
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier = "modifier_imba_markmanship_slow";
        this.duration = this.caster.GetTalentValue("special_bonus_imba_drow_ranger_5", "duration");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.parent == attacker) {
                if (!target.IsMagicImmune() && !target.IsBuilding()) {
                    target.AddNewModifier(this.caster, this.ability, this.modifier, {
                        duration: this.duration * (1 - target.GetStatusResistance())
                    });
                }
            }
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
@registerModifier()
export class modifier_imba_markmanship_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public duration: number;
    public slow_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.duration = this.GetDuration();
        this.slow_pct = this.caster.GetTalentValue("special_bonus_imba_drow_ranger_5", "slow_pct");
    }
    GetTexture(): string {
        return "drow_ranger_marksmanship";
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_slowed_cold.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_pct * (-1);
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
}
@registerModifier()
export class modifier_imba_drow_ranger_marksmanship_proc_armor extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR)
    CC_GetModifierIgnorePhysicalArmor(keys: ModifierAttackEvent): number {
        return 1;
    }
}
@registerAbility()
export class imba_drow_ranger_marksmanship_723 extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_drow_ranger_marksmanship_723";
    }
}
@registerModifier()
export class modifier_imba_drow_ranger_marksmanship_723 extends BaseModifier_Plus {
    public procs: any;
    public marksmanship_particle: any;
    public start_particle: any;
    public frost_arrow_modifier: modifier_generic_orb_effect_lua;
    public projectile_name: any;
    public bFrost: any;
    public splinter_projectile_name: any;
    BeCreated(p_0: any,): void {
        this.procs = {}
        if (!IsServer()) {
            return;
        }
        this.marksmanship_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_drow/drow_marksmanship.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.marksmanship_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(this.marksmanship_particle, 3, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(this.marksmanship_particle, 5, this.GetParentPlus().GetAbsOrigin());
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (GameFunc.GetCount(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("disable_range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false)) >= 1) {
            if (this.marksmanship_particle) {
                ParticleManager.SetParticleControl(this.marksmanship_particle, 2, Vector(1, 0, 0));
            }
            this.start_particle = undefined;
            this.SetStackCount(-1);
        } else if (!this.start_particle) {
            this.start_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_drow/drow_marksmanship_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(this.start_particle);
            this.SetStackCount(0);
            ParticleManager.SetParticleControl(this.marksmanship_particle, 2, Vector(2, 0, 0));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD,
        2: Enum_MODIFIER_EVENT.ON_ATTACK,
        3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
        4: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY,
        5: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
    });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            if (!this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion() && this.start_particle && !keys.target.IsOther() && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != keys.attacker.GetTeamNumber() && GFuncRandom.PRD(this.GetAbilityPlus().GetTalentSpecialValueFor("chance"), this)) {
                this.procs[keys.record] = true;
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_drow_ranger_marksmanship_723_proc_damage", {});
            } else {
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.procs[keys.record]) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_drow_ranger_marksmanship_723_proc_damage");
            if (this.GetParentPlus().HasAbility("imba_drow_ranger_frost_arrows_723") && !this.frost_arrow_modifier) {
                for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName("modifier_generic_orb_effect_lua"))) {
                    if (mod.GetAbility().GetName() == "imba_drow_ranger_frost_arrows_723") {
                        this.frost_arrow_modifier = mod as modifier_generic_orb_effect_lua;
                        return;
                    }
                }
            }
            if (!keys.no_attack_cooldown) {
                if (this.frost_arrow_modifier && this.frost_arrow_modifier.cast && this.frost_arrow_modifier.GetAbility() && this.frost_arrow_modifier.GetAbility().IsFullyCastable()) {
                    this.projectile_name = "particles/units/heroes/hero_drow/drow_marksmanship_frost_arrow.vpcf";
                } else {
                    this.projectile_name = "particles/units/heroes/hero_drow/drow_marksmanship_attack.vpcf";
                }
                ProjectileManager.CreateTrackingProjectile({
                    Target: keys.target,
                    Ability: this.GetAbilityPlus(),
                    EffectName: this.projectile_name,
                    iMoveSpeed: this.GetParentPlus().GetProjectileSpeed(),
                    vSourceLoc: this.GetParentPlus().GetAttachmentOrigin(this.GetParentPlus().ScriptLookupAttachment("attach_attack1")),
                    bDrawsOnMinimap: false,
                    bDodgeable: true,
                    bIsAttack: true,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 10.0,
                    bProvidesVision: false,
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1
                });
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            if (this.procs[keys.record]) {
                let target = keys.target as IBaseNpc_Plus
                keys.target.EmitSound("Hero_DrowRanger.Marksmanship.Target");
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_drow_ranger_marksmanship_723_proc_armor", {});
                if (keys.target.GetHealthPercent() <= this.GetSpecialValueFor("instakill_threshold") && !target.IsRoshan() && !keys.target.HasModifier("modifier_oracle_false_promise_timer") && !keys.target.HasModifier("modifier_imba_oracle_false_promise_timer")) {
                    keys.target.Kill(this.GetAbilityPlus(), this.GetParentPlus());
                }
            }
            if (this.GetParentPlus().HasScepter() && !this.GetParentPlus().PassivesDisabled() && this.start_particle && !keys.no_attack_cooldown) {
                let splinter_counter = 0;
                for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), keys.target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("scepter_range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false))) {
                    if (enemy != keys.target) {
                        if (splinter_counter < this.GetSpecialValueFor("split_count_scepter")) {
                            if (this.frost_arrow_modifier && this.frost_arrow_modifier.GetAbility() && (this.frost_arrow_modifier.cast || this.frost_arrow_modifier.GetAbility().GetAutoCastState()) && this.frost_arrow_modifier.GetAbility().IsFullyCastable()) {
                                this.frost_arrow_modifier.GetAbility().UseResources(true, false, false);
                                this.bFrost = true;
                                this.splinter_projectile_name = "particles/units/heroes/hero_drow/drow_frost_arrow.vpcf";
                            } else {
                                this.bFrost = false;
                                this.splinter_projectile_name = this.GetParentPlus().GetRangedProjectileName();
                            }
                            ProjectileHelper.TrackingProjectiles.Projectile<{ bFrost: boolean }>({
                                hTarget: enemy,
                                hCaster: keys.target,
                                hAbility: this.GetAbilityPlus(),
                                iMoveSpeed: this.GetParentPlus().GetProjectileSpeed(),
                                EffectName: this.splinter_projectile_name,
                                SoundName: "",
                                flRadius: 1,
                                bDodgeable: true,
                                bDestroyOnDodge: true,
                                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                                bFrost: this.bFrost,
                                OnProjectileHitUnit: GHandler.create(this,
                                    (params, projectileID) => {
                                        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_marksmanship_scepter_dmg_reduction", {});
                                        this.GetParentPlus().PerformAttack(enemy, false, true, true, true, false, false, false);
                                        this.GetParentPlus().RemoveModifierByName("modifier_imba_marksmanship_scepter_dmg_reduction");
                                        if (params.bFrost) {
                                            this.frost_arrow_modifier.GetAbilityPlus<imba_drow_ranger_frost_arrows_723>().OnOrbImpact({
                                                target: enemy
                                            } as any);
                                        }
                                    })
                            });
                            splinter_counter = splinter_counter + 1;
                        } else {
                            return;
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.procs[keys.record]) {
            this.procs[keys.record] = undefined;
            keys.target.RemoveModifierByName("modifier_imba_drow_ranger_marksmanship_723_proc_armor");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (!this.GetParentPlus().PassivesDisabled() && this.GetStackCount() == 0) {
            return this.GetSpecialValueFor("range_bonus");
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return !this.GetParentPlus().IsIllusion();
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("agility_range");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_drow_ranger_marksmanship_723_aura_bonus";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return !this.GetAbilityPlus().IsTrained() || !hTarget.IsRangedAttacker() || this.GetParentPlus().PassivesDisabled() || !this.start_particle;
    }
}
@registerModifier()
export class modifier_imba_drow_ranger_marksmanship_723_aura_bonus extends BaseModifier_Plus {
    public agility_multiplier: any;
    public agility_to_add: any;
    BeCreated(p_0: any,): void {
        this.agility_multiplier = this.GetSpecialValueFor("agility_multiplier") * 0.01;
        this.agility_to_add = this.GetCasterPlus().GetAgility() * this.agility_multiplier;
        this.StartIntervalThink(0.5);
    }
    BeRefresh(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.agility_multiplier = this.GetSpecialValueFor("agility_multiplier") * 0.01;
        }
    }
    OnIntervalThink(): void {
        this.agility_to_add = 0;
        if (this.GetCasterPlus() && !this.GetCasterPlus().IsNull()) {
            this.agility_to_add = this.GetCasterPlus().GetAgility() * this.agility_multiplier;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.agility_to_add;
    }
}
@registerModifier()
export class modifier_imba_drow_ranger_marksmanship_723_proc_damage extends BaseModifier_Plus {
    public bonus_damage: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE_POST_CRIT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE_POST_CRIT)
    CC_GetModifierPreAttack_BonusDamagePostCrit(p_0: ModifierAttackEvent,): number {
        return this.bonus_damage;
    }
}
@registerModifier()
export class modifier_imba_drow_ranger_marksmanship_723_proc_armor extends BaseModifier_Plus {
    public base_armor: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.base_armor = this.GetParentPlus().GetPhysicalArmorBaseValue() * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.base_armor;
    }
}
@registerAbility()
export class imba_drow_ranger_trueshot_720 extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_drow_ranger_trueshot_720";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let trueshot_modifier = this.GetCasterPlus().findBuff<modifier_imba_drow_ranger_trueshot_720>("modifier_imba_drow_ranger_trueshot_720");
        if (trueshot_modifier) {
            trueshot_modifier.activation_counter = this.GetDuration() + 0.1;
            trueshot_modifier.StartIntervalThink(-1);
            trueshot_modifier.OnIntervalThink();
            trueshot_modifier.StartIntervalThink(0.1);
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_drow_ranger_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_trueshot_talent_buff", {
                duration: this.GetDuration()
            });
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_drow_ranger_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_drow_ranger_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_drow_ranger_6"), "modifier_special_bonus_imba_drow_ranger_6", {});
        }
    }
}
@registerModifier()
export class modifier_imba_drow_ranger_trueshot_720 extends BaseModifier_Plus {
    public activation_counter: number;
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return 25000;
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
        return "modifier_imba_drow_ranger_trueshot_720_aura";
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus().IsTrained() && !this.GetCasterPlus().PassivesDisabled() && (hEntity.IsHero() || (hEntity.IsRangedAttacker() && this.activation_counter != undefined && this.activation_counter > 0))) {
            return false;
        } else {
            return true;
        }
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.activation_counter = 0;
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        this.SetStackCount(this.GetCasterPlus().GetAgility() * (this.GetAbilityPlus().GetTalentSpecialValueFor("trueshot_ranged_attack_speed") / 100));
        if (this.activation_counter > 0) {
            this.activation_counter = math.max(this.activation_counter - 0.1, 0);
        }
    }
}
@registerModifier()
export class modifier_imba_drow_ranger_trueshot_720_aura extends BaseModifier_Plus {
    public melee_fencing_efficiency: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_drow/drow_aura_buff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.melee_fencing_efficiency = this.GetSpecialValueFor("melee_fencing_efficiency") / 100;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this == undefined || this.GetCasterPlus() == undefined) {
            return;
        }
        let trueshot_stacks = this.GetCasterPlus().findBuffStack("modifier_imba_drow_ranger_trueshot_720", this.GetCasterPlus());
        if (this.GetParentPlus().IsRangedAttacker()) {
            return trueshot_stacks;
        } else {
            return trueshot_stacks * this.melee_fencing_efficiency;
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_drow_ranger_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_drow_ranger_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_drow_ranger_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_drow_ranger_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_drow_ranger_frost_arrows_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_drow_ranger_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_drow_ranger_3 extends BaseModifier_Plus {
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
