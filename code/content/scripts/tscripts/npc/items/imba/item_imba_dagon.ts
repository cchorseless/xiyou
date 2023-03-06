
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_dagon extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_dagon_passive";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        if (target.IsMagicImmune()) {
            return undefined;
        }
        let damage = this.GetSpecialValueFor("damage");
        let bounce_damage = damage / 100 * this.GetSpecialValueFor("bounce_damage_pct");
        let bounce_range = this.GetSpecialValueFor("bounce_range");
        let targets_hit = [target];
        let search_sources = [target];
        caster.EmitSound("DOTA_Item.Dagon.Activate");
        target.EmitSound("DOTA_Item.Dagon" + this.GetLevel() + ".Target");
        if (target.IsIllusion() && !GFuncEntity.Custom_bIsStrongIllusion(target)) {
            target.Kill(this, caster);
        }
        this.DagonizeIt(caster, this, caster, target, damage);
        while (GameFunc.GetCount(search_sources) > 0) {
            for (const [potential_source_index, potential_source] of GameFunc.iPair(search_sources)) {
                let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), potential_source.GetAbsOrigin(), undefined, bounce_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, potential_target] of GameFunc.iPair(nearby_enemies)) {
                    let already_hit = false;
                    for (const [_, hit_target] of GameFunc.iPair(targets_hit)) {
                        if (potential_target == hit_target) {
                            already_hit = true;
                            return;
                        }
                    }
                    if (!already_hit) {
                        this.DagonizeIt(caster, this, potential_source, potential_target, bounce_damage);
                        targets_hit[GameFunc.GetCount(targets_hit) + 1] = potential_target;
                        search_sources[GameFunc.GetCount(search_sources) + 1] = potential_target;
                    }
                }
                table.remove(search_sources, potential_source_index);
            }
        }
    }
    DagonizeIt(caster: IBaseNpc_Plus, ability: IBaseItem_Plus, source: IBaseNpc_Plus, target: IBaseNpc_Plus, damage: number) {
        let dagon_pfx = ParticleManager.CreateParticle("particles/item/dagon/dagon.vpcf", ParticleAttachment_t.PATTACH_RENDERORIGIN_FOLLOW, source);
        ParticleManager.SetParticleControlEnt(dagon_pfx, 0, source, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", source.GetAbsOrigin(), false);
        ParticleManager.SetParticleControlEnt(dagon_pfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), false);
        ParticleManager.SetParticleControl(dagon_pfx, 2, Vector(damage, 0, 0));
        ParticleManager.SetParticleControl(dagon_pfx, 3, Vector(0.3, 0, 0));
        ParticleManager.ReleaseParticleIndex(dagon_pfx);
        if (target.IsAlive()) {
            ApplyDamage({
                attacker: caster,
                victim: target,
                ability: ability,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
}
@registerModifier()
export class modifier_item_imba_dagon_passive extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
    }
}
