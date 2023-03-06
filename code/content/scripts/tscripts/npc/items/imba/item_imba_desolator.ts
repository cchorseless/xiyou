
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function Desolate(attacker: IBaseNpc_Plus, target: IBaseNpc_Plus, ability: IBaseItem_Plus, modifier_name: string, duration: number) {
    if (!target.HasModifier(modifier_name)) {
        target.EmitSound("Item_Desolator.Target");
    }
    target.AddNewModifier(attacker, ability, modifier_name, {
        duration: duration * (1 - target.GetStatusResistance())
    });
}
@registerAbility()
export class item_imba_blight_stone extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_blight_stone";
    }
}
@registerModifier()
export class modifier_item_imba_blight_stone extends BaseModifier_Plus {
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
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            if (owner != keys.attacker) {
                return;
            }
            let target = keys.target;
            if (owner.IsIllusion()) {
                return;
            }
            if (target.HasModifier("modifier_item_imba_desolator_debuff") || target.HasModifier("modifier_item_imba_desolator_2_debuff")) {
                return;
            }
            let ability = this.GetItemPlus();
            Desolate(owner, target, ability, "modifier_item_imba_blight_stone_debuff", ability.GetSpecialValueFor("duration"));
        }
    }
}
@registerModifier()
export class modifier_item_imba_blight_stone_debuff extends BaseModifier_Plus {
    public armor_reduction: any;
    public vision_reduction: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let ability = this.GetItemPlus();
        if (!ability) {
            this.Destroy();
            return undefined;
        }
        this.armor_reduction = (-1) * ability.GetSpecialValueFor("armor_reduction");
        this.vision_reduction = (-1) * ability.GetSpecialValueFor("vision_reduction");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return this.vision_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.vision_reduction;
    }
}
@registerAbility()
export class item_imba_desolator extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_desolator";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let target_loc = this.GetCursorPosition();
            let projectile_radius = this.GetSpecialValueFor("projectile_radius");
            let projectile_length = this.GetSpecialValueFor("projectile_length");
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            caster.EmitSound("Imba.DesolatorCast");
            let projectile_direction = (target_loc - caster_loc as Vector).Normalized();
            if (target_loc == caster_loc) {
                projectile_direction = caster.GetForwardVector();
            }
            let desolator_projectile: CreateLinearProjectileOptions = {
                Ability: this,
                EffectName: "particles/item/desolator/desolator_active.vpcf",
                vSpawnOrigin: caster_loc + projectile_direction * 50 + Vector(0, 0, 100) as Vector,
                fDistance: projectile_length,
                fStartRadius: projectile_radius,
                fEndRadius: projectile_radius,
                Source: caster,
                bHasFrontalCone: false,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                // bDeleteOnHit: false,
                vVelocity: projectile_direction * projectile_speed as Vector,
                bProvidesVision: false,
                iVisionRadius: 0,
                iVisionTeamNumber: caster.GetTeamNumber()
            }
            ProjectileManager.CreateLinearProjectile(desolator_projectile);
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, target_loc: Vector): boolean | void {
        if (IsServer() && target) {
            let active_damage = this.GetSpecialValueFor("active_damage");
            target.EmitSound("Item_Desolator.Target");
            target.RemoveModifierByName("modifier_item_imba_blight_stone_debuff");
            if (!target.HasModifier("modifier_item_imba_desolator_2_debuff")) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_desolator_debuff", {
                    duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
                });
            }
            let effect_pfx = ResHelper.CreateParticleEx("particles/item/desolator/desolator_active_damage.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
            ParticleManager.SetParticleControl(effect_pfx, 0, target_loc);
            ParticleManager.SetParticleControl(effect_pfx, 1, target_loc + Vector(0, 0, 100) as Vector);
            ParticleManager.ReleaseParticleIndex(effect_pfx);
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: target,
                ability: this,
                damage: active_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
            });
        }
    }
}
@registerModifier()
export class modifier_item_imba_desolator extends BaseModifier_Plus {
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
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("damage");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetItemPlus()) {
            let owner = this.GetParentPlus();
            if (owner != keys.attacker) {
                return;
            }
            let target = keys.target;
            if (owner.IsIllusion()) {
                return;
            }
            if (target.HasModifier("modifier_item_imba_desolator_2_debuff")) {
                return;
            }
            target.RemoveModifierByName("modifier_item_imba_blight_stone_debuff");
            let ability = this.GetItemPlus();
            Desolate(owner, target, ability, "modifier_item_imba_desolator_debuff", ability.GetSpecialValueFor("duration"));
        }
    }
}
@registerModifier()
export class modifier_item_imba_desolator_debuff extends BaseModifier_Plus {
    public armor_reduction: any;
    public vision_reduction: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        let ability = this.GetItemPlus();
        this.armor_reduction = (-1) * ability.GetSpecialValueFor("armor_reduction");
        this.vision_reduction = (-1) * ability.GetSpecialValueFor("vision_reduction");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return this.vision_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.vision_reduction;
    }
}
@registerAbility()
export class item_imba_desolator_2 extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_desolator_2";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let caster_loc = caster.GetAbsOrigin();
        let target_loc = this.GetCursorPosition();
        let projectile_radius = this.GetSpecialValueFor("projectile_radius");
        let projectile_length = this.GetSpecialValueFor("projectile_length");
        let projectile_speed = this.GetSpecialValueFor("projectile_speed");
        let projectile_cone = this.GetSpecialValueFor("projectile_cone");
        let projectile_amount = this.GetSpecialValueFor("projectile_amount");
        let projectile_directions: Vector[] = []
        let main_direction = (target_loc - caster_loc as Vector).Normalized();
        if (target_loc == caster_loc) {
            main_direction = caster.GetForwardVector();
        }
        let angle_step = projectile_cone / (projectile_amount - 1);
        for (let i = 0; i < projectile_amount; i++) {
            projectile_directions[i] = RotatePosition(caster_loc, QAngle(0, (i - 1) * angle_step - projectile_cone * 0.5, 0), caster_loc + main_direction * 50 as Vector);
        }
        let desolator_projectile: CreateLinearProjectileOptions = {
            Ability: this,
            EffectName: "particles/item/desolator/desolator2_active.vpcf",
            vSpawnOrigin: caster_loc + main_direction * 50 + Vector(0, 0, 100) as Vector,
            fDistance: projectile_length,
            fStartRadius: projectile_radius,
            fEndRadius: projectile_radius,
            Source: caster,
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            // bDeleteOnHit: false,
            vVelocity: main_direction * projectile_speed as Vector,
            bProvidesVision: false,
            iVisionRadius: 0,
            iVisionTeamNumber: caster.GetTeamNumber()
        }
        let projectiles_launched = 0;
        this.AddTimer(0, () => {
            caster.EmitSound("Imba.DesolatorCast");
            desolator_projectile.vSpawnOrigin = projectile_directions[projectiles_launched + 1] + Vector(0, 0, 100) as Vector;
            desolator_projectile.vVelocity = (projectile_directions[projectiles_launched + 1] - caster_loc as Vector).Normalized() * projectile_speed as Vector;
            desolator_projectile.vVelocity.z = 0;
            ProjectileManager.CreateLinearProjectile(desolator_projectile);
            projectiles_launched = projectiles_launched + 1;
            if (projectiles_launched < projectile_amount) {
                return 0.1;
            }
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, target_loc: Vector): boolean | void {
        if (IsServer() && target) {
            let active_damage = this.GetSpecialValueFor("active_damage");
            target.EmitSound("Item_Desolator.Target");
            target.RemoveModifierByName("modifier_item_imba_blight_stone_debuff");
            if (!target.HasModifier("modifier_item_imba_desolator_2_debuff")) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_desolator_debuff", {
                    duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
                });
            }
            let effect_pfx = ResHelper.CreateParticleEx("particles/item/desolator/desolator_active_damage.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
            ParticleManager.SetParticleControl(effect_pfx, 0, target_loc);
            ParticleManager.SetParticleControl(effect_pfx, 1, target_loc + Vector(0, 0, 100) as Vector);
            ParticleManager.ReleaseParticleIndex(effect_pfx);
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: target,
                ability: this,
                damage: active_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
            });
        }
    }
}
@registerModifier()
export class modifier_item_imba_desolator_2 extends BaseModifier_Plus {
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
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetItemPlus().GetSpecialValueFor("damage");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            if (owner != keys.attacker) {
                return;
            }
            let target = keys.target;
            if (owner.IsIllusion()) {
                return;
            }
            target.RemoveModifierByName("modifier_item_imba_blight_stone_debuff");
            target.RemoveModifierByName("modifier_item_imba_desolator_debuff");
            let ability = this.GetItemPlus();
            Desolate(owner, target, ability, "modifier_item_imba_desolator_2_debuff", ability.GetSpecialValueFor("duration"));
        }
    }
}
@registerModifier()
export class modifier_item_imba_desolator_2_debuff extends BaseModifier_Plus {
    public armor_reduction: any;
    public vision_reduction: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let ability = this.GetItemPlus();
        if (ability) {
            this.armor_reduction = (-1) * ability.GetSpecialValueFor("armor_reduction");
            this.vision_reduction = (-1) * ability.GetSpecialValueFor("vision_reduction");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return this.vision_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.vision_reduction;
    }
}
