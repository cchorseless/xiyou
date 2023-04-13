
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 死灵书
@registerAbility()
export class item_imba_necronomicon extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_necronomicon";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let summon_duration = this.GetSpecialValueFor("summon_duration");
        let caster_loc = this.GetCasterPlus().GetAbsOrigin();
        let caster_direction = this.GetCasterPlus().GetForwardVector();
        let melee_summon_name = "npc_imba_necronomicon_warrior_" + this.GetLevel();
        let ranged_summon_name = "npc_imba_necronomicon_archer_" + this.GetLevel();
        this.GetCasterPlus().EmitSound("DOTA_Item.Necronomicon.Activate");
        let melee_loc = RotatePosition(caster_loc, QAngle(0, 30, 0), caster_loc + caster_direction * 180 as Vector);
        let ranged_loc = RotatePosition(caster_loc, QAngle(0, -30, 0), caster_loc + caster_direction * 180 as Vector);
        GridNav.DestroyTreesAroundPoint(caster_loc + caster_direction * 180 as Vector, 180, false);
        let melee_summon = this.GetCasterPlus().CreateSummon(melee_summon_name, melee_loc, summon_duration, true);
        let ranged_summon = this.GetCasterPlus().CreateSummon(ranged_summon_name, ranged_loc, summon_duration, true);
        // melee_summon.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
        melee_summon.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_necronomicon_summon", {});
        // ranged_summon.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
        ranged_summon.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_necronomicon_summon", {});
        let melee_abilities = {
            "1": "necronomicon_warrior_mana_burn",
            "2": "necronomicon_warrior_last_will",
            "3": "necronomicon_warrior_sight",
            "4": "black_dragon_dragonhide_aura",
            "5": "granite_golem_hp_aura",
            "6": "spawnlord_aura"
        }
        let ranged_abilities = {
            "1": "necronomicon_archer_purge",
            "2": "necronomicon_archer_mana_burn",
            "3": "necronomicon_archer_aoe",
            "4": "forest_troll_high_priest_mana_aura",
            "5": "big_thunder_lizard_wardrums_aura",
            "6": "imba_necronomicon_archer_multishot",
            "7": "imba_necronomicon_archer_spread_shot"
        }
        for (const [_, melee_ability] of GameFunc.Pair(melee_abilities)) {
            if (melee_summon.FindAbilityByName(melee_ability)) {
                if (melee_summon.FindAbilityByName(melee_ability).GetMaxLevel() > 1) {
                    melee_summon.FindAbilityByName(melee_ability).SetLevel(this.GetLevel());
                } else {
                    melee_summon.FindAbilityByName(melee_ability).SetLevel(1);
                }
            }
        }
        for (const [_, ranged_ability] of GameFunc.Pair(ranged_abilities)) {
            if (ranged_summon.FindAbilityByName(ranged_ability)) {
                if (ranged_summon.FindAbilityByName(ranged_ability).GetMaxLevel() > 1) {
                    ranged_summon.FindAbilityByName(ranged_ability).SetLevel(this.GetLevel());
                } else {
                    ranged_summon.FindAbilityByName(ranged_ability).SetLevel(1);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_necronomicon extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_STRENGTH_BONUS,
            2: MODIFIER_PROPERTY_EXTRA_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_STRENGTH_BONUS)
    CC_GetModifierExtraStrengthBonus(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
    }
    GetModifierExtraIntellectBonus() {
        return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
    }
}
@registerModifier()
export class modifier_item_imba_necronomicon_summon extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
}

// 多级死灵书
@registerAbility()
export class item_imba_necronomicon_2 extends item_imba_necronomicon { }
@registerAbility()
export class item_imba_necronomicon_3 extends item_imba_necronomicon { }
@registerAbility()
export class item_imba_necronomicon_4 extends item_imba_necronomicon { }
@registerAbility()
export class item_imba_necronomicon_5 extends item_imba_necronomicon { }