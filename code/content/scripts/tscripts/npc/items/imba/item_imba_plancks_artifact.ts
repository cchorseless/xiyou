
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 自定义
@registerAbility()
export class item_imba_plancks_artifact extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_plancks_artifact_basic";
    }
    set_respawn_time(reset = false): void {
        if (reset) {
            this.GetCasterPlus().TempData().plancks_artifact_respawn_reduction = undefined;
            print("PLANCK: resetting respawn time");
        } else {
            this.GetCasterPlus().TempData().plancks_artifact_respawn_reduction = this.GetSpecialValueFor("respawn_time_reduction") * this.GetCurrentCharges();
            print("PLANCK: setting respawn reduction time to " + tostring(this.GetCasterPlus().TempData().plancks_artifact_respawn_reduction));
        }
    }
    OnSpellStart(): void {
        if (this.GetCasterPlus().HasModifier("modifier_imba_reincarnation")) {
            this.GetCasterPlus().Kill(this, this.GetCasterPlus());
        } else {
            this.GetCasterPlus().TrueKilled(this.GetCasterPlus(), this);
        }
        let units_to_damage = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("implosion_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let damage = this.GetCasterPlus().GetMana() * this.GetSpecialValueFor("implosion_damage_percent");
        for (const [_, unit] of GameFunc.iPair(units_to_damage)) {
            ApplyDamage({
                victim: unit,
                attacker: this.GetCasterPlus(),
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
            });
        }
        let particle = ResHelper.CreateParticleEx("particles/econ/items/antimage/antimage_weapon_basher_ti5/antimage_manavoid_ti_5.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(particle);
    }
}
@registerModifier()
export class modifier_imba_plancks_artifact_basic extends BaseModifier_Plus {
    public modifier_self: any;
    public modifier_unique: any;
    public modifier_implosion: any;
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
        if (IsServer()) {
            this.modifier_self = "modifier_imba_plancks_artifact_basic";
            this.modifier_unique = "modifier_imba_plancks_artifact_unique";
            this.modifier_implosion = "modifier_imba_plancks_artifact_implosion";
            if (!this.GetCasterPlus().HasModifier(this.modifier_unique)) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), this.modifier_unique, {});
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasModifier(this.modifier_unique)) {
                this.GetCasterPlus().RemoveModifierByName(this.modifier_unique);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_mana");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_health");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        let reg = this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
        if (IsServer()) {
            reg = reg + this.GetItemPlus().GetSpecialValueFor("mana_regen_per_charge") * this.GetItemPlus().GetCurrentCharges();
        }
        return reg;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_intelligence");
    }
}
@registerModifier()
export class modifier_imba_plancks_artifact_unique extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.GetItemPlus<item_imba_plancks_artifact>().set_respawn_time();
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetItemPlus<item_imba_plancks_artifact>().set_respawn_time(true);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(args: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetItemPlus().GetCurrentCharges();
        let caster = this.GetItemPlus().GetCasterPlus();
        let target = args.unit as IBaseNpc_Plus;
        if (target != caster) {
            // if (!target.IsRealUnit() || target.IsClone()) {
            //     return undefined;
            // }
            if ((this.GetItemPlus().GetCasterPlus().GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D() > this.GetItemPlus().GetSpecialValueFor("stack_gain_radius")) {
                return undefined;
            }
            this.GetItemPlus().SetCurrentCharges(this.GetItemPlus().GetCurrentCharges() + 1);
            this.GetItemPlus<item_imba_plancks_artifact>().set_respawn_time();
        } else {
            // if (caster.WillReincarnate()) {
            //     return undefined;
            // }
            let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.GetItemPlus().GetSpecialValueFor("heal_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
            let heal_amount = this.GetItemPlus().GetSpecialValueFor("heal_on_death_base") + stacks * this.GetItemPlus().GetSpecialValueFor("heal_on_death_per_charge");
            for (const unit of (allies)) {
                unit.ApplyHeal(heal_amount, this.GetItemPlus());
            }
            let new_stacks = math.floor(stacks * this.GetItemPlus().GetSpecialValueFor("on_death_loss"));
            this.GetItemPlus().SetCurrentCharges(new_stacks);
            this.GetItemPlus<item_imba_plancks_artifact>().set_respawn_time();
        }
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
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPermanent(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    GetModifierSpellLifesteal() {
        return this.GetItemPlus().GetSpecialValueFor("spell_lifesteal");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_cooldown");
    }
}
