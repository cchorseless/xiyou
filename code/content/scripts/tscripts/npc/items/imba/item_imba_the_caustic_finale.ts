
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_the_caustic_finale extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_the_caustic_finale";
    }
    OnOwnerDied( /** params */): void {
        let hOwner = this.GetOwnerPlus();
        if (hOwner.IsReincarnating && hOwner.IsReincarnating()) {
            return undefined;
        }
        hOwner.DropItemAtPositionImmediate(this, hOwner.GetAbsOrigin());
    }
}
@registerModifier()
export class modifier_item_the_caustic_finale extends BaseModifier_Plus {
    public bonus_damage: number;
    public bonus_attack_speed: number;
    public caustic_duration: number;
    public max_stack_count: number;
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
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        this.bonus_attack_speed = this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
        this.caustic_duration = this.GetItemPlus().GetSpecialValueFor("caustic_duration");
        this.max_stack_count = this.GetItemPlus().GetSpecialValueFor("max_stack_count");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.GetParentPlus().IsIllusion()) {
                return;
            }
            if (this.GetParentPlus() == params.attacker) {
                let Target = params.target;
                if (Target != undefined && Target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                    let hCausticBuff = Target.findBuff<modifier_sand_king_boss_caustic_finale>("modifier_sand_king_boss_caustic_finale");
                    if (hCausticBuff == undefined) {
                        hCausticBuff = Target.AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_sand_king_boss_caustic_finale", {
                            duration: this.caustic_duration
                        }) as modifier_sand_king_boss_caustic_finale;
                        if (hCausticBuff != undefined) {
                            hCausticBuff.SetStackCount(0);
                        }
                    }
                    if (hCausticBuff != undefined) {
                        hCausticBuff.SetStackCount(math.min(hCausticBuff.GetStackCount() + 1, this.max_stack_count));
                        hCausticBuff.SetDuration(this.caustic_duration, true);
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage( /** params */): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant( /** params */): number {
        return this.bonus_attack_speed;
    }
    GetEffectName(): string {
        return "particles/item/rapier/rapier_trail_arcane.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.FORCE_DRAW_MINIMAP)
    CC_GetForceDrawOnMinimap(): 0 | 1 {
        return 1;
    }
}
@registerModifier()
export class modifier_sand_king_boss_caustic_finale extends BaseModifier_Plus {
    public caustic_radius: number;
    public caustic_damage: number;
    public nArmorReductionPerStack: any;
    GetTexture(): string {
        return "the_caustic_finale";
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caustic_radius = this.GetItemPlus().GetSpecialValueFor("caustic_radius");
        this.caustic_damage = this.GetItemPlus().GetSpecialValueFor("caustic_damage");
        this.nArmorReductionPerStack = math.max(math.floor(this.GetItemPlus().GetSpecialValueFor("caustic_armor_reduction_pct") * this.GetParentPlus().GetPhysicalArmorValue(false) / 100), 1);
        if (IsServer()) {
            ParticleManager.ReleaseParticleIndex(ResHelper.CreateParticleEx("particles/units/heroes/hero_sandking/sandking_caustic_finale_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus()));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.nArmorReductionPerStack == undefined) {
            return 0;
        }
        return this.nArmorReductionPerStack * this.GetStackCount() * -1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetParentPlus()) {
                EmitSoundOn("Ability.SandKing_CausticFinale", this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(ResHelper.CreateParticleEx("particles/units/heroes/hero_sandking/sandking_caustic_finale_explode.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus()));
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetOrigin(), undefined, this.caustic_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST, false);
                for (const [_, hEnemy] of GameFunc.iPair(enemies)) {
                    if (hEnemy != undefined && hEnemy.IsAlive() && hEnemy.IsInvulnerable() == false) {
                        let damageInfo = {
                            victim: hEnemy,
                            attacker: this.GetCasterPlus(),
                            damage: this.caustic_damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this.GetItemPlus()
                        }
                        ApplyDamage(damageInfo);
                    }
                }
            }
        }
    }
}
