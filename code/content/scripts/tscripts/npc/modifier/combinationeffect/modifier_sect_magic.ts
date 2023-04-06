import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_magic_base_a extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let magic_arm = this.getSpecialData("magic_arm");
        let t = parent.TempData().sect_magic || {
            magic_arm: 0,
        };
        t.magic_arm += magic_arm;
        parent.TempData().sect_magic = t;
        if (IsServer()) {
            let enemyunits = this.getAllEnemy()
            for (let i = 0; i < enemyunits.length; i++) {
                let unit = enemyunits[i];
                let buff = modifier_sect_magic_enemy_magic_down.applyOnly(unit, parent);
                buff.SetStackCount(math.abs(t.magic_arm))
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    spell_damage_pect: number;


}
@registerModifier()
export class modifier_sect_magic_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let magic_arm = this.getSpecialData("magic_arm");
        let t = parent.TempData().sect_magic || {
            magic_arm: 0,
        };
        t.magic_arm += magic_arm;
        parent.TempData().sect_magic = t;
        if (IsServer()) {
            let enemyunits = this.getAllEnemy()
            for (let i = 0; i < enemyunits.length; i++) {
                let unit = enemyunits[i];
                let buff = modifier_sect_magic_enemy_magic_down.applyOnly(unit, parent);
                buff.SetStackCount(math.abs(t.magic_arm))
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    spell_damage_pect: number;

}
@registerModifier()
export class modifier_sect_magic_base_c extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        this.spell_damage_pect = this.getSpecialData("spell_damage_pect");
        let magic_arm = this.getSpecialData("magic_arm");
        let t = parent.TempData().sect_magic || { magic_arm: 0, };
        t.magic_arm += magic_arm;
        parent.TempData().sect_magic = t;
        if (IsServer()) {
            let enemyunits = this.getAllEnemy()
            for (let i = 0; i < enemyunits.length; i++) {
                let unit = enemyunits[i];
                let buff = modifier_sect_magic_enemy_magic_down.applyOnly(unit, parent);
                buff.SetStackCount(math.abs(t.magic_arm))
            }
        }
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_ON_ABILITY_EXECUTED(e: ModifierAbilityEvent) {
        if (IsServer()) {
            let ability = e.ability as IBaseAbility_Plus;
            if (GFuncEntity.IsValid(ability)) {
                let parent = this.GetParentPlus();
                modifier_sect_magic_enemy_ice.applyOnly(e.target, parent, ability, {
                    duration: this.getSpecialData("duration") || 1,
                });
            }
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    spell_damage_pect: number;

}


@registerModifier()
export class modifier_sect_magic_enemy_magic_down extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    CC_MAGICAL_ARMOR_BONUS(): number {
        return this.GetStackCount() * -1;
    }

}


@registerModifier()
export class modifier_sect_magic_enemy_ice extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }

    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Crystal.Frostbite");
        }
    }
}