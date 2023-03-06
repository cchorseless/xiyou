
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_lotus_orb extends BaseItem_Plus {
    spell_shield_reflect: boolean = false;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_lotus_orb_passive";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_lotus_orb_active", {
            duration: this.GetSpecialValueFor("active_duration"),
            dispel: true
        });
    }
}
@registerModifier()
export class modifier_item_imba_lotus_orb_passive extends BaseModifier_Plus {
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
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().TempData().tOldSpells = [];
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        for (let i = GameFunc.GetCount(this.GetParentPlus().TempData().tOldSpells); i >= 1; i += -1) {
            let hSpell = this.GetParentPlus().TempData().tOldSpells[i];
            if (hSpell.NumModifiersUsingAbility() == 0 && !hSpell.IsChanneling()) {
                hSpell.RemoveSelf();
                table.remove(this.GetParentPlus().TempData().tOldSpells, i);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_armor");
        }
    }
}
@registerModifier()
export class modifier_item_imba_lotus_orb_active extends BaseModifier_Plus {
    public reflect_pfx: any;
    public reflect_sound: any;
    public absorb: any;
    public dispel: any;
    public pfx: any;
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSORB_SPELL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.REFLECT_SPELL
        });
    } */
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        let shield_pfx = "particles/items3_fx/lotus_orb_shield.vpcf";
        this.reflect_pfx = "particles/items3_fx/lotus_orb_reflect.vpcf";
        let cast_sound = "Item.LotusOrb.Target";
        this.reflect_sound = "";
        if (params.shield_pfx) {
            shield_pfx = params.shield_pfx;
        }
        if (params.cast_sound) {
            cast_sound = params.cast_sound;
        }
        if (params.reflect_pfx) {
            this.reflect_pfx = params.reflect_pfx;
        }
        if (params.absorb) {
            this.absorb = params.absorb;
        }
        if (params.dispel) {
            this.dispel = params.dispel;
        }
        if (params.dispel) {
            this.GetParentPlus().Purge(false, true, false, false, false);
        }
        this.pfx = ResHelper.CreateParticleEx(shield_pfx, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.pfx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.GetCasterPlus().EmitSound(cast_sound);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSORB_SPELL)
    CC_GetAbsorbSpell(params: ModifierAbilityEvent): 0 | 1 {
        if (this.GetItemPlus().GetAbilityName() == "item_imba_lotus_orb") {
            return undefined;
        }
        if (params.ability) {
            print("Ability absorbed:", params.ability.GetAbilityName());
        }
        if (params.ability.GetCasterPlus().GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            return undefined;
        }
        if (!this.absorb) {
            return 0;
        }
        this.GetCasterPlus().EmitSound("Item.LotusOrb.Activate");
        if (this.GetParentPlus().HasAbility("imba_antimage_spell_shield")) {
            if (this.GetItemPlus() && this.GetItemPlus().GetAutoCastState() && params.ability.GetCasterPlus() && params.ability.GetCasterPlus().IsAlive()) {
                let modifier_holder_position = this.GetParentPlus().GetAbsOrigin();
                let caster_position = params.ability.GetCasterPlus().GetAbsOrigin();
                FindClearSpaceForUnit(this.GetParentPlus(), caster_position, true);
                FindClearSpaceForUnit(params.ability.GetCasterPlus(), modifier_holder_position, true);
                let blink_1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_antimage/antimage_blink_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(blink_1);
                this.GetParentPlus().EmitSound("Hero_Antimage.Blink_out");
                let blink_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_antimage/antimage_blink_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, params.ability.GetCasterPlus());
                ParticleManager.ReleaseParticleIndex(blink_2);
                params.ability.GetCasterPlus().EmitSound("Hero_Antimage.Blink_out");
                params.ability.GetCasterPlus().EmitSound("Hero_Antimage.Counterspell.Target");
            }
        }
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.REFLECT_SPELL)
    CC_GetReflectSpell(params: ModifierAbilityEvent): 0 | 1 {
        let exception_spell: { [k: string]: boolean } = {
            "rubick_spell_steal": true,
            "imba_alchemist_greevils_greed": true,
            "imba_alchemist_unstable_concoction": true,
            "imba_disruptor_glimpse": true,
            "legion_commander_duel": true,
            "imba_phantom_assassin_phantom_strike": true,
            "phantom_assassin_phantom_strike": true,
            "imba_riki_blink_strike": true,
            "riki_blink_strike": true,
            "imba_rubick_spellsteal": true,
            "morphling_replicate": true
        }
        let reflected_spell_name = params.ability.GetAbilityName();
        let target = params.ability.GetCasterPlus();
        if (target.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            return undefined;
        }
        if ((!exception_spell[reflected_spell_name]) && (!target.HasModifier("modifier_imba_spell_shield_buff_reflect"))) {
            if ((params.ability as item_imba_lotus_orb).spell_shield_reflect) {
                return undefined;
            }
            let pfx = ResHelper.CreateParticleEx(this.reflect_pfx, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(pfx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(pfx);
            let old_spell = false;
            for (const hSpell of (this.GetParentPlus().TempData<IBaseItem_Plus[]>().tOldSpells)) {
                if (hSpell != undefined && hSpell.GetAbilityName() == reflected_spell_name) {
                    old_spell = true;
                    return;
                }
            }
            let ability: item_imba_lotus_orb;
            if (old_spell) {
                ability = this.GetParentPlus().FindAbilityByName(reflected_spell_name) as item_imba_lotus_orb;
            } else {
                ability = this.GetParentPlus().AddAbility(reflected_spell_name) as item_imba_lotus_orb;
                ability.SetStolen(true);
                ability.SetHidden(true);
                ability.spell_shield_reflect = true;
                ability.SetRefCountsModifiers(true);
                table.insert(this.GetParentPlus().TempData().tOldSpells, ability);
            }
            ability.SetLevel(params.ability.GetLevel());
            this.GetParentPlus().SetCursorCastTarget(target);
            if (ability.GetToggleState()) {
                ability.ToggleAbility();
            }
            ability.OnSpellStart();
            if (ability.OnChannelFinish) {
                ability.OnChannelFinish(false);
            }
        }
        return 0;
    }
    OnRemoved(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Item.LotusOrb.Destroy");
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
}
