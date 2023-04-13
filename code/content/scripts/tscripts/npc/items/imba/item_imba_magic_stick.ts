
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

// 魔棒
@registerAbility()
export class item_imba_magic_stick extends BaseItem_Plus {

    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let ability_level = this.GetLevel() - 1;
        let sound_cast = "DOTA_Item.MagicStick.Activate";
        let particle_cast = "particles/items2_fx/magic_stick.vpcf";
        let restore_per_charge = this.GetLevelSpecialValueFor("restore_per_charge", ability_level);
        let current_charges = this.GetCurrentCharges();
        caster.EmitSound(sound_cast);
        let stick_pfx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(stick_pfx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(stick_pfx, 1, Vector(10, 0, 0));
        caster.ApplyHeal(current_charges * restore_per_charge, this);
        caster.GiveMana(current_charges * restore_per_charge);
        this.SetCurrentCharges(0);
    }

    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_magic_stick_aura";
    }
}


@registerModifier()
export class modifier_item_imba_magic_stick_aura extends BaseModifier_Plus {

    IsHidden(): boolean {
        return true;
    }

    public IsDebuff(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    IsAura(): boolean {
        return true;
    }

    GetAuraRadius(): number {
        return this.charge_radius
    }

    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }

    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }

    GetAura() {
        return "modifier_item_imba_magic_stick_effect";
    }
    charge_radius: number;
    public Init(params?: IModifierTable): void {
        this.charge_radius = this.GetSpecialValueFor("charge_radius");
    }
}

@registerModifier()
export class modifier_item_imba_magic_stick_effect extends BaseModifier_Plus {
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

    @registerEvent(Enum_MODIFIER_EVENT.ON_SPENT_MANA)
    CC_ON_SPENT_MANA(keys: ModifierAbilityEvent) {
        let caster = this.GetCasterPlus();
        let target = keys.unit;
        let ability = this.GetItemPlus();
        let ability_level = ability.GetLevel() - 1;
        let cast_ability = keys.ability;
        let cast_ability_name = cast_ability.GetName();
        let max_charges = ability.GetLevelSpecialValueFor("max_charges", ability_level);
        let current_charges = ability.GetCurrentCharges();
        let mana_spent = cast_ability.GetManaCost(cast_ability.GetLevel() - 1);
        let procs_stick = cast_ability.ProcsMagicStick();
        let caster_visible = caster.CanEntityBeSeenByMyTeam(target);
        let special_abilities = ["storm_spirit_ball_lightning"]
        let special_ability_casted = false;
        for (const [_, special_ability] of GameFunc.iPair(special_abilities)) {
            if (cast_ability_name == special_ability) {
                return;
            }
        }
        if (mana_spent > 0 && procs_stick && caster_visible) {
            if (current_charges < max_charges) {
                ability.SetCurrentCharges(current_charges + 1);
            }
        }
    }

}
// 魔杖
@registerAbility()
export class item_imba_magic_wand extends item_imba_magic_stick {
    initialized = false;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_magic_wand";
    }
}


@registerModifier()
export class modifier_item_imba_magic_wand extends BaseModifier_Plus {

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
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    buff: IBaseModifier_Plus;
    public BeCreated(params?: IModifierTable): void {
        if (IsServer()) {
            this.buff = this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_item_imba_magic_stick_aura", {}) as IBaseModifier_Plus;
        }
    }
    public BeDestroy(): void {
        if (IsServer()) {
            if (this.buff) {
                this.buff.Destroy();
            }
        }
    }

    Init(p: any): void {
        this.bonus_all_stats = this.GetSpecialValueFor("bonus_all_stats");
        let ability = this.GetItemPlus<item_imba_magic_wand>();
        if (!ability.initialized) {
            ability.initialized = true;
            ability.SetCurrentCharges(ability.GetSpecialValueFor("initial_charges"));
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    bonus_all_stats: number;

}


