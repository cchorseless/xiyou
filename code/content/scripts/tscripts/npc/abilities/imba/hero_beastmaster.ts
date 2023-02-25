
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";


function UpgradeBeastsSummons(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
    let hawk_ability = "imba_beastmaster_summon_hawk";
    let boar_ability = "imba_beastmaster_summon_boar";
    let hawk_ability_handler;
    let boar_ability_handler;
    let raze_far_handler;
    if (caster.HasAbility(hawk_ability)) {
        hawk_ability_handler = caster.FindAbilityByName(hawk_ability);
    }
    if (caster.HasAbility(boar_ability)) {
        boar_ability_handler = caster.FindAbilityByName(boar_ability);
    }
    let leveled_ability_level = ability.GetLevel();
    if (hawk_ability_handler && hawk_ability_handler.GetLevel() < leveled_ability_level) {
        hawk_ability_handler.SetLevel(leveled_ability_level);
    }
    if (boar_ability_handler && boar_ability_handler.GetLevel() < leveled_ability_level) {
        boar_ability_handler.SetLevel(leveled_ability_level);
    }
}

@registerAbility()
export class imba_beastmaster_summon_hawk extends BaseAbility_Plus {
    public hawk: any;
    OnUpgrade(): void {
        UpgradeBeastsSummons(this.GetCasterPlus(), this);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let hawk_name = "npc_imba_dota_beastmaster_hawk_";
            let hawk_level = this.GetLevel();
            let spawn_point = caster.GetAbsOrigin();
            let spawn_particle = "particles/units/heroes/hero_beastmaster/beastmaster_call_bird.vpcf";
            let response = "beastmaster_beas_ability_summonsbird_0";
            let hawk_duration = this.GetSpecialValueFor("hawk_duration");
            caster.EmitSound(response + RandomInt(1, 5));
            caster.EmitSound("Hero_Beastmaster.Call.Hawk");
            let spawn_particle_fx = ResHelper.CreateParticleEx(spawn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(spawn_particle_fx, 0, spawn_point);
            this.hawk = BaseNpc_Plus.CreateUnitByName(hawk_name + hawk_level, spawn_point, caster.GetTeamNumber(), false, caster, caster);
            this.hawk.AddNewModifier(caster, this, "modifier_imba_beastmaster_hawk", {});
            this.hawk.AddNewModifier(caster, this, "modifier_kill", {
                duration: hawk_duration
            });
            this.hawk.SetControllableByPlayer(caster.GetPlayerID(), true);
        }
        let hawk_speed = this.GetSpecialValueFor("hawk_speed_tooltip");
        this.hawk.SetBaseMoveSpeed(hawk_speed);
    }
}
@registerModifier()
export class modifier_imba_beastmaster_hawk extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let invis_ability = parent.findAbliityPlus<imba_beastmaster_hawk_invis>("imba_beastmaster_hawk_invis");
            invis_ability.SetLevel(ability.GetLevel());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: MODIFIER_PROPERTY_MOVESPEED_MAX
        }
        return Object.values(decFuncs);
    } */
    GetModifierMoveSpeed_Max() {
        return 1200;
    }
}
@registerAbility()
export class imba_beastmaster_hawk_invis extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_hawk_invis_handler";
    }
}
@registerModifier()
export class modifier_imba_hawk_invis_handler extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus();
            ability.StartCooldown(ability.GetSpecialValueFor("fade_time"));
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let fade_time = ability.GetSpecialValueFor("fade_time");
            if (ability.IsCooldownReady()) {
                if (!parent.HasModifier("modifier_imba_hawk_invis")) {
                    parent.AddNewModifier(parent, ability, "modifier_imba_hawk_invis", {});
                }
            } else if (parent.HasModifier("modifier_imba_hawk_invis")) {
                parent.RemoveModifierByName("modifier_imba_hawk_invis");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_UNIT_MOVED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_UNIT_MOVED)
    CC_OnUnitMoved(keys: ModifierUnitEvent): void {
        if (IsServer()) {
            if (keys.unit == this.GetParentPlus()) {
                let ability = this.GetAbilityPlus();
                let fade_time = ability.GetSpecialValueFor("fade_time");
                if (ability.GetCooldownTimeRemaining() < fade_time * 0.9) {
                    ability.StartCooldown(fade_time);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_hawk_invis extends BaseModifier_Plus {
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
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(funcs);
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
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
}
@registerAbility()
export class imba_beastmaster_summon_boar extends BaseAbility_Plus {
    OnUpgrade(): void {
        UpgradeBeastsSummons(this.GetCasterPlus(), this);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let boar_name = "npc_imba_dota_beastmaster_boar_";
            let boar_level = this.GetLevel();
            let spawn_point = caster.GetAbsOrigin();
            let spawn_particle = "particles/units/heroes/hero_beastmaster/beastmaster_call_boar.vpcf";
            let response = "beastmaster_beas_ability_summonsboar_0";
            let boar_duration = this.GetSpecialValueFor("boar_duration");
            caster.EmitSound(response + RandomInt(1, 5));
            caster.EmitSound("Hero_Beastmaster.Call.Boar");
            let spawn_particle_fx = ResHelper.CreateParticleEx(spawn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(spawn_particle_fx, 0, spawn_point);
            let boar_count = 1;
            if (caster.HasAbility("special_bonus_unique_beastmaster_2")) {
                let talent_handler = caster.findAbliityPlus("special_bonus_unique_beastmaster_2");
                if (talent_handler && talent_handler.GetLevel() > 0) {
                    let additional_boars = talent_handler.GetSpecialValueFor("value");
                    if (additional_boars) {
                        boar_count = boar_count + additional_boars;
                    }
                }
            }
            for (let i = 1; i <= boar_count; i += 1) {
                let boar = BaseNpc_Plus.CreateUnitByName(boar_name + boar_level, spawn_point, caster.GetTeamNumber(), true, caster, caster);
                boar.AddNewModifier(caster, this, "modifier_imba_beastmaster_boar", {});
                boar.AddNewModifier(caster, this, "modifier_kill", {
                    duration: boar_duration
                });
                boar.SetControllableByPlayer(caster.GetPlayerID(), true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_beastmaster_boar extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let poison_ability = parent.findAbliityPlus<imba_beastmaster_boar_poison>("imba_beastmaster_boar_poison");
            poison_ability.SetLevel(ability.GetLevel());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: MODIFIER_PROPERTY_MOVESPEED_MAX
        }
        return Object.values(decFuncs);
    } */
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Beastmaster_Boar.Death");
            this.GetParentPlus().ForceKill(false);
        }
    }
}
@registerAbility()
export class imba_beastmaster_boar_poison extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_boar_poison";
    }
}
@registerModifier()
export class modifier_imba_boar_poison extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = params.target;
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let duration = ability.GetSpecialValueFor("duration");
            if ((parent == params.attacker)) {
                if ((target.IsCreep() || target.IsHero()) && !target.IsBuilding()) {
                    target.AddNewModifier(parent, ability, "modifier_imba_boar_poison_debuff", {
                        duration: duration * (1 - target.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_boar_poison_debuff extends BaseModifier_Plus {
    public movespeed_slow: number;
    public attackspeed_slow: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.movespeed_slow = ability.GetSpecialValueFor("movespeed_slow");
        this.attackspeed_slow = ability.GetSpecialValueFor("attackspeed_slow");
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
        return this.movespeed_slow * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackspeed_slow * (-1);
    }
}
