
import { EventHelper } from "../../../helper/EventHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 阿哈利姆魔晶
@registerAbility()
export class item_imba_ultimate_scepter_synth extends BaseItem_Plus {

    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let modifier_synth = "modifier_item_ultimate_scepter_consumed";
        let modifier_stats = "modifier_item_imba_ultimate_scepter_synth_stats";
        let sound_cast = "Hero_Alchemist.Scepter.Cast";
        if (caster.HasModifier(modifier_synth)) {
            return;
        }
        if (caster.HasModifier("modifier_arc_warden_tempest_double")) {
            EventHelper.ErrorMessage("Tempest Doubles cannot create a divergent synth modifier.", caster.GetPlayerID());
            return;
        }
        caster.AddNewModifier(caster, this, modifier_synth, {});
        caster.AddNewModifier(caster, this, modifier_stats, {});
        caster.EmitSound(sound_cast);
        this.SetCurrentCharges(this.GetCurrentCharges() - 1);
        caster.RemoveItem(this);
        let dummy_scepter = caster.CreateOneItem("item_ultimate_scepter");
        caster.AddItem(dummy_scepter);
        this.AddTimer(0.01, () => {
            caster.RemoveItem(dummy_scepter);
        });
    }
}

@registerModifier()
export class modifier_item_imba_ultimate_scepter_synth extends BaseModifier_Plus {
    public IsHidden(): boolean {
        return true;
    }
    public IsPurgable(): boolean {
        return false;
    }
    public IsDebuff(): boolean {
        return false;
    }

    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    bonus_all_stats: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    bonus_health: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    bonus_mana: number;

    public Init(params?: IModifierTable): void {
        this.bonus_all_stats = this.GetSpecialValueFor("bonus_all_stats");
        this.bonus_health = this.GetSpecialValueFor("bonus_health");
        this.bonus_mana = this.GetSpecialValueFor("bonus_mana");
    }




}

@registerModifier()
export class modifier_item_imba_ultimate_scepter_synth_stats extends BaseModifier_Plus {
    public IsHidden(): boolean {
        return true;
    }
    public IsPurgable(): boolean {
        return false;
    }
    public IsDebuff(): boolean {
        return false;
    }

    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    bonus_all_stats: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    bonus_health: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    bonus_mana: number;

    public Init(params?: IModifierTable): void {
        this.bonus_all_stats = this.GetSpecialValueFor("bonus_all_stats");
        this.bonus_health = this.GetSpecialValueFor("bonus_health");
        this.bonus_mana = this.GetSpecialValueFor("bonus_mana");
    }
}