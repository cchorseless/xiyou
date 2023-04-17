
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 跳刀
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
                    this.GetCasterPlus().CastAbilityOnPosition(ent.GetAbsOrigin(), this, this.GetCasterPlus().GetPlayerID());
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

    // 测试
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.NEGATIVE_EVASION_CONSTANT)
    CC_GetModifierProcAttack_BonusDamage_Physical(kv: ModifierAttackEvent): number {
        return 50;
    }

}

