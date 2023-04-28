
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 自定义
@registerAbility()
export class item_imba_black_queen_cape extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_black_queen_cape_passive";
    }

    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let urn_particle = "particles/items2_fx/urn_of_shadows.vpcf";
        let bkb_modifier = "modifier_imba_black_queen_cape_active_bkb";
        let heal_modifier = "modifier_imba_black_queen_cape_active_heal";
        let heal = this.GetSpecialValueFor("heal");
        let heal_duration = this.GetSpecialValueFor("heal_duration");
        let bkb_duration = this.GetSpecialValueFor("bkb_duration");
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        EmitSoundOn("DOTA_Item.BlackKingBar.Activate", target);
        let particle_fx = ResHelper.CreateParticleEx(urn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(particle_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_fx, 1, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_fx);
        target.AddNewModifier(caster, this, bkb_modifier, {
            duration: bkb_duration
        });
        target.Purge(false, true, false, false, false);
        for (const modifier_name of (GameServiceConfig.IMBA_EtherealAbilities)) {
            if (target.HasModifier(modifier_name)) {
                target.RemoveModifierByName(modifier_name);
            }
        }
        if (this.GetCurrentCharges() > 0 && !target.IsBuilding()) {
            EmitSoundOn("DOTA_Item.UrnOfShadows.Activate", target);
            target.AddNewModifier(caster, this, heal_modifier, {
                duration: heal_duration,
                heal: heal,
                bkb_modifier: bkb_modifier
            });
            this.SetCurrentCharges(this.GetCurrentCharges() - 1);
        }
    }
}
@registerModifier()
export class modifier_imba_black_queen_cape_passive extends BaseModifier_Plus {
    public item: any;
    public parent: IBaseNpc_Plus;
    public soultrap_range: number;
    public bonus_armor: number;
    public bonus_damage: number;
    public bonus_mana_regen: number;
    public bonus_health_regen: number;
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
        this.bonus_damage = this.item.GetSpecialValueFor("bonus_damage");
        this.bonus_mana_regen = this.item.GetSpecialValueFor("bonus_mana_regen");
        this.bonus_health_regen = this.item.GetSpecialValueFor("bonus_health_regen");
        this.bonus_agility = this.item.GetSpecialValueFor("bonus_agility");
        this.bonus_strength = this.item.GetSpecialValueFor("bonus_strength");
        this.bonus_intelligence = this.item.GetSpecialValueFor("bonus_intelligence");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            7: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            8: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        }
        return Object.values(decFuns);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(params: ModifierAttackEvent): void {
        if (!IsServer()) {
            return undefined;
        }
        let target = params.target;
        let cape_item_name = "item_imba_black_queen_cape";
        if (!target.IsRealUnit()) {
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
                            if ((item.GetAbilityName() == cape_item_name) && (item.GetPurchaser() == ally)) {
                                if ((ally.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D() < our_distance) {
                                    return undefined;
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i <= 5; i++) {
            let item = this.parent.GetItemInSlot(i);
            if (item) {
                if (item.GetAbilityName() == cape_item_name) {
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.bonus_health_regen;
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
}
@registerModifier()
export class modifier_imba_black_queen_cape_active_heal extends BaseModifier_Plus {
    public heal: any;
    public heal_duration: number;
    public health_regen: any;
    public bkb_modifier: any;
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
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.heal = this.GetItemPlus().GetSpecialValueFor("heal");
        this.heal_duration = this.GetItemPlus().GetSpecialValueFor("heal_duration");
        this.health_regen = this.heal / this.heal_duration;
        if (IsServer()) {
            this.bkb_modifier = params.bkb_modifier;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    GetEffectName(): string {
        return "particles/items2_fx/urn_of_shadows_heal.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.health_regen;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if ((params.unit != this.GetParentPlus()) || (!params.attacker.IsRealUnit())) {
            return;
        }
        if (this.GetParentPlus().HasModifier(this.bkb_modifier)) {
            return;
        }
        if (params.damage > 0) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_black_queen_cape_active_bkb extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
    }
    GetEffectName(): string {
        return "particles/item/black_queen_cape/black_king_bar_avatar.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
