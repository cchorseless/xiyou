
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_dust_of_appearance extends BaseItem_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
    }
    GetAbilityTextureName(): string {
        return "imba_dust_of_appearance";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let aoe = this.GetSpecialValueFor("area_of_effect");
        let duration = this.GetSpecialValueFor("reveal_duration");
        let foundInvis = 0;
        caster.EmitSound("DOTA_Item.DustOfAppearance.Activate");
        let particle = ResHelper.CreateParticleEx("particles/items_fx/dust_of_appearance.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle, 1, Vector(aoe, aoe, aoe));
        let true_sight_modifier = undefined;
        let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(targets)) {
            if (unit.IsInvisible() || unit.IsInvisiblePlus()) {
                foundInvis = foundInvis + 1;
            }
            true_sight_modifier = unit.AddNewModifier(caster, this, "modifier_imba_dust_of_appearance", {
                duration: duration * (1 - unit.GetStatusResistance())
            });
        }
        let chance = this.GetSpecialValueFor("meme_chance") * foundInvis;
        if (RollPercentage(chance)) {
            caster.EmitSound("Imba.DustMGS");
        }
        if (foundInvis == 0) {
            let new_charge_count = this.GetCurrentCharges() - 1;
            if (new_charge_count == 0) {
                this.Destroy();
            } else {
                this.SetCurrentCharges(new_charge_count);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_dust_of_appearance extends BaseModifier_Plus {
    public invisible_slow: any;
    public invisModifiers: { [key: string]: string };
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_dust";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.invisible_slow = this.GetItemPlus().GetSpecialValueFor("invisible_slow");
        this.invisModifiers = {
            "1": "modifier_invisible",
            "2": "modifier_mirana_moonlight_shadow",
            "3": "modifier_item_imba_shadow_blade_invis",
            "4": "modifier_item_shadow_amulet_fade",
            "5": "modifier_imba_vendetta",
            "6": "modifier_nyx_assassin_burrow",
            "7": "modifier_item_imba_silver_edge_invis",
            "8": "modifier_item_glimmer_cape_fade",
            "9": "modifier_weaver_shukuchi",
            "10": "modifier_treant_natures_guise_invis",
            "11": "modifier_templar_assassin_meld",
            "12": "modifier_imba_skeleton_walk_dummy",
            "13": "modifier_invoker_ghost_walk_self",
            "14": "modifier_rune_invis"
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    GetEffectName(): string {
        return "particles/items2_fx/true_sight_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().HasModifier("modifier_slark_shadow_dance") || this.GetParentPlus().HasModifier("modifier_imba_slark_shadow_dance")) {
            return undefined;
        }
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        if (this.invisModifiers) {
            for (const [_, v] of GameFunc.Pair(this.invisModifiers)) {
                if (this.GetParentPlus().HasModifier(v)) {
                    return 1;
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.invisModifiers) {
            for (const [_, v] of GameFunc.Pair(this.invisModifiers)) {
                if (this.GetParentPlus().HasModifier(v)) {
                    return this.invisible_slow;
                }
            }
        }
    }
}
