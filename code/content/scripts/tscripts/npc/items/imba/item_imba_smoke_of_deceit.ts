
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 诡计之雾
@registerAbility()
export class item_imba_smoke_of_deceit extends BaseItem_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "DOTA_Item.SmokeOfDeceit.Activate";
        let modifier_smoke = "modifier_imba_smoke_of_deceit";
        let application_radius = ability.GetSpecialValueFor("application_radius");
        let smoke_duration = ability.GetSpecialValueFor("smoke_duration");
        EmitSoundOn(sound_cast, caster);
        let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, application_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            ally.AddNewModifier(caster, ability, modifier_smoke, {
                duration: smoke_duration
            });
        }
        ability.SpendCharge();
    }
}
@registerModifier()
export class modifier_imba_smoke_of_deceit extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_smoke: any;
    public modifier_surprise: any;
    public visibility_radius: number;
    public movespeed_bonus_pct: number;
    public surprise_atk_delay: number;
    public surprise_atk_duration: number;
    public surprise_atk_damage_pct: number;
    public surprise_atk_spell_amp: any;
    public surprise_atk_hit_count: number;
    public gank_unit_radius: number;
    public gank_hero_ms_bonus_pct: number;
    public gank_unit_ms_bonus_pct: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }

    GetTexture(): string {
        return "item_smoke_of_deceit";
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/dropped_smoke.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.modifier_smoke = "modifier_imba_smoke_of_deceit";
        this.modifier_surprise = "modifier_imba_smoke_of_deceit_surprise";
        this.visibility_radius = this.ability.GetSpecialValueFor("visibility_radius");
        this.movespeed_bonus_pct = this.ability.GetSpecialValueFor("movespeed_bonus_pct");
        this.surprise_atk_delay = this.ability.GetSpecialValueFor("surprise_atk_delay");
        this.surprise_atk_duration = this.ability.GetSpecialValueFor("surprise_atk_duration");
        this.surprise_atk_damage_pct = this.ability.GetSpecialValueFor("surprise_atk_damage_pct");
        this.surprise_atk_spell_amp = this.ability.GetSpecialValueFor("surprise_atk_spell_amp");
        this.surprise_atk_hit_count = this.ability.GetSpecialValueFor("surprise_atk_hit_count");
        this.gank_unit_radius = this.ability.GetSpecialValueFor("gank_unit_radius");
        this.gank_hero_ms_bonus_pct = this.ability.GetSpecialValueFor("gank_hero_ms_bonus_pct");
        this.gank_unit_ms_bonus_pct = this.ability.GetSpecialValueFor("gank_unit_ms_bonus_pct");
        this.parent.TempData().smoke_of_deceit_surprise_atk_damage_pct = this.surprise_atk_damage_pct;
        this.parent.TempData().smoke_of_deceit_surprise_atk_spell_amp = this.surprise_atk_spell_amp;
        this.parent.TempData().smoke_of_deceit_surprise_atk_hit_count = this.surprise_atk_hit_count;
        if (IsServer()) {
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.visibility_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.IsRealUnit() || enemy.IsClone() || enemy.IsTower()) {
                this.SurpriseAttack();
                this.Destroy();
                return undefined;
            }
        }
        let allies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.gank_unit_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
        let stacks = 0;
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.HasModifier(this.modifier_smoke)) {
                if (ally.IsIllusion()) {
                    stacks = stacks + 0;
                } else if (ally.IsRealUnit()) {
                    stacks = stacks + this.gank_hero_ms_bonus_pct;
                } else {
                    stacks = stacks + this.gank_unit_ms_bonus_pct;
                }
            }
        }
        this.SetStackCount(stacks);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE]: true
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let ms_bonus = this.movespeed_bonus_pct + this.GetStackCount();
        return ms_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED)
    CC_OnAttackFinished(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        let attacker = keys.attacker;
        let target = keys.target;
        if (this.parent == attacker) {
            this.SurpriseAttack();
            this.Destroy();
        }
    }
    SurpriseAttack() {
        if (!IsServer()) {
            return;
        }
        if (this.GetElapsedTime() < this.surprise_atk_delay) {
            return;
        }
        this.parent.AddNewModifier(this.caster, this.ability, this.modifier_surprise, {
            duration: this.surprise_atk_duration
        });
    }
}
@registerModifier()
export class modifier_imba_smoke_of_deceit_surprise extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public surprise_atk_damage_pct: number;
    public surprise_atk_spell_amp: any;
    public surprise_atk_hit_count: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetTexture(): string {
        return "item_smoke_of_deceit";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.surprise_atk_damage_pct = this.parent.TempData().smoke_of_deceit_surprise_atk_damage_pct;
        this.surprise_atk_spell_amp = this.parent.TempData().smoke_of_deceit_surprise_atk_spell_amp;
        this.surprise_atk_hit_count = this.parent.TempData().smoke_of_deceit_surprise_atk_hit_count;
        delete this.parent.TempData().smoke_of_deceit_surprise_atk_damage_pct;
        delete this.parent.TempData().smoke_of_deceit_surprise_atk_spell_amp;
        delete this.parent.TempData().smoke_of_deceit_surprise_atk_hit_count;
        this.SetStackCount(this.surprise_atk_hit_count);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.surprise_atk_spell_amp;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.surprise_atk_damage_pct;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let attacker = keys.attacker;
        let target = keys.unit;
        let damage = keys.damage;
        if (attacker == this.parent) {
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, target, damage, undefined);
            if (this.GetStackCount() > 1) {
                this.DecrementStackCount();
            } else {
                this.Destroy();
            }
        }
    }
}
