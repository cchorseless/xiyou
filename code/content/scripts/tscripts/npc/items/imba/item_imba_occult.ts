
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_occult_mask extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_occult_mask";
    }
}
@registerModifier()
export class modifier_imba_occult_mask extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_self: any;
    public modifier_unique: any;
    public bonus_damage: number;
    public bonus_strength: number;
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
        this.modifier_self = "modifier_imba_occult_mask";
        this.modifier_unique = "modifier_imba_occult_mask_unique";
        if (this.ability) {
            this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
            this.bonus_strength = this.ability.GetSpecialValueFor("bonus_strength");
            if (IsServer()) {
                if (!this.caster.HasModifier(this.modifier_unique)) {
                    this.caster.AddNewModifier(this.caster, this.ability, this.modifier_unique, {});
                }
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.caster.HasModifier(this.modifier_self)) {
                this.caster.RemoveModifierByName(this.modifier_unique);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
}
@registerModifier()
export class modifier_imba_occult_mask_unique extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public radius: number;
    public damage_per_second: number;
    public interval: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        if (this.ability) {
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.damage_per_second = this.ability.GetSpecialValueFor("damage_per_second");
            this.interval = this.ability.GetSpecialValueFor("interval");
            if (IsServer()) {
                this.StartIntervalThink(this.interval);
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let ignore_enemy;
                if (enemy.HasModifier("modifier_imba_souldrain_damage") || enemy.HasModifier("modifier_imba_helldrain_damage")) {
                    ignore_enemy = true;
                }
                if (!ignore_enemy) {
                    let damageTable = {
                        victim: enemy,
                        attacker: this.caster,
                        damage: this.damage_per_second * this.interval,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                        ability: this.ability
                    }
                    let actual_damage = ApplyDamage(damageTable);
                    if (actual_damage > 0) {
                        this.caster.Heal(actual_damage, this.ability);
                    }
                }
            }
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        return this.radius;
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
        return "modifier_imba_occult_mask_drain_debuff";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target.HasModifier("modifier_imba_souldrain_damage") || target.HasModifier("modifier_imba_helldrain_damage")) {
            return true;
        }
        return false;
    }
}
@registerModifier()
export class modifier_imba_occult_mask_drain_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/occult_mask/imba_occult_mask_spirits.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
