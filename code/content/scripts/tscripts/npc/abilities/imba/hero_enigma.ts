
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseModifierMotionHorizontal, registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function CalculatePullLength(caster: IBaseNpc_Plus, target: IBaseNpc_Plus, length: number) {
    if (!IsServer()) {
        return;
    }
    let son = caster.FindAbilityByName("imba_enigma_demonic_conversion") as imba_enigma_demonic_conversion;
    let iLenght = length;
    if (son) {
        let debuff = target.FindModifierByName("modifier_imba_enigma_eidolon_attack_counter");
        if (debuff) {
            iLenght = iLenght * (1 + son.GetSpecialValueFor("increased_mass_pull_pct") * 0.01 * debuff.GetStackCount());
        }
    }
    return iLenght;
}

function SearchForEngimaThinker(caster: IBaseNpc_Plus, victim: IBaseNpc_Plus, length: number, talent: boolean = false) {
    if (!IsServer()) {
        return;
    }
    talent = talent || false;
    let Black_Hole = caster.FindAbilityByName("imba_enigma_black_hole") as imba_enigma_black_hole;
    let hThinker = caster;
    if (talent) {
        let Thinkers = FindUnitsInRadius(victim.GetTeamNumber(), victim.GetAbsOrigin(), undefined, 9999999,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD,
            FindOrder.FIND_CLOSEST, false);
        for (const [_, thinker] of GameFunc.iPair(Thinkers)) {
            if (thinker.FindModifierByNameAndCaster("modifier_imba_enigma_malefice", caster) && thinker != victim) {
                hThinker = thinker;
                break;
            }
        }
    }
    let allthinker = caster.FindChildByBuffName("modifier_imba_enigma_midnight_pulse_thinker") as IBaseNpc_Plus[];
    for (const [_, ent] of GameFunc.iPair(allthinker)) {
        if (ent.TempData().midnight) {
            hThinker = ent;
            break;
        }
    }
    if (Black_Hole.thinker && !Black_Hole.thinker.IsNull()) {
        hThinker = Black_Hole.thinker;
    }
    let iLenght = CalculatePullLength(caster, victim, length);
    victim.AddNewModifier(caster, undefined, "modifier_imba_enigma_generic_pull", {
        duration: 1.0 * (1 - victim.GetStatusResistance()),
        target: hThinker.entindex(),
        length: iLenght
    });
}
@registerModifier()
export class modifier_imba_enigma_generic_pull extends BaseModifierMotionHorizontal_Plus {
    public target: IBaseNpc_Plus;
    public length: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }

    GetPriority() {
        return 0;
    }
    Init(keys: any): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target) {
            this.target = EntIndexToHScript(keys.target) as IBaseNpc_Plus;
        }
        this.target = this.target || this.GetCasterPlus();
        this.length = keys.length;
        this.BeginMotionOrDestroy()
    }


    UpdateHorizontalMotion(unit: IBaseNpc_Plus, dt: number) {
        let length = this.length / (1.0 / FrameTime());
        if (!this.target || this.target.IsNull()) {
            this.target = this.GetCasterPlus();
        }
        let pos = this.GetParentPlus().GetAbsOrigin();
        let tar_pos = this.target.GetAbsOrigin();
        let next_pos = GetGroundPosition((pos + (tar_pos - pos as Vector).Normalized() * length) as Vector, unit);
        unit.SetAbsOrigin(next_pos);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
}
@registerModifier()
export class modifier_enigma_magic_immunity extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "enigma_malefice";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
    }
    GetEffectName(): string {
        return "particles/hero/enigma/enigma_magic_immunity.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enigma_7 extends BaseModifier_Plus {
    SetTalentSpellImmunity(caster: IBaseNpc_Plus) {
        let modifier = caster.FindModifierByName("modifier_enigma_magic_immunity");
        if (modifier) {
            let time = modifier.GetRemainingTime() + caster.GetTalentValue("special_bonus_imba_enigma_7");
            modifier.SetDuration(time, true);
        } else {
            caster.AddNewModifier(caster, undefined, "modifier_enigma_magic_immunity", {
                duration: caster.GetTalentValue("special_bonus_imba_enigma_7")
            });
        }
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && !keys.ability.IsItem() && !keys.ability.IsToggle() && keys.ability.GetAbilityName() != "ability_capture") {
            this.SetTalentSpellImmunity(this.GetParentPlus());
        }
    }
}
@registerAbility()
export class imba_enigma_malefice extends BaseAbility_Plus {
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
    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_enigma_2") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enigma_2").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enigma_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_enigma_2", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enigma_7") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enigma_7")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_enigma_7", {});
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enigma_2")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_enigma_2");
        } else {
            return 0;
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let base_duration = this.GetSpecialValueFor("duration");
        let hp_extra_duration = this.GetSpecialValueFor("health_bonus_duration");
        let pct_per_extra = this.GetSpecialValueFor("health_bonus_duration_percent");
        let CalculateDuration = (unit: IBaseNpc_Plus) => {
            let hp_pct = unit.GetHealthPercent();
            let total_duration = base_duration;
            total_duration = total_duration + hp_extra_duration * math.floor((100 - hp_pct) / pct_per_extra);
            return total_duration;
        }
        if (!caster.HasTalent("special_bonus_imba_enigma_2")) {
            let final_duration = CalculateDuration(target);
            target.AddNewModifier(caster, this, "modifier_imba_enigma_malefice", {
                duration: final_duration
            });
        } else {
            let talent_radius = caster.GetTalentValue("special_bonus_imba_enigma_2");
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, talent_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let final_duration = CalculateDuration(enemy);
                enemy.AddNewModifier(caster, this, "modifier_imba_enigma_malefice", {
                    duration: final_duration
                });
            }
        }
    }

    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_enigma_malefice extends BaseModifier_Plus {
    public interval: number;
    public dmg: any;
    public stun_duration: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_enigma/enigma_malefice.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let target = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        this.interval = ability.GetSpecialValueFor("tick_rate");
        this.dmg = ability.GetSpecialValueFor("damage") + caster.GetTalentValue("special_bonus_imba_enigma_malefice_damage");
        this.stun_duration = ability.GetSpecialValueFor("stun_duration");
        this.StartIntervalThink(this.interval);
        this.OnIntervalThink();
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        let damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: this.dmg,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: ability
        }
        ApplyDamage(damageTable);
        target.AddNewModifier(caster, ability, "modifier_generic_stunned", {
            duration: this.stun_duration * (1 - target.GetStatusResistance())
        });
        EmitSoundOn("Hero_Enigma.MaleficeTick", target);
        if (ability.GetAutoCastState()) {
            SearchForEngimaThinker(caster, this.GetParentPlus(), ability.GetSpecialValueFor("pull_strength"));
        }
    }
}
@registerAbility()
export class imba_enigma_demonic_conversion extends BaseAbility_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasTalent("special_bonus_imba_enigma_8") && target.IsRealUnit()) {
                return UnitFilterResult.UF_SUCCESS;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        if (target.GetTeamNumber() != caster.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
        }
        let location = target.GetAbsOrigin();
        EmitSoundOn("Hero_Enigma.Demonic_Conversion", target);
        target.Kill(this, caster);
        target = undefined;
        let eidolon_count = this.GetSpecialValueFor("spawn_count") + caster.GetTalentValue("special_bonus_imba_enigma_6");
        if (eidolon_count > 0) {
            for (let i = 0; i < eidolon_count; i++) {
                this.CreateEidolon(caster, location, 1, this.GetSpecialValueFor("AbilityDuration"));
            }
        }
    }
    CreateEidolon(hParent: IBaseNpc_Plus, vLocation: Vector, iWave: number, fDuration: number) {
        let caster = this.GetCasterPlus();
        if (!GFuncEntity.IsValid(hParent)) {
            hParent = caster;
        }
        let eidolon = caster.CreateSummon("npc_imba_enigma_eidolon_" + math.min(4, this.GetLevel()), vLocation, fDuration, true);
        eidolon.SetOwner(caster);
        // eidolon.SetControllableByPlayer(caster.GetPlayerID(), true);
        eidolon.SetUnitOnClearGround();
        let attacks_needed = this.GetSpecialValueFor("split_attack_count") + this.GetSpecialValueFor("additional_attacks_split") * (iWave - 1);
        eidolon.AddNewModifier(caster, this, "modifier_imba_enigma_eidolon", {
            duration: fDuration,
            wave: iWave,
            parent: caster.entindex(),
            stack: attacks_needed
        });
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_enigma_demonic_conversion_attack_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enigma_demonic_conversion_attack_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enigma_demonic_conversion_attack_range"), "modifier_special_bonus_imba_enigma_demonic_conversion_attack_range", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_enigma_eidolon extends BaseModifier_Plus {
    public attacks: any;
    public last_target: any;
    public parent: IBaseNpc_Plus;
    public trans_pct: number;
    public wave: any;
    public armor_bonus: number;
    public movespeed_bonus: number;
    public attack_speed_bonus: number;
    public health_bonus: number;
    public damage_bonus: number;
    IsDebuff(): boolean {
        return true;
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
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            6: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            7: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        });
    } */
    BeCreated(keys: any): void {
        this.attacks = keys.stack;
        this.last_target = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        if (keys.parent) {
            this.parent = EntIndexToHScript(keys.parent) as IBaseNpc_Plus;
        }
        this.parent = this.parent || this.GetCasterPlus();
        this.trans_pct = ability.GetSpecialValueFor("shard_percentage");
        this.wave = keys.wave;
        this.armor_bonus = this.parent.GetPhysicalArmorValue(false) * this.trans_pct * 0.01;
        this.movespeed_bonus = this.parent.GetIdealSpeed() * this.trans_pct * 0.01;
        this.attack_speed_bonus = (this.parent.GetAttacksPerSecond() * this.parent.GetBaseAttackTime() * 100) * this.trans_pct * 0.01;
        if (!IsServer()) {
            return;
        }
        this.health_bonus = this.parent.GetMaxHealth() * this.trans_pct * 0.01;
        // TODO 
        if (this.parent.HasModifier("modifier_imba_echo_rapier_haste")) {
            let echo_buf = this.parent.findBuff("modifier_imba_echo_rapier_haste") as IBaseModifier_Plus & { attack_speed_buff: number };
            this.attack_speed_bonus = ((this.parent.GetAttacksPerSecond() * this.parent.GetBaseAttackTime() * 100) - echo_buf.attack_speed_buff) * this.trans_pct * 0.01;
        }
        this.damage_bonus = this.trans_pct * this.parent.GetAverageTrueAttackDamage(this.parent) * 0.01;
        this.SetStackCount(this.damage_bonus);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        if (IsServer()) {
            return this.health_bonus;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.movespeed_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetCasterPlus() && !this.GetCasterPlus().IsNull() && this.GetCasterPlus().HasTalent("special_bonus_imba_enigma_demonic_conversion_attack_range")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_enigma_demonic_conversion_attack_range");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && !keys.target.IsBuilding() && this.GetParentPlus().GetOwner() == this.GetCasterPlus()) {
            if (this.GetParentPlus().GetTeamNumber() != keys.target.GetTeamNumber()) {
                let target = keys.target;
                if (!target.HasModifier("modifier_imba_enigma_eidolon_attack_counter")) {
                    target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_enigma_eidolon_attack_counter", {});
                }
                if (!this.GetParentPlus().IsNull() && !this.last_target.IsNull() && this.last_target.FindModifierByNameAndCaster("modifier_imba_enigma_eidolon_attacks_debuff", this.GetParentPlus())) {
                    this.last_target.FindModifierByNameAndCaster("modifier_imba_enigma_eidolon_attacks_debuff", this.GetParentPlus()).Destroy();
                }
                this.last_target = target;
                target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_enigma_eidolon_attacks_debuff", {
                    duration: this.GetSpecialValueFor("increased_mass_duration") * (1 - target.GetStatusResistance())
                });
            }
            if (this.attacks > 1) {
                this.attacks = this.attacks - 1;
            } else {
                if (GFuncEntity.IsValid(this.GetCasterPlus())) {
                    this.GetAbilityPlus<imba_enigma_demonic_conversion>().CreateEidolon(this.parent, this.GetParentPlus().GetAbsOrigin(), this.wave + 1, this.GetRemainingTime() + this.GetSpecialValueFor("life_extension"));
                    this.GetAbilityPlus<imba_enigma_demonic_conversion>().CreateEidolon(this.parent, this.GetParentPlus().GetAbsOrigin(), this.wave + 1, this.GetRemainingTime() + this.GetSpecialValueFor("life_extension"));
                }
                this.GetParentPlus().ForceKill(false);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_enigma_eidolon_attack_counter extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        let debuffs = this.GetParentPlus().FindAllModifiersByName("modifier_imba_enigma_eidolon_attacks_debuff");
        if (GameFunc.GetCount(debuffs) > 0) {
            this.SetStackCount(GameFunc.GetCount(debuffs));
        } else {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_enigma_eidolon_attacks_debuff extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerAbility()
export class imba_enigma_midnight_pulse extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let duration = this.GetSpecialValueFor("duration");
        let radius = this.GetSpecialValueFor("radius");
        EmitSoundOnLocationWithCaster(point, "Hero_Enigma.Midnight_Pulse", caster);
        GridNav.DestroyTreesAroundPoint(point, radius, false);
        BaseModifier_Plus.CreateBuffThinker(caster, this, "modifier_imba_enigma_midnight_pulse_thinker", {
            duration: duration
        }, point, caster.GetTeamNumber(), false);
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_enigma_midnight_pulse_thinker extends BaseModifier_Plus {
    public radius: number;
    public pull_length: any;
    public particle: any;
    IsAura(): boolean {
        return true;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetModifierAura(): string {
        return "modifier_imba_enigma_midnight_pulse_aura";
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        this.GetParentPlus().TempData().midnight = true;
        this.radius = this.GetSpecialValueFor("radius");
        this.pull_length = this.GetSpecialValueFor("pull_strength");
        this.StartIntervalThink(1.0);
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_enigma/enigma_midnight_pulse.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle, 1, Vector(this.radius, 0, 0));
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        GridNav.DestroyTreesAroundPoint(parent.GetAbsOrigin(), this.radius, false);
        let dmg_pct = ability.GetSpecialValueFor("damage_percent") * 0.01;
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false) as IBaseNpc_Plus[];
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsRoshan()) {
                let dmg = enemy.GetMaxHealth() * dmg_pct;
                let damageTable = {
                    victim: enemy,
                    attacker: caster,
                    damage: dmg,
                    damage_type: ability.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    ability: ability
                }
                ApplyDamage(damageTable);
                SearchForEngimaThinker(caster, enemy, this.pull_length);
            }
        }
        let eidolons = FindUnitsInRadius(caster.GetTeamNumber(), parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, eidolon] of GameFunc.iPair(eidolons)) {
            if (eidolon.HasModifier("modifier_imba_enigma_eidolon")) {
                eidolon.ApplyHeal(ability.GetSpecialValueFor("eidolon_hp_regen"), undefined);
            }
        }
        if (caster.HasTalent("special_bonus_imba_enigma_3")) {
            this.radius = this.radius + ability.GetSpecialValueFor("radius") / ability.GetSpecialValueFor("duration");
            ParticleManager.SetParticleControl(this.particle, 1, Vector(this.radius, 0, 0));
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.particle, false);
        ParticleManager.ReleaseParticleIndex(this.particle);
    }
}
@registerModifier()
export class modifier_imba_enigma_midnight_pulse_aura extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    GetTexture(): string {
        return "enigma_midnight_pulse";
    }
}
@registerAbility()
export class imba_enigma_black_hole extends BaseAbility_Plus {
    public radius: number;
    public pull_radius: number;
    public thinker: IBaseNpc_Plus;
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
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_enigma_1") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enigma_1").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enigma_1")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_enigma_1", {});
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_enigma_5") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_enigma_5").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_enigma_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_enigma_5", {});
        }
    }
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("cast_range") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_enigma_5");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_singularity";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().findBuffStack("modifier_imba_singularity", this.GetCasterPlus()) * this.GetSpecialValueFor("singularity_stun_radius_increment_per_stack");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let pos = this.GetCursorPosition();
        let ability = this;
        let base_radius = this.GetSpecialValueFor("radius");
        let extra_radius = this.GetSpecialValueFor("singularity_stun_radius_increment_per_stack");
        let base_pull_radius = this.GetSpecialValueFor("scepter_radius");
        let extra_pull_radius = this.GetSpecialValueFor("singularity_pull_radius_increment_per_stack");
        this.radius = base_radius + extra_radius * caster.findBuff<modifier_imba_singularity>("modifier_imba_singularity").GetStackCount();
        this.pull_radius = base_pull_radius + extra_pull_radius * caster.findBuff<modifier_imba_singularity>("modifier_imba_singularity").GetStackCount();
        let duration = this.GetSpecialValueFor("duration");
        this.thinker = BaseModifier_Plus.CreateBuffThinker(caster, this, "modifier_imba_enigma_black_hole_thinker", {
            duration: duration
        }, pos, caster.GetTeamNumber(), false);
    }
    OnChannelFinish(bInterrupted: boolean): void {
        StopSoundOn("Hero_Enigma.Black_Hole", this.thinker);
        StopSoundOn("Hero_Enigma.BlackHole.Cast", this.thinker);
        if (bInterrupted) {
            this.thinker.findBuff<modifier_imba_enigma_black_hole_thinker>("modifier_imba_enigma_black_hole_thinker").Destroy();
            let singularity = this.GetCasterPlus().findBuff<modifier_imba_singularity>("modifier_imba_singularity");
            if (!singularity) {
                return;
            }
            let caster = this.GetCasterPlus();
            let d_pct = this.GetSpecialValueFor("interrupt_disable_loss_pct");
            let m_pct = this.GetSpecialValueFor("interrupt_manual_loss_pct");
            this.AddTimer(FrameTime(), () => {
                if (caster.IsRooted() || caster.IsSilenced() || caster.IsStunned() || caster.IsHexed() || caster.IsCommandRestricted() || !caster.IsAlive()) {
                    singularity.SetStackCount(math.floor(singularity.GetStackCount() * (100 - d_pct) * 0.01));
                } else {
                    singularity.SetStackCount(math.floor(singularity.GetStackCount() * (100 - m_pct) * 0.01));
                }
            });
        }
    }
    OnOwnerDied(): void {
        let singularity = this.GetCasterPlus().findBuff<modifier_imba_singularity>("modifier_imba_singularity");
        if (singularity) {
            singularity.SetStackCount(math.floor(singularity.GetStackCount() * (100 - this.GetSpecialValueFor("death_loss_pct")) * 0.01));
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_enigma_black_hole_thinker extends BaseModifier_Plus {
    public radius: number;
    public pull_radius: number;
    public pfx_ulti: any;
    public particle: any;
    public think_time: number;
    public dmg: any;
    public scepter: any;
    IsAura(): boolean {
        return true;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetModifierAura(): string {
        return "modifier_imba_enigma_black_hole";
    }
    BeCreated(keys: any): void {
        let ability = this.GetAbilityPlus<imba_enigma_black_hole>();
        this.radius = ability.radius;
        this.pull_radius = ability.pull_radius;
        if (!IsServer()) {
            return;
        }
        // if (this.GetCasterPlus().black_hole_effect) {
        this.pfx_ulti = ResHelper.CreateParticleEx("particles/econ/items/slark/slark_ti6_blade/slark_ti6_pounce_leash_gold_body_energy_pull.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.pfx_ulti, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), false);
        ParticleManager.SetParticleControlEnt(this.pfx_ulti, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), false);
        ParticleManager.SetParticleControl(this.pfx_ulti, 3, this.GetParentPlus().GetAbsOrigin());
        // }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(enemies) >= 5) {
            EmitSoundOn("Imba.EnigmaBlackHoleTobi0" + math.random(1, 5), this.GetParentPlus());
        }
        let buff = this.GetCasterPlus().findBuff<modifier_imba_singularity>("modifier_imba_singularity");
        let stacks = buff.GetStackCount();
        if (!keys.talent) {
            buff.SetStackCount(stacks + GameFunc.GetCount(enemies));
        }
        EmitSoundOn("Hero_Enigma.Black_Hole", this.GetParentPlus());
        EmitSoundOn("Hero_Enigma.BlackHole.Cast", this.GetParentPlus());
        let dummy = this.GetParentPlus();
        GTimerHelper.AddTimer(4.0, GHandler.create({}, () => {
            StopSoundOn("Hero_Enigma.Black_Hole", dummy);
            StopSoundOn("Hero_Enigma.BlackHole.Cast", dummy);
        }));
        let actual_vision = this.radius;
        if (this.GetCasterPlus().HasShard()) {
            actual_vision = this.pull_radius;
        }

        this.particle = ResHelper.CreateParticleEx("particles/econ/items/enigma/enigma_world_chasm/enigma_blackhole_ti5.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.particle, 0, Vector(this.GetParentPlus().GetAbsOrigin().x, this.GetParentPlus().GetAbsOrigin().y, this.GetParentPlus().GetAbsOrigin().z + 64));
        ParticleManager.SetParticleControl(this.particle, 10, Vector(this.radius, actual_vision, 0));
        for (let i = DOTATeam_t.DOTA_TEAM_FIRST; i <= DOTATeam_t.DOTA_TEAM_CUSTOM_MAX; i++) {
            if (i == this.GetParentPlus().GetTeamNumber()) {
                AddFOWViewer(i, this.GetParentPlus().GetAbsOrigin(), actual_vision, FrameTime() * 2, false);
            } else {
                AddFOWViewer(i, this.GetParentPlus().GetAbsOrigin(), 10, FrameTime() * 2, false);
            }
        }
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), actual_vision, false);
        this.think_time = 0;
        this.dmg = this.GetSpecialValueFor("damage");
        this.StartIntervalThink(FrameTime());
        if (this.GetCasterPlus().HasScepter()) {
            this.scepter = true;
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.think_time = this.think_time + FrameTime();
        for (let i = DOTATeam_t.DOTA_TEAM_FIRST; i <= DOTATeam_t.DOTA_TEAM_CUSTOM_MAX; i++) {
            if (i == this.GetParentPlus().GetTeamNumber()) {
                AddFOWViewer(i, this.GetParentPlus().GetAbsOrigin(), this.pull_radius, FrameTime() * 2, false);
            } else {
                AddFOWViewer(i, this.GetParentPlus().GetAbsOrigin(), 10, FrameTime() * 2, false);
            }
        }
        if (this.GetCasterPlus().HasShard()) {
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.pull_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false) as IBaseNpc_Plus[];
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsRoshan()) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_enigma_black_hole_pull", {});
                }
            }
        }
        if (this.think_time >= 1.0) {
            this.think_time = this.think_time - 1.0;
            let midnightDamagePcnt = 0;
            if (this.scepter) {
                let midnight = this.GetCasterPlus().findAbliityPlus<imba_enigma_midnight_pulse>("imba_enigma_midnight_pulse");
                if (midnight && midnight.GetLevel() > 0) {
                    midnightDamagePcnt = midnight.GetSpecialValueFor("damage_percent") * 0.01;
                }
            }
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false) as IBaseNpc_Plus[];
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsRoshan()) {
                    ApplyDamage({
                        victim: enemy,
                        attacker: this.GetCasterPlus(),
                        damage: this.dmg,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        ability: this.GetAbilityPlus()
                    });
                    if (this.scepter) {
                        ApplyDamage({
                            victim: enemy,
                            attacker: this.GetCasterPlus(),
                            damage: enemy.GetMaxHealth() * midnightDamagePcnt,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                            ability: this.GetAbilityPlus()
                        });
                    }
                }
            }
            let singularity = this.GetCasterPlus().findBuff<modifier_imba_singularity>("modifier_imba_singularity");
            if (singularity && singularity.GetStackCount() >= this.GetSpecialValueFor("singularity_cap") && !AoiHelper.IsNearFountain(this.GetCasterPlus().GetAbsOrigin(), 2500)) {
                let buildings = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, building] of GameFunc.iPair(buildings)) {
                    ApplyDamage({
                        victim: building,
                        attacker: this.GetCasterPlus(),
                        damage: this.dmg,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        ability: this.GetAbilityPlus()
                    });
                    building.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                        duration: 1.0 * (1 - building.GetStatusResistance())
                    });
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        StopSoundOn("Hero_Enigma.Black_Hole", this.GetParentPlus());
        StopSoundOn("Hero_Enigma.BlackHole.Cast", this.GetParentPlus());
        StopSoundOn("Hero_Enigma.BlackHole.Cast.Chasm", this.GetParentPlus());
        EmitSoundOn("Hero_Enigma.Black_Hole.Stop", this.GetParentPlus());
        ParticleManager.DestroyParticle(this.particle, false);
        ParticleManager.ReleaseParticleIndex(this.particle);
        if (this.pfx_ulti) {
            ParticleManager.DestroyParticle(this.pfx_ulti, false);
            ParticleManager.ReleaseParticleIndex(this.pfx_ulti);
        }
        this.GetParentPlus().ForceKill(false);
    }
}
@registerModifier()
export class modifier_imba_enigma_black_hole extends BaseModifierMotionHorizontal {
    public radius: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return;
        }
        let state = {}
        if (!this.GetParentPlus().IsRoshan()) {
            state = {
                [modifierstate.MODIFIER_STATE_DISARMED]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true,
                [modifierstate.MODIFIER_STATE_STUNNED]: true
            }
        }
        return state;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus() && this.GetParentPlus().IsRoshan()) {
            this.Destroy();
        }
        let ability = this.GetAbilityPlus<imba_enigma_black_hole>();
        this.radius = ability.radius;
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.BeginMotionOrDestroy()
    }
    CheckSelf() {
        let enigma = this.GetCasterPlus();
        let ability = this.GetAbilityPlus<imba_enigma_black_hole>();
        if (!ability.IsChanneling()) {
            this.Destroy();
            return;
        }
        if (ability.thinker) {
            let distance = CalcDistanceBetweenEntityOBB(ability.thinker, this.GetParentPlus());
            if (distance > this.radius) {
                this.Destroy();
                return;
            }
        }
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, dt: number) {
        let ability = this.GetAbilityPlus<imba_enigma_black_hole>();
        let thinker = ability.thinker;
        let pos = unit.GetAbsOrigin();
        if (thinker && !thinker.IsNull() && ability.IsChanneling()) {
            let thinker_pos = thinker.GetAbsOrigin();
            let next_pos = GetGroundPosition(RotatePosition(thinker_pos, QAngle(0, 0.5, 0), pos), unit);
            let distance = CalcDistanceBetweenEntityOBB(unit, thinker);
            if (distance > 20) {
                next_pos = GetGroundPosition((next_pos + (thinker_pos - next_pos as Vector).Normalized() * 1 as Vector), unit);
            }
            unit.SetAbsOrigin(next_pos);
        }
        this.CheckSelf();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
}
@registerModifier()
export class modifier_imba_enigma_black_hole_pull extends BaseModifierMotionHorizontal_Plus {
    public pull_radius: number;
    public base_pull_distance: number;
    public pull_distance: number;
    IsDebuff(): boolean {
        return true;
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
    RemoveOnDeath(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_LOW;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().IsRoshan()) {
            this.Destroy();
        }
        let ability = this.GetAbilityPlus();
        this.pull_radius = this.GetAbilityPlus<imba_enigma_black_hole>().pull_radius;
        this.base_pull_distance = ability.GetSpecialValueFor("scepter_drag_speed");
        this.BeginMotionOrDestroy()
    }
    CheckSelf(): boolean {
        let enigma = this.GetCasterPlus();
        let ability = this.GetAbilityPlus<imba_enigma_black_hole>();
        if (!ability.IsChanneling()) {
            this.Destroy();
            return;
        }
        if (ability.thinker) {
            let distance = CalcDistanceBetweenEntityOBB(ability.thinker, this.GetParentPlus());
            if (distance > this.pull_radius) {
                this.Destroy();
                return;
            }
        }
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        let ability = this.GetAbilityPlus<imba_enigma_black_hole>();
        this.pull_distance = CalculatePullLength(this.GetCasterPlus(), this.GetParentPlus(), this.base_pull_distance) / (1.0 / FrameTime());
        let thinker = ability.thinker;
        let pos = unit.GetAbsOrigin();
        if (thinker && !thinker.IsNull() && this.GetAbilityPlus().IsChanneling() && !this.GetParentPlus().HasModifier("modifier_imba_enigma_black_hole")) {
            let thinker_pos = thinker.GetAbsOrigin();
            let next_pos = GetGroundPosition((pos + (thinker_pos - pos as Vector).Normalized() * this.pull_distance as Vector), unit);
            unit.SetAbsOrigin(next_pos);
        }
        this.CheckSelf();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
}
@registerModifier()
export class modifier_imba_singularity extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (IsServer() && keys.unit == this.GetParentPlus() && this.GetParentPlus().HasTalent("special_bonus_imba_enigma_4") && this.GetParentPlus().IsRealUnit()) {
            let ability = this.GetAbilityPlus<imba_enigma_black_hole>();
            let duration = ability.GetSpecialValueFor("duration") / this.GetParentPlus().GetTalentValue("special_bonus_imba_enigma_4");
            let base_radius = ability.GetSpecialValueFor("radius");
            let extra_radius = ability.GetSpecialValueFor("singularity_stun_radius_increment_per_stack");
            let base_pull_radius = ability.GetSpecialValueFor("pull_radius");
            let extra_pull_radius = ability.GetSpecialValueFor("singularity_pull_radius_increment_per_stack");
            ability.radius = base_radius + extra_radius * keys.unit.findBuff<modifier_imba_singularity>("modifier_imba_singularity").GetStackCount();
            ability.pull_radius = base_pull_radius + extra_pull_radius * keys.unit.findBuff<modifier_imba_singularity>("modifier_imba_singularity").GetStackCount();
            this.AddTimer(FrameTime(), () => {
                ability.thinker = BaseModifier_Plus.CreateBuffThinker(keys.unit, ability, "modifier_imba_enigma_black_hole_thinker", {
                    duration: duration,
                    talent: 1
                }, keys.unit.GetAbsOrigin(), keys.unit.GetTeamNumber(), false);
            });
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_enigma_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_enigma_malefice_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_enigma_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_enigma_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_enigma_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_enigma_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_enigma_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_enigma_demonic_conversion_attack_range extends BaseModifier_Plus {
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
