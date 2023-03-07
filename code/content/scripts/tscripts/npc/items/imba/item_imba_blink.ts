
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_blink extends BaseItem_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (IsServer()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DIRECTIONAL + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DIRECTIONAL + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_blink_dagger_handler";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return this.GetSpecialValueFor("max_blink_range") - this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCursorTarget() && this.GetCursorTarget() == this.GetCasterPlus()) {
            for (const [_, ent] of GameFunc.iPair(Entities.FindAllByClassname("ent_dota_fountain"))) {
                if (ent.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                    this.GetCasterPlus().SetCursorTargetingNothing(true);
                    if (this.GetCasterPlus().GetPlayerOwnerID) {
                        this.GetCasterPlus().CastAbilityOnPosition(ent.GetAbsOrigin(), this, this.GetCasterPlus().GetPlayerOwnerID());
                    } else if (this.GetCasterPlus().GetOwnerPlus().GetPlayerOwnerID) {
                        this.GetCasterPlus().CastAbilityOnPosition(ent.GetAbsOrigin(), this, this.GetCasterPlus().GetOwnerPlus().GetPlayerOwnerID());
                    }
                    return;
                }
            }
        }
        return true;
    }
    OnSpellStart(): void {
        if (this.GetCursorTarget() || this.GetCursorTarget() == this.GetCasterPlus()) {
            this.EndCooldown();
            return;
        }
        let caster = this.GetCasterPlus();
        let origin_point = caster.GetAbsOrigin();
        let target_point = this.GetCursorPosition();
        let distance = (target_point - origin_point as Vector).Length2D();
        let max_blink_range = this.GetSpecialValueFor("max_blink_range");
        if (distance > max_blink_range) {
            let max_extra_distance = this.GetSpecialValueFor("max_extra_distance");
            let max_extra_cooldown = this.GetSpecialValueFor("max_extra_cooldown");
            if (distance > max_extra_distance) {
                target_point = origin_point + (target_point - origin_point as Vector).Normalized() * max_extra_distance as Vector;
            }
        }
        GFuncEntity.Blink(caster, target_point, false, true);
    }
}
@registerModifier()
export class modifier_imba_blink_dagger_handler extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        if (IMBA_MUTATION && IMBA_MUTATION["positive"] == "super_blink") {
            return Object.values({});
        }
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        let ability = this.GetItemPlus();
        let blink_damage_cooldown = ability.GetSpecialValueFor("blink_damage_cooldown");
        let parent = this.GetParentPlus();
        let unit = keys.unit;
        if (parent == unit && keys.attacker.GetTeam() != parent.GetTeam()) {
            if (GFuncEntity.IsHeroDamage(keys.attacker, keys.damage)) {
                if (ability.GetCooldownTimeRemaining() < blink_damage_cooldown) {
                    ability.StartCooldown(blink_damage_cooldown);
                }
            }
        }
    }
}
@registerAbility()
export class item_imba_blink_boots extends BaseItem_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (IsServer()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DIRECTIONAL + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DIRECTIONAL + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_blink_boots_handler";
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCursorTarget() && this.GetCursorTarget() == this.GetCasterPlus()) {
            for (const [_, building] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false))) {
                if (string.find(building.GetUnitName(), "ent_dota_fountain")) {
                    this.GetCasterPlus().SetCursorTargetingNothing(true);
                    this.GetCasterPlus().CastAbilityOnPosition(building.GetAbsOrigin(), this, this.GetCasterPlus().GetPlayerOwnerID());
                    return;
                }
            }
        }
        return true;
    }
    OnSpellStart(): void {
        if (this.GetCursorTarget() || this.GetCursorTarget() == this.GetCasterPlus()) {
            this.EndCooldown();
            return;
        }
        let caster = this.GetCasterPlus();
        let origin_point = caster.GetAbsOrigin();
        let target_point = this.GetCursorPosition();
        let distance = (target_point - origin_point as Vector).Length2D();
        let max_blink_range = this.GetSpecialValueFor("max_blink_range");
        let sweet_spot_min = this.GetSpecialValueFor("sweet_spot_min");
        if (distance > max_blink_range) {
            target_point = origin_point + (target_point - origin_point as Vector).Normalized() * max_blink_range as Vector;
        }
        if (!this.GetCursorTarget() && distance >= sweet_spot_min && distance <= max_blink_range && !caster.HasModifier("modifier_imba_blink_boots_flash_step")) {
            this.AddTimer(FrameTime(), () => {
                let particle = ResHelper.CreateParticleEx("particles/econ/items/meepo/meepo_colossal_crystal_chorus/meepo_divining_rod_poof_end_explosion_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControl(particle, 0, this.GetParentPlus().GetAbsOrigin());
                ParticleManager.SetParticleControl(particle, 6, Vector(0, 255, 255));
                ParticleManager.ReleaseParticleIndex(particle);
                caster.AddNewModifier(caster, this, "modifier_imba_blink_boots_flash_step", {
                    duration: this.GetSpecialValueFor("flash_step_cooldown")
                });
                this.EndCooldown();
            });
        }
        GFuncEntity.Blink(caster, target_point, false, true);
    }
}
@registerModifier()
export class modifier_imba_blink_boots_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        if (IMBA_MUTATION && IMBA_MUTATION["positive"] == "super_blink") {
            return Object.values({
                1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE
            });
        } else {
            return Object.values({
                1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
                2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
            });
        }
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Special_Boots(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_movement_speed");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (this.GetItemPlus()) {
            if (this.GetParentPlus() == keys.unit && keys.attacker.GetTeam() != this.GetParentPlus().GetTeam()) {
                if (GFuncEntity.IsHeroDamage(keys.attacker, keys.damage)) {
                    if (this.GetItemPlus().GetCooldownTimeRemaining() < this.GetItemPlus().GetSpecialValueFor("blink_damage_cooldown")) {
                        this.GetItemPlus().StartCooldown(this.GetItemPlus().GetSpecialValueFor("blink_damage_cooldown"));
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_blink_boots_flash_step extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        return "modifiers/imba_blink_boots";
    }
}
