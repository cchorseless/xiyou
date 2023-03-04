
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_black_king_bar extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_black_king_bar";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "DOTA_Item.BlackKingBar.Activate";
        let modifier_bkb = "modifier_item_imba_black_king_bar_buff";
        let duration = ability.GetSpecialValueFor("duration");
        let max_level = ability.GetSpecialValueFor("max_level");
        if (ability.GetLevel() < max_level) {
            ability.SetLevel(ability.GetLevel() + 1);
            caster.TempData().bkb_current_level = ability.GetLevel();
        }
        EmitSoundOn(sound_cast, caster);
        caster.Purge(false, true, false, false, false);
        for (const modifier_name of (GameServiceConfig.IMBA_EtherealAbilities)) {
            if (caster.HasModifier(modifier_name)) {
                caster.RemoveModifierByName(modifier_name);
            }
        }
        caster.AddNewModifier(caster, ability, modifier_bkb, {
            duration: duration
        });
    }
}
@registerModifier()
export class modifier_item_imba_black_king_bar extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public bonus_strength: number;
    public bonus_damage: number;
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
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.bonus_strength = this.ability.GetSpecialValueFor("bonus_strength");
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
        if (IsServer()) {
            if (this.caster.TempData().bkb_current_level && this.ability) {
                if (this.caster.TempData().bkb_current_level != this.ability.GetLevel()) {
                    this.ability.SetLevel(this.caster.TempData().bkb_current_level);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
}
@registerModifier()
export class modifier_item_imba_black_king_bar_buff extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public model_scale: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items_fx/black_king_bar_avatar.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.model_scale = this.ability.GetSpecialValueFor("model_scale");
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        }
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return this.model_scale;
    }
}
