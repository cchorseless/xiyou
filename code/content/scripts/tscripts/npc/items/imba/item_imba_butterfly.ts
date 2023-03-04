
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_butterfly extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_butterfly";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "DOTA_Item.Butterfly";
        let modifier_flutter = "modifier_item_imba_butterfly_flutter";
        let flutter_duration = ability.GetSpecialValueFor("flutter_duration");
        EmitSoundOn(sound_cast, caster);
        caster.AddNewModifier(caster, ability, modifier_flutter, {
            duration: flutter_duration
        });
    }
}
@registerModifier()
export class modifier_item_imba_butterfly extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_unique: any;
    public modifier_flutter: any;
    public modifier_active_song: any;
    public bonus_agility: number;
    public bonus_damage: number;
    public bonus_evasion: number;
    public wind_song_evasion: any;
    public bonus_attack_speed: number;
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
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.modifier_unique = "modifier_item_imba_butterfly_unique";
        this.modifier_flutter = "modifier_item_imba_butterfly_flutter";
        this.modifier_active_song = "modifier_item_imba_butterfly_wind_song_active";
        this.bonus_agility = this.ability.GetSpecialValueFor("bonus_agility");
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
        this.bonus_evasion = this.ability.GetSpecialValueFor("bonus_evasion");
        this.wind_song_evasion = this.ability.GetSpecialValueFor("wind_song_evasion");
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed");
        if (IsServer()) {
            if (!this.caster.HasModifier(this.modifier_unique)) {
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_unique, {});
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        return this.bonus_evasion;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.caster && !this.caster.IsNull() && !this.caster.HasModifier("modifier_item_imba_butterfly")) {
                this.caster.RemoveModifierByName("modifier_item_imba_butterfly_unique");
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_butterfly_unique extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_stacks: string;
    public modifier_active_song: any;
    public wind_song_stack_duration: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.modifier_stacks = "modifier_item_imba_butterfly_wind_song_stacks";
        this.modifier_active_song = "modifier_item_imba_butterfly_wind_song_active";
        this.wind_song_stack_duration = this.ability.GetSpecialValueFor("wind_song_stack_duration");
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
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(keys: ModifierAttackEvent): void {
        let attacker = keys.attacker;
        let target = keys.target;
        if (this.caster == target) {
            if (this.caster.HasModifier(this.modifier_active_song)) {
                return undefined;
            }
            if (!this.caster.HasModifier(this.modifier_stacks)) {
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_stacks, {
                    duration: this.wind_song_stack_duration
                });
            }
            let modifier_active_song_handler = this.caster.FindModifierByName(this.modifier_stacks);
            if (modifier_active_song_handler) {
                modifier_active_song_handler.IncrementStackCount();
                modifier_active_song_handler.ForceRefresh();
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.caster.HasModifier(this.modifier_stacks)) {
                this.caster.RemoveModifierByName(this.modifier_stacks);
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_butterfly_flutter extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public flutter_movespeed_pct: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.flutter_movespeed_pct = this.ability.GetSpecialValueFor("flutter_movespeed_pct");
        if (!IsServer()) {
            return;
        }
        let particle_flutter_fx = ResHelper.CreateParticleEx("particles/item/butterfly/butterfly_wind_song.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(particle_flutter_fx, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControlEnt(particle_flutter_fx, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(particle_flutter_fx, false, false, -1, false, false);
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        AddFOWViewer(this.caster.GetTeam(), this.caster.GetAbsOrigin(), this.caster.GetCurrentVisionRange(), FrameTime(), false);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.flutter_movespeed_pct;
    }
}
@registerModifier()
export class modifier_item_imba_butterfly_wind_song_stacks extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_active_song: any;
    public wind_song_active_stacks: number;
    public wind_song_duration: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.modifier_active_song = "modifier_item_imba_butterfly_wind_song_active";
        this.wind_song_active_stacks = this.ability.GetSpecialValueFor("wind_song_active_stacks");
        this.wind_song_duration = this.ability.GetSpecialValueFor("wind_song_duration");
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    OnStackCountChanged(p_0: number,): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (stacks >= this.wind_song_active_stacks) {
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_active_song, {
                    duration: this.wind_song_duration
                });
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_butterfly_wind_song_active extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_slow: any;
    public wind_song_bonus_ms_pct: number;
    public wind_song_bonus_as: number;
    public wind_song_slow_radius: number;
    GetEffectName(): string {
        return "particles/items2_fx/yasha_active.vpcf";
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
        this.modifier_slow = "modifier_item_imba_butterfly_wind_song_slow";
        this.wind_song_bonus_ms_pct = this.ability.GetSpecialValueFor("wind_song_bonus_ms_pct");
        this.wind_song_bonus_as = this.ability.GetSpecialValueFor("wind_song_bonus_as");
        this.wind_song_slow_radius = this.ability.GetSpecialValueFor("wind_song_slow_radius");
        if (IsServer()) {
            this.StartIntervalThink(0.1);
        }
    }
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
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.wind_song_bonus_ms_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.wind_song_bonus_as;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.wind_song_slow_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(enemies)) {
                if (!enemy.HasModifier(this.modifier_slow)) {
                    let remaining_time = this.GetRemainingTime();
                    enemy.AddNewModifier(this.caster, this.ability, this.modifier_slow, {
                        duration: remaining_time * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_butterfly_wind_song_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public particle_slow: any;
    public wind_song_ms_slow_pct: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.particle_slow = "particles/units/heroes/hero_windrunner/windrunner_windrun_slow.vpcf";
        this.wind_song_ms_slow_pct = this.ability.GetSpecialValueFor("wind_song_ms_slow_pct");
        let particle_slow_fx = ResHelper.CreateParticleEx(this.particle_slow, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(particle_slow_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_slow_fx, 1, Vector(1, 0, 0));
        this.AddParticle(particle_slow_fx, false, false, -1, false, false);
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.wind_song_ms_slow_pct * (-1);
    }
}
