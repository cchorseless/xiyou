
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_hellblade extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_hellblade";
    }
    GetAbilityTextureName(): string {
        return "imba_hellblade";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let ability = this;
            let sound_cast = "Imba.Curseblade";
            let datadrive_baseclass = "modifier_datadriven";
            let debuff = "modifier_item_imba_hellblade_debuff";
            let duration = this.GetSpecialValueFor("duration");
            EmitSoundOn(sound_cast, caster);
            target.AddNewModifier(caster, ability, debuff, {
                duration: duration * (1 - target.GetStatusResistance())
            });
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            if (target.IsMagicImmune()) {
                return undefined;
            }
        }
    }
    TransferAllDebuffs(caster: IBaseNpc_Plus, target: IBaseNpc_Plus) {
        if (IsServer()) {
            let modifiers = caster.FindAllModifiers() as IBaseModifier_Plus[];
            for (const [_, modifier] of ipairs(modifiers)) {
                let modifier_found = false;
                let modifier_name = modifier.GetName();
                if (modifier.IsDebuff && modifier.IsPurgable && modifier.ApplyHorizontalMotionController == undefined && modifier.ApplyVerticalMotionController == undefined) {
                    if (modifier.IsDebuff() && modifier.IsPurgable()) {
                        modifier_found = true;
                    }
                }
                if (IsVanillaDebuff(modifier_name)) {
                    modifier_found = true;
                }
                if (!modifier_found) {
                    for (const [_, modifier_name_in_list] of ipairs(DISPELLABLE_DEBUFF_LIST)) {
                        if (modifier_name == modifier_name_in_list) {
                            modifier_found = true;
                        }
                    }
                }
                if (modifier_found && modifier_name != "modifier_item_imba_spirit_vessel_damage") {
                    let modifier_duration = modifier.GetDuration();
                    caster.RemoveModifierByName(modifier_name);
                    print("Transferring modifier '" + modifier_name + "' via Hellblade.");
                    let modifier_ability = modifier.GetItemPlus();
                    let modifier_class = modifier.GetClass();
                    if (modifier_ability != undefined) {
                        if (modifier_class == datadrive_baseclass) {
                            modifier_ability.ApplyDataDrivenModifier(caster, target, modifier_name, {
                                duration: modifier_duration
                            });
                        } else {
                            target.AddNewModifier(caster, modifier_ability, modifier_name, {
                                duration: modifier_duration
                            });
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_helldrain extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_aoe");
    }
    GetModifierAura(): string {
        return "modifier_imba_helldrain_damage";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.StartIntervalThink(this.GetItemPlus().GetSpecialValueFor("aura_damage_heal_interval"));
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.OnCreated();
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let item = this.GetItemPlus();
            let caster = item.GetCasterPlus();
            let location = caster.GetAbsOrigin();
            let radius = item.GetSpecialValueFor("aura_aoe");
            let heal_per_enemy = item.GetSpecialValueFor("aura_damage_per_second");
            let heal_interval = item.GetSpecialValueFor("aura_damage_heal_interval");
            if (caster.IsIllusion()) {
                heal_per_enemy = heal_per_enemy / 2;
            }
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, radius, item.GetAbilityTargetTeam(), item.GetAbilityTargetType(), item.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            let valid_enemies = 0;
            for (const [_, enemy] of ipairs(enemies)) {
                if (enemy.HasModifier("modifier_imba_helldrain_damage")) {
                    let actual_damage = ApplyDamage({
                        victim: enemy,
                        attacker: caster,
                        ability: item,
                        damage: heal_per_enemy * heal_interval,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                        ability: item
                    });
                    caster.Heal(actual_damage, caster);
                    valid_enemies = valid_enemies + 1;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_helldrain_damage extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_item_imba_hellblade extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public agility_bonus: number;
    public intelligence_bonus: number;
    public strength_bonus: number;
    public damage: number;
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
        this.agility_bonus = this.ability.GetSpecialValueFor("agility_bonus");
        this.intelligence_bonus = this.ability.GetSpecialValueFor("intelligence_bonus");
        this.strength_bonus = this.ability.GetSpecialValueFor("strength_bonus");
        this.damage = this.ability.GetSpecialValueFor("damage");
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_imba_helldrain")) {
                parent.AddNewModifier(parent, this.GetItemPlus(), "modifier_imba_helldrain", {});
            }
            if (!this.caster.HasModifier("modifier_item_imba_hellblade_unique")) {
                this.caster.AddNewModifier(this.caster, this.ability, "modifier_item_imba_hellblade_unique", {});
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_item_imba_hellblade")) {
                parent.RemoveModifierByName("modifier_imba_helldrain");
            }
            if (!this.caster.IsNull() && !this.caster.HasModifier("modifier_item_imba_hellblade")) {
                this.caster.RemoveModifierByName("modifier_item_imba_hellblade_unique");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.agility_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.intelligence_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.strength_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.damage;
    }
}
@registerModifier()
export class modifier_item_imba_hellblade_unique extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public sound_cast: any;
    public datadrive_baseclass: any;
    public transfer_chance: number;
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
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.sound_cast = "Imba.Curseblade";
        this.datadrive_baseclass = "modifier_datadriven";
        this.transfer_chance = this.ability.GetSpecialValueFor("transfer_chance");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACKED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_OnAttacked(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.attacker;
            let modifier_transferred = false;
            let debuff_found = false;
            let is_valid_debuff = false;
            if (keys.target == this.caster && GFuncRandom.PRD(this.transfer_chance, this)) {
                if (target.IsMagicImmune()) {
                    return undefined;
                }
                let modifiers = this.caster.FindAllModifiers();
                for (const [_, modifier] of ipairs(modifiers)) {
                    if (modifier.IsDebuff && modifier.IsPurgable && modifier.ApplyHorizontalMotionController == undefined && modifier.ApplyVerticalMotionController == undefined && modifier.GetName() != "modifier_item_imba_spirit_vessel_damage") {
                        if (modifier.IsDebuff() && modifier.IsPurgable()) {
                            debuff_found = true;
                            return;
                        }
                    }
                    let modifier_name = modifier.GetName();
                    if (!debuff_found) {
                        if (IsVanillaDebuff(modifier_name)) {
                            debuff_found = true;
                        }
                    }
                    if (!debuff_found) {
                        for (const [_, modifier_name_in_list] of ipairs(DISPELLABLE_DEBUFF_LIST)) {
                            if (modifier_name == modifier_name_in_list) {
                                debuff_found = true;
                                return;
                            }
                        }
                    }
                    if (debuff_found) {
                        return;
                    }
                }
                if (debuff_found) {
                    while (!modifier_transferred) {
                        let random_modifier_index = math.random(1, GameFunc.GetCount(modifiers));
                        let modifier = modifiers[random_modifier_index];
                        let modifier_name = modifier.GetName();
                        if (modifier.IsDebuff && modifier.IsPurgable && modifier.ApplyHorizontalMotionController == undefined && modifier.ApplyVerticalMotionController == undefined) {
                            if (modifier.IsDebuff() && modifier.IsPurgable()) {
                                is_valid_debuff = true;
                            }
                        }
                        if (!is_valid_debuff) {
                            if (IsVanillaDebuff(modifier_name)) {
                                is_valid_debuff = true;
                            }
                        }
                        if (!is_valid_debuff) {
                            for (const [_, modifier_name_in_list] of ipairs(DISPELLABLE_DEBUFF_LIST)) {
                                if (modifier_name == modifier_name_in_list) {
                                    is_valid_debuff = true;
                                    return;
                                }
                            }
                        }
                        if (is_valid_debuff) {
                            let modifier_duration = modifier.GetRemainingTime();
                            this.caster.RemoveModifierByName(modifier_name);
                            modifier_transferred = true;
                            let modifier_ability = modifier.GetItemPlus();
                            let modifier_class = modifier.GetClass();
                            if (modifier_ability != undefined) {
                                if (modifier_class == this.datadrive_baseclass) {
                                    modifier_ability.ApplyDataDrivenModifier(this.caster, target, modifier_name, {
                                        duration: modifier_duration
                                    });
                                } else {
                                    target.AddNewModifier(this.caster, modifier_ability, modifier_name, {
                                        duration: modifier_duration
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_hellblade_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ability: item_imba_hellblade;
    public particle_drain: any;
    public tick_rate: any;
    public lifedrain_per_second: any;
    public manadrain_per_second: any;
    public slow_amount: number;
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

        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.ability = this.GetItemPlus();
        this.particle_drain = "particles/hero/skeleton_king/skeleton_king_vampiric_aura_lifesteal.vpcf";
        this.tick_rate = this.ability.GetSpecialValueFor("tick_rate");
        this.lifedrain_per_second = this.ability.GetSpecialValueFor("lifedrain_per_second");
        this.manadrain_per_second = this.ability.GetSpecialValueFor("manadrain_per_second");
        this.slow_amount = this.ability.GetSpecialValueFor("slow_amount");
        this.ability.TransferAllDebuffs(this.caster, this.parent);
        this.StartIntervalThink(this.tick_rate);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_amount;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetEffectName(): string {
        return "particles/item/curseblade/imba_hellblade_curse.vpcf";
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.ability.TransferAllDebuffs(this.caster, this.parent);
            let particle_drain_fx = ResHelper.CreateParticleEx(this.particle_drain, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
            ParticleManager.SetParticleControl(particle_drain_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_drain_fx, 1, this.caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_drain_fx);
            let lifedrain = this.lifedrain_per_second * this.tick_rate;
            let manadrain = this.manadrain_per_second * this.tick_rate;
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: lifedrain,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS,
                ability: this.ability
            }
            ApplyDamage(damageTable);
            this.caster.Heal(lifedrain, this.GetItemPlus());
            this.parent.ReduceMana(manadrain);
            this.caster.GiveMana(manadrain);
        }
    }
}
