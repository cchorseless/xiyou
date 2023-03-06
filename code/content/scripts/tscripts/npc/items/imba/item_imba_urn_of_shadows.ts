
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_urn_of_shadows extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_urn_of_shadows_passive";
    }
    GetAbilityTextureName(): string {
        return "item_urn_of_shadows";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.GetTeam() != target.GetTeam() && target.IsMagicImmune()) {
                return UnitFilterResult.UF_FAIL_MAGIC_IMMUNE_ENEMY;
            }
            return UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
        }
    }
    OnSpellStart(): void {
        if (this.GetPurchaseTime() == -1) {
            return;
        }
        let urn_particle = "particles/items2_fx/urn_of_shadows.vpcf";
        let heal_modifier = "modifier_imba_urn_of_shadows_active_ally";
        let damage_modifier = "modifier_imba_urn_of_shadows_active_enemy";
        let damage = this.GetSpecialValueFor("damage");
        let heal = this.GetSpecialValueFor("heal");
        let duration = this.GetSpecialValueFor("duration");
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        EmitSoundOn("DOTA_Item.UrnOfShadows.Activate", target);
        let particle_fx = ResHelper.CreateParticleEx(urn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(particle_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_fx, 1, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_fx);
        if (target.GetTeam() == caster.GetTeam()) {
            target.AddNewModifier(caster, this, heal_modifier, {
                duration: duration,
                heal: heal
            });
        } else {
            target.AddNewModifier(caster, this, damage_modifier, {
                duration: duration,
                damage: damage
            });
        }
        this.SetCurrentCharges(this.GetCurrentCharges() - 1);
    }
}
@registerModifier()
export class modifier_imba_urn_of_shadows_passive extends BaseModifier_Plus {
    public item: any;
    public parent: IBaseNpc_Plus;
    public soultrap_range: number;
    public bonus_armor: number;
    public bonus_mana_regen: number;
    public bonus_agility: number;
    public bonus_strength: number;
    public bonus_intelligence: number;
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
        this.item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.soultrap_range = this.item.GetSpecialValueFor("soultrap_range");
        this.bonus_armor = this.item.GetSpecialValueFor("bonus_armor");
        this.bonus_mana_regen = this.item.GetSpecialValueFor("bonus_mana_regen");
        this.bonus_agility = this.item.GetSpecialValueFor("bonus_agility");
        this.bonus_strength = this.item.GetSpecialValueFor("bonus_strength");
        this.bonus_intelligence = this.item.GetSpecialValueFor("bonus_intelligence");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let die_time = this.GetDieTime();
        let charges = this.GetItemPlus().GetCurrentCharges();
        let parent = this.GetParentPlus();
        this.AddTimer(0.75, () => {
            if (!parent.IsNull() && parent.HasItemInInventory("item_imba_black_queen_cape") || parent.HasItemInInventory("item_imba_spirit_vessel")) {
                for (let itemSlot = 0; itemSlot <= 5; itemSlot++) {
                    if (parent.GetItemInSlot) {
                        let item = parent.GetItemInSlot(itemSlot);
                        if (item && (item.GetName() == "item_imba_black_queen_cape" || item.GetName() == "item_imba_spirit_vessel")) {
                            item.SetCurrentCharges(math.max(charges, 0));
                            return;
                        }
                    }
                }
            }
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            6: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        }
        return Object.values(decFuns);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(params: ModifierAttackEvent): void {
        if (!IsServer()) {
            return undefined;
        }
        let target = params.target;
        let black_queen_cape_modifier = "modifier_imba_black_queen_cape_passive";
        let urn_item_name = "item_imba_urn_of_shadows";
        let cape_item_name = "item_imba_black_queen_cape";
        if (!target.IsRealHero()) {
            return undefined;
        }
        if (this.parent.IsIllusion()) {
            return undefined;
        }
        if ((this.parent != this.item.GetPurchaser())) {
            return undefined;
        }
        if (this.parent.GetTeamNumber() == target.GetTeamNumber()) {
            return undefined;
        }
        if ((this.parent.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D() > this.soultrap_range) {
            return undefined;
        }
        if (this.parent.HasModifier(black_queen_cape_modifier)) {
            return undefined;
        }
        let team_filter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
        let type_filter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
        let flag_filter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS;
        let allies_in_vicinity = FindUnitsInRadius(this.parent.GetTeamNumber(), target.GetAbsOrigin(), undefined, this.soultrap_range, team_filter, type_filter, flag_filter, FindOrder.FIND_CLOSEST, false);
        let our_distance = (this.parent.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D();
        if (GameFunc.GetCount(allies_in_vicinity) > 1) {
            for (const [_, ally] of GameFunc.iPair(allies_in_vicinity)) {
                if (ally != this.parent) {
                    for (let i = 0; i <= 5; i++) {
                        let item = ally.GetItemInSlot(i);
                        if (item) {
                            if ((item.GetName() == urn_item_name || item.GetName() == "item_imba_spirit_vessel") && (item.GetPurchaser() == ally)) {
                                if ((ally.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D() < our_distance) {
                                    return undefined;
                                }
                            } else if ((item.GetName() == cape_item_name) && (item.GetPurchaser() == ally)) {
                                return undefined;
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i <= 5; i++) {
            let item = this.parent.GetItemInSlot(i);
            if (item) {
                if (item.GetName() == urn_item_name) {
                    if (item != this.item) {
                        return undefined;
                    }
                    let gained_charges = 1;
                    let current_charges = item.GetCurrentCharges();
                    if (current_charges == 0) {
                        gained_charges = 2;
                    }
                    item.SetCurrentCharges(current_charges + gained_charges);
                    return;
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intelligence;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
}
@registerModifier()
export class modifier_imba_urn_of_shadows_active_ally extends BaseModifier_Plus {
    public health_regen: any;
    IsDebuff(): boolean {
        return false;
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
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.health_regen = (params.heal || this.GetItemPlus().GetSpecialValueFor("heal")) / params.duration;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuns);
    } */
    GetEffectName(): string {
        return "particles/items2_fx/urn_of_shadows_heal.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetTexture(): string {
        return "item_urn_of_shadows";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.health_regen;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return undefined;
        }
        if ((params.unit != this.GetParentPlus()) || (!params.attacker.IsHero())) {
            return undefined;
        }
        if (params.damage > 0) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_urn_of_shadows_active_enemy extends BaseModifier_Plus {
    public damage_per_second: number;
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
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/items2_fx/urn_of_shadows_damage.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetTexture(): string {
        return "item_urn_of_shadows";
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.damage_per_second = params.damage / params.duration;
        this.StartIntervalThink(1);
    }
    OnIntervalThink() {
        let damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: this.damage_per_second,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS,
            ability: this.GetItemPlus()
        }
        ApplyDamage(damageTable);
    }
}
